import { Resend } from 'resend'
import { render } from '@react-email/render'
import BookingConfirmation from '@/emails/BookingConfirmation'
import SplitPaymentInvite from '@/emails/SplitPaymentInvite'
import ProviderNotification from '@/emails/ProviderNotification'
import ReminderEmail from '@/emails/ReminderEmail'
import WelcomeWaitlist from '@/emails/WelcomeWaitlist'
import type { Booking, Experience, Provider, Participant } from '@/types/database'

const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@resakit.fr'
const REPLY_TO = process.env.RESEND_REPLY_TO || 'contact@resakit.fr'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

async function sendEmail(opts: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `ResaKit <${FROM_EMAIL}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo || REPLY_TO,
    })
    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Email send failed:', error)
    return { success: false, error }
  }
}

/**
 * Email de confirmation à l'organisateur après paiement.
 */
export async function sendBookingConfirmation(params: {
  booking: Booking
  experience: Experience
  provider: Provider
  appUrl: string
}) {
  const { booking, experience, provider, appUrl } = params

  const splitPaymentUrl = booking.split_payment_code
    ? `${appUrl}/join/${booking.split_payment_code}`
    : undefined

  const html = await render(
    BookingConfirmation({
      organizerName: booking.organizer_name,
      bookingRef: booking.booking_ref,
      experienceName: experience.title,
      providerName: provider.name,
      date: booking.created_at,
      groupSize: booking.group_size,
      totalAmount: Number(booking.total_amount),
      splitPaymentUrl,
      appUrl,
    })
  )

  return sendEmail({
    to: booking.organizer_email,
    subject: `✅ Réservation confirmée — ${experience.title}`,
    html,
  })
}

/**
 * Email d'invitation aux participants pour payer leur part.
 */
export async function sendSplitPaymentInvite(params: {
  booking: Booking
  experience: Experience
  participant: Participant
  appUrl: string
}) {
  const { booking, experience, participant, appUrl } = params

  const paymentUrl = `${appUrl}/join/${booking.split_payment_code}`

  const html = await render(
    SplitPaymentInvite({
      organizerName: booking.organizer_name,
      experienceName: experience.title,
      occasion: booking.occasion || 'un événement',
      date: booking.created_at,
      amount: Number(participant.amount_due),
      paymentUrl,
      deadline: booking.split_payment_deadline || '',
    })
  )

  return sendEmail({
    to: participant.email,
    subject: `🎉 ${booking.organizer_name} t'invite à ${experience.title}`,
    html,
  })
}

/**
 * Notification au prestataire d'une nouvelle réservation.
 */
export async function sendProviderNotification(params: {
  booking: Booking
  experience: Experience
  provider: Provider
  appUrl: string
}) {
  const { booking, experience, provider, appUrl } = params

  if (!provider.contact_email) return { success: false, error: 'No provider email' }

  const html = await render(
    ProviderNotification({
      providerName: provider.contact_name || provider.name,
      bookingRef: booking.booking_ref,
      experienceName: experience.title,
      organizerName: booking.organizer_name,
      organizerEmail: booking.organizer_email,
      organizerPhone: booking.organizer_phone || '',
      occasion: booking.occasion || '',
      groupSize: booking.group_size,
      totalAmount: Number(booking.total_amount),
      providerAmount: Number(booking.provider_amount),
      message: booking.message_to_provider || '',
      dashboardUrl: `${appUrl}/dashboard/bookings/${booking.id}`,
    })
  )

  return sendEmail({
    to: provider.contact_email,
    subject: `🔔 Nouvelle réservation — ${booking.booking_ref}`,
    html,
  })
}

/**
 * Rappel J-1 à l'organisateur et participants.
 */
export async function sendReminderEmail(params: {
  recipient: { name: string; email: string }
  booking: Booking
  experience: Experience
  provider: Provider
}) {
  const { recipient, booking, experience, provider } = params

  const html = await render(
    ReminderEmail({
      recipientName: recipient.name,
      experienceName: experience.title,
      providerName: provider.name,
      address: experience.address || provider.address || '',
      whatToBring: experience.what_to_bring || 'Bonne humeur !',
    })
  )

  return sendEmail({
    to: recipient.email,
    subject: `⏰ C'est demain ! Rappel : ${experience.title}`,
    html,
  })
}

/**
 * Email de bienvenue waitlist.
 */
export async function sendWelcomeWaitlist(params: { email: string; city?: string }) {
  const html = await render(
    WelcomeWaitlist({
      city: params.city || 'Toulouse',
    })
  )

  return sendEmail({
    to: params.email,
    subject: `👋 Bienvenue sur ResaKit !`,
    html,
  })
}
