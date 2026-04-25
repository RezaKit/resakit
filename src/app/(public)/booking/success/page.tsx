import Link from 'next/link'
import { Check } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { SplitLinkActions } from '@/components/booking/SplitLinkActions'
import { formatPrice } from '@/lib/utils'

interface PageProps {
  searchParams: { session_id?: string }
}

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id
  let booking: any = null

  if (sessionId) {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('bookings')
      .select('*, experience:experiences(*), provider:providers(*)')
      .eq('stripe_session_id', sessionId)
      .single()
    booking = data
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resakit.fr'
  const splitUrl = booking?.split_payment_code ? `${appUrl}/join/${booking.split_payment_code}` : null
  const mainPhoto = booking?.experience?.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80'

  return (
    <main
      className="min-h-screen pb-32 md:pb-0"
      style={{ background: 'radial-gradient(600px 400px at 50% 0%, rgba(124,58,237,0.13), transparent 70%), #fff' }}
    >
      <div className="md:max-w-2xl md:mx-auto md:px-8 md:py-16">

      {/* Close / home button */}
      <div className="flex justify-end px-5 pt-16 pb-0 md:pt-0">
        <Link
          href="/"
          className="w-[38px] h-[38px] rounded-full border border-[#EFEDE8] bg-white flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Link>
      </div>

      {/* Hero */}
      <div className="px-6 pt-6 pb-0 text-center">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #F97316)',
            boxShadow: '0 12px 30px rgba(124,58,237,0.33)',
          }}
        >
          <Check className="w-[34px] h-[34px] text-white" strokeWidth={2.5} />
        </div>

        <h1
          className="font-serif text-[34px] text-[#141414] leading-[1.02] mt-5 text-balance"
          style={{ letterSpacing: -1, fontWeight: 400 }}
        >
          C&apos;est dans la <em className="text-[#7C3AED]">poche.</em>
        </h1>
        <p className="text-[14px] text-[#6B6960] leading-[1.5] mt-2.5 max-w-xs mx-auto">
          {booking
            ? `On vient d'envoyer les SMS à ta bande. Tu recevras une notif dès que chacun confirme.`
            : `Ton paiement a bien été reçu. Tu vas recevoir un email de confirmation sous peu.`}
        </p>
      </div>

      {/* Ticket card */}
      <div className="px-5 pt-6">
        <div
          className="rounded-[22px] bg-white border border-[#EFEDE8] overflow-hidden"
          style={{ boxShadow: '0 20px 40px rgba(20,20,20,0.06)' }}
        >
          {/* Image */}
          <div
            className="relative h-[110px]"
            style={{ background: `url(${mainPhoto}) center/cover` }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))' }}
            />
            <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-[0.4px] opacity-85">
                Réservation {booking?.booking_ref ? `#${booking.booking_ref}` : ''}
              </div>
              <div className="text-[16px] font-semibold mt-0.5 truncate" style={{ letterSpacing: -0.2 }}>
                {booking?.experience?.title || 'Expérience Resakit'}
              </div>
            </div>
          </div>

          {/* Perforation */}
          <div className="relative h-[22px] flex items-center mx-[-12px]">
            <div
              className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white border border-[#EFEDE8]"
              style={{ clipPath: 'inset(0 0 0 50%)' }}
            />
            <div
              className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white border border-[#EFEDE8]"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
            <div className="flex-1 border-t-2 border-dashed border-[#EFEDE8] mx-4" />
          </div>

          {/* Ticket info */}
          <div className="px-[18px] pb-[18px] pt-[10px]">
            <div className="grid grid-cols-2 gap-3">
              {booking ? (
                <>
                  <TicketField label="Date" value={booking.date ? new Date(booking.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'} />
                  <TicketField label="Heure" value={booking.time_slot || '—'} />
                  <TicketField label="Groupe" value={`${booking.group_size} personnes`} />
                  <TicketField label="Total" value={formatPrice(Number(booking.total_amount))} />
                </>
              ) : (
                <>
                  <TicketField label="Date" value="À confirmer" />
                  <TicketField label="Groupe" value="—" />
                  <TicketField label="Statut" value="Confirmé" />
                  <TicketField label="Total" value="—" />
                </>
              )}
            </div>
            {booking?.provider && (
              <div
                className="mt-3.5 pt-3.5 flex justify-between items-center"
                style={{ borderTop: '1px dashed #EFEDE8' }}
              >
                <span className="text-[12px] text-[#6B6960]">Adresse</span>
                <span className="text-[12.5px] font-semibold text-[#141414]">
                  {booking.provider.address || booking.provider.city || 'Toulouse'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Split link */}
      {splitUrl && (
        <div className="px-5 pt-5">
          <SplitLinkActions splitUrl={splitUrl} occasion={booking?.occasion} />
        </div>
      )}

      {/* Next steps */}
      <div className="px-5 pt-6">
        <div
          className="font-serif text-[18px] text-[#141414] mb-2.5"
          style={{ letterSpacing: -0.3, fontWeight: 400 }}
        >
          Et maintenant&nbsp;?
        </div>
        {[
          { n: '1', t: 'On attend les paiements', d: "Jusqu'à 48h avant. Relance auto 24h avant." },
          { n: '2', t: 'On confirme à tout le monde', d: 'SMS + email avec les infos pratiques.' },
          { n: '3', t: 'Jour J : profite', d: "L'hôte vous accueille sur place." },
        ].map((s, i) => (
          <div
            key={i}
            className="flex gap-3 py-2.5"
            style={{ borderBottom: i < 2 ? '1px solid #F2F0EC' : 'none' }}
          >
            <div
              className="font-serif italic text-[22px] text-[#7C3AED] leading-none w-[26px] flex-shrink-0"
            >
              {s.n}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#141414]" style={{ letterSpacing: -0.1 }}>
                {s.t}
              </div>
              <div className="text-[12.5px] text-[#6B6960] mt-0.5 leading-[1.4]">{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA — sticky on mobile, inline on desktop */}
      <div
        className="fixed bottom-0 inset-x-0 md:relative md:bottom-auto md:inset-x-auto md:mt-8 md:mx-5 md:rounded-2xl flex gap-2.5 px-5 pb-[34px] pt-[14px] md:pb-[14px]"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #EFEDE8',
        }}
      >
        <Link
          href="/"
          className="px-[18px] py-[14px] rounded-[14px] bg-white border border-[#EFEDE8] text-[14px] font-semibold text-[#141414] flex-shrink-0"
        >
          Accueil
        </Link>
        <Link
          href="/mes-reservations"
          className="flex-1 flex items-center justify-center gap-2 py-[14px] rounded-[14px] bg-[#141414] text-white text-[15px] font-semibold"
        >
          Voir les paiements
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      </div>
    </main>
  )
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-[#8A8880] uppercase" style={{ letterSpacing: 0.4 }}>
        {label}
      </div>
      <div className="text-[14px] font-semibold text-[#141414] mt-0.5" style={{ letterSpacing: -0.1 }}>
        {value}
      </div>
    </div>
  )
}
