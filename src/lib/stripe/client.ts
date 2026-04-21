import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
  typescript: true,
})

export const stripeConfig = {
  currency: 'eur',
  allowedPaymentMethods: ['card'] as const,
  applicationFeePercent: 0.10, // 10% par défaut
}

/**
 * Convertit un montant en euros (float) en centimes (int) pour Stripe.
 */
export function toStripeAmount(amountEuros: number): number {
  return Math.round(amountEuros * 100)
}

/**
 * Convertit des centimes Stripe en euros.
 */
export function fromStripeAmount(amountCents: number): number {
  return amountCents / 100
}

/**
 * Formate un montant en euros avec séparateurs.
 */
export function formatPrice(amountEuros: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountEuros)
}
