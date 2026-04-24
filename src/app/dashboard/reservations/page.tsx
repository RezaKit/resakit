import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatShortDate, formatTime } from '@/lib/utils'

export const metadata = { title: 'Réservations — Dashboard' }

export default async function ReservationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase.from('providers').select('*').eq('user_id', user.id).single()
  if (!provider) redirect('/dashboard')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, experience:experiences(*), slot:slots(*)')
    .eq('provider_id', provider.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'orange' },
    deposit_paid: { label: 'Acompte payé', color: 'blue' },
    fully_paid: { label: 'Payée', color: 'green' },
    confirmed: { label: 'Confirmée', color: 'green' },
    completed: { label: 'Terminée', color: 'gray' },
    cancelled: { label: 'Annulée', color: 'red' },
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif italic text-[#141414]">
          <em className="text-[#7C3AED]">Réservations</em>
        </h1>
        <p className="text-sm text-gray-500 mt-1">{bookings?.length || 0} réservation{(bookings?.length || 0) > 1 ? 's' : ''} au total</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFEDE8] overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-6 px-6 py-3 border-b border-[#EFEDE8] text-[10px] font-bold text-[#8A8880] uppercase tracking-wider">
          <span className="col-span-2">Expérience</span>
          <span>Date</span>
          <span>Groupe</span>
          <span>Montant</span>
          <span>Statut</span>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="divide-y divide-[#EFEDE8]">
            {bookings.map((b: any) => {
              const status = STATUS_LABELS[b.status] || { label: b.status, color: 'gray' }
              return (
                <div key={b.id} className="grid grid-cols-1 md:grid-cols-6 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="md:col-span-2 mb-1 md:mb-0">
                    <p className="text-sm font-semibold text-[#141414]">{b.experience?.title}</p>
                    <p className="text-xs text-[#8A8880] mt-0.5">{b.booking_ref}</p>
                  </div>
                  <p className="text-sm text-[#6B6960]">
                    {b.slot ? `${formatShortDate(b.slot.date)} ${formatTime(b.slot.time_start)}` : '—'}
                  </p>
                  <p className="text-sm text-[#6B6960]">{b.group_size} pers</p>
                  <p className="text-sm font-semibold text-[#141414]">{formatPrice(Number(b.provider_amount))}</p>
                  <div>
                    <StatusBadge status={b.status} label={status.label} color={status.color} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-[#6B6960] text-sm mb-2">Aucune réservation pour l&apos;instant.</p>
            <p className="text-xs text-[#8A8880]">Partage ta fiche Resakit pour commencer à recevoir des réservations !</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status, label, color }: { status: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[color] || colors.gray}`}>
      {label}
    </span>
  )
}
