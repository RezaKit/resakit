import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <span className="font-serif italic text-[140px] md:text-[160px] leading-none text-[#7C3AED] tracking-[-6px]">
            404
          </span>
          <span className="absolute top-1/2 -right-4 -translate-y-1/2 font-serif italic text-5xl text-[#F97316] rotate-12">
            !
          </span>
        </div>

        <h1 className="font-serif italic text-2xl md:text-3xl text-[#141414] mb-3">
          Cette page s&apos;est <em className="text-[#7C3AED]">perdue</em> en chemin
        </h1>
        <p className="text-sm text-[#6B6960] mb-10 max-w-[280px]">
          Mais les expériences, elles, sont bien là.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/"
            className="w-full bg-[#7C3AED] text-white text-sm font-semibold py-3.5 rounded-xl text-center hover:bg-[#6D28D9] transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/toulouse"
            className="w-full bg-white text-[#141414] text-sm font-semibold py-3.5 rounded-xl border border-[#EFEDE8] text-center hover:bg-gray-50 transition-colors"
          >
            Explorer les expériences
          </Link>
        </div>
      </main>
    </>
  )
}
