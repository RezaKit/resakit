import Link from 'next/link'
import { Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-display font-bold text-gradient-brand">
              ResaKit
            </Link>
            <p className="mt-3 text-sm text-gray-600 max-w-xs">
              Réserve l&apos;expérience, pas juste une table. Toulouse en premier, la France ensuite.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Expériences</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/toulouse/evjf" className="hover:text-brand-violet">EVJF</Link></li>
              <li><Link href="/toulouse/anniversaire" className="hover:text-brand-violet">Anniversaires</Link></li>
              <li><Link href="/toulouse/team-building" className="hover:text-brand-violet">Team building</Link></li>
              <li><Link href="/toulouse" className="hover:text-brand-violet">Toutes les expériences</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Prestataires</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/pour-les-pros" className="hover:text-brand-violet">Référencer mon activité</Link></li>
              <li><Link href="/login" className="hover:text-brand-violet">Espace prestataire</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/a-propos" className="hover:text-brand-violet">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-brand-violet">Contact</Link></li>
              <li><Link href="/cgu" className="hover:text-brand-violet">CGU</Link></li>
              <li><Link href="/cgv" className="hover:text-brand-violet">CGV</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-brand-violet">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ResaKit. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/resakit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-violet"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
