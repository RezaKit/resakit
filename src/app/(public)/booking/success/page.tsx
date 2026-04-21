import Link from 'next/link'
import { Check, Share2, Copy } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { SplitLinkActions } from '@/components/booking/SplitLinkActions'
import { formatPrice } from '@/lib/utils'

interface PageProps {
  searchParams: { session_id?: string }
}

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id
  let booking: any = null

  if (sessionId) {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('bookings')
      .select('*, experience:experiences(*), provider:providers(*)')
      .eq('stripe_session_id', sessionId)
      .single()
    booking = data
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resakit.fr'
  const splitUrl = booking?.split_payment_code ? `${appUrl}/join/${booking.split_payment_code}` : null

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container max-w-2xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-display font-bold mb-3">
              Réservation confirmée !
            </h1>

            {booking ? (
              <>
                <p className="text-gray-600 mb-2">
                  Référence : <span className="font-mono font-semibold">{booking.booking_ref}</span>
                </p>
                <p className="text-gray-600 mb-8">
                  Un email de confirmation a été envoyé à{' '}
                  <span className="font-semibold">{booking.organizer_email}</span>
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                  <h2 className="font-display font-bold text-lg mb-4">Récapitulatif</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expérience</span>
                      <span className="font-semibold">{booking.experience?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prestataire</span>
                      <span className="font-semibold">{booking.provider?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de personnes</span>
                      <span className="font-semibold">{booking.group_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold">{formatPrice(Number(booking.total_amount))}</span>
                    </div>
                  </div>
                </div>

                {splitUrl && (
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 className="w-5 h-5 text-brand-violet" />
                      <h2 className="font-display font-bold text-lg">
                        Partage ce lien à ton groupe
                      </h2>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Chaque participant paiera sa part via ce lien unique :
                    </p>
                    <SplitLinkActions splitUrl={splitUrl} occasion={booking.occasion} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-600 mb-6">
                Ton paiement a bien été reçu. Tu vas recevoir un email de confirmation sous peu.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
              <Button asChild>
                <Link href="/toulouse">Voir d&apos;autres expériences</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
