import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BookingWizard } from '@/components/booking/BookingWizard'

interface PageProps {
  params: { experienceId: string }
  searchParams: { slot?: string; size?: string }
}

export default async function BookPage({ params, searchParams }: PageProps) {
  const supabase = createClient()

  const { data: experience } = await supabase
    .from('experiences')
    .select('*, provider:providers(*)')
    .eq('id', params.experienceId)
    .eq('is_active', true)
    .single()

  if (!experience) notFound()

  const { data: slots } = await supabase
    .from('slots')
    .select('*')
    .eq('experience_id', experience.id)
    .eq('is_blocked', false)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(50)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container max-w-3xl">
          <BookingWizard
            experience={experience}
            slots={slots || []}
            initialSlotId={searchParams.slot}
            initialSize={searchParams.size ? parseInt(searchParams.size) : undefined}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
