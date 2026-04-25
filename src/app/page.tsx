import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ExperienceCard } from '@/components/experience/ExperienceCard'
import { WaitlistForm } from '@/components/WaitlistForm'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createClient()
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*, provider:providers(*)')
    .eq('is_active', true)
    .limit(6)

  return (
    <>
      <Header />
      <main className="bg-white pb-20 md:pb-0" style={{ fontFamily: '"Inter", -apple-system, sans-serif' }}>

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="px-5 pt-4 pb-2">
          {/* badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4"
            style={{ background: '#FFF1E6', color: '#B3450E' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] shadow-[0_0_0_4px_rgba(249,115,22,0.15)]" />
            <span className="text-[11px] font-semibold tracking-[0.2px]">Nouveau à Toulouse</span>
          </div>

          {/* headline */}
          <h1 className="font-serif text-[44px] leading-[0.98] tracking-[-1.2px] text-[#141414] mb-0"
            style={{ fontStyle: 'normal', textWrap: 'balance' }}>
            Réserve la{' '}
            <em className="italic text-[#7C3AED]">sortie.</em>
            <br />
            Oublie l&apos;<em className="italic text-[#F97316]">avance.</em>
          </h1>

          <p className="mt-3.5 text-[15px] leading-[1.45] text-[#5B5952] max-w-[300px]">
            Escape games, ateliers, dégustations. Réserve en un clic et{' '}
            <strong className="text-[#141414] font-semibold">partage l&apos;addition</strong> avec ta bande.
          </p>
        </section>

        {/* ── SEARCH BAR ─────────────────────────────────── */}
        <section className="px-5 pt-4 pb-5">
          <div className="rounded-[22px] border border-[#E6E4E0] bg-white"
            style={{ boxShadow: '0 8px 24px rgba(20,20,20,0.06), 0 1px 2px rgba(0,0,0,0.03)', padding: 6 }}>
            <div className="grid grid-cols-2 px-1 pt-2.5 pb-2"
              style={{ borderBottom: '1px solid #F2F0EC' }}>
              <SearchField label="Occasion" value="EVJF" icon="✦" />
              <SearchField label="Ville" value="Toulouse" icon="📍" border />
            </div>
            <div className="grid grid-cols-2 px-1 pt-2.5 pb-2.5">
              <SearchField label="Date" value="Sam. 16 mai" icon="📅" />
              <SearchField label="Groupe" value="6 personnes" icon="👥" border />
            </div>
            <Link
              href="/toulouse"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white"
              style={{ background: '#7C3AED', boxShadow: '0 6px 18px rgba(124,58,237,0.35)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              Trouver mon expérience
            </Link>
          </div>
        </section>

        {/* ── OCCASIONS ──────────────────────────────────── */}
        <section className="pt-2 pb-2">
          <div className="flex items-baseline justify-between px-5 mb-3">
            <h2 className="font-serif text-[22px] tracking-[-0.5px] text-[#141414]">
              Quelle est l&apos;occasion&nbsp;?
            </h2>
            <Link href="/toulouse" className="text-[13px] font-medium text-[#7C3AED] flex-shrink-0 ml-3">
              Tout voir
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {OCCASIONS.map((occ, i) => (
              <Link key={occ.label} href={`/toulouse?occasion=${occ.label}`}
                className="flex-shrink-0 flex flex-col gap-0.5 rounded-2xl relative"
                style={{
                  padding: '13px 36px 12px 16px',
                  background: occ.bg,
                  border: '1px solid rgba(0,0,0,0.03)',
                  minWidth: 150,
                }}>
                <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full" style={{ background: occ.dot }} />
                <span className="font-serif italic text-[20px] leading-none tracking-[-0.4px]" style={{ color: occ.fg }}>
                  {occ.label}
                </span>
                <span className="text-[11px] font-medium mt-1" style={{ color: occ.fg, opacity: 0.7 }}>
                  {occ.sub}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── EXPÉRIENCES ────────────────────────────────── */}
        <section className="pt-5 pb-2">
          <div className="flex items-baseline justify-between px-5 mb-3.5">
            <h2 className="font-serif text-[22px] tracking-[-0.5px] text-[#141414]">
              À Toulouse <em className="italic text-[#7C3AED]">cette semaine</em>
            </h2>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="flex gap-3.5 overflow-x-auto px-5 pb-2.5" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
              {experiences.map((exp: any) => (
                <ExperienceCard key={exp.id} experience={exp} variant="scroll" />
              ))}
            </div>
          ) : (
            /* Fallback cards when no DB data */
            <div className="flex gap-3.5 overflow-x-auto px-5 pb-2.5" style={{ scrollbarWidth: 'none' }}>
              {SAMPLE_EXPERIENCES.map((e, i) => (
                <SampleCard key={i} e={e} />
              ))}
            </div>
          )}

          <div className="px-5 mt-4">
            <Link href="/toulouse"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[14px] font-semibold text-[#7C3AED] border border-[#EFEDE8] bg-white">
              Voir toutes les expériences
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ── SPLIT PAYMENT ──────────────────────────────── */}
        <section className="px-5 pt-8 pb-2">
          <div className="relative rounded-[26px] overflow-hidden text-white px-5 py-6"
            style={{ background: 'linear-gradient(155deg, #141414 0%, #1f1b2e 55%, #7C3AED 130%)' }}>
            {/* blobs */}
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.33) 0%, transparent 65%)', filter: 'blur(10px)' }} />
            <div className="absolute -left-14 -bottom-14 w-44 h-44 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.33) 0%, transparent 65%)', filter: 'blur(10px)' }} />

            {/* badge */}
            <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 text-[10px] font-semibold tracking-[0.4px] uppercase"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/></svg>
              La nouveauté Resakit
            </div>

            <h3 className="relative font-serif text-[32px] leading-none tracking-[-0.8px] mb-0">
              Une réservation.<br />
              <em className="italic" style={{ color: '#FFB27A' }}>Une addition partagée.</em>
            </h3>
            <p className="relative mt-3 text-[13.5px] leading-[1.5] max-w-[280px]" style={{ color: 'rgba(255,255,255,0.78)' }}>
              Tu réserves pour le groupe, chacun paie sa part par SMS.
              Fini l&apos;avance de 300€ et les relances Lydia.
            </p>

            {/* participants live */}
            <div className="relative mt-4 rounded-2xl p-3.5"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-2.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Atelier Cocktails · 6 pers
              </p>
              {PARTICIPANTS.map((p, i) => (
                <div key={p.n} className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 mb-1"
                  style={{ background: p.paid ? 'rgba(134,239,172,0.15)' : 'rgba(255,255,255,0.06)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-[#141414] flex-shrink-0"
                    style={{ background: p.color }}>
                    {p.n[0]}
                  </div>
                  <span className="flex-1 text-[13px] font-medium" style={{ color: p.paid ? '#86EFAC' : 'rgba(255,255,255,0.75)' }}>{p.n}</span>
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>55€</span>
                  {p.paid && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────── */}
        <section className="px-5 pt-10 pb-4">
          <div className="text-center mb-10">
            <h2 className="font-serif italic text-3xl md:text-4xl text-[#141414] mb-2">
              Trois étapes. Zéro galère.
            </h2>
            <p className="text-sm text-[#6B6960]">C&apos;est le but.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_STEPS.map((s) => (
              <div key={s.n}>
                <div className="font-serif italic text-[64px] leading-none select-none mb-3" style={{ color: '#EFEDE8' }}>{s.n}</div>
                <h3 className="text-sm font-semibold text-[#141414] mb-1.5">{s.title}</h3>
                <p className="text-sm text-[#6B6960] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WAITLIST ───────────────────────────────────── */}
        <section className="px-5 pt-8 pb-10">
          <div className="rounded-3xl border border-orange-100 p-8 text-center" style={{ background: '#FFF7EF' }}>
            <p className="text-sm font-medium text-orange-500 mb-3">+847 Toulousains sur la liste</p>
            <h2 className="font-serif italic text-2xl md:text-3xl text-[#141414] mb-3">
              Sois parmi les premiers
            </h2>
            <p className="text-sm text-[#6B6960] mb-6 leading-relaxed max-w-xs mx-auto">
              Reçois les nouveautés et un code promo de{' '}
              <strong className="text-[#141414]">-15%</strong> pour ta première réservation.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/* ── Static data ────────────────────────────────────────────── */
const OCCASIONS = [
  { label: 'EVJF', sub: 'dès 35€/pers', bg: '#F7EEFF', fg: '#6B21A8', dot: '#A855F7' },
  { label: 'Anniversaire', sub: 'dès 25€/pers', bg: '#FFF1E6', fg: '#9A3412', dot: '#F97316' },
  { label: 'Team building', sub: 'dès 45€/pers', bg: '#EAF3FF', fg: '#1E40AF', dot: '#3B82F6' },
  { label: 'Entre amis', sub: 'dès 20€/pers', bg: '#EAF7EE', fg: '#166534', dot: '#16A34A' },
]

const PARTICIPANTS = [
  { n: 'Marie', paid: true, color: '#FFB27A' },
  { n: 'Léo', paid: true, color: '#C4B5FD' },
  { n: 'Tom', paid: true, color: '#FCA5A5' },
  { n: 'Anna', paid: false, color: '#86EFAC' },
  { n: 'Jules', paid: false, color: '#7DD3FC' },
  { n: 'Sam', paid: false, color: '#F0ABFC' },
]

const HOW_STEPS = [
  { n: '01', title: 'Choisis ton expérience', desc: 'Parcours le catalogue, filtre par occasion, nombre de personnes et budget.' },
  { n: '02', title: 'Réserve et partage', desc: 'Paie ta part et envoie le lien aux participants — chacun règle directement.' },
  { n: '03', title: 'Profite du moment', desc: 'On gère tout. Confirmations, rappels, contact prestataire. Toi tu te concentres sur le fun.' },
]

const SAMPLE_EXPERIENCES = [
  { title: 'Escape Game — Le Braquage', type: 'Escape · Capitole', price: '25€', group: '4–8', rating: 4.9, reviews: 238, img: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=900&q=80', tag: 'Populaire EVG' },
  { title: 'Atelier Cocktails Signature', type: 'Mixologie · Saint-Cyprien', price: '55€', group: '6–16', rating: 4.8, reviews: 412, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80', tag: 'Top EVJF' },
  { title: 'Food Gaming — Vins & Fromages', type: 'Dégustation · Carmes', price: '48€', group: '4–12', rating: 4.9, reviews: 156, img: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=900&q=80', tag: 'Team favori' },
  { title: 'Karaoké Privatisé — Box VIP', type: 'Karaoké · Saint-Aubin', price: '32€', group: '4–10', rating: 4.7, reviews: 189, img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&q=80', tag: 'Ambiance EVJF' },
]

function SampleCard({ e }: { e: typeof SAMPLE_EXPERIENCES[0] }) {
  return (
    <div className="flex-shrink-0 rounded-[22px] overflow-hidden bg-white border border-[#EFEDE8]" style={{ width: 280 }}>
      <div className="relative overflow-hidden" style={{ height: 210, background: `url(${e.img}) center/cover` }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35))' }} />
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
        </button>
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#141414]"
          style={{ background: 'rgba(255,255,255,0.95)' }}>
          <span className="text-[#7C3AED]">◆</span> {e.tag}
        </div>
        <div className="absolute bottom-2.5 left-3 px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-[0.3px] text-white"
          style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          Paiement partagé
        </div>
      </div>
      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] font-semibold text-[#141414] leading-snug">{e.title}</p>
          <div className="flex items-center gap-1 text-[12px] font-semibold text-[#141414] flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#141414"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {e.rating}
          </div>
        </div>
        <p className="text-[12px] text-[#8A8880] mt-1">{e.type}</p>
        <div className="mt-2.5 pt-2.5 flex items-center justify-between" style={{ borderTop: '1px dashed #EDEBE5' }}>
          <div className="flex items-center gap-1 text-[12px] text-[#6B6960]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {e.group} pers
          </div>
          <div>
            <span className="text-[16px] font-bold text-[#141414] tracking-tight">{e.price}</span>
            <span className="text-[12px] text-[#8A8880]">/pers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchField({ label, value, icon, border }: { label: string; value: string; icon: string; border?: boolean }) {
  return (
    <div className={`px-3 ${border ? 'border-l border-[#F2F0EC]' : ''}`}>
      <div className="flex items-center gap-1 text-[10px] font-semibold text-[#8A8880] uppercase tracking-[0.5px] mb-1">
        <span>{icon}</span> {label}
      </div>
      <div className="text-[14px] font-medium text-[#141414] tracking-[-0.1px]">{value}</div>
    </div>
  )
}
