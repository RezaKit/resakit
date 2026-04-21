import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = { title: 'CGV - Conditions Générales de Vente' }

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-16">
        <h1 className="text-3xl font-display font-bold mb-8">Conditions Générales de Vente</h1>
        <div className="prose prose-gray max-w-none">
          <p><em>Dernière mise à jour : [Date]</em></p>

          <h2>1. Objet</h2>
          <p>
            Les présentes CGV régissent les relations entre ResaKit, plateforme de mise en relation
            entre utilisateurs et prestataires d&apos;expériences de groupe, et ses utilisateurs.
          </p>

          <h2>2. Réservation</h2>
          <p>
            Toute réservation effectuée via ResaKit est ferme dès confirmation du paiement (acompte
            ou paiement total). L&apos;utilisateur reçoit un email de confirmation contenant tous les
            détails de sa réservation.
          </p>

          <h2>3. Prix</h2>
          <p>
            Les prix affichés sur ResaKit sont indiqués en euros TTC. ResaKit perçoit une
            commission de 10% sur chaque réservation confirmée, prélevée directement sur le
            paiement du client via Stripe Connect.
          </p>

          <h2>4. Paiement</h2>
          <p>
            Le paiement s&apos;effectue en ligne via Stripe, prestataire agréé. ResaKit ne stocke
            jamais les coordonnées bancaires des utilisateurs.
          </p>
          <p>
            En cas de paiement splitté : l&apos;organisateur paie sa part à la réservation. Chaque
            participant paie sa part via un lien unique. Si certains participants ne paient pas
            dans le délai imparti, la réservation peut être annulée et les sommes déjà versées
            remboursées, ou l&apos;organisateur peut compléter le montant manquant.
          </p>

          <h2>5. Annulation</h2>
          <p>
            Chaque prestataire définit sa propre politique d&apos;annulation, affichée sur la fiche
            de l&apos;expérience. Par défaut, annulation gratuite jusqu&apos;à 72h avant l&apos;événement.
            Au-delà, l&apos;acompte reste acquis au prestataire.
          </p>

          <h2>6. Responsabilité</h2>
          <p>
            ResaKit agit en tant qu&apos;intermédiaire. Le prestataire est seul responsable de la
            prestation fournie. ResaKit s&apos;engage à tout mettre en œuvre pour sélectionner des
            prestataires fiables et de qualité.
          </p>

          <h2>7. Droit applicable</h2>
          <p>
            Les présentes CGV sont régies par le droit français. Tout litige relèvera de la
            compétence exclusive des tribunaux français.
          </p>

          <h2>8. Contact</h2>
          <p>
            Pour toute réclamation : <a href="mailto:contact@resakit.fr" className="text-brand-violet">contact@resakit.fr</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
