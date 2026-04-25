import { Mail, Instagram, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Contact — Resakit',
  description: 'Une question, un partenariat, une idée ? Contacte-nous, on répond sous 24h.',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-[#F5F2EC] pb-20 md:pb-0">

        {/* Hero */}
        <section className="bg-[#141414] px-5 py-16 md:py-20">
          <div className="container max-w-3xl">
            <h1 className="font-serif italic text-4xl md:text-[50px] leading-[1.05] text-white mb-4">
              On est <em className="text-[#7C3AED]">à l&apos;écoute.</em>
            </h1>
            <p className="text-base text-white/70 max-w-md leading-relaxed">
              Une question, un bug, un partenariat ? Écris-nous directement.
              On répond sous 24h, promis.
            </p>
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="container max-w-2xl">
            <div className="grid gap-4">

              {/* Email */}
              <a
                href="mailto:contact@resakit.fr"
                className="bg-white rounded-2xl border border-[#EFEDE8] p-6 flex items-center gap-5 hover:border-[#7C3AED] transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F1EAFE] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#141414] mb-0.5">Email</p>
                  <p className="text-sm text-[#6B6960]">contact@resakit.fr</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8A8880] group-hover:text-[#7C3AED] transition-colors" />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/resakit"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-[#EFEDE8] p-6 flex items-center gap-5 hover:border-[#F97316] transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-[#F97316]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#141414] mb-0.5">Instagram</p>
                  <p className="text-sm text-[#6B6960]">@resakit</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8A8880] group-hover:text-[#F97316] transition-colors" />
              </a>

              {/* Pour les pros */}
              <a
                href="mailto:contact@resakit.fr?subject=Rejoindre%20Resakit"
                className="bg-white rounded-2xl border border-[#EFEDE8] p-6 flex items-center gap-5 hover:border-[#141414] transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5F2EC] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏢</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#141414] mb-0.5">Tu es prestataire ?</p>
                  <p className="text-sm text-[#6B6960]">Écris-nous pour référencer ton activité</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8A8880] group-hover:text-[#141414] transition-colors" />
              </a>
            </div>

            {/* Response time note */}
            <div
              className="mt-8 p-5 rounded-2xl text-center"
              style={{ background: '#FFF7EF', border: '1px solid #FFE4CC' }}
            >
              <p className="text-sm text-[#B3450E] font-medium">
                ⏱ Réponse garantie sous 24h en semaine
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
