import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge des classes Tailwind avec gestion des conflits.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Slugify une chaîne pour une URL.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format date en français.
 */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    ...opts,
  }).format(d)
}

/**
 * Format date courte (ex: "Sam. 15 juin").
 */
export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d)
}

/**
 * Format heure.
 */
export function formatTime(time: string): string {
  return time.substring(0, 5) // "14:30:00" → "14:30"
}

/**
 * Format durée en minutes → "1h30".
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h${m.toString().padStart(2, '0')}`
}

/**
 * Format prix en euros.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Libellé d'une catégorie.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  escape_game: 'Escape Game',
  atelier_cocktail: 'Atelier Cocktail',
  atelier_cuisine: 'Atelier Cuisine',
  atelier_oenologie: 'Œnologie',
  sport_loisir: 'Sport & Loisirs',
  bar_privatisation: 'Bar Privatisable',
  atelier_creatif: 'Atelier Créatif',
  karaoke: 'Karaoké',
  experience_insolite: 'Expérience Insolite',
  bien_etre: 'Bien-être',
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category
}

/**
 * Calcule le prix total d'une expérience selon le nombre de personnes.
 */
export function calculateTotalPrice(
  pricePerPerson: number | null,
  priceFixed: number | null,
  groupSize: number
): number {
  if (pricePerPerson) return pricePerPerson * groupSize
  if (priceFixed) return priceFixed
  return 0
}

/**
 * Format un numéro de téléphone français.
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }
  return phone
}
