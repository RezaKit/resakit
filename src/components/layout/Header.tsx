import Link from 'next/link'
import { MobileNav } from './MobileNav'

export function Header() {
  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-[#EFEDE8] bg-white/95 backdrop-blur-sm">
      <div className="container max-w-5xl flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-serif italic text-[28px] leading-none">
            <span className="text-[#141414]">Resa</span>
            <span className="text-[#7C3AED]">kit</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link href="/toulouse/evjf" className="text-sm font-medium text-gray-600 hover:text-[#141414] transition-colors">
            EVJF
          </Link>
          <Link href="/toulouse/anniversaire" className="text-sm font-medium text-gray-600 hover:text-[#141414] transition-colors">
            Anniversaire
          </Link>
          <Link href="/toulouse/team-building" className="text-sm font-medium text-gray-600 hover:text-[#141414] transition-colors">
            Team building
          </Link>
          <Link href="/toulouse" className="text-sm font-medium text-gray-600 hover:text-[#141414] transition-colors">
            Toutes les expériences
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/pour-les-pros"
            className="hidden sm:block text-sm font-medium text-gray-600 hover:text-[#141414] transition-colors"
          >
            Pour les pros
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium bg-[#7C3AED] text-white px-4 py-2 rounded-xl hover:bg-[#6D28D9] transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </header>
    <MobileNav />
    </>
  )
}
