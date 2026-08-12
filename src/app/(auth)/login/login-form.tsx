'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { loginSchema, type LoginInput } from '@/server/auth/schemas'

const ROLE_REDIRECT: Record<string, string> = {
  ORGANIZER: '/organizer',
  GATE: '/gate',
  CUSTOMER: '/',
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setServerError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setServerError(result.error ?? 'Não foi possível entrar. Tente novamente.')
        return
      }

      const redirectTo = searchParams.get('redirect')
      router.push(redirectTo ?? ROLE_REDIRECT[result.role] ?? '/')
      router.refresh()
    } catch {
      setServerError('Erro de conexão. Verifique sua internet e tente novamente.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface/80 p-8 shadow-2xl backdrop-blur-sm"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-text-muted">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
          className="rounded-md border border-border bg-bg px-3 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-text-muted">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
          className="rounded-md border border-border bg-bg px-3 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-sm text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? (
          <>
            <Spinner className="mr-2 size-4" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  )
}
