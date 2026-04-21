import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Mentions légales',
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-16">
        <h1 className="text-3xl font-display font-bold mb-8">Mentions légales</h1>
        <div className="prose prose-gray max-w-none">
          <h2>Éditeur du site</h2>
          <p>
            ResaKit<br />
            [Nom du propriétaire]<br />
            [Adresse complète]<br />
            [Ville, Code postal]<br />
            Email : contact@resakit.fr
          </p>
          <p>
            SIRET : [à compléter]<br />
            Statut juridique : [Micro-entreprise / SAS / SARL]<br />
            Directeur de la publication : [Nom]
          </p>

          <h2>Hébergement</h2>
          <p>
            Vercel Inc.<br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789<br />
            États-Unis
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos, code) est la propriété
            exclusive de ResaKit, sauf mentions contraires. Toute reproduction, même partielle,
            est interdite sans autorisation écrite préalable.
          </p>

          <h2>Protection des données</h2>
          <p>
            Les données personnelles collectées sur ce site sont traitées conformément au RGPD.
            Consultez notre{' '}
            <a href="/politique-confidentialite" className="text-brand-violet">
              Politique de confidentialité
            </a>
            .
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question : <a href="mailto:contact@resakit.fr" className="text-brand-violet">contact@resakit.fr</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
