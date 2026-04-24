import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Lock, CreditCard, Bell, Star, Euro, HelpCircle, Mail, Shield, LogOut, ChevronRight, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = { title: 'Mon profil' }

export default async function ProfilPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] min-h-screen pb-24 md:pb-0">
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-serif italic text-3xl text-[#141414]">Profil</h1>
        </div>

        {/* Identity card */}
        <div className="px-5">
          <div className="bg-white rounded-2xl border border-[#EFEDE8] p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FFB27A] flex items-center justify-center text-xl font-bold text-[#141414] flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-[#141414] truncate">{name}</p>
              <p className="text-xs text-[#6B6960] truncate">{user.email}</p>
              <div className="flex gap-2 mt-1.5">
                <span className="text-[10px] font-semibold text-[#7C3AED] bg-[#F1EAFE] px-2 py-0.5 rounded-full">0 résas</span>
              </div>
            </div>
          </div>

          {/* Promo pros */}
          <Link href="/pour-les-pros" className="mt-3 block">
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #141414, #7C3AED)' }}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Tu as une activité ?</p>
                <p className="text-xs text-white/75 mt-0.5">Référence-la gratuitement sur Resakit</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/60" />
            </div>
          </Link>
        </div>

        {/* Sections */}
        <div className="px-5 space-y-4 mt-4">
          <Section title="Mon compte">
            <SRow icon={User} label="Informations personnelles" />
            <SRow icon={Lock} label="Changer mon mot de passe" />
            <SRow icon={CreditCard} label="Méthodes de paiement" last />
          </Section>

          <Section title="Préférences">
            <SRow icon={Bell} label="Notifications" right={<span className="text-xs text-[#8A8880]">Email + Push</span>} />
            <SRow icon={Shield} label="Langue" right={<span className="text-xs text-[#8A8880]">Français</span>} last />
          </Section>

          <Section title="Mon activité">
            <SRow icon={Star} label="Mes avis" right={<span className="text-xs text-[#8A8880]">0</span>} />
            <SRow icon={Euro} label="Historique des paiements" last />
          </Section>

          <Section title="Aide">
            <SRow icon={HelpCircle} label="Centre d'aide / FAQ" />
            <SRow icon={Mail} label="Nous contacter" />
            <SRow icon={Shield} label="Confidentialité · CGU" href="/cgu" last />
          </Section>

          <form action="/api/auth/signout" method="POST">
            <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-500 mt-2">
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#8A8880] uppercase tracking-widest mb-2 px-1">{title}</p>
      <div className="bg-white rounded-2xl border border-[#EFEDE8] overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function SRow({
  icon: Icon,
  label,
  right,
  href,
  last,
}: {
  icon: React.ElementType
  label: string
  right?: React.ReactNode
  href?: string
  last?: boolean
}) {
  const content = (
    <div className={`flex items-center gap-3 px-4 py-3 ${!last ? 'border-b border-[#EFEDE8]' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-[#F5F2EC] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#141414]" />
      </div>
      <span className="flex-1 text-sm font-medium text-[#141414]">{label}</span>
      {right}
      <ChevronRight className="w-4 h-4 text-[#8A8880]" />
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : <div>{content}</div>
}
