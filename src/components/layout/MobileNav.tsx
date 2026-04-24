'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Ticket, User } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()
  const tabs = [
    { href: '/', icon: Home, label: 'Accueil', active: (p: string) => p === '/' },
    { href: '/toulouse', icon: Compass, label: 'Explorer', active: (p: string) => p.startsWith('/toulouse') },
    { href: '/mes-reservations', icon: Ticket, label: 'Mes résas', active: (p: string) => p.startsWith('/mes-reservations') },
    { href: '/profil', icon: User, label: 'Profil', active: (p: string) => p === '/profil' || p === '/login' },
  ]
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-t border-[#EFEDE8] md:hidden">
      <div className="flex items-center justify-around px-2 pt-2 pb-6">
        {tabs.map((tab) => {
          const isActive = tab.active(pathname)
          const Icon = tab.icon
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 min-w-[64px] py-1">
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#7C3AED]' : 'text-[#8A8880]'}`} />
              <span className={`text-[10px] font-semibold font-sans ${isActive ? 'text-[#7C3AED]' : 'text-[#8A8880]'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
