import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-gradient-brand">
            ResaKit
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/toulouse/evjf"
            className="text-sm font-medium text-gray-700 hover:text-brand-violet transition-colors"
          >
            EVJF
          </Link>
          <Link
            href="/toulouse/anniversaire"
            className="text-sm font-medium text-gray-700 hover:text-brand-violet transition-colors"
          >
            Anniversaire
          </Link>
          <Link
            href="/toulouse/team-building"
            className="text-sm font-medium text-gray-700 hover:text-brand-violet transition-colors"
          >
            Team building
          </Link>
          <Link
            href="/toulouse"
            className="text-sm font-medium text-gray-700 hover:text-brand-violet transition-colors"
          >
            Toutes les expériences
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/pour-les-pros"
            className="hidden sm:block text-sm font-medium text-gray-700 hover:text-brand-violet transition-colors"
          >
            Pour les pros
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
