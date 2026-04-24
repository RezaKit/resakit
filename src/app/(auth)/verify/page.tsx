import Link from 'next/link'
import { Mail, Check } from 'lucide-react'

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <div className="w-28 h-28 rounded-[28px] bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center mx-auto mb-6 relative">
          <Mail className="w-14 h-14 text-[#7C3AED]" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center border-3 border-white">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="font-serif italic text-4xl text-[#141414] leading-tight mb-3">
          Vérifie ta <em className="text-[#7C3AED]">boîte mail</em>
        </h1>
        <p className="text-sm text-[#6B6960] leading-relaxed mb-8 max-w-xs mx-auto">
          On a envoyé un lien de confirmation à{' '}
          <strong className="text-[#141414]">ton adresse email</strong>.
          Clique dessus pour activer ton compte.
        </p>

        <div className="flex flex-col gap-3">
          <button className="w-full py-3.5 rounded-xl border border-[#EFEDE8] bg-white text-sm font-semibold text-[#141414]">
            Renvoyer l&apos;email
          </button>
          <Link href="/login" className="text-sm text-[#F97316] font-semibold">
            Changer d&apos;adresse email
          </Link>
        </div>

        <p className="text-xs text-[#8A8880] mt-8">
          Pas reçu ? Vérifie tes spams.
        </p>
      </div>
    </main>
  )
}
