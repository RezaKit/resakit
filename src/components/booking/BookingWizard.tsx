'use client'

import { useState, useMemo } from 'react'
import { Check, Users, Calendar, CreditCard, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  formatPrice,
  formatShortDate,
  formatTime,
  calculateTotalPrice,
} from '@/lib/utils'
import type { Experience, Slot, Provider } from '@/types/database'

interface BookingWizardProps {
  experience: Experience & { provider: Provider }
  slots: Slot[]
  initialSlotId?: string
  initialSize?: number
}

const OCCASIONS = [
  { value: 'EVJF', label: '👰 EVJF' },
  { value: 'EVG', label: '🤵 EVG' },
  { value: 'Anniversaire', label: '🎂 Anniversaire' },
  { value: 'Team building', label: '🤝 Team building' },
  { value: 'Soirée', label: '🎉 Soirée' },
  { value: 'Entre amis', label: '👯 Entre amis' },
  { value: 'Pot de départ', label: '🥂 Pot de départ' },
  { value: 'Autre', label: '💫 Autre' },
]

export function BookingWizard({
  experience,
  slots,
  initialSlotId,
  initialSize,
}: BookingWizardProps) {
  const [step, setStep] = useState(1)
  const [slotId, setSlotId] = useState<string | null>(initialSlotId ?? null)
  const [groupSize, setGroupSize] = useState(initialSize ?? experience.min_people)
  const [organizerName, setOrganizerName] = useState('')
  const [organizerEmail, setOrganizerEmail] = useState('')
  const [organizerPhone, setOrganizerPhone] = useState('')
  const [occasion, setOccasion] = useState('')
  const [message, setMessage] = useState('')
  const [splitPayment, setSplitPayment] = useState(true)
  const [loading, setLoading] = useState(false)

  const slotsByDate = useMemo(() => {
    const map = new Map<string, Slot[]>()
    slots.forEach((s) => {
      if (!map.has(s.date)) map.set(s.date, [])
      map.get(s.date)!.push(s)
    })
    return Array.from(map.entries()).slice(0, 14)
  }, [slots])

  const totalAmount = calculateTotalPrice(
    experience.price_per_person,
    experience.price_fixed,
    groupSize
  )
  const partPerPerson = totalAmount / groupSize
  const depositAmount = (totalAmount * experience.deposit_percent) / 100
  const amountToPay = splitPayment ? partPerPerson : depositAmount

  function canGoToStep2() {
    return slotId !== null && groupSize >= experience.min_people
  }

  function canGoToStep3() {
    return (
      organizerName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerEmail)
    )
  }

  async function handleSubmit() {
    if (!slotId) return
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: experience.id,
          slotId,
          groupSize,
          organizerName,
          organizerEmail,
          organizerPhone: organizerPhone || undefined,
          occasion: occasion || undefined,
          message: message || undefined,
          splitPayment,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Une erreur est survenue')
        return
      }
      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl
    } catch (err) {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-brand-violet transition-all z-0"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  s < step
                    ? 'bg-brand-violet text-white'
                    : s === step
                    ? 'bg-brand-violet text-white ring-4 ring-brand-violet/20'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              <span className="text-xs font-medium mt-2 text-gray-600">
                {s === 1 ? 'Créneau' : s === 2 ? 'Infos' : 'Paiement'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="mb-6 pb-6 border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Tu réserves</p>
          <h1 className="text-xl font-display font-bold">{experience.title}</h1>
          <p className="text-sm text-gray-600">par {experience.provider.name}</p>
        </div>

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">
              Choisis ton créneau
            </h2>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                <Calendar className="w-5 h-5" /> Date et heure
              </label>
              {slotsByDate.length === 0 ? (
                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                  Aucun créneau disponible pour le moment.
                </p>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {slotsByDate.map(([date, daySlots]) => (
                    <div key={date}>
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        {formatShortDate(date)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {daySlots.map((slot) => {
                          const remaining = slot.total_capacity - slot.booked_capacity
                          const disabled = remaining < groupSize
                          const selected = slot.id === slotId
                          return (
                            <button
                              key={slot.id}
                              onClick={() => setSlotId(slot.id)}
                              disabled={disabled}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selected
                                  ? 'bg-brand-violet text-white'
                                  : disabled
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {formatTime(slot.time_start)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                <Users className="w-5 h-5" /> Nombre de personnes
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGroupSize(Math.max(experience.min_people, groupSize - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-brand-violet hover:text-brand-violet font-bold text-xl"
                >
                  −
                </button>
                <div className="flex-1 text-center bg-gray-50 rounded-lg py-3">
                  <span className="text-3xl font-bold">{groupSize}</span>
                  <span className="text-gray-500 ml-2">pers.</span>
                </div>
                <button
                  onClick={() => setGroupSize(Math.min(experience.max_people, groupSize + 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-brand-violet hover:text-brand-violet font-bold text-xl"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Min {experience.min_people} — Max {experience.max_people} personnes
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total estimé</p>
                <p className="text-2xl font-bold">{formatPrice(totalAmount)}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                {experience.price_per_person &&
                  `${formatPrice(experience.price_per_person)} / pers`}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!canGoToStep2()}
                size="lg"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Tes informations</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Nom et prénom *
                </label>
                <Input
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="Sophie Martin"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Email *
                </label>
                <Input
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="sophie@email.fr"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Téléphone
                </label>
                <Input
                  type="tel"
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Occasion
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ.value}
                      onClick={() => setOccasion(occ.value)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        occasion === occ.value
                          ? 'bg-brand-violet text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Message au prestataire (optionnel)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Allergies, préférences, infos utiles..."
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet min-h-[80px]"
                  maxLength={500}
                />
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={splitPayment}
                    onChange={(e) => setSplitPayment(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-brand-violet"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      💳 Paiement splitté entre participants
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tu paies ta part ({formatPrice(partPerPerson)}), chaque participant paie la
                      sienne via un lien unique. Plus besoin de Lydia !
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} variant="ghost">
                <ArrowLeft className="w-4 h-4" /> Retour
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canGoToStep3()}
                size="lg"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Récapitulatif & paiement</h2>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expérience</span>
                <span className="font-semibold">{experience.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nombre de personnes</span>
                <span className="font-semibold">{groupSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Occasion</span>
                <span className="font-semibold">{occasion || 'Non précisée'}</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">Total de la réservation</span>
                <span className="font-semibold">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold">Tu paies maintenant</span>
                <span className="font-bold text-brand-violet">{formatPrice(amountToPay)}</span>
              </div>
              {splitPayment && (
                <p className="text-xs text-gray-500 pt-2">
                  Les {groupSize - 1} autres participants paieront leur part
                  ({formatPrice(partPerPerson)} chacun) via un lien unique que tu pourras partager.
                </p>
              )}
              {!splitPayment && (
                <p className="text-xs text-gray-500 pt-2">
                  Acompte de {experience.deposit_percent}%. Le solde sera réglé directement au prestataire.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <CreditCard className="w-4 h-4" />
              <span>Paiement sécurisé par Stripe</span>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(2)} variant="ghost">
                <ArrowLeft className="w-4 h-4" /> Retour
              </Button>
              <Button onClick={handleSubmit} disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  <>
                    Payer {formatPrice(amountToPay)} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
