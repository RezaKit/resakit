import Link from 'next/link'
import { Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#141414] text-white mb-16 md:mb-0">
      <div className="container max-w-5xl py-16">
        <div className="mb-12">
          <span className="font-serif italic text-[56px] leading-none text-white">
            Resakit.
          </span>
          <p className="mt-4 text-gray-400 max-w-sm text-sm leading-relaxed">
            Réserve l&apos;expérience, pas juste une table. Toulouse en premier, la France ensuite.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Expériences</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/toulouse/evjf" className="hover:text-white transition-colors">EVJF</Link></li>
              <li><Link href="/toulouse/anniversaire" className="hover:text-white transition-colors">Anniversaires</Link></li>
              <li><Link href="/toulouse/team-building" className="hover:text-white transition-colors">Team building</Link></li>
              <li><Link href="/toulouse" className="hover:text-white transition-colors">Toutes les expériences</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Prestataires</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/pour-les-pros" className="hover:text-white transition-colors">Référencer mon activité</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Espace prestataire</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Entreprise</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/a-propos" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors">CGU</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Resakit. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/resakit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
