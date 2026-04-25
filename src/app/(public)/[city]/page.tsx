import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { SlidersHorizontal, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ExperienceCard } from '@/components/experience/ExperienceCard'

interface PageProps {
  params: { city: string }
  searchParams: { occasion?: string; sort?: string }
}

const OCCASIONS = ['EVJF', 'Anniversaire', 'Team building', 'Entre amis', 'EVG', 'Soirée']

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

  if (searchParams.sort === 'price') {
    query = query.order('price_per_person', { ascending: true })
  } else {
    query = query.order('rating_average', { ascending: false })
  }

  const { data: experiences } = await query
  const count = experiences?.length ?? 0
  const activeOccasion = searchParams.occasion ?? ''
  const activeSort = searchParams.sort ?? 'top'

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-24 md:pb-0">

        {/* Mini search summary */}
        <div className="px-4 pt-3 pb-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-[#FAF8F4] border border-[#EFEDE8]">
            <div
              className="w-8 h-8 rounded-[10px] flex-shrink-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #F97316)' }}
            >
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#141414] truncate">
                {activeOccasion || 'Tout voir'} · {city}
              </div>
              <div className="text-[11px] text-[#8A8880] mt-0.5">Modifier la recherche</div>
            </div>
            <SlidersHorizontal className="w-4 h-4 text-[#8A8880] flex-shrink-0" />
          </div>
        </div>

        {/* Occasion pill tabs */}
        <div
          className="flex gap-2 overflow-x-auto py-3 px-4"
          style={{ scrollbarWidth: 'none' }}
        >
          <Link
            href={`/${params.city}`}
            className={`flex-shrink-0 px-3.5 py-[7px] rounded-full text-[13px] font-medium border transition-colors ${
              !activeOccasion
                ? 'bg-[#141414] text-white border-[#141414]'
                : 'bg-white text-[#141414] border-[#EFEDE8]'
            }`}
          >
            Tout voir
          </Link>
          {OCCASIONS.map((occ) => (
            <Link
              key={occ}
              href={`/${params.city}?occasion=${encodeURIComponent(occ)}`}
              className={`flex-shrink-0 px-3.5 py-[7px] rounded-full text-[13px] font-medium border whitespace-nowrap transition-colors ${
                activeOccasion === occ
                  ? 'bg-[#141414] text-white border-[#141414]'
                  : 'bg-white text-[#141414] border-[#EFEDE8]'
              }`}
            >
              {occ}
            </Link>
          ))}
        </div>

        {/* Count + sort */}
        <div className="px-4 pt-1 pb-2.5">
          <div
            className="font-serif italic text-[20px] text-[#141414] leading-[1.15]"
            style={{ letterSpacing: -0.3 }}
          >
            {count} expérience{count > 1 ? 's' : ''}{' '}
            <em className="text-[#7C3AED]">pour toi</em>
          </div>
        </div>

        <div className="flex gap-1.5 px-4 mb-2.5">
          <Link
            href={activeOccasion ? `/${params.city}?occasion=${activeOccasion}` : `/${params.city}`}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              activeSort !== 'price'
                ? 'bg-[#FFF1E6] text-[#B3450E] border-[#FFCFA5]'
                : 'bg-white text-[#6B6960] border-[#EFEDE8]'
            }`}
          >
            Populaires
          </Link>
          <Link
            href={`/${params.city}?${activeOccasion ? `occasion=${activeOccasion}&` : ''}sort=price`}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              activeSort === 'price'
                ? 'bg-[#FFF1E6] text-[#B3450E] border-[#FFCFA5]'
                : 'bg-white text-[#6B6960] border-[#EFEDE8]'
            }`}
          >
            Prix ↑
          </Link>
        </div>

        {/* Card list */}
        <div className="px-4 pb-8">
          {experiences && experiences.length > 0 ? (
            <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
              {experiences.map((exp: any) => (
                <ExperienceCard key={exp.id} experience={exp} city={params.city} variant="list" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF8F4] border border-[#EFEDE8] flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-[#8A8880]" />
              </div>
              <p className="font-serif italic text-[22px] text-[#141414] mb-2 leading-tight">
                Aucune expérience
              </p>
              <p className="text-sm text-[#6B6960] mb-6 max-w-xs leading-relaxed">
                {activeOccasion
                  ? `Pas encore d'expérience pour "${activeOccasion}" à ${city}.`
                  : `On agrandit le catalogue chaque semaine !`}
              </p>
              {activeOccasion && (
                <Link href={`/${params.city}`} className="text-sm font-semibold text-[#7C3AED]">
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
