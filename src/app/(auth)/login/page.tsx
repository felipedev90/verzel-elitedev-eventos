import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from './login-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const SEED_CREDENTIALS = [
  { role: 'Organizador', email: 'organizador@eventos.com' },
  { role: 'Portaria', email: 'portaria@eventos.com' },
  { role: 'Cliente 1', email: 'cliente1@eventos.com' },
  { role: 'Cliente 2', email: 'cliente2@eventos.com' },
]

export const metadata: Metadata = {
  title: 'Entrar',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(217,154,63,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(26,33,56,0.8), transparent)',
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(244,242,236,0.02) 2px, rgba(244,242,236,0.02) 4px)',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs tracking-[0.3em] uppercase">Sua próxima sessão começa aqui</p>
          <h1 className="font-serif text-4xl text-text">
            <span className="text-accent/90">Kino</span>Garten
          </h1>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors duration-300 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Início
        </Link>

        <div className="mt-6 rounded-md border border-border bg-surface/50 p-4 text-center">
          <p className="mb-2 text-sm">Credenciais de teste (senha: senha123)</p>
          <ul className="flex flex-col gap-1">
            {SEED_CREDENTIALS.map((cred) => (
              <li key={cred.email} className="text-xs text-text-muted">
                <span className="text-text">{cred.role}:</span> {cred.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
