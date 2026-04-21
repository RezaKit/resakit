import Link from 'next/link'
import Image from 'next/image'
import { Search, Sparkles, Heart, Users, Calendar, CreditCard, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden gradient-brand text-white">
          <div className="container py-20 md:py-28 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                Réserve l&apos;expérience,
                <br />
                pas juste une table.
              </h1>
              <p className="text-lg md:text-xl opacity-95 mb-8 max-w-2xl">
                La marketplace des expériences de groupe à Toulouse. EVJF, anniversaires,
                team building — avec paiement splitté entre participants.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/toulouse">
                    <Search className="w-5 h-5" />
                    Découvrir les expériences
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-brand-violet">
                  <Link href="/pour-les-pros">Je suis un prestataire</Link>
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm opacity-90">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Paiement sécurisé
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Split entre amis
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> 100% Toulouse
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 top-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 bottom-0 w-72 h-72 bg-brand-orange/30 rounded-full blur-3xl"></div>
        </section>

        {/* OCCASIONS */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Pour quelle occasion ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sélectionne ton occasion, on te montre les meilleures expériences adaptées.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OccasionCard
                href="/toulouse/evjf"
                emoji="👰"
                title="EVJF"
                description="Enterrement de vie de jeune fille"
              />
              <OccasionCard
                href="/toulouse/anniversaire"
                emoji="🎂"
                title="Anniversaire"
                description="Marque le coup entre amis"
              />
              <OccasionCard
                href="/toulouse/team-building"
                emoji="🤝"
                title="Team building"
                description="Cohésion d'équipe"
              />
              <OccasionCard
                href="/toulouse"
                emoji="🎉"
                title="Entre amis"
                description="Juste pour le plaisir"
              />
            </div>
          </div>
        </section>

        {/* EXPÉRIENCES À LA UNE */}
        {experiences && experiences.length > 0 && (
          <section className="py-16">
            <div className="container">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                    Les expériences du moment
                  </h2>
                  <p className="text-gray-600">À Toulouse, sélectionnées pour toi.</p>
                </div>
                <Link
                  href="/toulouse"
                  className="hidden md:inline-flex items-center gap-2 text-brand-violet font-semibold hover:underline"
                >
                  Voir tout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp: any) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>

              <div className="md:hidden mt-8 text-center">
                <Button asChild variant="outline">
                  <Link href="/toulouse">
                    Voir toutes les expériences <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* COMMENT CA MARCHE */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Comment ça marche ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                3 étapes, zéro galère. C&apos;est le but.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Step
                number="1"
                icon={<Search className="w-6 h-6" />}
                title="Choisis ton expérience"
                description="Parcours les expériences disponibles à Toulouse. Filtre par occasion, date, nombre de personnes."
              />
              <Step
                number="2"
                icon={<CreditCard className="w-6 h-6" />}
                title="Réserve et paie ta part"
                description="Paiement en ligne sécurisé. Active le paiement splitté pour que chaque participant paie directement."
              />
              <Step
                number="3"
                icon={<Sparkles className="w-6 h-6" />}
                title="Profite du moment"
                description="On envoie la confirmation, on te rappelle la veille. Tu te concentres sur l'essentiel : t'amuser."
              />
            </div>
          </div>
        </section>

        {/* WAITLIST */}
        <section className="py-20 gradient-brand text-white">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <Heart className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Reste informé du lancement
              </h2>
              <p className="text-lg opacity-95 mb-8">
                On agrandit le catalogue chaque semaine. Reçois les nouveautés et un code
                promo de -15% pour ta première réservation.
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
  emoji,
  title,
  description,
}: {
  href: string
  emoji: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-brand-violet hover:shadow-lg transition-all text-center"
    >
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="font-display font-bold text-lg mb-1 group-hover:text-brand-violet transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-brand text-white flex items-center justify-center font-display font-bold text-xl">
          {number}
        </div>
        <div className="flex items-center gap-2 text-brand-violet">{icon}</div>
      </div>
      <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
