'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatPrice, formatShortDate, formatTime } from '@/lib/utils'
import type { Experience, Slot } from '@/types/database'

interface BookingWidgetProps {
  experience: Experience
  slots: Slot[]
}

export function BookingWidget({ experience, slots }: BookingWidgetProps) {
  const router = useRouter()
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [groupSize, setGroupSize] = useState(experience.min_people)

  // Grouper par date
  const slotsByDate = useMemo(() => {
    const map = new Map<string, Slot[]>()
    slots.forEach((s) => {
      if (!map.has(s.date)) map.set(s.date, [])
      map.get(s.date)!.push(s)
    })
    return Array.from(map.entries()).slice(0, 10)
  }, [slots])

  const selectedSlot = slots.find((s) => s.id === selectedSlotId)

  const totalPrice = useMemo(() => {
    if (experience.price_per_person) {
      return experience.price_per_person * groupSize
    }
    return experience.price_fixed ?? 0
  }, [experience, groupSize])

  const pricePerPersonDisplay = experience.price_per_person ?? (experience.price_fixed ? experience.price_fixed / groupSize : 0)

  function handleReserve() {
    if (!selectedSlotId) return
    const params = new URLSearchParams({
      slot: selectedSlotId,
      size: groupSize.toString(),
    })
    router.push(`/book/${experience.id}?${params.toString()}`)
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md">
      <div className="mb-5 pb-5 border-b border-gray-100">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-brand-violet">
            {formatPrice(pricePerPersonDisplay)}
          </span>
          {experience.price_per_person && (
            <span className="text-gray-500">/personne</span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Acompte {experience.deposit_percent}% à la réservation
        </p>
      </div>

      {/* Créneaux */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Calendar className="w-4 h-4" />
          Choisis un créneau
        </label>
        {slotsByDate.length === 0 ? (
          <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
            Aucun créneau disponible pour le moment.
            <br />
            Contacte-nous pour une demande personnalisée.
          </p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {slotsByDate.map(([date, daySlots]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  {formatShortDate(date)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {daySlots.map((slot) => {
                    const remaining = slot.total_capacity - slot.booked_capacity
                    const disabled = remaining < experience.min_people
                    const selected = slot.id === selectedSlotId
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        disabled={disabled}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Nombre de personnes */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Users className="w-4 h-4" />
          Nombre de personnes
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGroupSize(Math.max(experience.min_people, groupSize - 1))}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-bold"
          >
            −
          </button>
          <Input
            type="number"
            value={groupSize}
            onChange={(e) => {
              const v = parseInt(e.target.value) || experience.min_people
              setGroupSize(Math.min(experience.max_people, Math.max(experience.min_people, v)))
            }}
            min={experience.min_people}
            max={experience.max_people}
            className="flex-1 text-center font-semibold"
          />
          <button
            onClick={() => setGroupSize(Math.min(experience.max_people, groupSize + 1))}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-bold"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Min {experience.min_people} — Max {experience.max_people}
        </p>
      </div>

      {/* Total */}
      <div className="bg-gray-50 rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Acompte à la réservation</span>
          <span className="font-semibold text-brand-violet">
            {formatPrice((totalPrice * experience.deposit_percent) / 100)}
          </span>
        </div>
      </div>

      <Button
        onClick={handleReserve}
        disabled={!selectedSlotId || slotsByDate.length === 0}
        className="w-full"
        size="lg"
      >
        Réserver maintenant
      </Button>

      <p className="text-xs text-gray-500 text-center mt-3">
        ✅ Paiement sécurisé · ✅ Split entre amis · ✅ Annulation flexible
      </p>
    </div>
  )
}
