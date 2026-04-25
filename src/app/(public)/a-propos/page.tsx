import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'À propos — Resakit',
  description: "Resakit simplifie la réservation d'expériences de groupe à Toulouse. Notre mission : que chaque sortie entre amis se passe sans galère.",
}

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] pb-20 md:pb-0">

        {/* Hero */}
        <section className="bg-[#141414] px-5 py-16 md:py-24">
          <div className="container max-w-3xl">
            <h1 className="font-serif italic text-4xl md:text-[56px] leading-[1.05] text-white mb-6">
              On croit aux sorties<br />
              <em className="text-[#7C3AED]">sans prise de tête.</em>
            </h1>
            <p className="text-base text-white/70 max-w-xl leading-relaxed">
              Resakit est né d&apos;une frustration simple : organiser une sortie de groupe à Toulouse
              était trop compliqué. Trop de messages, trop de bons de virement, trop de no-shows.
              On a décidé de régler ça.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="px-5 py-14">
          <div className="container max-w-2xl">
            <div className="bg-white rounded-3xl border border-[#EFEDE8] p-8 md:p-10 space-y-6">
              <div>
                <h2 className="font-serif italic text-2xl text-[#141414] mb-3">Notre histoire</h2>
                <p className="text-sm text-[#6B6960] leading-relaxed">
                  Lancé en 2024 à Toulouse, Resakit connecte les groupes avec les meilleurs prestataires
                  d&apos;expériences de la ville. Escape games, ateliers cocktails, team buildings, EVJF —
                  tout se réserve en quelques taps et chaque participant paie sa part directement.
                </p>
              </div>
              <div>
                <h2 className="font-serif italic text-2xl text-[#141414] mb-3">Notre mission</h2>
                <p className="text-sm text-[#6B6960] leading-relaxed">
                  Que la meilleure partie de la sortie ne soit pas l&apos;organisation. On s&apos;occupe du reste :
                  paiement partagé par SMS, confirmation instantanée, zéro avance pour l&apos;organisateur.
                </p>
              </div>
              <div>
                <h2 className="font-serif italic text-2xl text-[#141414] mb-3">Pour les prestataires</h2>
                <p className="text-sm text-[#6B6960] leading-relaxed">
                  0€ d&apos;abonnement, 10% de commission uniquement sur les réservations confirmées.
                  On t&apos;apporte des clients qualifiés, tu te concentres sur ce que tu fais de mieux.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-5 pb-14">
          <div className="container max-w-4xl">
            <h2 className="font-serif italic text-2xl md:text-3xl text-[#141414] text-center mb-8">
              Ce qu&apos;on croit vraiment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { n: '01', t: 'Simple avant tout', d: "La meilleure interface est celle qu'on n'a pas besoin d'expliquer." },
                { n: '02', t: 'Local en premier', d: "Toulouse d'abord. Connaître une ville avant de la conquérir." },
                { n: '03', t: 'Équitable', d: "10% pour un service réel. Pas d'abonnement caché, pas de frais surprise." },
              ].map((v) => (
                <div key={v.n} className="bg-white rounded-2xl border border-[#EFEDE8] p-6">
                  <div className="font-serif italic text-4xl text-[#EFEDE8] mb-3">{v.n}</div>
                  <h3 className="font-semibold text-[#141414] mb-2">{v.t}</h3>
                  <p className="text-sm text-[#6B6960] leading-relaxed">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-16">
          <div className="container max-w-2xl text-center">
            <div className="bg-white border border-[#EFEDE8] rounded-3xl p-10">
              <h2 className="font-serif italic text-2xl text-[#141414] mb-4">
                Tu as une activité à Toulouse ?
              </h2>
              <p className="text-sm text-[#6B6960] mb-6 leading-relaxed">
                Rejoins Resakit gratuitement et commence à recevoir des réservations de groupe.
              </p>
              <Link
                href="/pour-les-pros"
                className="inline-flex items-center gap-2 bg-[#7C3AED] text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-[#6D28D9] transition-colors"
              >
                Référencer mon activité <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
