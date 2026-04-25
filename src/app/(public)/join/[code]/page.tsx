import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { JoinPaymentForm } from '@/components/booking/JoinPaymentForm'
import { formatPrice } from '@/lib/utils'

interface PageProps {
  params: { code: string }
}

const AVATAR_COLORS = ['#FFB27A', '#C4B5FD', '#FCA5A5', '#86EFAC', '#7DD3FC', '#F0ABFC']

export default async function JoinPage({ params }: PageProps) {
  const supabase = createAdminClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, experience:experiences(*), provider:providers(*)')
    .eq('split_payment_code', params.code)
    .single()

  if (!booking) notFound()

  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('booking_id', booking.id)

  const paidCount = participants?.filter((p) => p.payment_status === 'paid').length || 0
  const totalCount = booking.group_size
  const progressPct = totalCount > 0 ? (paidCount / totalCount) * 100 : 0
  const partAmount = Number(booking.total_amount) / booking.group_size

  const deadlineDate = booking.split_payment_deadline ? new Date(booking.split_payment_deadline) : null
  const isExpired = deadlineDate ? deadlineDate < new Date() : false
  const isFull = booking.status === 'fully_paid' || booking.status === 'completed'

  const mainPhoto = booking.experience?.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resakit.fr'
  const shareUrl = `${appUrl}/join/${params.code}`

  return (
    <main className="bg-white min-h-screen pb-32 md:pb-16 pt-[62px]">
      {/* TopBar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#F2F0EC] md:max-w-2xl md:mx-auto">
        <Link
          href="/"
          className="w-[38px] h-[38px] rounded-full border border-[#EFEDE8] bg-white flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-[14px] font-semibold text-[#141414]" style={{ letterSpacing: -0.1 }}>
          Paiement partagé
        </span>
        <div className="w-[38px]" />
      </div>

      {/* Content container */}
      <div className="md:max-w-2xl md:mx-auto">

      {/* Progress hero — dark gradient card */}
      <div className="px-5 pt-5 pb-1.5">
        <div
          className="relative p-5 rounded-[22px] overflow-hidden text-white"
          style={{ background: 'linear-gradient(155deg, #141414, #1f1b2e 60%, #7C3AED)' }}
        >
          {/* Blob decoration */}
          <div
            className="absolute right-[-30px] top-[-30px] w-[140px] h-[140px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(249,115,22,0.33) 0%, transparent 65%)',
              filter: 'blur(12px)',
            }}
          />

          <div
            className="relative text-[11px] font-semibold uppercase text-white/65"
            style={{ letterSpacing: 0.4 }}
          >
            {isFull ? 'Réservation complète' : 'Réservation confirmée'}
          </div>
          <div
            className="relative mt-1 font-serif text-[24px] leading-[1.1]"
            style={{ letterSpacing: -0.4 }}
          >
            {booking.experience?.title || 'Expérience Resakit'}
          </div>
          <div className="relative mt-0.5 text-[12px] text-white/70">
            {booking.occasion && `${booking.occasion} · `}{booking.group_size} personnes
          </div>

          {/* Progress */}
          <div className="relative mt-[18px]">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[28px] font-bold" style={{ letterSpacing: -0.6 }}>
                  {formatPrice(paidCount * partAmount)}
                </span>
                <span className="text-[14px] ml-1 text-white/55">
                  / {formatPrice(Number(booking.total_amount))}
                </span>
              </div>
              <div
                className="px-2.5 py-[3px] rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(134,239,172,0.18)', color: '#86EFAC' }}
              >
                {paidCount}/{totalCount} payés
              </div>
            </div>
            <div
              className="mt-2.5 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #86EFAC, rgba(249,115,22,0.6))',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deadline note */}
      {deadlineDate && !isFull && !isExpired && (
        <div className="px-5 pt-3.5 pb-1.5">
          <div
            className="flex items-center gap-2.5 p-[11px_14px] rounded-xl border"
            style={{ background: '#FFF7EF', borderColor: '#FFE4CC' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B3450E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
            </svg>
            <div className="text-[12.5px] text-[#6B4A2D] leading-[1.35]">
              <strong className="text-[#141414]">
                Deadline : {deadlineDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}, {deadlineDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.
              </strong>
              {' '}Sinon, remboursement auto.
            </div>
          </div>
        </div>
      )}

      {/* Participants list */}
      <div className="px-5 pt-4">
        <div className="text-[13px] font-semibold text-[#141414] mb-2.5">Ta bande</div>
        <div className="flex flex-col gap-2">
          {participants && participants.length > 0 ? (
            participants.map((p: any, i: number) => {
              const isPaid = p.payment_status === 'paid'
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-[12px_14px] rounded-[14px] border border-[#EFEDE8] bg-white"
                >
                  <div
                    className="relative w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-[#141414]"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {(p.name || p.email || '?')[0].toUpperCase()}
                    {isPaid && (
                      <div
                        className="absolute bottom-[-2px] right-[-2px] w-4 h-4 rounded-full bg-[#16A34A] border-2 border-white flex items-center justify-center"
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#141414] truncate" style={{ letterSpacing: -0.1 }}>
                      {p.name || p.email || 'Participant'}
                    </div>
                    <div
                      className="text-[11.5px] mt-0.5"
                      style={{ color: isPaid ? '#16A34A' : '#8A8880' }}
                    >
                      {isPaid ? 'A payé' : 'En attente de paiement'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[14px] font-bold text-[#141414]">{formatPrice(partAmount)}</span>
                    {!isPaid && (
                      <span
                        className="text-[10.5px] font-semibold uppercase px-2 py-0.5 rounded-full"
                        style={{ letterSpacing: 0.3, background: '#F2F0EC', color: '#141414' }}
                      >
                        Relancer
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            Array.from({ length: totalCount }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-[12px_14px] rounded-[14px] border border-[#EFEDE8] bg-white"
              >
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="h-3 w-24 bg-[#F2F0EC] rounded" />
                  <div className="h-2.5 w-16 bg-[#F7F5F1] rounded mt-1.5" />
                </div>
                <span className="text-[14px] font-bold text-[#141414]">{formatPrice(partAmount)}</span>
              </div>
            ))
          )}
        </div>

        {/* Share link */}
        <div
          className="mt-3.5 flex items-center gap-2.5 p-[12px_14px] rounded-[14px] bg-[#141414] text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <div className="flex-1 text-[12.5px] truncate min-w-0">{shareUrl}</div>
          <button
            className="px-3 py-1.5 rounded-full bg-white text-[#141414] text-[11px] font-semibold flex-shrink-0"
          >
            Copier
          </button>
        </div>
      </div>

      {/* Payment form for unpaid participants */}
      {!isFull && !isExpired && (
        <div className="px-5 pt-5">
          <div
            className="font-serif text-[22px] text-[#141414] mb-4"
            style={{ letterSpacing: -0.4, fontWeight: 400 }}
          >
            Paie ta <em className="text-[#7C3AED]">part</em>
          </div>

          <div
            className="p-5 rounded-[22px] bg-[#FAF8F4] border border-[#EFEDE8] text-center mb-4"
          >
            <div className="text-[12px] text-[#8A8880] mb-1">Ta part à payer</div>
            <div
              className="text-[36px] font-bold text-[#7C3AED]"
              style={{ letterSpacing: -0.8 }}
            >
              {formatPrice(partAmount)}
            </div>
          </div>

          <JoinPaymentForm code={params.code} amount={partAmount} />
        </div>
      )}

      {/* Full / expired states */}
      {isFull && (
        <div className="px-5 pt-5">
          <div
            className="p-6 rounded-[22px] text-center"
            style={{ background: '#E6F7EC', border: '1px solid #BFEBCB' }}
          >
            <div className="font-serif italic text-[24px] text-[#15803D] mb-2">
              Tout le monde a payé !
            </div>
            <p className="text-[14px] text-[#14532D]">
              Rendez-vous pour {booking.experience?.title} !
            </p>
          </div>
        </div>
      )}

      {isExpired && !isFull && (
        <div className="px-5 pt-5">
          <div
            className="p-6 rounded-[22px] bg-[#F7F5F1] border border-[#EFEDE8] text-center"
          >
            <div className="font-serif italic text-[22px] text-[#141414] mb-2">
              Délai de paiement dépassé
            </div>
            <p className="text-[13px] text-[#6B6960]">
              Contacte l&apos;organisateur pour plus d&apos;infos.
            </p>
          </div>
        </div>
      )}

      {/* CTA — sticky on mobile, inline on desktop */}
      <div
        className="fixed bottom-0 inset-x-0 md:relative md:bottom-auto md:inset-x-auto md:mt-6 px-5 pb-[34px] pt-[14px] md:pb-[14px]"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #EFEDE8',
        }}
      >
        <Link
          href="/mes-reservations"
          className="block w-full py-[14px] rounded-[14px] bg-[#141414] text-white text-[15px] font-semibold text-center"
        >
          Voir ma réservation
        </Link>
      </div>

      </div>
    </main>
  )
}
