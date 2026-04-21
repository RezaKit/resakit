import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createParticipantPaymentIntent } from '@/lib/stripe/helpers'

const paySchema = z.object({
  code: z.string().min(4).max(20),
  name: z.string().min(2).max(100),
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = paySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const { code, name, email } = parsed.data
    const supabase = createAdminClient()

    // Fetch booking
    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .select('*, experiences(*, providers(*))')
      .eq('split_payment_code', code)
      .single()

    if (bookErr || !booking) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    if (booking.status === 'fully_paid' || booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Cette réservation est déjà complète' },
        { status: 400 }
      )
    }

    if (
      booking.split_payment_deadline &&
      new Date(booking.split_payment_deadline) < new Date()
    ) {
      return NextResponse.json(
        { error: 'Le délai de paiement est dépassé' },
        { status: 400 }
      )
    }

    // Vérifier si cet email a déjà payé
    const { data: existing } = await supabase
      .from('participants')
      .select('*')
      .eq('booking_id', booking.id)
      .eq('email', email)
      .single()

    if (existing && existing.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Vous avez déjà payé votre part' },
        { status: 400 }
      )
    }

    // Calculer la part
    const totalAmount = Number(booking.total_amount)
    const partAmount = totalAmount / booking.group_size
    const provider = (booking as any).experiences.providers

    // Créer le PaymentIntent
    const paymentIntent = await createParticipantPaymentIntent({
      amount: partAmount,
      bookingId: booking.id,
      participantEmail: email,
      providerStripeAccountId: provider.stripe_account_id,
      commissionRate: provider.commission_rate ?? 0.10,
    })

    // Créer ou mettre à jour le participant
    if (existing) {
      await supabase
        .from('participants')
        .update({
          name,
          payment_intent_id: paymentIntent.id,
          payment_status: 'pending',
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('participants').insert({
        booking_id: booking.id,
        name,
        email,
        amount_due: partAmount,
        payment_intent_id: paymentIntent.id,
      })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: partAmount,
      stripeAccountId: provider.stripe_account_id,
    })
  } catch (error: any) {
    console.error('Participant pay error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
