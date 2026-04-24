import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Créer une expérience — Dashboard' }

const STEPS = ['Présentation', 'Photos', 'Tarifs & Groupe', 'Disponibilités', 'Paiement']

const DURATIONS = ['1h', '1h30', '2h', '2h30', '3h', 'Sur devis']
const CATEGORIES = [
  { value: 'escape_game', label: 'Escape Game' },
  { value: 'atelier_cocktail', label: 'Atelier Cocktail' },
  { value: 'atelier_cuisine', label: 'Atelier Cuisine' },
  { value: 'atelier_oenologie', label: 'Œnologie' },
  { value: 'sport_loisir', label: 'Sport & Loisirs' },
  { value: 'bar_privatisation', label: 'Bar Privatisable' },
  { value: 'atelier_creatif', label: 'Atelier Créatif' },
  { value: 'karaoke', label: 'Karaoké' },
  { value: 'experience_insolite', label: 'Expérience Insolite' },
  { value: 'bien_etre', label: 'Bien-être' },
]
const OCCASIONS = ['EVJF', 'EVG', 'Anniversaire', 'Team building', 'Soirée', 'Entre amis', 'Pot de départ', 'Séminaire']

export default async function NewExperiencePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase.from('providers').select('*').eq('user_id', user.id).single()
  if (!provider) redirect('/dashboard')

  return (
    <div>
      <Link href="/dashboard/experiences" className="inline-flex items-center gap-2 text-sm text-gray-500 mb-6">
        <ArrowLeft className="w-4 h-4" /> Mes expériences
      </Link>
      <h1 className="text-3xl font-serif italic text-[#141414] mb-6">
        Créer une <em className="text-[#7C3AED]">expérience</em>
      </h1>

      {/* Steps */}
      <div className="bg-white rounded-2xl border border-[#EFEDE8] p-4 mb-6 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              i === 0 ? 'bg-[#7C3AED] text-white' : 'bg-[#F5F2EC] text-[#8A8880]'
            }`}>
              {i < 0 ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden md:block ${i === 0 ? 'text-[#141414]' : 'text-[#8A8880]'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < 0 ? 'bg-[#7C3AED]' : 'bg-[#EFEDE8]'}`} />}
          </div>
        ))}
      </div>

      <form action="/api/dashboard/experiences" method="POST">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Présentation */}
            <div className="bg-white rounded-2xl border border-[#EFEDE8] p-6">
              <h2 className="font-serif italic text-2xl text-[#141414] mb-5">
                Présentation
              </h2>
              <div className="space-y-4">
                <Field label="Titre de l'expérience" name="title" placeholder="Ex: Atelier Cocktails Signature" required />
                <div>
                  <label className="block text-xs font-semibold text-[#6B6960] mb-2">Catégorie</label>
                  <select name="category" className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] outline-none focus:border-[#7C3AED]">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6960] mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Décris ton expérience de manière engageante…"
                    className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>
                <Field label="Description courte (pour les cards)" name="short_description" placeholder="Ex: L'atelier cocktails le plus stylé de Toulouse" />
                <Field label="Adresse exacte" name="address" placeholder="Ex: 23 rue des Filatiers, Toulouse" />
              </div>
            </div>

            {/* Tarifs */}
            <div className="bg-white rounded-2xl border border-[#EFEDE8] p-6">
              <h2 className="font-serif italic text-2xl text-[#141414] mb-5">
                Tarifs & <em className="text-[#7C3AED]">Groupe</em>
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Prix par personne (€)" name="price_per_person" type="number" placeholder="55" />
                  <Field label="Ou prix fixe (€)" name="price_fixed" type="number" placeholder="—" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Min. participants" name="min_people" type="number" placeholder="4" required />
                  <Field label="Max. participants" name="max_people" type="number" placeholder="16" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6960] mb-2">Durée</label>
                  <div className="flex gap-2 flex-wrap">
                    {DURATIONS.map((d, i) => (
                      <label key={d} className="cursor-pointer">
                        <input type="radio" name="duration" value={d} className="sr-only" defaultChecked={i === 2} />
                        <span className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                          i === 2 ? 'border-[#7C3AED] bg-[#F1EAFE] text-[#7C3AED]' : 'border-[#EFEDE8] bg-white text-[#141414]'
                        }`}>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6960] mb-2">Occasions</label>
                  <div className="flex gap-2 flex-wrap">
                    {OCCASIONS.map(occ => (
                      <label key={occ} className="cursor-pointer">
                        <input type="checkbox" name="occasions" value={occ} className="sr-only" />
                        <span className="px-3 py-1.5 rounded-full border border-[#EFEDE8] bg-white text-xs font-medium text-[#141414]">{occ}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6960] mb-2">Ce qui est inclus</label>
                  <textarea
                    name="what_included"
                    rows={3}
                    placeholder="Ex: Matériel fourni, tablier, cours par un barman professionnel…"
                    className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-violet-100 to-purple-50 rounded-2xl p-5 border-0">
              <p className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-2">Transparence</p>
              <p className="text-sm font-semibold text-[#141414] mb-1">Resakit prend 10% de commission</p>
              <p className="text-xs text-[#6B6960] leading-relaxed">
                Tu reçois 90% du montant collecté. Aucun frais fixe, aucun abonnement.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EFEDE8] p-5">
              <p className="text-xs font-bold text-[#8A8880] uppercase tracking-wider mb-3">Calcul live</p>
              <div className="bg-[#F5F2EC] rounded-xl p-3 mb-3">
                <p className="text-xs text-[#6B6960]">8 participants × 55€</p>
                <p className="text-2xl font-bold text-[#141414] mt-1">440€</p>
                <p className="text-xs text-[#8A8880]">collectés</p>
              </div>
              <div className="flex justify-between text-xs text-[#6B6960] mb-2">
                <span>Commission (10%)</span><span>-44€</span>
              </div>
              <div className="h-px bg-[#EFEDE8] mb-2" />
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-[#141414]">Pour toi</span>
                <span className="text-lg font-bold text-green-600">396€</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" className="flex-1 py-3 rounded-xl border border-[#EFEDE8] bg-white text-sm font-semibold text-[#141414]">
                Brouillon
              </button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] transition-colors">
                Publier
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({
  label, name, type = 'text', placeholder, required
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#6B6960] mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED]"
      />
    </div>
  )
}
