import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  sendBookingConfirmation,
  sendProviderNotification,
  sendSplitPaymentInvite,
} from '@/lib/resend/client'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, supabase)
        break
      }

      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(pi, supabase)
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(pi, supabase)
        break
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        await handleAccountUpdated(account, supabase)
        break
      }

      default:
        console.log('Unhandled event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    // On retourne quand même 200 pour que Stripe ne retry pas
    return NextResponse.json({ received: true, error: error.message })
  }
}

// ─────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createAdminClient>
) {
  const bookingRef = await supabase
    .from('bookings')
    .select('*, experiences(*, providers(*))')
    .eq('stripe_session_id', session.id)
    .single()

  if (!bookingRef.data) {
    console.error('Booking not found for session:', session.id)
    return
  }

  const booking = bookingRef.data
  const experience = (booking as any).experiences
  const provider = experience.providers

  // Mettre à jour le statut
  const newStatus = booking.split_payment_enabled ? 'deposit_paid' : 'deposit_paid'
  const paymentIntentId = session.payment_intent as string

  await supabase
    .from('bookings')
    .update({
      status: newStatus,
      payment_intent_id: paymentIntentId,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', booking.id)

  // Réserver la capacité sur le slot
  await supabase.rpc('increment_slot_capacity', {
    slot_id: booking.slot_id,
    amount: booking.group_size,
  }).then(undefined, async () => {
    // Fallback si la fonction RPC n'existe pas
    const { data: slot } = await supabase
      .from('slots')
      .select('booked_capacity')
      .eq('id', booking.slot_id)
      .single()

    if (slot) {
      await supabase
        .from('slots')
        .update({ booked_capacity: slot.booked_capacity + booking.group_size })
        .eq('id', booking.slot_id)
    }
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  // Email organisateur
  await sendBookingConfirmation({
    booking,
    experience,
    provider,
    appUrl,
  })

  // Email prestataire
  await sendProviderNotification({
    booking,
    experience,
    provider,
    appUrl,
  })
}

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createAdminClient>
) {
  const bookingId = paymentIntent.metadata?.bookingId
  const participantEmail = paymentIntent.metadata?.participantEmail

  if (!bookingId || !participantEmail) return

  // Mettre à jour le participant
  await supabase
    .from('participants')
    .update({
      payment_status: 'paid',
      amount_paid: (paymentIntent.amount / 100),
      paid_at: new Date().toISOString(),
      payment_intent_id: paymentIntent.id,
    })
    .eq('booking_id', bookingId)
    .eq('email', participantEmail)

  // Vérifier si tous les participants ont payé
  const { data: participants } = await supabase
    .from('participants')
    .select('payment_status')
    .eq('booking_id', bookingId)

  const allPaid = participants?.every((p) => p.payment_status === 'paid')

  if (allPaid) {
    await supabase
      .from('bookings')
      .update({ status: 'fully_paid' })
      .eq('id', bookingId)
  }
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createAdminClient>
) {
  const bookingId = paymentIntent.metadata?.bookingId
  const participantEmail = paymentIntent.metadata?.participantEmail

  if (!bookingId || !participantEmail) return

  await supabase
    .from('participants')
    .update({ payment_status: 'failed' })
    .eq('booking_id', bookingId)
    .eq('email', participantEmail)
}

async function handleAccountUpdated(
  account: Stripe.Account,
  supabase: ReturnType<typeof createAdminClient>
) {
  const onboardingComplete =
    account.charges_enabled &&
    account.details_submitted &&
    account.payouts_enabled

  await supabase
    .from('providers')
    .update({ stripe_onboarding_complete: onboardingComplete })
    .eq('stripe_account_id', account.id)
}
