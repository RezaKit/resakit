import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h1 className="text-2xl font-display font-bold mb-2">Espace prestataire</h1>
            <p className="text-gray-600 mb-6">
              Connecte-toi à ton dashboard ResaKit.
            </p>
            <LoginForm />
            <p className="text-sm text-gray-500 mt-6 text-center">
              Pas encore partenaire ?{' '}
              <Link href="/pour-les-pros" className="text-brand-violet font-semibold hover:underline">
                Rejoindre ResaKit
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
