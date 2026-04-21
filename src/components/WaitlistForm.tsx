'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city: 'Toulouse', source: 'homepage' }),
      })

      if (res.ok) {
        setSubmitted(true)
        toast.success('Merci ! Vérifie tes emails 💌')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Une erreur est survenue')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
        <p className="font-semibold">🎉 Merci pour ton inscription !</p>
        <p className="text-sm mt-2 opacity-90">
          On t&apos;envoie un email dès le lancement à Toulouse.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ton@email.fr"
        required
        className="flex-1 bg-white text-gray-900 border-white h-12"
      />
      <Button type="submit" disabled={loading} size="lg" variant="secondary">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Je m\'inscris'}
      </Button>
    </form>
  )
}
