import Link from 'next/link'
import { ArrowLeft, Mail, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EC] flex flex-col">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-10 max-w-md mx-auto w-full">
        <Link href="/login" className="flex items-center gap-2 text-sm text-[#6B6960] mb-8 w-fit">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <h1 className="font-serif italic text-[36px] leading-tight text-[#141414] mb-2">
          Réinitialiser le <em className="text-[#7C3AED]">mot de passe</em>
        </h1>
        <p className="text-sm text-[#6B6960] mb-8">Entre ton email et on t&apos;envoie un lien.</p>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B6960] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8880]" />
              <input
                type="email"
                placeholder="ton@email.fr"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#EFEDE8] rounded-xl text-sm text-[#141414] placeholder-[#8A8880] outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#7C3AED] text-white text-sm font-semibold py-4 rounded-xl hover:bg-[#6D28D9] transition-colors mt-2"
          >
            Envoyer le lien
          </button>
        </form>

        {/* Success state — shown after submit */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 hidden">
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Lien envoyé !</p>
            <p className="text-xs text-green-700 mt-0.5">Vérifie ta boîte mail.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
