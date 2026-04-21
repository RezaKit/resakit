'use client'

import { useState } from 'react'
import { Copy, Check, MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  splitUrl: string
  occasion?: string
}

export function SplitLinkActions({ splitUrl, occasion }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(splitUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const message = `🎉 Salut ! Je t'invite à ${occasion || 'notre événement'} sur ResaKit. Paie ta part ici : ${splitUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  const emailUrl = `mailto:?subject=${encodeURIComponent("Tu es invité(e) à notre événement 🎉")}&body=${encodeURIComponent(message)}`

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3">
        <code className="flex-1 text-xs text-gray-600 truncate">{splitUrl}</code>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-violet hover:text-brand-violet-dark"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Copié !
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copier
            </>
          )}
        </button>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={emailUrl}>
            <Mail className="w-4 h-4" />
            Email
          </a>
        </Button>
      </div>
    </div>
  )
}
