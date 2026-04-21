import Link from 'next/link'
import { Check, Zap, Users, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Référencer mon activité sur ResaKit',
  description: 'Rejoins ResaKit et reçois des réservations de groupe à Toulouse. 0% d\'abonnement, 10% de commission uniquement sur les réservations confirmées.',
}

export default function ProPage() {
  return (
    <>
      <Header />
      <main>
        <section className="gradient-brand text-white py-20">
          <div className="container max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Remplis ton agenda sans y penser.
            </h1>
            <p className="text-xl opacity-95 mb-8">
              ResaKit t&apos;apporte des réservations de groupe. Tu reçois et tu profites.
              <br />
              0€ d&apos;abonnement, 10% de commission uniquement sur les réservations confirmées.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a href="mailto:contact@resakit.fr?subject=Rejoindre%20ResaKit">
                Rejoindre ResaKit
              </a>
            </Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-3 gap-8 mb-14">
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Audience qualifiée"
                description="Les gens qui arrivent sur ta fiche cherchent exactement ce que tu proposes."
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Paiement intégré"
                description="Paiements sécurisés par Stripe. Fini les Lydia galère et les no-shows."
              />
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Zéro engagement"
                description="Tu ne paies que quand tu reçois des réservations. Désactivable à tout moment."
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-display font-bold mb-6">Comment ça fonctionne</h2>
              <div className="space-y-4">
                {[
                  "On crée ta fiche ResaKit avec photos, description, tarifs.",
                  "Tu configures Stripe Connect en 5 minutes pour recevoir les paiements.",
                  "Ta fiche est visible sur resakit.fr et référencée Google.",
                  "Tu reçois tes réservations dans ton dashboard — avec paiement déjà effectué.",
                  "On prélève 10% uniquement sur les réservations confirmées.",
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-violet text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Prêt à nous rejoindre ?
            </h2>
            <p className="text-gray-600 mb-8">
              Écris-nous un mot et on s&apos;occupe de tout.
            </p>
            <Button asChild size="lg">
              <a href="mailto:contact@resakit.fr?subject=Rejoindre%20ResaKit">
                Contacter l&apos;équipe
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
