import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Clock, Copy, Mail, MapPin, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { formatPrice, formatShortDate, formatTime } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

export default async function ResaDetailPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, experience:experiences(*), provider:providers(*), slot:slots(*)')
    .eq('id', params.id)
    .single()

  if (!booking) notFound()

  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('booking_id', booking.id)

  const paidCount = (participants || []).filter(p => p.payment_status === 'paid').length
  const totalCount = booking.group_size
  const progress = Math.round((paidCount / totalCount) * 100)
  const photo = booking.experience?.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900'
  const isConfirmed = ['fully_paid', 'confirmed', 'completed'].includes(booking.status)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resakit.fr'
  const splitUrl = booking.split_payment_code ? `${appUrl}/join/${booking.split_payment_code}` : null

  const AVATAR_COLORS = ['#FFB27A', '#C4B5FD', '#86EFAC', '#FCA5A5', '#7DD3FC', '#F0ABFC', '#FDE68A', '#A7F3D0']

  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] min-h-screen pb-24 md:pb-10">
        {/* Hero */}
        <div className="relative h-[200px]">
          <Image src={photo} alt={booking.experience?.title || ''} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Link href="/mes-reservations" className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
          {isConfirmed ? (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-white" /> Confirmée
            </span>
          ) : (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" /> En attente
            </span>
          )}
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Title */}
          <div>
            <h1 className="font-serif italic text-2xl text-[#141414]">{booking.experience?.title}</h1>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {booking.slot && (
                <>
                  <InfoBox label="Date" value={formatShortDate(booking.slot.date)} />
                  <InfoBox label="Heure" value={formatTime(booking.slot.time_start)} />
                </>
              )}
              <InfoBox label="Durée" value={`${booking.experience?.duration_minutes ? Math.floor(booking.experience.duration_minutes / 60) + 'h' : '—'}`} />
              <InfoBox label="Lieu" value={booking.provider?.address?.split(',')[0] || booking.provider?.city || '—'} />
            </div>
          </div>

          {/* Participants & paiements */}
          <div className="bg-white rounded-2xl border border-[#EFEDE8] p-4">
            <p className="text-[10px] font-bold text-[#8A8880] uppercase tracking-wider mb-3">Participants & paiements</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#6B6960]">{paidCount}/{totalCount} ont payé</p>
              <p className="text-sm font-bold text-[#141414]">
                {formatPrice((paidCount / totalCount) * Number(booking.total_amount))}{' '}
                <span className="text-xs text-[#8A8880] font-normal">/ {formatPrice(Number(booking.total_amount))}</span>
              </p>
            </div>
            <div className="h-2 bg-[#F5F2EC] rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #F97316)' }}
              />
            </div>

            <div className="space-y-2">
              {(participants || []).map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#141414] flex-shrink-0"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {(p.name || 'P').charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm text-[#141414] font-medium truncate">{p.name || `Participant ${i + 1}`}</span>
                  <span className="text-xs text-[#6B6960]">{formatPrice(Number(booking.total_amount) / booking.group_size)}</span>
                  {p.payment_status === 'paid' ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" /> Payé
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded-full">Relancer</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            {splitUrl && (
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#EFEDE8] bg-white text-xs font-semibold text-[#141414]">
                <Copy className="w-3.5 h-3.5" /> Copier le lien
              </button>
            )}
            {booking.provider?.contact_email && (
              <a
                href={`mailto:${booking.provider.contact_email}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#EFEDE8] bg-white text-xs font-semibold text-[#141414]"
              >
                <Mail className="w-3.5 h-3.5" /> Contacter l&apos;hôte
              </a>
            )}
          </div>

          {/* Address */}
          {booking.provider?.address && (
            <div className="bg-white rounded-2xl border border-[#EFEDE8] overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-[#141414]">{booking.provider.address}</p>
                <p className="text-xs text-[#6B6960]">{booking.provider.city}</p>
              </div>
            </div>
          )}

          {/* Cancel */}
          <div className="text-center pt-2">
            <button className="text-sm text-red-500 font-medium">Annuler la réservation</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F5F2EC] rounded-xl p-3">
      <p className="text-[10px] font-bold text-[#8A8880] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#141414]">{value}</p>
    </div>
  )
}
