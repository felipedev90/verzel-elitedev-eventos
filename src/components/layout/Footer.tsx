import Link from 'next/link'

const FOOTER_LINKS = {
  produto: [
    { label: 'Em cartaz', href: '/' },
    { label: 'Como funciona', href: '/#como-funciona' },
    { label: 'Criar conta', href: '/register' },
  ],
  empresa: [
    { label: 'Sobre nós', href: '/#sobre' },
    { label: 'Contato', href: 'mailto:contato@kinogarten.com' },
  ],
  legal: [
    { label: 'Termos de uso', href: '/termos' },
    { label: 'Privacidade', href: '/privacidade' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 text-center sm:grid-cols-2 sm:text-left md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-3 font-serif text-2xl text-text">
              <span className="text-accent/90">Kino</span>Garten
            </p>
            <p className="text-sm text-text-muted">
              Sua próxima sessão começa aqui. Filmes em cartaz, ingressos sem fila.
            </p>
          </div>

          <FooterColumn title="Produto" links={FOOTER_LINKS.produto} />
          <FooterColumn title="Empresa" links={FOOTER_LINKS.empresa} />
          <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center flex flex-col gap-2 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} KinoGarten. Projeto de portfólio, não é um serviço real de
            venda de ingressos.
          </p>
          <p className="text-xs text-text-muted">
            Criado por{' '}
            <a
              href="https://devfelipeaugusto.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors duration-300 hover:text-accent-hover"
            >
              Felipe Augusto
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-text">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-muted transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
