import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Plus, Edit, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export const metadata = { title: 'Mes expériences — Dashboard' }

export default async function ExperiencesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase.from('providers').select('*').eq('user_id', user.id).single()
  if (!provider) redirect('/dashboard')

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('provider_id', provider.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif italic text-[#141414]">
            Mes <em className="text-[#7C3AED]">expériences</em>
          </h1>
          <p className="text-sm text-gray-500 mt-1">{experiences?.length || 0} expérience{(experiences?.length || 0) > 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/dashboard/experiences/new"
          className="inline-flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#EA580C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Créer une expérience
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#EFEDE8] rounded-xl p-1 mb-6 w-fit">
        {['Toutes', 'Actives', 'Brouillon', 'Archivées'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              i === 0 ? 'bg-[#F5F2EC] text-[#141414] font-semibold' : 'text-gray-500 hover:text-[#141414]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {experiences && experiences.length > 0 ? (
          <>
            {experiences.map((exp: any) => (
              <ExperienceRow key={exp.id} experience={exp} />
            ))}
          </>
        ) : null}

        {/* Add new CTA */}
        <Link
          href="/dashboard/experiences/new"
          className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-[#EFEDE8] rounded-2xl bg-white/50 hover:bg-white transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-[#EFEDE8] flex items-center justify-center group-hover:border-[#7C3AED] transition-colors">
            <Plus className="w-5 h-5 text-[#8A8880] group-hover:text-[#7C3AED]" />
          </div>
          <span className="text-sm font-semibold text-[#141414]">Ajouter une expérience</span>
        </Link>
      </div>
    </div>
  )
}

function ExperienceRow({ experience }: { experience: any }) {
  const photo = experience.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300'
  const isActive = experience.is_active

  return (
    <div className="bg-white rounded-2xl border border-[#EFEDE8] p-4 flex items-center gap-4">
      <div className="relative w-[90px] h-[70px] rounded-xl overflow-hidden flex-shrink-0">
        <Image src={photo} alt={experience.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#141414] truncate">{experience.title}</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
          }`}>
            {isActive ? 'Active' : 'Brouillon'}
          </span>
        </div>
        <p className="text-xs text-[#6B6960] mt-0.5">
          {experience.price_per_person ? `${formatPrice(experience.price_per_person)} / pers` : formatPrice(experience.price_fixed || 0)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? 'bg-[#7C3AED]' : 'bg-[#E6E4E0]'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'right-1' : 'left-1'}`} />
        </div>
        <Link
          href={`/dashboard/experiences/${experience.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141414] bg-white border border-[#EFEDE8] px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <Edit className="w-3 h-3" /> Modifier
        </Link>
        <Link
          href={`/toulouse/${experience.tags?.[0] || 'experience'}/${experience.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141414] bg-white border border-[#EFEDE8] px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <Eye className="w-3 h-3" /> Voir
        </Link>
      </div>
    </div>
  )
}
