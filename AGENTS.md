<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Convenções do projeto KinoGarten

Documento de referência para manter consistência entre sessões de trabalho com IA e entre humanos.

## O projeto

Plataforma de eventos e ingressos de cinema. Organizador publica sessão a partir de um filme do TMDb, cliente escolhe assento e compra, portaria valida QR na entrada.

## Stack

- Next.js 16 (App Router), fullstack no mesmo projeto
- React 19
- TypeScript 5 (strict + `noUncheckedIndexedAccess`)
- PostgreSQL + Prisma ORM
- Tailwind v4 (CSS-first, design tokens em `globals.css`)
- React Hook Form + Zod
- ESLint 9 (flat config) + Prettier
- Husky + lint-staged + commitlint

## Git

- Conventional Commits com scope obrigatório em kebab-case
- Exemplo: `feat(checkout): add seat reservation`, `fix(auth): require login before checkout`
- Branches: `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `test/*`, `docs/*`
- Branch base: `main`, protegida via CI verde (format, lint, typecheck, build)

## Estrutura de pastas

- `src/app/api/` — Route Handlers, a camada de transporte HTTP
- `src/app/(public)/` — Home, evento, checkout
- `src/app/(auth)/` — Login
- `src/app/(dashboard)/` — Organizador, portaria, meus ingressos
- `src/server/` — lógica de domínio, nunca importa nada de UI, nunca roda no navegador
- `src/components/ui/` — primitivos reutilizáveis
- `src/components/layout/` — Navbar, Footer, DashboardNav
- `src/lib/` — utilities puras (`cn`, `format`, `tmdb`)
- `src/types/` — tipagens compartilhadas

## Nomenclatura

- Componentes React: PascalCase (`Button.tsx`, `EventCard.tsx`)
- Demais arquivos: kebab-case (`use-media-query.ts`, `qr-code.ts`)
- Identificadores (variáveis, funções, tipos): inglês
- Conteúdo visível ao usuário (strings de UI): pt-BR
- Mensagens de erro de API: inglês (documentado e justificado no README)

## TypeScript

- `type` sempre, nunca `interface`
- `import type { X }` para imports puramente de tipo
- Nunca `any`, usar `unknown` + narrowing
- Rotas dinâmicas do Next 15+: `params` e `searchParams` são `Promise`, sempre `await`

## Server e Client Components

- Server Component por padrão
- `'use client'` só quando precisa de hook, evento, ou lib client-only
- Se um componente maior tem só uma parte interativa, extrai a parte interativa para um filho Client, mantendo o pai como Server

## Segurança

- Nunca confiar em dado vindo do client sem validar com Zod na rota
- Toda escrita concorrente sensível (venda de assento, validação de ingresso) precisa de garantia no nível do banco (constraint ou `WHERE` condicional), não só checagem em código
- `role` de usuário nunca vem do body de uma requisição de registro ou criação, é sempre derivado da sessão ou fixado no servidor

## Acessibilidade

- Target: WCAG 2.1 AA
- Ícones decorativos ou sem texto: `aria-hidden`, e o elemento pai leva `aria-label`
- `prefers-reduced-motion` respeitado nas animações
- Contraste mínimo 4.5:1

## Design tokens (globals.css)

- Cores: `--color-bg`, `--color-surface`, `--color-accent`, `--color-text`, `--color-border` (paleta azul-meia-noite + âmbar)
- Fontes: `--font-serif` (Fraunces, títulos), `--font-sans` (Inter, corpo)
- Classes Tailwind geradas automaticamente via `@theme inline`
