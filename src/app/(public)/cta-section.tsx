import Image from 'next/image'
import Link from 'next/link'

type CtaSectionProps = {
  imageUrl: string
}

export function CtaSection({ imageUrl }: CtaSectionProps) {
  return (
    <section className="px-6 py-20 bg-surface">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-linear-to-br from-bg/40 to-accent/50 shadow-lg">
        <div className="grid items-center lg:grid-cols-[1fr_1.1fr]">
          <div className="px-8 py-14 text-center md:px-14 md:py-20 md:text-left">
            <h2 className="mb-6 font-serif text-4xl leading-[1.15] text-text md:text-6xl">
              Tudo que a sua
              <br />
              sessão precisa
            </h2>
            <p className="mb-10 max-w-sm text-base leading-relaxed text-text/90">
              Escolha o assento no mapa, pague em segundos e leve o ingresso no celular. Sem fila,
              sem papel, sem complicação.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-full bg-accent px-10 py-4 text-base font-semibold text-bg transition-colors duration-300 hover:bg-accent-hover"
            >
              Criar minha conta
            </Link>
          </div>

          <div className="relative h-72 md:h-full md:min-h-112">
            <Image
              src={imageUrl}
              alt="Pessoas assistindo a um filme no cinema"
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
