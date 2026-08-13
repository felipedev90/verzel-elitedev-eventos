'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="border-t border-border bg-surface/40 px-6 py-24">
      <div className="mx-auto grid max-w-4xl items-center gap-12 lg:gap-32 lg:grid-cols-2">
        <div className="relative h-64 md:h-80">
          <Image
            src="/newsletter.svg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        <div>
          <h2 className="mb-4 font-serif text-3xl lg:text-5xl text-text text-center lg:text-left uppercase">
            Fique por dentro das <span className="text-accent">estreias</span>
          </h2>
          <p className="mb-8 text-text-muted text-center lg:text-left">
            Receba os próximos lançamentos, sessões especiais e promoções antes de todo mundo.
          </p>

          {subscribed ? (
            <p role="status" className="text-accent">
              Inscrição registrada. Obrigado por assinar!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                aria-label="Seu e-mail"
                className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:flex-1"
              />
              <Button type="submit">Assinar</Button>
            </form>
          )}

          <p className="mt-4 text-xs text-text-muted">
            Seção demonstrativa. Nenhum e-mail é armazenado ou enviado.
          </p>
        </div>
      </div>
    </section>
  )
}
