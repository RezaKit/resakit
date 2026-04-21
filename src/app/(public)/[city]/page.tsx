import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ExperienceCard } from '@/components/experience/ExperienceCard'

interface PageProps {
  params: { city: string }
  searchParams: { occasion?: string; min_price?: string; max_price?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = capitalize(params.city)
  return {
    title: `Expériences de groupe à ${city}`,
    description: `Trouve et réserve une expérience à ${city} : EVJF, anniversaires, team building. Escape games, ateliers cocktails, cours de cuisine et plus.`,
  }
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const city = capitalize(params.city)

  if (!['Toulouse', 'Bordeaux', 'Lyon', 'Paris', 'Marseille'].includes(city)) {
    notFound()
  }

  const supabase = createClient()
  let query = supabase
    .from('experiences')
    .select('*, provider:providers!inner(*)')
    .eq('is_active', true)
    .eq('provider.city', city)

  if (searchParams.occasion) {
    query = query.contains('occasions', [searchParams.occasion])
  }

  const { data: experiences } = await query

  return (
    <>
      <Header />
      <main>
        <section className="bg-gray-50 py-12">
          <div className="container">
            <h1 className="text-4xl font-display font-bold mb-3">
              Expériences de groupe à {city}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              {experiences?.length ?? 0} expériences disponibles pour tes EVJF,
              anniversaires et team building.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container">
            {experiences && experiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp: any) => (
                  <ExperienceCard key={exp.id} experience={exp} city={params.city} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">
                  Aucune expérience disponible pour cette recherche.
                </p>
                <p className="text-gray-400">
                  On ajoute de nouveaux prestataires chaque semaine. Reviens bientôt !
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
