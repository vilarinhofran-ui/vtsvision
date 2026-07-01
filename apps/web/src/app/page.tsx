import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Layers3,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Users2,
  Zap,
} from "lucide-react";

const stats = [
  {
    value: "+2.100",
    label: "diagnosticos gerados",
  },
  {
    value: "93%",
    label: "clientes com ganho de visibilidade",
  },
  {
    value: "30 dias",
    label: "tempo medio para primeiras melhorias",
  },
];

const steps = [
  {
    title: "Cadastro inteligente",
    description:
      "Crie sua conta com preenchimento automatico por CEP e retomada do formulario.",
    icon: Users2,
  },
  {
    title: "Diagnostico orientado por IA",
    description:
      "Responda em 3 etapas e receba leitura de maturidade com riscos e oportunidades.",
    icon: Sparkles,
  },
  {
    title: "Execucao no dashboard",
    description:
      "Acompanhe KPIs, alertas e plano de acao de 30 dias em um painel unico.",
    icon: BarChart3,
  },
];

const benefits = [
  {
    title: "Pronto para operacao",
    description:
      "Fluxo claro para qualquer cliente navegar sem treinamento tecnico.",
    icon: Zap,
  },
  {
    title: "Confianca para decidir",
    description: "Leitura executiva com contexto, risco e acao priorizada.",
    icon: ShieldCheck,
  },
  {
    title: "Entrega consultiva",
    description:
      "A plataforma fala a lingua do negocio, nao apenas de tecnologia.",
    icon: MessageSquareQuote,
  },
];

const segments = [
  "Comercio e varejo",
  "Servicos",
  "Industria",
  "Saude",
  "Educacao",
  "Logistica",
];

const testimonials = [
  {
    name: "Juliana Mendes",
    role: "Diretora financeira - Rede de lojas",
    quote:
      "Em duas semanas, passamos de planilhas soltas para um plano de melhoria com indicadores claros.",
  },
  {
    name: "Carlos Azevedo",
    role: "CEO - Empresa de servicos",
    quote:
      "O diagnostico trouxe exatamente os gargalos que sentiamos, mas nao conseguiamos provar com dados.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    cadence: "/mes",
    items: ["Ate 3 dashboards", "Atualizacao mensal", "IA limitada"],
    highlight: false,
  },
  {
    name: "Business",
    price: "R$ 197",
    cadence: "/mes",
    items: [
      "IA completa",
      "Dashboard ilimitado",
      "Alertas inteligentes",
      "Insights automaticos",
      "Google Sheets",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$ 397",
    cadence: "/mes",
    items: [
      "Tudo incluso",
      "Consultor IA",
      "Relatorios automaticos",
      "Benchmark",
      "Alertas inteligentes",
    ],
    highlight: false,
  },
];

const faqs = [
  {
    question: "Preciso instalar algo?",
    answer: "Nao. A plataforma e 100% web e acessada por navegador.",
  },
  {
    question: "Quanto tempo leva para começar?",
    answer:
      "Voce cria conta, faz o diagnostico e recebe seu plano inicial em minutos.",
  },
  {
    question: "Serve para empresas pequenas?",
    answer:
      "Sim. O fluxo e desenhado para pequenos e medios negocios com linguagem simples.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-8 md:py-10">
      <section className="vts-glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="vts-logo-frame p-1.5">
              <Image
                src="/vts-logo.png"
                alt="VTS Vision"
                width={58}
                height={58}
                className="rounded-lg"
                priority
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
                VTS Vision
              </p>
              <h1 className="vts-title text-2xl font-bold md:text-3xl">
                Transforme seus dados em decisoes inteligentes.
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/cadastro"
              className="rounded-full bg-[#009DFF] px-5 py-2 text-sm font-semibold text-white"
            >
              Comecar Diagnostico
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#009DFF] bg-white px-5 py-2 text-sm font-semibold text-[#003C8F]"
            >
              Logar
            </Link>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm text-slate-600 md:text-base">
          O analista virtual que mostra onde sua empresa ganha, perde e pode
          crescer.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-[#CFE9FF] bg-white/80 p-4"
            >
              <p className="vts-title text-xl font-bold text-[#003C8F]">
                {item.value}
              </p>
              <p className="text-sm text-slate-600">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">Como funciona</h2>
          <div className="mt-4 space-y-3">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <div
                key={title}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3"
              >
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F6FF] text-[#003C8F]">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {index + 1}. {title}
                  </p>
                  <p className="text-sm text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">Mock do dashboard</h2>
          <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Maturidade atual
              </p>
              <span className="rounded-full bg-[#E8F6FF] px-2 py-1 text-xs font-semibold text-[#003C8F]">
                Medio
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 w-2/3 rounded-full bg-[#009DFF]" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="font-semibold text-slate-800">Riscos</p>
                <p className="text-slate-600">3 criticos mapeados</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="font-semibold text-slate-800">Oportunidades</p>
                <p className="text-slate-600">5 frentes priorizadas</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-800">
                Plano 30 dias
              </p>
              <p className="text-sm text-slate-600">
                11 acoes recomendadas com prazo e impacto.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {benefits.map(({ title, description, icon: Icon }) => (
          <article key={title} className="vts-card p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F6FF] text-[#003C8F]">
              <Icon size={18} />
            </span>
            <h3 className="vts-title mt-3 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">
            Segmentos atendidos
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {segments.map((segment) => (
              <span
                key={segment}
                className="rounded-full border border-[#BFE0FF] bg-[#F3FAFF] px-3 py-1.5 text-sm font-semibold text-[#003C8F]"
              >
                {segment}
              </span>
            ))}
          </div>
        </article>

        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">Depoimentos</h2>
          <div className="mt-4 space-y-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-sm text-slate-700">\"{item.quote}\"</p>
                <footer className="mt-2 text-xs text-slate-500">
                  <strong>{item.name}</strong> - {item.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`vts-card p-6 ${plan.highlight ? "border-[#009DFF] shadow-[0_20px_40px_rgba(0,61,143,0.2)]" : ""}`}
          >
            <p className="text-sm font-semibold text-[#003C8F]">{plan.name}</p>
            <p className="mt-2 vts-title text-2xl font-bold text-slate-900">
              {plan.price}
              <span className="ml-1 text-sm font-medium text-slate-500">
                {plan.cadence}
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {plan.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 text-[#009DFF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#003C8F] px-4 py-2 text-sm font-semibold text-white"
            >
              Escolher plano <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-6 vts-card p-6">
        <h2 className="vts-title text-xl font-semibold">FAQ</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-500">
          Decida com Dados. Cresca com Visao.
        </p>
      </section>

      <section className="mt-6 vts-glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#003C8F]">
              Pronto para escalar sua gestao?
            </p>
            <h2 className="vts-title mt-1 text-2xl font-bold text-slate-900">
              Inicie seu diagnostico e receba seu plano de 30 dias hoje
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Plataforma pronta para cliente navegar do cadastro ate a execucao.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 rounded-full bg-[#009DFF] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Criar conta <ArrowRight size={15} />
            </Link>
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 rounded-full border border-[#009DFF] bg-white px-5 py-2.5 text-sm font-semibold text-[#003C8F]"
            >
              Fazer diagnostico <Sparkles size={15} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 pb-4 text-sm text-slate-600">
        <p>
          © {new Date().getFullYear()} VTS Vision. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} /> Suporte comercial
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers3 size={14} /> Plataforma SaaS
          </span>
        </div>
      </footer>
    </main>
  );
}
