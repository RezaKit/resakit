import { stripe, toStripeAmount } from './client'
import type { Experience, Provider } from '@/types/database'

interface CreateCheckoutSessionParams {
  experience: Experience
  provider: Provider
  slotId: string
  groupSize: number
  organizerEmail: string
  organizerName: string
  organizerPhone?: string
  occasion?: string
  message?: string
  splitPayment: boolean
  appUrl: string
}

/**
 * Crée une session Stripe Checkout avec Stripe Connect.
 * Le client paie → l'argent arrive sur le compte du prestataire
 * → ResaKit prélève sa commission via application_fee_amount.
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const {
    experience,
    provider,
    slotId,
    groupSize,
    organizerEmail,
    organizerName,
    organizerPhone,
    occasion,
    message,
    splitPayment,
    appUrl,
  } = params

  // Calculer le montant total
  const totalAmount = experience.price_per_person
    ? experience.price_per_person * groupSize
    : experience.price_fixed ?? 0

  // Montant à charger maintenant
  // - Si split paiement : l'organisateur paie sa part uniquement
  // - Sinon : acompte (30% par défaut)
  const amountToCharge = splitPayment
    ? totalAmount / groupSize
    : (totalAmount * experience.deposit_percent) / 100

  // Commission ResaKit (toujours calculée sur le total, mais prélevée proportionnellement)
  const commissionRate = provider.commission_rate ?? 0.10
  const commissionOnCharge = amountToCharge * commissionRate

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: toStripeAmount(amountToCharge),
            product_data: {
              name: experience.title,
              description: splitPayment
                ? `Votre part pour ${groupSize} personnes (${occasion || 'événement'})`
                : `Acompte ${experience.deposit_percent}% pour ${groupSize} personnes`,
              images: experience.photos?.[0] ? [experience.photos[0]] : undefined,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: toStripeAmount(commissionOnCharge),
        transfer_data: {
          destination: provider.stripe_account_id!,
        },
        metadata: {
          experienceId: experience.id,
          providerId: provider.id,
          slotId,
          groupSize: groupSize.toString(),
          splitPayment: splitPayment.toString(),
          occasion: occasion || '',
          totalAmount: totalAmount.toString(),
        },
      },
      customer_email: organizerEmail,
      metadata: {
        experienceId: experience.id,
        providerId: provider.id,
        slotId,
        groupSize: groupSize.toString(),
        organizerName,
        organizerPhone: organizerPhone || '',
        occasion: occasion || '',
        message: message || '',
        splitPayment: splitPayment.toString(),
        totalAmount: totalAmount.toString(),
      },
      success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/book/${experience.id}?cancelled=true`,
    },
    // Connect : la session est créée sur le compte du prestataire
    { stripeAccount: provider.stripe_account_id! }
  )

  return session
}

/**
 * Crée un Payment Intent pour un participant (split paiement).
 */
export async function createParticipantPaymentIntent(params: {
  amount: number
  bookingId: string
  participantEmail: string
  providerStripeAccountId: string
  commissionRate: number
}) {
  const { amount, bookingId, participantEmail, providerStripeAccountId, commissionRate } = params

  const commission = amount * commissionRate

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: toStripeAmount(amount),
      currency: 'eur',
      application_fee_amount: toStripeAmount(commission),
      transfer_data: {
        destination: providerStripeAccountId,
      },
      metadata: {
        bookingId,
        participantEmail,
      },
      automatic_payment_methods: { enabled: true },
    },
    { stripeAccount: providerStripeAccountId }
  )

  return paymentIntent
}

/**
 * Crée le compte Connect et génère le lien d'onboarding pour un prestataire.
 */
export async function createConnectOnboardingLink(params: {
  email: string
  appUrl: string
  existingAccountId?: string | null
}) {
  const { email, appUrl, existingAccountId } = params

  let accountId = existingAccountId

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'company',
    })
    accountId = account.id
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/dashboard/settings?stripe=refresh`,
    return_url: `${appUrl}/dashboard/settings?stripe=success`,
    type: 'account_onboarding',
  })

  return {
    accountId,
    url: accountLink.url,
  }
}

/**
 * Génère un code unique pour le lien de split paiement.
 */
export function generateSplitPaymentCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // pas de 0/O/1/I
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
