'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'

interface Props {
  stripeOnboardingComplete: boolean
  providerName: string
  contactEmail?: string
}

export default function SettingsClient({
  stripeOnboardingComplete,
  providerName,
  contactEmail,
}: Props) {
  const [loading, setLoading] = useState(false)

  async function startOnboarding() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Erreur')
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch (err) {
      toast.error('Erreur serveur')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configure ton compte et tes paiements.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="font-display font-bold text-lg mb-4">Informations</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nom du prestataire</span>
            <span className="font-semibold">{providerName}</span>
          </div>
          {contactEmail && (
            <div className="flex justify-between">
              <span className="text-gray-600">Email de contact</span>
              <span className="font-semibold">{contactEmail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              stripeOnboardingComplete ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            {stripeOnboardingComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )}
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Paiements Stripe</h2>
            <p className="text-sm text-gray-600 mt-1">
              {stripeOnboardingComplete
                ? 'Ton compte Stripe est configuré. Tu reçois les paiements automatiquement.'
                : 'Configure Stripe pour recevoir les paiements de tes réservations.'}
            </p>
          </div>
        </div>

        <Button onClick={startOnboarding} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirection...
            </>
          ) : stripeOnboardingComplete ? (
            <>
              Accéder à mon compte Stripe <ExternalLink className="w-4 h-4" />
            </>
          ) : (
            <>
              Configurer Stripe <ExternalLink className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
