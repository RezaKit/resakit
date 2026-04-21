import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsClient from '@/components/dashboard/SettingsClient'

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!provider) redirect('/dashboard')

  return (
    <SettingsClient
      stripeOnboardingComplete={provider.stripe_onboarding_complete}
      providerName={provider.name}
      contactEmail={provider.contact_email ?? undefined}
    />
  )
}
