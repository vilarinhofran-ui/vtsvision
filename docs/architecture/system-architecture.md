# Arquitetura VTS Vision

## Visao geral

A plataforma foi dividida em modulos para crescer sem retrabalho:

- Frontend SaaS em Next.js para onboarding, dashboard e area do cliente
- Backend em NestJS para regras de negocio, diagnostico e integracoes
- Banco PostgreSQL com Prisma ORM
- Storage de arquivos no Supabase Storage
- Modulo de IA com OpenAI + LangChain + RAG
- Gateway de pagamentos para Stripe, Mercado Pago e Asaas

## Modulos de dominio

1. Cadastro e Onboarding

- Captura dados basicos
- Busca CEP automatica
- Salva progresso para retomar depois

2. Diagnostico Inteligente

- Segmento e ramo
- Dores e objetivos por prioridade
- Calculo de maturidade e plano inicial

3. Upload e Conectores

- Excel, CSV, Google Sheets, API e banco
- Pipeline de validacao e padronizacao

4. Analista Virtual

- Explica graficos sem linguagem tecnica
- Gera insights, riscos e oportunidades
- Monta plano de acao de 30 dias

5. Dashboard Interativo

- KPIs principais
- Drill down, drill through e cross filter
- Exportacao PDF, Excel e PNG

6. Alertas Inteligentes

- Queda de margem
- Receita em baixa
- Estoque critico
- Meta distante

7. Benchmark

- Compara com empresas de mesmo segmento
- Mostra distancia da media e recomendacao

8. Retencao Mensal

- Novo relatorio executivo
- Novos insights
- Comparativo mes a mes

9. Painel Admin

- Gestao de clientes, planos, segmentos e pagamentos
- Logs de auditoria e monitoramento

## Arquitetura logica

- Camada de Apresentacao: Next.js + componentes reutilizaveis
- Camada de Aplicacao: casos de uso no NestJS
- Camada de Dominio: regras de negocio por modulo
- Camada de Infra: banco, storage, pagamento e IA

## Nao funcionais

- Clean Code e SOLID
- WCAG e responsividade
- Testes unitarios e integracao
- Swagger para documentacao de API
- Pronto para integrar Power BI, Looker Studio, ERP e CRM
