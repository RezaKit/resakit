import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { SlidersHorizontal, Search, ChevronRight } from 'lucide-react'
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
      <main className="bg-white min-h-screen pb-24 md:pb-0 md:bg-[#F5F2EC]">

        {/* Mini search summary — mobile only */}
        <div className="md:hidden px-4 pt-3 pb-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-[#FAF8F4] border border-[#EFEDE8]">
            <div className="w-8 h-8 rounded-[10px] flex-shrink-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #F97316)' }}>
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

        {/* Mobile occasion pill tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto py-3 px-4" style={{ scrollbarWidth: 'none' }}>
          <Link href={`/${params.city}`}
            className={`flex-shrink-0 px-3.5 py-[7px] rounded-full text-[13px] font-medium border transition-colors ${
              !activeOccasion ? 'bg-[#141414] text-white border-[#141414]' : 'bg-white text-[#141414] border-[#EFEDE8]'
            }`}>
            Tout voir
          </Link>
          {OCCASIONS.map((occ) => (
            <Link key={occ} href={`/${params.city}?occasion=${encodeURIComponent(occ)}`}
              className={`flex-shrink-0 px-3.5 py-[7px] rounded-full text-[13px] font-medium border whitespace-nowrap transition-colors ${
                activeOccasion === occ ? 'bg-[#141414] text-white border-[#141414]' : 'bg-white text-[#141414] border-[#EFEDE8]'
              }`}>
              {occ}
            </Link>
          ))}
        </div>

        {/* Mobile count + sort */}
        <div className="md:hidden px-4 pt-1 pb-2.5">
          <div className="font-serif italic text-[20px] text-[#141414] leading-[1.15]" style={{ letterSpacing: -0.3 }}>
            {count} expérience{count > 1 ? 's' : ''} <em className="text-[#7C3AED]">pour toi</em>
          </div>
        </div>
        <div className="md:hidden flex gap-1.5 px-4 mb-2.5">
          <Link href={activeOccasion ? `/${params.city}?occasion=${activeOccasion}` : `/${params.city}`}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              activeSort !== 'price' ? 'bg-[#FFF1E6] text-[#B3450E] border-[#FFCFA5]' : 'bg-white text-[#6B6960] border-[#EFEDE8]'
            }`}>
            Populaires
          </Link>
          <Link href={`/${params.city}?${activeOccasion ? `occasion=${activeOccasion}&` : ''}sort=price`}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              activeSort === 'price' ? 'bg-[#FFF1E6] text-[#B3450E] border-[#FFCFA5]' : 'bg-white text-[#6B6960] border-[#EFEDE8]'
            }`}>
            Prix ↑
          </Link>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden px-4 pb-8 flex flex-col gap-3.5">
          <CardList experiences={experiences} activeOccasion={activeOccasion} city={params.city} cityName={city} />
        </div>

        {/* ── DESKTOP LAYOUT ─────────────────────────────── */}
        <div className="hidden md:block">
          <div className="container max-w-5xl mx-auto py-10">

            {/* Desktop header row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-serif italic text-3xl text-[#141414] leading-tight">
                  {activeOccasion ? activeOccasion : 'Toutes les expériences'}{' '}
                  <em className="text-[#7C3AED]">à {city}</em>
                </h1>
                <p className="text-sm text-[#6B6960] mt-1">{count} expérience{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-[#EFEDE8]">
                <Link href={activeOccasion ? `/${params.city}?occasion=${activeOccasion}` : `/${params.city}`}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    activeSort !== 'price' ? 'bg-[#141414] text-white' : 'text-[#6B6960] hover:text-[#141414]'
                  }`}>
                  Populaires
                </Link>
                <Link href={`/${params.city}?${activeOccasion ? `occasion=${activeOccasion}&` : ''}sort=price`}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    activeSort === 'price' ? 'bg-[#141414] text-white' : 'text-[#6B6960] hover:text-[#141414]'
                  }`}>
                  Prix croissant
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-[240px_1fr] gap-8">
              {/* Sidebar */}
              <aside>
                <div className="bg-white rounded-2xl border border-[#EFEDE8] p-5 sticky top-24">
                  <h3 className="text-[11px] font-bold text-[#8A8880] uppercase tracking-widest mb-3">Occasion</h3>
                  <div className="flex flex-col gap-1">
                    <Link href={`/${params.city}`}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                        !activeOccasion ? 'bg-[#141414] text-white' : 'text-[#141414] hover:bg-[#F5F2EC]'
                      }`}>
                      <span>Tout voir</span>
                      {!activeOccasion && <ChevronRight className="w-4 h-4 opacity-60" />}
                    </Link>
                    {OCCASIONS.map((occ) => (
                      <Link key={occ} href={`/${params.city}?occasion=${encodeURIComponent(occ)}`}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                          activeOccasion === occ ? 'bg-[#141414] text-white' : 'text-[#141414] hover:bg-[#F5F2EC]'
                        }`}>
                        <span>{occ}</span>
                        {activeOccasion === occ && <ChevronRight className="w-4 h-4 opacity-60" />}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 pt-5 border-t border-[#EFEDE8]">
                    <h3 className="text-[11px] font-bold text-[#8A8880] uppercase tracking-widest mb-3">Ville</h3>
                    <div className="flex flex-col gap-1">
                      {['Toulouse', 'Bordeaux', 'Lyon', 'Paris'].map((c) => (
                        <Link key={c} href={`/${c.toLowerCase()}`}
                          className={`px-3 py-2 rounded-xl text-[14px] font-medium transition-colors ${
                            city === c ? 'bg-[#F1EAFE] text-[#7C3AED]' : 'text-[#141414] hover:bg-[#F5F2EC]'
                          }`}>
                          {c}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Card grid */}
              <div>
                {experiences && experiences.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {experiences.map((exp: any) => (
                      <ExperienceCard key={exp.id} experience={exp} city={params.city} variant="list" />
                    ))}
                  </div>
                ) : (
                  <DesktopEmptyState activeOccasion={activeOccasion} city={city} citySlug={params.city} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function CardList({ experiences, activeOccasion, city, cityName }: {
  experiences: any[] | null
  activeOccasion: string
  city: string
  cityName: string
}) {
  if (experiences && experiences.length > 0) {
    return experiences.map((exp: any) => (
      <ExperienceCard key={exp.id} experience={exp} city={city} variant="list" />
    ))
  }
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F4] border border-[#EFEDE8] flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-[#8A8880]" />
      </div>
      <p className="font-serif italic text-[22px] text-[#141414] mb-2 leading-tight">Aucune expérience</p>
      <p className="text-sm text-[#6B6960] mb-6 max-w-xs leading-relaxed">
        {activeOccasion
          ? `Pas encore d'expérience pour "${activeOccasion}" à ${cityName}.`
          : `On agrandit le catalogue chaque semaine !`}
      </p>
      {activeOccasion && (
        <Link href={`/${city}`} className="text-sm font-semibold text-[#7C3AED]">
          Voir toutes les expériences
        </Link>
      )}
    </div>
  )
}

function DesktopEmptyState({ activeOccasion, city, citySlug }: { activeOccasion: string; city: string; citySlug: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#EFEDE8]">
      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F4] border border-[#EFEDE8] flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-[#8A8880]" />
      </div>
      <p className="font-serif italic text-2xl text-[#141414] mb-2">Aucune expérience</p>
      <p className="text-sm text-[#6B6960] mb-6 max-w-xs leading-relaxed">
        {activeOccasion
          ? `Pas encore d'expérience pour "${activeOccasion}" à ${city}.`
          : `On agrandit le catalogue chaque semaine !`}
      </p>
      {activeOccasion && (
        <Link href={`/${citySlug}`} className="text-sm font-semibold text-[#7C3AED]">
          Voir toutes les expériences
        </Link>
      )}
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
