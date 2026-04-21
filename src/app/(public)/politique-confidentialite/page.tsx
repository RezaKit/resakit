import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = { title: 'Politique de confidentialité' }

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-16">
        <h1 className="text-3xl font-display font-bold mb-8">
          Politique de confidentialité
        </h1>
        <div className="prose prose-gray max-w-none">
          <p><em>Conforme au RGPD. Dernière mise à jour : [Date]</em></p>

          <h2>1. Données collectées</h2>
          <p>
            ResaKit collecte uniquement les données nécessaires à son bon fonctionnement :
          </p>
          <ul>
            <li>Nom, prénom, email, téléphone (lors d&apos;une réservation)</li>
            <li>Adresse IP (pour la sécurité et l&apos;analyse)</li>
            <li>Données de navigation (cookies techniques)</li>
          </ul>
          <p>
            Aucune donnée bancaire n&apos;est stockée par ResaKit (paiements gérés par Stripe).
          </p>

          <h2>2. Finalités</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Traiter les réservations</li>
            <li>Envoyer les confirmations et rappels par email/SMS</li>
            <li>Améliorer nos services</li>
            <li>Vous informer des nouveautés (avec votre accord)</li>
          </ul>

          <h2>3. Conservation</h2>
          <p>
            Les données de réservation sont conservées 3 ans après la dernière interaction, puis
            archivées pour obligations légales comptables.
          </p>

          <h2>4. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement, de portabilité et d&apos;opposition. Pour exercer ces droits :{' '}
            <a href="mailto:contact@resakit.fr" className="text-brand-violet">
              contact@resakit.fr
            </a>
          </p>

          <h2>5. Cookies</h2>
          <p>
            ResaKit utilise uniquement des cookies techniques nécessaires au fonctionnement du
            site. Aucun cookie publicitaire ou de tracking tiers.
          </p>

          <h2>6. Sous-traitants</h2>
          <ul>
            <li>Stripe (paiements) — conforme RGPD</li>
            <li>Supabase (hébergement données) — conforme RGPD</li>
            <li>Vercel (hébergement site) — conforme RGPD</li>
            <li>Resend (emails transactionnels) — conforme RGPD</li>
          </ul>

          <h2>7. Contact</h2>
          <p>
            Délégué à la protection des données :{' '}
            <a href="mailto:contact@resakit.fr" className="text-brand-violet">
              contact@resakit.fr
            </a>
          </p>
          <p>
            Vous pouvez également déposer une réclamation auprès de la CNIL :{' '}
            <a href="https://www.cnil.fr" className="text-brand-violet" target="_blank" rel="noopener noreferrer">
              cnil.fr
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
