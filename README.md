# KinoGarten

Plataforma de eventos e ingressos desenvolvida para o desafio técnico Elite Dev da Verzel. Organizadores publicam sessões de cinema a partir de um catálogo (TMDb), clientes escolhem assento num mapa interativo e compram ingresso com QR code, e a portaria valida a entrada em tempo real.

**Deploy:** https://verzel-elitedev-eventos.vercel.app

## Credenciais de teste

Todas as senhas: `senha123`

| Papel       | E-mail                    |
| ----------- | ------------------------- |
| Organizador | `organizador@eventos.com` |
| Cliente     | `cliente1@eventos.com`    |
| Portaria    | `portaria@eventos.com`    |

## Stack

- **Framework**: Next.js 16 (App Router), fullstack, front e back no mesmo projeto
- **Linguagem**: TypeScript strict
- **Banco**: PostgreSQL + Prisma ORM
- **Estilização**: Tailwind CSS v4
- **Autenticação**: JWT em cookie httpOnly, implementação própria, sem lib de auth
- **Formulários**: React Hook Form + Zod
- **Deploy**: Vercel (aplicação) + Neon (Postgres)

### Por que um repositório só

O desafio pede back-end em Node. Route Handlers do Next são Node rodando no servidor, então atendem o requisito sem precisar de um segundo serviço, um segundo deploy e um segundo `.env` para manter sincronizados. A separação real de responsabilidades não está em pastas de repositórios diferentes, mas em camadas dentro do próprio código: `src/server/` concentra toda a lógica de domínio e nunca importa nada de UI; `src/app/api/` é só a camada fina de transporte HTTP que chama o que está em `src/server/`. Isso é visível olhando a estrutura de pastas do projeto.

## Rodando localmente

### Pré-requisitos

- Node.js 22+
- Docker (para o Postgres local) ou uma `DATABASE_URL` de Postgres já pronta

### 1. Clonar e instalar

\```bash
git clone https://github.com/felipedev90/verzel-elitedev-eventos.git
cd verzel-elitedev-eventos
npm install
\```

### 2. Variáveis de ambiente

Copia `.env.example` para `.env` e preenche:

\```bash
cp .env.example .env
\```

| Variável         | Descrição                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | Connection string do Postgres                                                                                     |
| `TMDB_API_TOKEN` | Read Access Token da API do TMDb (gratuito em [themoviedb.org](https://www.themoviedb.org/settings/api))          |
| `JWT_SECRET`     | Segredo para assinar sessões. Gera com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `TICKET_SECRET`  | Segredo para assinar o código HMAC do QR code, gera do mesmo jeito que o `JWT_SECRET`, com um valor diferente     |

### 3. Banco de dados

Duas opções:

**A. Postgres local via Docker (recomendado para desenvolver)**

\```bash
docker compose up -d
npx prisma migrate deploy
npx prisma db seed
\```

**B. Usar o banco de produção direto**

Se quiser só ver o projeto funcionando sem instalar Docker, usa a `DATABASE_URL` do Neon já populada. Nesse caso pula o passo do Docker e cola direto a URL de produção no `.env`.

### 4. Rodar

\```bash
npm run dev
\```

Abre em `http://localhost:3000`.

## Estrutura de pastas

\```
src/
├── app/
│ ├── api/ # Route Handlers (o "back-end")
│ │ ├── auth/
│ │ ├── organizer/
│ │ ├── checkout/
│ │ ├── tickets/
│ │ └── gate/
│ ├── (public)/ # Home, evento, checkout
│ ├── (auth)/ # Login
│ └── (dashboard)/ # Organizador, portaria, meus ingressos
├── components/
│ ├── ui/ # Primitivos reutilizáveis
│ └── layout/ # Nav, Footer, DashboardNav
├── server/ # Lógica de domínio, nunca roda no navegador
│ ├── auth/
│ ├── events/
│ ├── checkout/
│ ├── tickets/
│ ├── gate/
│ └── tmdb/
├── lib/ # Utilities compartilhadas (cn, format)
└── types/ # Tipos puros
\```

## Decisões técnicas

### Autenticação

Sessão via JWT assinado (biblioteca `jose`, compatível com Edge Runtime) guardado num cookie `httpOnly`. Como o JavaScript do navegador não consegue ler esse cookie, toda chamada autenticada do front passa por Route Handlers do próprio Next, que leem o cookie no servidor e injetam o header `Authorization` nas consultas ao banco. Três papéis (`ORGANIZER`, `CUSTOMER`, `GATE`) protegidos em duas camadas: `middleware.ts` bloqueia navegação de página por papel, e `requireRole()` protege cada rota de API individualmente, porque o `matcher` do middleware não cobre `/api/*`.

Rate limiting simples (5 tentativas por minuto por IP, em memória) no login. Em produção com múltiplas instâncias a solução correta seria Redis com TTL, documentado aqui como limitação conhecida.

### Não vender o mesmo assento duas vezes

A garantia real não está numa checagem de `if` no código, mas na constraint `@@unique([eventId, seatId])` no banco. O checkout confere disponibilidade antes de criar o pedido (resposta mais rápida no caso comum), mas quem impede a corrida de fato é o banco: se dois clientes comprarem o mesmo assento no mesmo instante, o segundo `INSERT` falha por violação de constraint, e a API captura esse erro específico do Prisma (`P2002`) para devolver um 409 claro em vez de um 500 genérico.

### QR code não forjável

O código dentro do QR é `ticketId.assinatura`, onde a assinatura é um HMAC-SHA256 do `ticketId` usando um segredo que só o servidor conhece (`TICKET_SECRET`). A portaria recalcula a assinatura e compara com `timingSafeEqual`, não com `===`, para não vazar informação por tempo de resposta (timing attack). O código não é persistido no banco, é derivado do `id` do ticket sempre que necessário.

### Não validar o mesmo ingresso duas vezes

`UPDATE ... WHERE id = ? AND usedAt IS NULL`. Se o `count` do update voltar zero, é porque outra requisição já validou esse ticket entre a leitura e a escrita. Mesma lógica de defesa contra corrida do checkout, aplicada aqui de outra forma.

### Repository/Adapter no catálogo de filmes

O formato bruto que o TMDb devolve (`TmdbMovie`) nunca vazou para o resto da aplicação. Uma função de tradução (`toCatalogMovie`) converte para o formato que a aplicação usa internamente (`CatalogMovie`). Se o TMDb mudar o formato de resposta, ou se um dia o projeto trocar de provedor de catálogo, o ponto de ajuste é um só.

### Server e Client Components

Server Component por padrão. `'use client'` só quando o componente precisa de hook, evento ou biblioteca client-only. Onde um componente maior tinha só uma parte interativa, a parte interativa foi extraída para um componente filho menor, mantendo o pai como Server (exemplo: `Hero`, que é Server, delega a mecânica de carrossel para `Carousel`, que é Client).

## Requisitos opcionais

- **Busca e filtro de eventos**: implementado (busca por nome e filtro por cidade na Home).
- **Painel do organizador**: implementado (criar, editar, publicar/despublicar eventos).
- **Cancelamento com devolução ao estoque**: implementado. Cliente pode cancelar um ingresso até 2 horas antes do início do evento, desde que ainda não tenha sido validado na portaria. O assento volta a ficar disponível automaticamente, já que a constraint `@@unique([eventId, seatId])` some junto com o registro do `Ticket`.
- **Docker Compose**: implementado.
- **Aplicação publicada**: implementado (Vercel + Neon).
- **Testes automatizados**: implementado. Testes unitários e de integração (Vitest) cobrindo hash de senha, HMAC do QR code, simulação de pagamento, proteção contra venda duplicada de assento e os 4 estados de validação de portaria. Um teste E2E (Playwright) cobrindo o fluxo completo de compra, incluindo o caminho de pagamento recusado.

## Scripts

| Script                     | Descrição                    |
| -------------------------- | ---------------------------- |
| `npm run dev`              | Servidor de desenvolvimento  |
| `npm run build`            | Build de produção            |
| `npm run lint`             | ESLint                       |
| `npm run typecheck`        | Checagem de tipos            |
| `npm run format`           | Formata com Prettier         |
| `npx prisma studio`        | Interface visual do banco    |
| `npx prisma migrate reset` | Reseta o banco e roda o seed |

## Rodando os testes

Localmente, os testes unitários e de integração usam o banco configurado em `DATABASE_URL` do seu `.env`. Os testes E2E precisam da aplicação rodando (`npm run dev`) em outro terminal.

\```bash

# Testes unitários e de integração

npm run test

# Testes E2E

npm run test:e2e
\```

No CI, os testes rodam contra uma branch de banco separada no Neon (isolada da produção), e os E2E usam o container oficial do Playwright.

## Uso de IA

Detalhes sobre onde e como IA foi usada no desenvolvimento deste projeto estão em [`docs/USO-DE-IA.md`](./docs/USO-DE-IA.md).

---

Criado por [Felipe Augusto](https://devfelipeaugusto.com.br)
