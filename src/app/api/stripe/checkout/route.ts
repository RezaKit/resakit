import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createCheckoutSession, generateSplitPaymentCode } from '@/lib/stripe/helpers'
import { calculateTotalPrice } from '@/lib/utils'

const checkoutSchema = z.object({
  experienceId: z.string().uuid(),
  slotId: z.string().uuid(),
  groupSize: z.number().int().min(1).max(200),
  organizerName: z.string().min(2).max(100),
  organizerEmail: z.string().email(),
  organizerPhone: z.string().optional(),
  occasion: z.string().optional(),
  message: z.string().max(500).optional(),
  splitPayment: z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data
    const supabase = createAdminClient()

    // 1. Fetch expérience + prestataire
    const { data: experience, error: expErr } = await supabase
      .from('experiences')
      .select('*, providers(*)')
      .eq('id', data.experienceId)
      .single()

    if (expErr || !experience) {
      return NextResponse.json({ error: 'Expérience introuvable' }, { status: 404 })
    }

    const provider = (experience as any).providers
    if (!provider?.stripe_account_id || !provider.stripe_onboarding_complete) {
      return NextResponse.json(
        { error: 'Le prestataire n\'a pas encore configuré ses paiements' },
        { status: 400 }
      )
    }

    // 2. Vérifier la capacité du slot
    const { data: slot, error: slotErr } = await supabase
      .from('slots')
      .select('*')
      .eq('id', data.slotId)
      .single()

    if (slotErr || !slot) {
      return NextResponse.json({ error: 'Créneau introuvable' }, { status: 404 })
    }

    if (slot.is_blocked) {
      return NextResponse.json({ error: 'Ce créneau n\'est plus disponible' }, { status: 400 })
    }

    const remaining = slot.total_capacity - slot.booked_capacity
    if (data.groupSize > remaining) {
      return NextResponse.json(
        { error: `Seulement ${remaining} places disponibles` },
        { status: 400 }
      )
    }

    // 3. Vérifier min/max
    if (data.groupSize < experience.min_people) {
      return NextResponse.json(
        { error: `Minimum ${experience.min_people} personnes pour cette expérience` },
        { status: 400 }
      )
    }
    if (data.groupSize > experience.max_people) {
      return NextResponse.json(
        { error: `Maximum ${experience.max_people} personnes pour cette expérience` },
        { status: 400 }
      )
    }

    // 4. Calculer montants
    const totalAmount = calculateTotalPrice(
      experience.price_per_person,
      experience.price_fixed,
      data.groupSize
    )
    const commissionRate = provider.commission_rate ?? 0.10
    const commissionAmount = totalAmount * commissionRate
    const providerAmount = totalAmount - commissionAmount

    // 5. Créer la réservation en "pending"
    const splitCode = data.splitPayment ? generateSplitPaymentCode() : null
    const splitDeadline = data.splitPayment
      ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert({
        experience_id: data.experienceId,
        slot_id: data.slotId,
        provider_id: provider.id,
        organizer_name: data.organizerName,
        organizer_email: data.organizerEmail,
        organizer_phone: data.organizerPhone,
        occasion: data.occasion,
        message_to_provider: data.message,
        group_size: data.groupSize,
        total_amount: totalAmount,
        deposit_amount: (totalAmount * experience.deposit_percent) / 100,
        commission_amount: commissionAmount,
        provider_amount: providerAmount,
        status: 'pending',
        split_payment_enabled: data.splitPayment,
        split_payment_code: splitCode,
        split_payment_deadline: splitDeadline,
      })
      .select()
      .single()

    if (bookErr || !booking) {
      console.error('Booking creation error:', bookErr)
      return NextResponse.json({ error: 'Erreur création réservation' }, { status: 500 })
    }

    // 6. Créer la session Stripe
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const session = await createCheckoutSession({
      experience,
      provider,
      slotId: data.slotId,
      groupSize: data.groupSize,
      organizerEmail: data.organizerEmail,
      organizerName: data.organizerName,
      organizerPhone: data.organizerPhone,
      occasion: data.occasion,
      message: data.message,
      splitPayment: data.splitPayment,
      appUrl,
    })

    // 7. Sauver le session_id sur le booking
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)

    return NextResponse.json({
      sessionUrl: session.url,
      bookingRef: booking.booking_ref,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
