import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Check, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { formatShortDate, formatTime } from '@/lib/utils'

export const metadata = { title: 'Mes réservations' }

export default async function MesReservationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, experience:experiences(*), slot:slots(*)')
    .eq('organizer_email', user.email!)
    .order('created_at', { ascending: false })

  const upcoming = (bookings || []).filter(b => !['completed', 'cancelled'].includes(b.status))
  const past = (bookings || []).filter(b => ['completed', 'cancelled'].includes(b.status))

  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] min-h-screen pb-24 md:pb-0">
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-serif italic text-3xl text-[#141414]">Mes réservations</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-[#EFEDE8] px-5 flex">
          <button className="px-0 py-3 text-sm font-semibold text-[#141414] border-b-2 border-[#7C3AED] mr-6">
            À venir
            {upcoming.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F1EAFE] text-[#7C3AED] text-[10px] font-bold">
                {upcoming.length}
              </span>
            )}
          </button>
          <button className="px-0 py-3 text-sm font-medium text-[#6B6960] border-b-2 border-transparent">
            Passées <span className="text-[#8A8880]">{past.length}</span>
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {upcoming.length === 0 && (
            <EmptyState />
          )}
          {upcoming.map((b: any) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

function BookingCard({ booking }: { booking: any }) {
  const photo = booking.experience?.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400'
  const isConfirmed = ['fully_paid', 'confirmed', 'completed'].includes(booking.status)
  const isPending = ['pending', 'deposit_paid'].includes(booking.status)

  return (
    <Link href={`/mes-reservations/${booking.id}`} className="block">
      <div className="bg-white rounded-2xl border border-[#EFEDE8] p-3 flex items-center gap-3">
        <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0">
          <Image src={photo} alt={booking.experience?.title || ''} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#141414] truncate">{booking.experience?.title}</p>
          <p className="text-xs text-[#6B6960] mt-0.5">
            {booking.slot ? `${formatShortDate(booking.slot.date)} · ${formatTime(booking.slot.time_start)}` : 'Date à confirmer'}
            {' · '}{booking.group_size} pers
          </p>
          <div className="mt-2">
            {isConfirmed ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                <Check className="w-2.5 h-2.5" /> Confirmée
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                <Clock className="w-2.5 h-2.5" /> Paiement en cours
              </span>
            ) : null}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8A8880] flex-shrink-0" />
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 rounded-2xl bg-white border border-[#EFEDE8] flex items-center justify-center mb-4 relative">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8A8880" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 10V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 0 0 4v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 0 0-4z"/>
        </svg>
        <span className="absolute -top-2 -right-3 font-serif italic text-2xl text-[#7C3AED] rotate-[-8deg]">oups</span>
      </div>
      <h2 className="font-serif italic text-2xl text-[#141414] mb-2">
        Pas encore de <em className="text-[#7C3AED]">réservation</em>
      </h2>
      <p className="text-sm text-[#6B6960] max-w-[260px] mb-6">
        Trouve ton prochain EVJF, atelier cocktails ou escape game entre amis.
      </p>
      <Link
        href="/toulouse"
        className="inline-flex items-center gap-2 bg-[#7C3AED] text-white text-sm font-semibold px-5 py-3 rounded-xl"
      >
        Explorer les expériences
      </Link>
    </div>
  )
}
