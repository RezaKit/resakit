import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Calendar, Settings, LogOut, AlertCircle, Sparkles, Ticket } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase.from('providers').select('*').eq('user_id', user.id).single()
  const stripeIncomplete = provider && !provider.stripe_onboarding_complete

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
    { href: '/dashboard/experiences', icon: Sparkles, label: 'Mes expériences' },
    { href: '/dashboard/reservations', icon: Ticket, label: 'Réservations' },
    { href: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      {/* Sidebar desktop */}
      <aside className="fixed left-0 top-0 h-screen w-56 bg-[#141414] hidden md:flex flex-col">
        <div className="p-6 pb-5 border-b border-white/10">
          <Link href="/" className="flex items-baseline gap-0">
            <span className="font-serif italic text-[22px] text-white">Resa</span>
            <span className="font-serif italic text-[22px] text-[#F97316]">kit.</span>
            <span className="ml-2 text-[10px] font-bold text-[#F97316] bg-[#F97316]/20 px-1.5 py-0.5 rounded tracking-wider">PRO</span>
          </Link>
          {provider && (
            <p className="text-xs text-white/50 mt-1.5 truncate">{provider.name}</p>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/65 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Provider info */}
        {provider && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-white/6 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {provider.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{provider.name}</p>
              <p className="text-[10px] text-white/40">Prestataire vérifié</p>
            </div>
          </div>
        )}

        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <form action="/api/auth/signout" method="POST">
            <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-sm w-full transition-colors">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-50 bg-[#141414] px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-0">
          <span className="font-serif italic text-xl text-white">Resa</span>
          <span className="font-serif italic text-xl text-[#F97316]">kit.</span>
        </Link>
        <div className="flex items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="text-white/60 hover:text-white">
                <Icon className="w-5 h-5" />
              </Link>
            )
          })}
          <form action="/api/auth/signout" method="POST">
            <button className="text-white/60 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="md:pl-56">
        {stripeIncomplete && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>
                <strong>Configuration requise :</strong> finalise ton onboarding Stripe pour recevoir les paiements.{' '}
                <Link href="/dashboard/settings" className="underline font-semibold">Finaliser →</Link>
              </p>
            </div>
          </div>
        )}
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}
