import Image from 'next/image'
import Link from 'next/link'
import { Users, Star, Heart } from 'lucide-react'
import { formatPrice, getCategoryLabel } from '@/lib/utils'
import type { Experience, Provider } from '@/types/database'

interface ExperienceCardProps {
  experience: Experience & { provider?: Provider | null }
  city?: string
  variant?: 'scroll' | 'list'
}

export function ExperienceCard({ experience, city = 'toulouse', variant = 'scroll' }: ExperienceCardProps) {
  const categorySlug = experience.tags?.[0] || 'experience'
  const href = `/${city.toLowerCase()}/${categorySlug}/${experience.slug}`
  const mainPhoto = experience.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80'
  const tag = experience.occasions?.[0] ? `Top ${experience.occasions[0]}` : getCategoryLabel(experience.tags?.[0] || '')
  const price = experience.price_per_person
    ? `${formatPrice(experience.price_per_person)}`
    : experience.price_fixed
    ? formatPrice(experience.price_fixed)
    : 'Sur devis'
  const per = experience.price_per_person ? '/pers' : ''

  if (variant === 'list') {
    return (
      <Link href={href} className="block">
        <div className="rounded-2xl overflow-hidden bg-white border border-[#EFEDE8]">
          {/* Image */}
          <div className="relative h-[180px] overflow-hidden" style={{ background: `url(${mainPhoto}) center/cover` }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.35))' }} />
            {/* Tag */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-[#141414]">
              <span className="text-[#7C3AED]">◆</span> {tag}
            </div>
            {/* Paiement partagé */}
            <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide text-white"
              style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              Paiement partagé
            </div>
          </div>
          {/* Content */}
          <div className="px-3.5 pt-3 pb-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[15px] font-semibold text-[#141414] leading-snug">{experience.title}</p>
              {experience.rating_count > 0 && (
                <div className="flex items-center gap-1 text-[12px] font-semibold text-[#141414] flex-shrink-0">
                  <Star className="w-3 h-3 fill-[#141414]" />
                  {experience.rating_average}
                </div>
              )}
            </div>
            <p className="text-[12px] text-[#8A8880] mt-1">
              {experience.provider?.name || getCategoryLabel(experience.tags?.[0] || '')}
            </p>
            <div className="mt-2.5 pt-2.5 flex items-center justify-between"
              style={{ borderTop: '1px dashed #EDEBE5' }}>
              <div className="flex items-center gap-1 text-[12px] text-[#6B6960]">
                <Users className="w-3 h-3" />
                {experience.min_people}–{experience.max_people} pers
                {experience.rating_count > 0 && <span className="ml-1">· {experience.rating_count} avis</span>}
              </div>
              <div>
                <span className="text-[16px] font-bold text-[#141414] tracking-tight">{price}</span>
                <span className="text-[12px] text-[#8A8880]">{per}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // scroll variant (homepage)
  return (
    <Link href={href} className="block flex-shrink-0" style={{ width: 280 }}>
      <div className="rounded-[22px] overflow-hidden bg-white border border-[#EFEDE8] h-full">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 210, background: `url(${mainPhoto}) center/cover` }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35))' }} />
          {/* Heart */}
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
            <Heart className="w-4 h-4 text-[#141414]" />
          </button>
          {/* Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-[#141414]">
            <span className="text-[#7C3AED]">◆</span> {tag}
          </div>
          {/* Paiement partagé */}
          <div className="absolute bottom-2.5 left-3 px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-[0.3px] text-white"
            style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}>
            Paiement partagé
          </div>
        </div>
        {/* Content */}
        <div className="px-3.5 pt-3 pb-3.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[15px] font-semibold text-[#141414] leading-snug">{experience.title}</p>
            {experience.rating_count > 0 && (
              <div className="flex items-center gap-1 text-[12px] font-semibold text-[#141414] flex-shrink-0">
                <Star className="w-3 h-3 fill-[#141414]" />
                {experience.rating_average}
              </div>
            )}
          </div>
          <p className="text-[12px] text-[#8A8880] mt-1">
            {experience.provider?.name || getCategoryLabel(experience.tags?.[0] || '')}
          </p>
          <div className="mt-2.5 pt-2.5 flex items-center justify-between"
            style={{ borderTop: '1px dashed #EDEBE5' }}>
            <div className="flex items-center gap-1 text-[12px] text-[#6B6960]">
              <Users className="w-3 h-3" />
              {experience.min_people}–{experience.max_people} pers
            </div>
            <div>
              <span className="text-[16px] font-bold text-[#141414] tracking-tight">{price}</span>
              <span className="text-[12px] text-[#8A8880]">{per}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
