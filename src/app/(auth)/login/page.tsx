import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
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
          <p className="mb-2 text-xs tracking-[0.3em] text-accent uppercase">
            Sua próxima sessão começa aqui
          </p>
          <h1 className="font-serif text-4xl text-text">KinoGarten</h1>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}
