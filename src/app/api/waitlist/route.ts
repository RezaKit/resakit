import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendWelcomeWaitlist } from '@/lib/resend/client'

const schema = z.object({
  email: z.string().email(),
  city: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const { email, city, source } = parsed.data
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('waitlist')
      .insert({ email, city: city || 'Toulouse', source })

    // Ignorer les doublons (l'email existe déjà)
    if (error && !error.message.includes('duplicate')) {
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    // Email de bienvenue (best effort)
    await sendWelcomeWaitlist({ email, city: city || 'Toulouse' })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
