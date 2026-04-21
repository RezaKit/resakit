import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createConnectOnboardingLink } from '@/lib/stripe/helpers'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: provider } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!provider) {
      return NextResponse.json({ error: 'Prestataire introuvable' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

    const { accountId, url } = await createConnectOnboardingLink({
      email: provider.contact_email || user.email!,
      appUrl,
      existingAccountId: provider.stripe_account_id,
    })

    // Sauver le stripe_account_id si nouvellement créé
    if (accountId && accountId !== provider.stripe_account_id) {
      await supabase
        .from('providers')
        .update({ stripe_account_id: accountId })
        .eq('id', provider.id)
    }

    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('Connect onboarding error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
