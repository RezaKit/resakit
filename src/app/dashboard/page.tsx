import { redirect } from 'next/navigation'
import { Calendar, Euro, Users, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatShortDate, formatTime } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!provider) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
          <h1 className="font-display font-bold text-2xl mb-3">
            Bienvenue sur ResaKit !
          </h1>
          <p className="text-gray-600 mb-6">
            Ton compte a bien été créé. Contacte-nous pour activer ta fiche prestataire :
          </p>
          <a
            href="mailto:contact@resakit.fr"
            className="inline-flex px-6 py-3 bg-brand-violet text-white rounded-lg font-semibold"
          >
            contact@resakit.fr
          </a>
        </div>
      </div>
    )
  }

  const now = new Date().toISOString()
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  // Metrics
  const { data: bookingsMonth } = await supabase
    .from('bookings')
    .select('*')
    .eq('provider_id', provider.id)
    .gte('created_at', startOfMonth)
    .in('status', ['deposit_paid', 'fully_paid', 'confirmed', 'completed'])

  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select('*, experience:experiences(*), slot:slots(*)')
    .eq('provider_id', provider.id)
    .in('status', ['deposit_paid', 'fully_paid', 'confirmed'])
    .order('created_at', { ascending: false })
    .limit(10)

  const revenueMonth = (bookingsMonth || []).reduce(
    (sum, b) => sum + Number(b.provider_amount),
    0
  )
  const bookingsCount = bookingsMonth?.length || 0
  const guestsCount = (bookingsMonth || []).reduce((sum, b) => sum + b.group_size, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Bonjour {provider.contact_name || provider.name} 👋</h1>
        <p className="text-gray-600 mt-1">Voici un aperçu de ton activité ResaKit ce mois-ci.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <MetricCard
          icon={<Calendar className="w-5 h-5" />}
          label="Réservations"
          value={bookingsCount.toString()}
        />
        <MetricCard
          icon={<Euro className="w-5 h-5" />}
          label="Revenus"
          value={formatPrice(revenueMonth)}
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Participants"
          value={guestsCount.toString()}
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Note moyenne"
          value={provider.rating_average ? provider.rating_average.toFixed(1) : '—'}
        />
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-xl font-display font-bold mb-4">Prochaines réservations</h2>
        {upcomingBookings && upcomingBookings.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            {upcomingBookings.map((b: any) => (
              <div key={b.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{b.experience?.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {b.organizer_name} · {b.occasion || 'Réservation'} · {b.group_size} pers.
                  </p>
                  {b.slot && (
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {formatShortDate(b.slot.date)} à {formatTime(b.slot.time_start)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-violet">
                    {formatPrice(Number(b.provider_amount))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{b.booking_ref}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">Aucune réservation pour l&apos;instant.</p>
            <p className="text-sm text-gray-400 mt-2">
              Partage ta fiche ResaKit pour commencer à recevoir des réservations !
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-display font-bold">{value}</p>
    </div>
  )
}
