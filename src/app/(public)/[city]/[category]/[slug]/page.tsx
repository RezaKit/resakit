import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Clock, Users, MapPin, Star, SplitSquareVertical, ArrowLeft, ChevronRight, Check, Info, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { formatPrice, formatDuration, getCategoryLabel } from '@/lib/utils'

interface PageProps {
  params: { city: string; category: string; slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: exp } = await supabase.from('experiences').select('*').eq('slug', params.slug).single()
  if (!exp) return { title: 'Expérience introuvable' }
  return {
    title: exp.seo_title || `${exp.title} à Toulouse`,
    description: exp.seo_description || exp.short_description || undefined,
    openGraph: {
      title: exp.title,
      description: exp.short_description || undefined,
      images: exp.photos?.[0] ? [exp.photos[0]] : undefined,
    },
  }
}

export default async function ExperiencePage({ params }: PageProps) {
  const supabase = createClient()

  const { data: experience } = await supabase
    .from('experiences')
    .select('*, provider:providers(*)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!experience) notFound()

  const { data: slots } = await supabase
    .from('slots')
    .select('*')
    .eq('experience_id', experience.id)
    .eq('is_blocked', false)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(50)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('experience_id', experience.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const mainPhoto = experience.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200'

  const priceDisplay = experience.price_per_person
    ? `${formatPrice(experience.price_per_person)}/pers`
    : experience.price_fixed
    ? formatPrice(experience.price_fixed)
    : 'Sur devis'

  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] pb-32 md:pb-0">

        {/* Hero image — mobile full bleed */}
        <div className="relative h-[280px] md:h-[420px] bg-gray-900">
          <Image
            src={mainPhoto}
            alt={experience.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

          {/* Back button */}
          <Link
            href={`/${params.city}`}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Category badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/95 backdrop-blur-sm text-[#141414] text-xs font-semibold px-2.5 py-1 rounded-lg">
              {getCategoryLabel(experience.tags?.[0] || '')}
            </span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            {experience.provider && (
              <p className="text-xs font-medium opacity-80 mb-1">{experience.provider.name}</p>
            )}
            <h1 className="font-serif italic text-2xl md:text-3xl leading-tight">
              {experience.title}
            </h1>
            {experience.rating_count > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{experience.rating_average}</span>
                <span className="text-xs opacity-70">({experience.rating_count} avis)</span>
              </div>
            )}
          </div>
        </div>

        {/* Split payment CTA band */}
        <div className="bg-[#7C3AED] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <SplitSquareVertical className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Paiement partagé entre participants</span>
          </div>
          <span className="text-white/70 text-xs">En savoir +</span>
        </div>

        <div className="container max-w-5xl py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Content */}
            <div className="lg:col-span-2 space-y-5">

              {/* Quick info grid */}
              <div className="grid grid-cols-2 gap-3">
                {experience.duration_minutes && (
                  <InfoBox label="Durée" value={formatDuration(experience.duration_minutes)} />
                )}
                <InfoBox label="Groupe" value={`${experience.min_people}–${experience.max_people} pers`} />
                {(experience.address || experience.provider?.address) && (
                  <InfoBox label="Lieu" value={experience.address || experience.provider?.address} />
                )}
                <InfoBox label="Prix" value={priceDisplay} accent />
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-5 border border-[#EFEDE8]">
                <h2 className="font-semibold text-[#141414] mb-3">À propos</h2>
                <p className="text-sm text-[#6B6960] leading-relaxed whitespace-pre-line">
                  {experience.description || experience.short_description}
                </p>
              </div>

              {/* Included */}
              {experience.what_included && (
                <div className="bg-white rounded-2xl p-5 border border-[#EFEDE8]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-[#141414]">Ce qui est inclus</h3>
                  </div>
                  <p className="text-sm text-[#6B6960] leading-relaxed whitespace-pre-line">{experience.what_included}</p>
                </div>
              )}

              {/* To bring */}
              {experience.what_to_bring && (
                <div className="bg-white rounded-2xl p-5 border border-[#EFEDE8]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-[#7C3AED]" />
                    <h3 className="font-semibold text-[#141414]">À prévoir</h3>
                  </div>
                  <p className="text-sm text-[#6B6960] leading-relaxed whitespace-pre-line">{experience.what_to_bring}</p>
                </div>
              )}

              {/* Cancellation */}
              {experience.cancellation_policy && (
                <div className="bg-white rounded-2xl p-5 border border-[#EFEDE8]">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-[#8A8880]" />
                    <h3 className="font-semibold text-[#141414]">Annulation</h3>
                  </div>
                  <p className="text-sm text-[#6B6960]">{experience.cancellation_policy}</p>
                </div>
              )}

              {/* Reviews */}
              {reviews && reviews.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[#141414] mb-3">Avis</h2>
                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-white rounded-2xl p-4 border border-[#EFEDE8]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#141414]">{r.author_name}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="text-sm text-[#6B6960] leading-relaxed">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking widget — desktop only */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <BookingWidget experience={experience} slots={slots || []} />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA — mobile only */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#EFEDE8] p-4 pb-20 md:hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-[#7C3AED]">{priceDisplay}</span>
              {experience.price_per_person && (
                <p className="text-xs text-[#8A8880]">par personne</p>
              )}
            </div>
            {experience.rating_count > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-[#141414]">{experience.rating_average}</span>
              </div>
            )}
          </div>
          <Link
            href={`/book/${experience.id}`}
            className="block w-full bg-[#7C3AED] text-white text-center text-sm font-semibold py-3.5 rounded-xl hover:bg-[#6D28D9] transition-colors"
          >
            Réserver & inviter mon groupe
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

function InfoBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-[#EFEDE8]">
      <p className="text-[10px] font-bold text-[#8A8880] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-semibold ${accent ? 'text-[#7C3AED]' : 'text-[#141414]'}`}>{value}</p>
    </div>
  )
}
