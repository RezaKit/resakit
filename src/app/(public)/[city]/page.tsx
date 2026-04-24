import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { Search, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ExperienceCard } from '@/components/experience/ExperienceCard'

interface PageProps {
  params: { city: string }
  searchParams: { occasion?: string }
}

const OCCASIONS = [
  { value: '', label: 'Tout voir' },
  { value: 'EVJF', label: 'EVJF' },
  { value: 'EVG', label: 'EVG' },
  { value: 'Anniversaire', label: 'Anniversaire' },
  { value: 'Team building', label: 'Team building' },
  { value: 'Entre amis', label: 'Entre amis' },
  { value: 'Soirée', label: 'Soirée' },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = capitalize(params.city)
  return {
    title: `Expériences de groupe à ${city}`,
    description: `EVJF, anniversaires, team building à ${city}. Réservation et paiement partagé entre participants.`,
  }
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const city = capitalize(params.city)
  if (!['Toulouse', 'Bordeaux', 'Lyon', 'Paris', 'Marseille'].includes(city)) notFound()

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
  const count = experiences?.length ?? 0

  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] min-h-screen pb-24 md:pb-0">
        {/* Search bar top */}
        <div className="bg-white border-b border-[#EFEDE8] px-5 py-3">
          <div className="flex items-center gap-2 bg-[#F5F2EC] rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-[#8A8880] flex-shrink-0" />
            <span className="text-sm text-[#8A8880] flex-1">Escape game, cocktails…</span>
            <SlidersHorizontal className="w-4 h-4 text-[#8A8880]" />
          </div>
        </div>

        {/* Occasion tabs */}
        <div className="bg-white border-b border-[#EFEDE8] overflow-x-auto">
          <div className="flex gap-0 px-4 w-max min-w-full">
            {OCCASIONS.map((occ) => {
              const isActive = (searchParams.occasion ?? '') === occ.value
              return (
                <Link
                  key={occ.value}
                  href={occ.value ? `/${params.city}?occasion=${occ.value}` : `/${params.city}`}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#7C3AED] text-[#7C3AED]'
                      : 'border-transparent text-[#6B6960] hover:text-[#141414]'
                  }`}
                >
                  {occ.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="px-5 pt-5 pb-4">
          <p className="text-xs font-semibold text-[#8A8880] uppercase tracking-widest">
            {count} expérience{count > 1 ? 's' : ''} à {city}
          </p>
        </div>

        {/* Grid */}
        <div className="px-5 pb-6">
          {experiences && experiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiences.map((exp: any) => (
                <ExperienceCard key={exp.id} experience={exp} city={params.city} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border border-[#EFEDE8] flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-[#8A8880]" />
              </div>
              <p className="font-serif italic text-2xl text-[#141414] mb-2">
                Aucune expérience
              </p>
              <p className="text-sm text-[#6B6960] mb-6 max-w-xs">
                {searchParams.occasion
                  ? `Pas encore d'expérience pour "${searchParams.occasion}" à ${city}.`
                  : `On agrandit le catalogue chaque semaine. Reviens bientôt !`}
              </p>
              {searchParams.occasion && (
                <Link
                  href={`/${params.city}`}
                  className="text-sm font-semibold text-[#7C3AED] hover:underline"
                >
                  Voir toutes les expériences
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
