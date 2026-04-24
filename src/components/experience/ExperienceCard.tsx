import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, Star, SplitSquareVertical } from 'lucide-react'
import { formatPrice, formatDuration, getCategoryLabel } from '@/lib/utils'
import type { Experience, Provider } from '@/types/database'

interface ExperienceCardProps {
  experience: Experience & { provider?: Provider | null }
  city?: string
  className?: string
}

export function ExperienceCard({ experience, city = 'toulouse', className }: ExperienceCardProps) {
  const categorySlug = experience.tags?.[0] || 'experience'
  const href = `/${city.toLowerCase()}/${categorySlug}/${experience.slug}`

  const mainPhoto =
    experience.photos?.[0] ||
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800'

  const priceDisplay = experience.price_per_person
    ? `${formatPrice(experience.price_per_person)}/pers`
    : experience.price_fixed
    ? formatPrice(experience.price_fixed)
    : 'Sur devis'

  return (
    <Link
      href={href}
      className={`group block rounded-2xl overflow-hidden bg-white border border-[#EFEDE8] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ${className || ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={mainPhoto}
          alt={experience.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-[#141414] text-xs font-medium px-2.5 py-1 rounded-lg">
            {getCategoryLabel(experience.tags?.[0] || '')}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-[#7C3AED] text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
            <SplitSquareVertical className="w-3 h-3" />
            Paiement partagé
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[#141414] line-clamp-1 mb-0.5">
          {experience.title}
        </h3>
        {experience.provider && (
          <p className="text-sm text-gray-400 line-clamp-1 mb-3">
            {experience.provider.name}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          {experience.duration_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(experience.duration_minutes)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {experience.min_people}–{experience.max_people} pers
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#EFEDE8]">
          {experience.rating_count > 0 ? (
            <span className="flex items-center gap-1 text-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-[#141414]">{experience.rating_average}</span>
              <span className="text-gray-400">({experience.rating_count})</span>
            </span>
          ) : (
            <span className="text-sm text-gray-400">Nouveau</span>
          )}
          <span className="font-bold text-[#7C3AED]">{priceDisplay}</span>
        </div>
      </div>
    </Link>
  )
}
