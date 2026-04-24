import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'CGU de Resakit — conditions générales d\'utilisation de la plateforme.',
}

export default function CguPage() {
  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] min-h-screen pb-10">
        <div className="container max-w-2xl py-10 px-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6B6960] mb-8">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <h1 className="font-serif italic text-3xl text-[#141414] mb-8">
            Conditions Générales d&apos;Utilisation
          </h1>
          <div className="bg-white rounded-2xl border border-[#EFEDE8] p-6 md:p-8 space-y-6 text-sm text-[#6B6960] leading-relaxed">
            <Section title="1. Objet">
              <p>Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès et l&apos;utilisation de la plateforme Resakit, accessible à l&apos;adresse resakit.fr, éditée par la société Resakit.</p>
            </Section>
            <Section title="2. Acceptation des CGU">
              <p>L&apos;utilisation de la plateforme implique l&apos;acceptation pleine et entière des présentes CGU. Si vous n&apos;acceptez pas ces conditions, vous ne pouvez pas utiliser la plateforme.</p>
            </Section>
            <Section title="3. Description du service">
              <p>Resakit est une marketplace permettant la réservation d&apos;expériences de groupe (escape games, ateliers cocktails, team building, etc.) à Toulouse et dans d&apos;autres villes. La plateforme propose également un système de paiement partagé entre participants.</p>
            </Section>
            <Section title="4. Inscription">
              <p>L&apos;inscription sur la plateforme est gratuite. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir ses informations à jour.</p>
            </Section>
            <Section title="5. Réservations">
              <p>Toute réservation effectuée sur la plateforme est soumise aux conditions spécifiques de l&apos;expérience sélectionnée (conditions d&apos;annulation, modalités de paiement, etc.).</p>
            </Section>
            <Section title="6. Paiement">
              <p>Les paiements sont traités de manière sécurisée via Stripe. Resakit prélève une commission de 10% sur chaque réservation confirmée. Les prestataires reçoivent 90% du montant collecté.</p>
            </Section>
            <Section title="7. Annulation">
              <p>Les conditions d&apos;annulation varient selon les prestataires. Veuillez consulter les conditions spécifiques à chaque expérience avant de réserver.</p>
            </Section>
            <Section title="8. Contact">
              <p>Pour toute question : <a href="mailto:contact@resakit.fr" className="text-[#7C3AED] hover:underline">contact@resakit.fr</a></p>
            </Section>
          </div>
          <p className="text-xs text-[#8A8880] mt-4 text-center">Dernière mise à jour : avril 2026</p>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-[#141414] mb-2">{title}</h2>
      {children}
    </div>
  )
}
