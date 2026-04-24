import Link from 'next/link'
import { Search, Sparkles, Gift, Users2, Wine, ArrowRight } from 'lucide-react'
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
      <main className="bg-[#F5F2EC]">
        {/* HERO */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container max-w-5xl">
            <div className="max-w-3xl">
              <span className="inline-block text-sm font-medium text-[#7C3AED] bg-violet-50 px-3 py-1 rounded-full mb-6">
                Toulouse · Expériences de groupe
              </span>
              <h1 className="font-serif italic text-4xl md:text-[56px] leading-[1.1] text-[#141414] mb-6">
                Vivez l&apos;expérience,<br />
                pas juste la soirée.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                La marketplace des expériences de groupe à Toulouse — avec paiement splitté entre participants en quelques clics.
              </p>

              {/* Search bar */}
              <div className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-sm border border-[#EFEDE8] max-w-xl">
                <Search className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Escape game, cocktails, anniversaire…"
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                  readOnly
                />
                <Link
                  href="/toulouse"
                  className="flex-shrink-0 bg-[#7C3AED] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#6D28D9] transition-colors"
                >
                  Rechercher
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* OCCASIONS */}
        <section className="py-12">
          <div className="container max-w-5xl">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Pour quelle occasion ?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OccasionCard
                href="/toulouse/evjf"
                icon={<Sparkles className="w-5 h-5 text-white" />}
                title="EVJF"
                description="Enterrement de vie de jeune fille"
                gradient="from-violet-600 to-purple-500"
              />
              <OccasionCard
                href="/toulouse/anniversaire"
                icon={<Gift className="w-5 h-5 text-white" />}
                title="Anniversaire"
                description="Marque le coup entre amis"
                gradient="from-orange-500 to-orange-400"
              />
              <OccasionCard
                href="/toulouse/team-building"
                icon={<Users2 className="w-5 h-5 text-white" />}
                title="Team building"
                description="Cohésion d'équipe"
                gradient="from-violet-500 to-orange-500"
              />
              <OccasionCard
                href="/toulouse"
                icon={<Wine className="w-5 h-5 text-white" />}
                title="Entre amis"
                description="Juste pour le plaisir"
                gradient="from-purple-500 to-violet-600"
              />
            </div>
          </div>
        </section>

        {/* EXPÉRIENCES À LA UNE */}
        <section className="py-12">
          <div className="container max-w-5xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif italic text-3xl md:text-4xl text-[#141414] mb-1">
                  Les expériences du moment
                </h2>
                <p className="text-gray-500 text-sm">À Toulouse, sélectionnées pour toi.</p>
              </div>
              <Link
                href="/toulouse"
                className="hidden md:inline-flex items-center gap-1.5 text-[#7C3AED] text-sm font-medium hover:underline"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {experiences && experiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp: any) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="mb-2">Le catalogue arrive bientôt.</p>
                <p className="text-sm">Inscris-toi à la liste d&apos;attente pour être prévenu !</p>
              </div>
            )}

            <div className="md:hidden mt-6 text-center">
              <Link href="/toulouse" className="inline-flex items-center gap-2 text-[#7C3AED] text-sm font-medium">
                Voir toutes les expériences <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* SPLIT PAYMENT */}
        <section className="py-12">
          <div className="container max-w-5xl">
            <div className="bg-[#141414] rounded-3xl p-8 md:p-14">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block text-xs font-semibold text-[#F97316] uppercase tracking-widest mb-4">
                    Notre super-pouvoir
                  </span>
                  <h2 className="font-serif italic text-3xl md:text-4xl text-white mb-5 leading-tight">
                    Une réservation.<br />Une addition partagée.
                  </h2>
                  <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                    Fini l&apos;organisatrice qui avance pour tout le monde. Chaque participant reçoit un lien et paie directement sa part — en 30 secondes.
                  </p>
                  <Link
                    href="/toulouse"
                    className="inline-flex items-center gap-2 bg-[#F97316] text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#EA580C] transition-colors"
                  >
                    Tester maintenant <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Léa (organisatrice)', amount: '55€', paid: true },
                    { label: 'Marie', amount: '55€', paid: true },
                    { label: 'Sophie', amount: '55€', paid: false },
                    { label: 'Camille', amount: '55€', paid: false },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.paid ? 'bg-green-400' : 'bg-gray-600'}`} />
                        <span className="text-white text-sm">{p.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">{p.amount}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${p.paid ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                          {p.paid ? 'Payé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="font-serif italic text-3xl md:text-4xl text-[#141414] mb-3">
                Trois étapes. Zéro galère.
              </h2>
              <p className="text-gray-500 text-sm">C&apos;est le but.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <HowItWorksStep
                number="01"
                title="Choisis ton expérience"
                description="Parcours le catalogue, filtre par occasion, nombre de personnes et budget."
              />
              <HowItWorksStep
                number="02"
                title="Réserve et partage"
                description="Paie ta part et envoie le lien aux participants — chacun règle directement."
              />
              <HowItWorksStep
                number="03"
                title="Profite du moment"
                description="On gère tout. Confirmations, rappels, contact prestataire. Toi tu te concentres sur le fun."
              />
            </div>
          </div>
        </section>

        {/* WAITLIST */}
        <section className="py-12 pb-20">
          <div className="container max-w-5xl">
            <div className="bg-[#FFF7EF] border border-orange-100 rounded-3xl p-10 md:p-16 text-center">
              <p className="text-sm font-medium text-orange-500 mb-3">
                +847 Toulousains sur la liste
              </p>
              <h2 className="font-serif italic text-3xl md:text-4xl text-[#141414] mb-4">
                Sois parmi les premiers
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                On agrandit le catalogue chaque semaine. Reçois les nouveautés et un code promo de{' '}
                <strong>-15%</strong> pour ta première réservation.
              </p>
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function OccasionCard({
  href,
  icon,
  title,
  description,
  gradient,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <Link href={href} className="group block">
      <div
        className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 mb-3 aspect-square flex flex-col justify-between group-hover:scale-[1.02] transition-transform duration-200`}
      >
        <div className="w-9 h-9 bg-white/25 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
      </div>
      <p className="text-xs text-gray-500 leading-snug">{description}</p>
    </Link>
  )
}

function HowItWorksStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div>
      <div className="font-serif italic text-[64px] leading-none text-[#EFEDE8] mb-4 select-none">
        {number}
      </div>
      <h3 className="font-semibold text-[#141414] text-base mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
