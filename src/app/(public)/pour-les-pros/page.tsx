import Link from 'next/link'
import { Check, Zap, Users, TrendingUp, ArrowRight, Star } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Pour les pros — Resakit',
  description: 'Rejoins Resakit et reçois des réservations de groupe à Toulouse. 0% d\'abonnement, 10% de commission uniquement sur les réservations confirmées.',
}

export default function ProPage() {
  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] pb-20 md:pb-0">

        {/* Hero */}
        <section className="bg-[#141414] px-5 py-16 md:py-24">
          <div className="container max-w-3xl">
            <span className="inline-block text-xs font-bold text-[#F97316] bg-[#F97316]/20 px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              Pour les prestataires
            </span>
            <h1 className="font-serif italic text-4xl md:text-[56px] leading-[1.05] text-white mb-6">
              Remplis ton agenda<br />
              <em className="text-[#F97316]">sans y penser.</em>
            </h1>
            <p className="text-base text-white/70 mb-8 max-w-xl leading-relaxed">
              Resakit t&apos;apporte des réservations de groupe. Tu reçois et tu profites.
              <br />
              <strong className="text-white">0€ d&apos;abonnement</strong>, 10% de commission uniquement sur les réservations confirmées.
            </p>
            <a
              href="mailto:contact@resakit.fr?subject=Rejoindre%20Resakit"
              className="inline-flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-[#EA580C] transition-colors"
            >
              Rejoindre Resakit <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-xs text-white/40 mt-4">Gratuit · Sans engagement · Réponse sous 24h</p>
          </div>
        </section>

        {/* Features */}
        <section className="px-5 py-14">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Audience qualifiée"
                description="Les gens qui arrivent sur ta fiche cherchent exactement ce que tu proposes — EVJF, anniversaire, team building."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Paiement intégré"
                description="Paiements sécurisés par Stripe. Fini les Lydia galère et les no-shows. Le groupe paie, tu reçois."
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Zéro engagement"
                description="Tu ne paies que quand tu reçois des réservations. Désactivable à tout moment, sans préavis."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-5 pb-14">
          <div className="container max-w-2xl">
            <div className="bg-white rounded-3xl border border-[#EFEDE8] p-8 md:p-10">
              <h2 className="font-serif italic text-2xl md:text-3xl text-[#141414] mb-8">
                Comment ça fonctionne
              </h2>
              <div className="space-y-5">
                {[
                  { n: '01', t: 'On crée ta fiche', d: 'On s\'occupe de la fiche avec photos, description, tarifs. Tu valides et c\'est parti.' },
                  { n: '02', t: 'Stripe en 5 minutes', d: 'Tu configures Stripe Connect pour recevoir les paiements directement sur ton compte.' },
                  { n: '03', t: 'Ta fiche est visible', d: 'Référencée sur resakit.fr, Google et nos réseaux. Le trafic arrive naturellement.' },
                  { n: '04', t: 'Tu reçois les résas', d: 'Notification en temps réel. Le paiement est déjà effectué — tu n\'as qu\'à accueillir.' },
                  { n: '05', t: 'On prend 10%', d: 'Uniquement sur les réservations confirmées. Aucun autre frais, jamais.' },
                ].map((step) => (
                  <div key={step.n} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {step.n}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#141414] mb-0.5">{step.t}</p>
                      <p className="text-sm text-[#6B6960] leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-5 pb-14">
          <div className="container max-w-4xl">
            <h2 className="font-serif italic text-2xl md:text-3xl text-[#141414] text-center mb-8">
              Ils nous font confiance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'L\'Alchimiste Bar', city: 'Toulouse', text: 'En 3 mois, Resakit représente 30% de mes réservations de groupe. Le paiement splitté a tout changé — plus de no-shows.', stars: 5 },
                { name: 'Escape Odyssée', city: 'Toulouse', text: 'Onboarding en 2 jours, première résa la semaine d\'après. L\'équipe est réactive et le dashboard est top.', stars: 5 },
              ].map((t) => (
                <div key={t.name} className="bg-white rounded-2xl border border-[#EFEDE8] p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#6B6960] leading-relaxed italic mb-4">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-xs font-semibold text-[#141414]">{t.name} <span className="font-normal text-[#8A8880]">· {t.city}</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-5 pb-16">
          <div className="container max-w-2xl text-center">
            <div className="bg-[#FFF7EF] border border-orange-100 rounded-3xl p-10 md:p-14">
              <h2 className="font-serif italic text-2xl md:text-3xl text-[#141414] mb-4">
                Prêt à nous rejoindre ?
              </h2>
              <p className="text-sm text-[#6B6960] mb-8 leading-relaxed">
                Écris-nous un mot et on s&apos;occupe de tout. Réponse sous 24h, onboarding en 48h.
              </p>
              <a
                href="mailto:contact@resakit.fr?subject=Rejoindre%20Resakit"
                className="inline-flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-[#EA580C] transition-colors"
              >
                Contacter l&apos;équipe <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-xs text-[#8A8880] mt-4">contact@resakit.fr</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EFEDE8] p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center text-white mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-[#141414] mb-2">{title}</h3>
      <p className="text-sm text-[#6B6960] leading-relaxed">{description}</p>
    </div>
  )
}
