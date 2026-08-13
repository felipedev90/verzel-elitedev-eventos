import { Clapperboard, Armchair, QrCode } from 'lucide-react'

const SERVICES = [
  {
    icon: Clapperboard,
    title: 'Catálogo em cartaz',
    description:
      'Os filmes em exibição vêm direto de uma base atualizada, com pôster, sinopse e data de estreia sempre em dia.',
  },
  {
    icon: Armchair,
    title: 'Escolha do assento',
    description:
      'Mapa interativo da sala, com assentos disponíveis e ocupados em tempo real. Você escolhe onde quer sentar antes de pagar.',
  },
  {
    icon: QrCode,
    title: 'Ingresso digital',
    description:
      'Seu ingresso fica no celular, com QR code próprio. Na entrada, a portaria valida em segundos, sem papel nem fila.',
  },
]

export function AboutSection() {
  return (
    <section id="sobre" className="border-t border-border px-6 py-24 bg-bg-elevated/10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 max-w-2xl flex flex-col gap-4 text-center mx-auto">
          <h2 className="mb-4 font-serif text-3xl lg:text-5xl text-text">
            Sobre o <span className="text-accent">Kino</span>Garten
          </h2>
          <p className="leading-relaxed text-text-muted">
            O Kinogarten conecta quem exibe filmes a quem quer assistir. Organizadores publicam
            sessões a partir de um catálogo real de cinema, e o público compra ingresso escolhendo o
            assento, com pagamento e validação de entrada num fluxo só.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}

type ServiceCardProps = {
  icon: typeof Clapperboard
  title: string
  description: string
}

function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 flex flex-col items-center text-center">
      <div className="mb-5 inline-flex rounded-xl bg-accent/10 p-3">
        <Icon size={24} className="text-accent" aria-hidden="true" />
      </div>
      <h3 className="mb-3 font-serif text-xl text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{description}</p>
    </div>
  )
}
