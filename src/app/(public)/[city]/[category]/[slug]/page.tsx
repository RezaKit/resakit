import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { Clock, Users, MapPin, Check, Info, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/Badge'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { formatPrice, formatDuration, getCategoryLabel } from '@/lib/utils'

interface PageProps {
  params: { city: string; category: string; slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: exp } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', params.slug)
    .single()

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
    .limit(10)

  const mainPhoto = experience.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200'

  return (
    <>
      <Header />
      <main>
        {/* Gallery */}
        <section className="bg-gray-50">
          <div className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl overflow-hidden">
              <div className="md:col-span-2 relative aspect-[4/3] md:aspect-[16/10] bg-gray-100">
                <Image src={mainPhoto} alt={experience.title} fill className="object-cover" priority />
              </div>
              <div className="hidden md:flex flex-col gap-3">
                {experience.photos?.slice(1, 3).map((photo: string, i: number) => (
                  <div key={i} className="relative flex-1 bg-gray-100 min-h-[140px]">
                    <Image src={photo} alt={`${experience.title} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contenu principal */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="default">{getCategoryLabel(experience.provider?.category || '')}</Badge>
                {experience.occasions?.map((occ: string) => (
                  <Badge key={occ} variant="muted">{occ}</Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {experience.title}
              </h1>

              {experience.provider && (
                <p className="text-gray-600 mb-6">
                  par <span className="font-semibold">{experience.provider.name}</span>
                </p>
              )}

              <div className="flex flex-wrap gap-6 text-gray-700 mb-8 pb-8 border-b border-gray-200">
                {experience.duration_minutes && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-violet" />
                    {formatDuration(experience.duration_minutes)}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-violet" />
                  {experience.min_people} à {experience.max_people} personnes
                </span>
                {(experience.address || experience.provider?.address) && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-violet" />
                    {experience.address || experience.provider?.address}
                  </span>
                )}
              </div>

              <div className="prose prose-gray max-w-none mb-10">
                <h2 className="text-2xl font-display font-bold mb-3">À propos</h2>
                <p className="whitespace-pre-line">{experience.description}</p>
              </div>

              {experience.what_included && (
                <div className="bg-green-50 rounded-xl p-6 mb-6">
                  <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    Ce qui est inclus
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{experience.what_included}</p>
                </div>
              )}

              {experience.what_to_bring && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    À prévoir
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{experience.what_to_bring}</p>
                </div>
              )}

              {experience.cancellation_policy && (
                <div className="bg-gray-50 rounded-xl p-6 mb-10">
                  <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Politique d&apos;annulation
                  </h3>
                  <p className="text-gray-700">{experience.cancellation_policy}</p>
                </div>
              )}

              {/* Avis */}
              {reviews && reviews.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-6">Avis clients</h2>
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{r.author_name}</span>
                          <span className="text-yellow-500">{'⭐'.repeat(r.rating)}</span>
                        </div>
                        {r.comment && <p className="text-gray-700">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BookingWidget experience={experience} slots={slots || []} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
