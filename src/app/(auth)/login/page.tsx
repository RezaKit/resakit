import Link from 'next/link'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EC] flex flex-col">
      <div className="flex-1 flex flex-col px-6 pt-16 pb-10 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="font-serif italic text-3xl text-[#141414]">Resa</span>
            <span className="font-serif italic text-3xl text-[#7C3AED]">kit.</span>
          </Link>
        </div>

        <h1 className="font-serif italic text-[38px] leading-none text-[#141414] mb-2">
          Bon retour <em className="text-[#7C3AED]">parmi nous</em>
        </h1>
        <p className="text-sm text-[#6B6960] mb-8">Connecte-toi pour accéder à tes réservations</p>

        {/* Social buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-[#EFEDE8] rounded-xl text-sm font-medium text-[#141414] hover:bg-gray-50 transition-colors">
            <GoogleIcon />
            Continuer avec Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#141414] rounded-xl text-sm font-medium text-white hover:bg-black transition-colors">
            <AppleIcon />
            Continuer avec Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 text-[#8A8880] text-xs">
          <div className="flex-1 h-px bg-[#EFEDE8]" />
          <span>ou</span>
          <div className="flex-1 h-px bg-[#EFEDE8]" />
        </div>

        <LoginForm />

        <p className="text-center text-sm text-[#6B6960] mt-6">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-[#F97316] font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>

        <p className="text-center text-sm text-[#6B6960] mt-4">
          Prestataire ?{' '}
          <Link href="/pour-les-pros" className="text-[#7C3AED] font-semibold hover:underline">
            Espace pros →
          </Link>
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 34.5 44 29.7 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 384 512" fill="white">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM258.8 87.6c27.8-33 25.3-63 24.5-73.6-24.6 1.4-53 16.7-69.2 35.5-17.9 20.1-28.3 45-26 72.7 26.6 2.1 50.9-11.6 70.7-34.6z"/>
    </svg>
  )
}
