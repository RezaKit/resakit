import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { Star, Users, Clock, MapPin, Globe, Share2, Heart, ArrowLeft, ChevronRight } from 'lucide-react'
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
  const tag = experience.occasions?.[0] ? `Top ${experience.occasions[0]}` : getCategoryLabel(experience.tags?.[0] || '')

  const priceNum = experience.price_per_person || (experience.price_fixed ? experience.price_fixed : 0)
  const priceDisplay = experience.price_per_person
    ? `${formatPrice(experience.price_per_person)}/pers`
    : experience.price_fixed
    ? formatPrice(experience.price_fixed)
    : 'Sur devis'

  const infoGrid = [
    experience.duration_minutes ? { l: 'Durée', v: formatDuration(experience.duration_minutes) } : null,
    { l: 'Groupe', v: `${experience.min_people}–${experience.max_people} pers` },
    { l: 'Langue', v: 'FR / EN' },
    { l: 'Lieu', v: experience.provider?.city || 'Centre-ville' },
  ].filter(Boolean) as { l: string; v: string }[]

  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] pb-32 md:pb-0">

        {/* Hero — 360px mobile */}
        <div
          className="relative md:h-[420px]"
          style={{ height: 360, background: `url(${mainPhoto}) center/cover` }}
        >
          {/* top gradient */}
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none z-[5]"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45), transparent)' }}
          />

          {/* Back button */}
          <Link
            href={`/${params.city}`}
            className="absolute top-[62px] left-4 z-[6] w-[38px] h-[38px] rounded-full flex items-center justify-center border-none"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
          >
            <ArrowLeft className="w-4 h-4 text-[#141414]" />
          </Link>

          {/* Share + Heart */}
          <div className="absolute top-[62px] right-4 z-[6] flex gap-2">
            {[Share2, Heart].map((Icon, i) => (
              <button
                key={i}
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center border-none"
                style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
              >
                <Icon className="w-4 h-4 text-[#141414]" />
              </button>
            ))}
          </div>

          {/* Photo counter */}
          {experience.photos && experience.photos.length > 1 && (
            <div
              className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full text-white text-[11px] font-medium"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            >
              1 / {experience.photos.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white md:bg-[#F5F2EC]">
          <div className="px-5 pt-5 pb-4 md:container md:max-w-5xl md:py-8">
            <div className="md:grid md:grid-cols-3 md:gap-8">

              {/* Left col */}
              <div className="md:col-span-2 space-y-5">

                {/* Tag pill */}
                <div
                  className="inline-flex items-center gap-[5px] px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: '#FFF1E6', color: '#B3450E', letterSpacing: 0.2 }}
                >
                  <span className="w-[5px] h-[5px] rounded-full bg-[#F97316] inline-block" />
                  {tag}
                </div>

                {/* Title */}
                <h1
                  className="font-serif text-[30px] text-[#141414] leading-[1.05] mt-3"
                  style={{ letterSpacing: -0.8, fontWeight: 400 }}
                >
                  {experience.title}
                </h1>

                {/* Rating row */}
                <div className="flex items-center gap-3 text-[13px] text-[#6B6960] mt-2.5">
                  {experience.rating_count > 0 && (
                    <>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#141414] text-[#141414]" />
                        <strong className="text-[#141414] font-semibold">{experience.rating_average}</strong>
                        <span>({experience.rating_count} avis)</span>
                      </div>
                      <span>·</span>
                    </>
                  )}
                  <span>{experience.provider?.name || getCategoryLabel(experience.tags?.[0] || '')}</span>
                </div>

                {/* Split payment dark banner */}
                <div
                  className="flex items-center gap-3 p-[14px] rounded-2xl mt-[18px]"
                  style={{ background: 'linear-gradient(135deg, #141414, #1f1b2e)' }}
                >
                  <div
                    className="w-[42px] h-[42px] rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #F97316)' }}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-white" style={{ letterSpacing: -0.1 }}>
                      Paiement partagé dispo
                    </div>
                    <div className="text-[11.5px] mt-0.5 leading-[1.35]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Réserve maintenant, chacun paie sa part par SMS.
                    </div>
                  </div>
                </div>

                {/* Info 2x2 grid */}
                <div className="grid grid-cols-2 gap-2.5 mt-[18px]">
                  {infoGrid.map((f) => (
                    <div
                      key={f.l}
                      className="p-[11px_12px] rounded-xl border border-[#EFEDE8]"
                      style={{ background: '#FAF8F4' }}
                    >
                      <div
                        className="text-[10px] font-semibold text-[#8A8880] uppercase mb-0.5"
                        style={{ letterSpacing: 0.4 }}
                      >
                        {f.l}
                      </div>
                      <div className="text-[14px] font-semibold text-[#141414]">{f.v}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {(experience.description || experience.short_description) && (
                  <div className="mt-[22px]">
                    <h3
                      className="font-serif text-[22px] text-[#141414] leading-tight mb-2"
                      style={{ fontWeight: 400, letterSpacing: -0.4 }}
                    >
                      L&apos;expérience
                    </h3>
                    <p className="text-[14px] leading-[1.55] text-[#3C3A34] whitespace-pre-line">
                      {experience.description || experience.short_description}
                    </p>
                    {/* Tags */}
                    {experience.tags && experience.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {experience.tags.map((t: string) => (
                          <span
                            key={t}
                            className="px-2.5 py-[5px] rounded-full text-[11.5px] font-medium text-[#3C3A34]"
                            style={{ background: '#F2F0EC' }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* What's included */}
                {experience.what_included && (
                  <div className="mt-5 bg-white rounded-2xl p-5 border border-[#EFEDE8]">
                    <h3 className="font-semibold text-[#141414] mb-2 text-sm">Ce qui est inclus</h3>
                    <p className="text-[13px] text-[#6B6960] leading-relaxed whitespace-pre-line">
                      {experience.what_included}
                    </p>
                  </div>
                )}

                {/* Host card */}
                {experience.provider && (
                  <div
                    className="flex items-center gap-3 p-[14px] rounded-2xl border border-[#EFEDE8] mt-5"
                  >
                    <div
                      className="w-11 h-11 rounded-full flex-shrink-0 bg-[#EFEDE8]"
                      style={
                        experience.provider.logo_url
                          ? { background: `url(${experience.provider.logo_url}) center/cover` }
                          : {}
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#8A8880]">Hôte partenaire</div>
                      <div className="text-[15px] font-semibold text-[#141414] mt-0.5 truncate" style={{ letterSpacing: -0.1 }}>
                        {experience.provider.name}
                      </div>
                    </div>
                    <a
                      href={`mailto:${experience.provider.email || 'contact@resakit.fr'}`}
                      className="px-3.5 py-2 rounded-full border border-[#EFEDE8] text-[12px] font-semibold text-[#141414] bg-white flex-shrink-0"
                    >
                      Contacter
                    </a>
                  </div>
                )}

                {/* Reviews */}
                {reviews && reviews.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className="font-serif text-[22px] text-[#141414] leading-tight mb-4"
                      style={{ fontWeight: 400, letterSpacing: -0.4 }}
                    >
                      Avis
                    </h3>
                    <div className="space-y-3">
                      {reviews.map((r: any) => (
                        <div key={r.id} className="bg-white rounded-2xl p-4 border border-[#EFEDE8]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[14px] font-semibold text-[#141414]">{r.author_name}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: r.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          {r.comment && (
                            <p className="text-[13px] text-[#6B6960] leading-relaxed">{r.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right col — desktop booking widget */}
              <div className="hidden md:block">
                <div className="sticky top-24">
                  <BookingWidget experience={experience} slots={slots || []} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA — mobile */}
        <div
          className="fixed bottom-0 inset-x-0 z-40 flex items-center gap-3 px-5 pb-[34px] pt-[14px] md:hidden"
          style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid #EFEDE8',
          }}
        >
          <div className="flex-shrink-0">
            <div
              className="text-[10px] font-semibold text-[#8A8880] uppercase"
              style={{ letterSpacing: 0.4 }}
            >
              Dès
            </div>
            <div>
              <span
                className="text-[22px] font-bold text-[#141414]"
                style={{ letterSpacing: -0.5 }}
              >
                {experience.price_per_person
                  ? formatPrice(experience.price_per_person)
                  : experience.price_fixed
                  ? formatPrice(experience.price_fixed)
                  : 'Sur'}
              </span>
              {experience.price_per_person && (
                <span className="text-[13px] text-[#8A8880]">/pers</span>
              )}
            </div>
          </div>
          <Link
            href={`/book/${experience.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-[14px] rounded-[14px] text-[15px] font-semibold text-white"
            style={{
              background: '#7C3AED',
              boxShadow: '0 6px 18px rgba(124,58,237,0.33)',
              letterSpacing: -0.1,
            }}
          >
            Réserver &amp; inviter
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
