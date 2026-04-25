'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function SignupForm() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: firstName } },
      })
      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }
      router.push('/verify')
    } catch {
      toast.error('Erreur lors de la création du compte')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-[#6B6960] mb-1.5">Prénom</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Léa"
          required
          className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED]"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#6B6960] mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="lea@email.fr"
          required
          className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED]"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#6B6960] mb-1.5">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED]"
        />
      </div>

      <label className="flex items-start gap-3 text-xs text-[#6B6960] leading-relaxed">
        <div className="w-[18px] h-[18px] rounded bg-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <span>
          J&apos;accepte les{' '}
          <Link href="/cgu" className="text-[#141414] font-medium underline">CGU</Link>
          {' '}et la{' '}
          <Link href="/politique-confidentialite" className="text-[#141414] font-medium underline">politique de confidentialité</Link>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#7C3AED] text-white text-sm font-semibold py-4 rounded-xl hover:bg-[#6D28D9] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer mon compte'}
      </button>
    </form>
  )
}
