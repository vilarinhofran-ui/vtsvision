# VTS Vision

Decida com Dados. Cresca com Visao.

## Estrutura

- `apps/web`: Frontend SaaS em Next.js + TypeScript + Tailwind
- `apps/api`: Backend em NestJS + TypeScript
- `packages/ui`: Biblioteca de componentes compartilhados
- `docs`: Documentacao de produto, arquitetura e roadmap

## Como rodar localmente

1. Instale dependencias na raiz:
   - `npm install`
2. Configure autenticacao do frontend:
   - Copie `apps/web/.env.example` para `apps/web/.env.local`
   - Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Rode frontend:
   - `npm run dev:web`
4. Rode backend:
   - `npm run dev:api`

## Persistencia de Upload (API + PostgreSQL)

1. Configure variavel de ambiente do backend:
   - Copie `apps/api/.env.example` para `apps/api/.env`
2. Ajuste o `DATABASE_URL` para seu PostgreSQL local
3. Gere o cliente Prisma:
   - `npm run prisma:generate --workspace @vts/api`
4. Crie as tabelas com migracao:
   - `npm run prisma:migrate --workspace @vts/api`

Endpoints criados:

- `POST /datasets` salva o upload processado por usuario (`customerId` obrigatorio)
- `GET /datasets/latest?customerId=<id>` retorna o ultimo dataset do usuario

## Objetivo

A plataforma foi desenhada para pequenas e medias empresas que possuem planilhas, mas nao possuem BI. O foco nao e vender dashboards. O foco e entregar respostas praticas para decisoes de negocio.
