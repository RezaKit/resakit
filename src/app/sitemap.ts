import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resakit.fr'
  const supabase = createClient()

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/toulouse`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/pour-les-pros`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/cgv`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/politique-confidentialite`, lastModified: new Date(), priority: 0.3 },
  ]

  // Pages catégories principales
  const categories = [
    'evjf',
    'anniversaire',
    'team-building',
    'escape-game',
    'atelier-cocktail',
    'atelier-cuisine',
  ]
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/toulouse/${cat}`,
    lastModified: new Date(),
    priority: 0.8,
  }))

  // Pages expériences dynamiques
  const { data: experiences } = await supabase
    .from('experiences')
    .select('slug, updated_at, provider:providers!inner(city)')
    .eq('is_active', true)

  const experiencePages: MetadataRoute.Sitemap =
    experiences?.map((exp: any) => ({
      url: `${baseUrl}/${exp.provider.city.toLowerCase()}/experience/${exp.slug}`,
      lastModified: new Date(exp.updated_at),
      priority: 0.7,
    })) || []

  return [...staticPages, ...categoryPages, ...experiencePages]
}
