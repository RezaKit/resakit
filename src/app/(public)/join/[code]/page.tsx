import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Users, Calendar } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JoinPaymentForm } from '@/components/booking/JoinPaymentForm'
import { formatPrice, formatShortDate } from '@/lib/utils'

interface PageProps {
  params: { code: string }
}

export default async function JoinPage({ params }: PageProps) {
  const supabase = createAdminClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, experience:experiences(*), provider:providers(*)')
    .eq('split_payment_code', params.code)
    .single()

  if (!booking) notFound()

  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('booking_id', booking.id)

  const paidCount = participants?.filter((p) => p.payment_status === 'paid').length || 0
  const totalCount = booking.group_size
  const progressPct = (paidCount / totalCount) * 100
  const partAmount = Number(booking.total_amount) / booking.group_size

  const deadlineDate = booking.split_payment_deadline
    ? new Date(booking.split_payment_deadline)
    : null
  const isExpired = deadlineDate ? deadlineDate < new Date() : false
  const isFull = booking.status === 'fully_paid' || booking.status === 'completed'

  const mainPhoto = booking.experience?.photos?.[0] || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header image */}
            <div className="relative aspect-[16/9] bg-gray-100">
              <Image src={mainPhoto} alt={booking.experience?.title || ''} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm opacity-90">
                  🎉 {booking.organizer_name} t&apos;invite à
                </p>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  {booking.experience?.title}
                </h1>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Progress */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {paidCount}/{totalCount} personnes ont payé
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progressPct)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-brand transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Détails */}
              <div className="space-y-3 mb-6">
                {booking.occasion && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">🎉</span>
                    <span>Occasion : <strong>{booking.occasion}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-brand-violet" />
                  <span>Groupe de <strong>{booking.group_size} personnes</strong></span>
                </div>
                {booking.provider && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-brand-violet" />
                    <span>Chez <strong>{booking.provider.name}</strong></span>
                  </div>
                )}
              </div>

              {/* Statut */}
              {isFull ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <p className="text-4xl mb-2">🎉</p>
                  <h2 className="font-display font-bold text-xl text-green-800 mb-2">
                    Tout le monde a payé !
                  </h2>
                  <p className="text-green-700">
                    Rendez-vous pour {booking.experience?.title} !
                  </p>
                </div>
              ) : isExpired ? (
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <p className="text-4xl mb-2">⏰</p>
                  <h2 className="font-display font-bold text-xl mb-2">
                    Le délai de paiement est dépassé
                  </h2>
                  <p className="text-gray-600">
                    Contacte {booking.organizer_name} pour plus d&apos;infos.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-purple-50 rounded-xl p-6 mb-6 text-center">
                    <p className="text-sm text-gray-600 mb-1">Ta part à payer</p>
                    <p className="text-4xl font-bold text-brand-violet">
                      {formatPrice(partAmount)}
                    </p>
                  </div>

                  <JoinPaymentForm
                    code={params.code}
                    amount={partAmount}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
