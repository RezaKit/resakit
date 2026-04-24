'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }
      toast.success('Connexion réussie')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Erreur de connexion')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-[#6B6960] mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.fr"
          required
          className="w-full px-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED]"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-[#6B6960]">Mot de passe</label>
          <Link href="/forgot-password" className="text-xs text-[#7C3AED] font-medium hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
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
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#7C3AED] text-white text-sm font-semibold py-4 rounded-xl hover:bg-[#6D28D9] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Se connecter'}
      </button>
    </form>
  )
}
