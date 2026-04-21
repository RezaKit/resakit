import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Calendar, Settings, LogOut, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const stripeIncomplete = provider && !provider.stripe_onboarding_complete

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar desktop */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="text-2xl font-display font-bold text-gradient-brand">
            ResaKit
          </Link>
          {provider && (
            <p className="text-sm text-gray-500 mt-1 truncate">{provider.name}</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm"
          >
            <LayoutDashboard className="w-5 h-5" />
            Vue d&apos;ensemble
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm"
          >
            <Calendar className="w-5 h-5" />
            Réservations
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <form action="/api/auth/signout" method="POST">
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm w-full">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        {stripeIncomplete && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>
                <strong>Configuration requise :</strong> finalise ton onboarding Stripe pour
                recevoir les paiements.{' '}
                <Link
                  href="/dashboard/settings"
                  className="underline font-semibold"
                >
                  Finaliser →
                </Link>
              </p>
            </div>
          </div>
        )}
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
