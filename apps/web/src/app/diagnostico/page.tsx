"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const segmentos = [
  "Comercio",
  "ServiÇos",
  "Tecnologia",
  "Saúde",
  "Construção",
  "Alimentação",
  "Automotivo",
  "Educação",
  "Indústria",
  "Logística",
  "Hotelaria",
  "Agronegócio",
  "Imobiliário",
  "Outro",
];

const dores = [
  "Não sei meu lucro",
  "Dados desorganizados",
  "Não sei o que vende mais",
  "Não tenho indicadores",
  "Não tenho controle financeiro",
  "Não consigo crescer",
  "Outra",
];

const objetivos = [
  "Aumentar faturamento",
  "Aumentar lucro",
  "Reduzir custos",
  "Organizar dados",
  "Controlar estoque",
  "Prever vendas",
  "Tomar decisões com segurança",
];

type DiagnosticsResponse = {
  maturidade: "Baixo" | "Médio" | "Alto";
  problemaPrincipal: string;
  riscos: string[];
  oportunidades: string[];
  planoInicial: string[];
  respostaExecutiva: string;
};

type Stage = "form" | "processing" | "result";

const ramoBySegmento: Record<string, string[]> = {
  Comercio: ["Varejo físico", "E-commerce", "Atacado", "Distribuição", "Outro"],
  Serviços: [
    "Consultoria",
    "Agência",
    "Prestação técnica",
    "Assinaturas",
    "Outro",
  ],
  Tecnologia: [
    "SaaS",
    "Software sob medida",
    "Infraestrutura",
    "Dados",
    "Outro",
  ],
  Saúde: [
    "Clínica",
    "Laboratório",
    "Hospital",
    "Serviços domiciliares",
    "Outro",
  ],
  Construção: ["Obras", "Projetos", "Materiais", "Manutenção", "Outro"],
  Alimentação: [
    "Restaurante",
    "Delivery",
    "Indústria alimentícia",
    "Mercado",
    "Outro",
  ],
  Automotivo: ["Oficina", "Concessionária", "Autopeças", "Frotas", "Outro"],
  Educação: [
    "Escola",
    "Cursos",
    "Treinamentos corporativos",
    "Edtech",
    "Outro",
  ],
  Indústria: ["Metalurgia", "Têxtil", "Química", "Bens de consumo", "Outro"],
  Logística: [
    "Transporte",
    "Armazenagem",
    "Last mile",
    "Gestão de frota",
    "Outro",
  ],
  Hotelaria: ["Hotel", "Pousada", "Eventos", "Turismo", "Outro"],
  Agronegócio: ["Produção", "Distribuição", "Insumos", "Máquinas", "Outro"],
  Imobiliário: [
    "Incorporadora",
    "Corretagem",
    "Locação",
    "Administração",
    "Outro",
  ],
  Outro: ["Outro"],
};

const iaStages = [
  "Coletando contexto do negócio",
  "Analisando maturidade de dados",
  "Priorizando riscos operacionais",
  "Mapeando oportunidades de crescimento",
  "Montando plano prático de 30 dias",
];

const riskCatalog: Record<string, string> = {
  "Não sei meu lucro":
    "Margem comprometida sem visibilidade por produto ou serviço.",
  "Dados desorganizados": "Decisão reativa por falta de dados consolidados.",
  "Não sei o que vende mais": "Perda de receita por mix comercial desalinhado.",
  "Não tenho indicadores": "Ausência de alertas para desvios relevantes.",
  "Não tenho controle financeiro": "Risco de caixa por falta de previsão.",
  "Não consigo crescer": "Escala com aumento de custo e queda de eficiência.",
  Outra: "Risco operacional por ausência de padrão de acompanhamento.",
};

const opportunityCatalog: Record<string, string> = {
  "Aumentar faturamento": "Ativar campanhas nos canais com maior conversão.",
  "Aumentar lucro": "Ajustar precificação e foco em itens mais rentáveis.",
  "Reduzir custos": "Eliminar desperdícios e renegociar custos recorrentes.",
  "Organizar dados": "Unificar dados em painel único para rotina de análise.",
  "Controlar estoque": "Definir política de estoque por giro e margem.",
  "Prever vendas": "Projetar vendas semanais por histórico e sazonalidade.",
  "Tomar decisões com segurança":
    "Criar ritual executivo com metas por indicador.",
};

export default function DiagnosticoPage() {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<Stage>("form");
  const [segmento, setSegmento] = useState(segmentos[0]);
  const [ramo, setRamo] = useState("");
  const [ramoOutro, setRamoOutro] = useState("");
  const [doresSelecionadas, setDoresSelecionadas] = useState<string[]>([]);
  const [objetivosSelecionados, setObjetivosSelecionados] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState<DiagnosticsResponse | null>(null);

  const ramoOptions = useMemo(
    () => ramoBySegmento[segmento] ?? ["Outro"],
    [segmento],
  );

  const processingIndex = useMemo(() => {
    if (stage !== "processing") return 0;
    return Math.floor(Date.now() / 900) % iaStages.length;
  }, [stage]);

  function onDragStart(
    event: React.DragEvent<HTMLButtonElement>,
    value: string,
  ) {
    event.dataTransfer.setData("text/plain", value);
  }

  function onDropItem(
    event: React.DragEvent<HTMLDivElement>,
    target: "dores" | "objetivos",
  ) {
    event.preventDefault();
    const value = event.dataTransfer.getData("text/plain");
    if (!value) return;

    if (target === "dores" && dores.includes(value)) {
      setDoresSelecionadas((prev) =>
        prev.includes(value) ? prev : [...prev, value].slice(0, 3),
      );
    }

    if (target === "objetivos" && objetivos.includes(value)) {
      setObjetivosSelecionados((prev) =>
        prev.includes(value) ? prev : [...prev, value].slice(0, 3),
      );
    }
  }

  function removeChip(target: "dores" | "objetivos", value: string) {
    if (target === "dores") {
      setDoresSelecionadas((prev) => prev.filter((item) => item !== value));
      return;
    }
    setObjetivosSelecionados((prev) => prev.filter((item) => item !== value));
  }

  function goToNextStep() {
    if (step === 1) {
      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!ramo) {
        setError("Selecione o ramo para continuar.");
        return;
      }
      if (ramo === "Outro" && !ramoOutro.trim()) {
        setError("Descreva seu ramo para continuar.");
        return;
      }
      setError("");
      setStep(3);
    }
  }

  function buildPersonalizedDiagnosis(): DiagnosticsResponse {
    const principalDor = doresSelecionadas[0] ?? "Dados desorganizados";
    const principalObjetivo = objetivosSelecionados[0] ?? "Aumentar lucro";

    const dorScore = doresSelecionadas.reduce((acc, item) => {
      if (
        item === "Não tenho controle financeiro" ||
        item === "Não tenho indicadores"
      ) {
        return acc + 3;
      }
      if (item === "Dados desorganizados" || item === "Não sei meu lucro") {
        return acc + 2;
      }
      return acc + 1;
    }, 0);

    const maturidade: DiagnosticsResponse["maturidade"] =
      dorScore >= 7 ? "Baixo" : dorScore >= 4 ? "Médio" : "Alto";

    const riscos = [
      ...new Set(
        doresSelecionadas.map((item) => riskCatalog[item]).filter(Boolean),
      ),
      "Baixa frequência de revisão de indicadores críticos.",
      "Dependência de decisões sem priorização estruturada.",
    ].slice(0, 3);

    const oportunidades = [
      ...new Set(
        objetivosSelecionados
          .map((item) => opportunityCatalog[item])
          .filter(Boolean),
      ),
      "Melhorar governança de dados para acelerar decisão.",
      "Aumentar previsibilidade com planejamento quinzenal.",
    ].slice(0, 3);

    const ramoFinal = ramo === "Outro" ? ramoOutro || "outro ramo" : ramo;

    return {
      maturidade,
      problemaPrincipal: principalDor,
      riscos,
      oportunidades,
      planoInicial: [
        `Priorizar ${principalObjetivo.toLowerCase()} com metas semanais para ${segmento.toLowerCase()}.`,
        `Organizar dados de ${ramoFinal.toLowerCase()} em painel com revisão toda semana.`,
        "Executar plano de 30 dias com responsável, prazo e indicador de sucesso.",
      ],
      respostaExecutiva: `Com base nas respostas de ${segmento.toLowerCase()}, a prioridade e corrigir ${principalDor.toLowerCase()} para sustentar ${principalObjetivo.toLowerCase()} com mais previsibilidade nos proximos 30 dias.`,
    };
  }

  async function handleGenerateDiagnosis() {
    setLoading(true);
    setError("");
    setNotice("");
    setResult(null);
    setStage("processing");

    if (!doresSelecionadas.length || !objetivosSelecionados.length) {
      setError("Arraste ao menos 1 dor e 1 objetivo para gerar seu resultado.");
      setLoading(false);
      setStage("form");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segmento,
          ramo,
          dores: doresSelecionadas,
          objetivos: objetivosSelecionados,
          ramoOutro: ramo === "Outro" ? ramoOutro : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao processar diagnostico");
      }

      const data = (await response.json()) as DiagnosticsResponse;
      setResult(data);
      setStage("result");
    } catch {
      const localResult = buildPersonalizedDiagnosis();
      setResult(localResult);
      setNotice(
        "API indisponivel no momento. Resultado personalizado gerado localmente com base nas suas respostas.",
      );
      setStage("result");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="module-shell module-diagnostico mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <section className="vts-card module-panel p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="vts-logo-frame p-1.5">
            <Image
              src="/vts-logo.png"
              alt="VTS Vision"
              width={64}
              height={64}
              className="rounded-lg"
              priority
            />
          </div>
          <div>
            <h1 className="vts-title text-3xl font-bold">
              Diagnostico Inteligente
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Jornada guiada em 3 etapas para gerar um resultado personalizado.
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {[1, 2, 3].map((item) => (
            <span
              key={item}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item === step
                  ? "bg-[#009DFF] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Etapa {item}
            </span>
          ))}
        </div>

        {stage === "form" && (
          <>
            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {segmentos.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSegmento(item);
                      setRamo("");
                      setRamoOutro("");
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      segmento === item
                        ? "border-[#009DFF] bg-[#E8F6FF]"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {item}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Selecionar segmento
                    </p>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-slate-700">
                  Ramo da empresa
                  <select
                    value={ramo}
                    onChange={(event) => setRamo(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-[#009DFF]"
                  >
                    <option value="">Selecione</option>
                    {ramoOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                {ramo === "Outro" && (
                  <label className="flex flex-col gap-1 text-sm text-slate-700">
                    Descreva seu ramo
                    <input
                      value={ramoOutro}
                      onChange={(event) => setRamoOutro(event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-[#009DFF]"
                      placeholder="Ex.: Distribuidora de pecas"
                    />
                  </label>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="vts-title text-lg font-semibold">
                    Arraste suas dores
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dores.map((item) => (
                      <button
                        key={item}
                        type="button"
                        draggable
                        onDragStart={(event) => onDragStart(event, item)}
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => onDropItem(event, "dores")}
                    className="mt-4 min-h-24 rounded-xl border border-dashed border-[#009DFF] bg-[#F3FAFF] p-3"
                  >
                    <p className="text-xs text-slate-500">
                      Solte aqui (maximo 3)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doresSelecionadas.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => removeChip("dores", item)}
                          className="rounded-full bg-[#009DFF] px-3 py-1 text-xs font-semibold text-white"
                        >
                          {item} x
                        </button>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="vts-title text-lg font-semibold">
                    Arraste seus objetivos
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {objetivos.map((item) => (
                      <button
                        key={item}
                        type="button"
                        draggable
                        onDragStart={(event) => onDragStart(event, item)}
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => onDropItem(event, "objetivos")}
                    className="mt-4 min-h-24 rounded-xl border border-dashed border-[#009DFF] bg-[#F3FAFF] p-3"
                  >
                    <p className="text-xs text-slate-500">
                      Solte aqui (maximo 3)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {objetivosSelecionados.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => removeChip("objetivos", item)}
                          className="rounded-full bg-[#003C8F] px-3 py-1 text-xs font-semibold text-white"
                        >
                          {item} x
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="inline-flex items-center gap-2 rounded-full bg-[#009DFF] px-6 py-3 font-semibold text-white"
                >
                  Avancar <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateDiagnosis}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#009DFF] px-6 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  Gerar resultado
                </button>
              )}

              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700"
                >
                  Voltar
                </button>
              )}

              <Link
                href="/dashboard"
                className="rounded-full border border-[#009DFF] bg-white px-6 py-3 font-semibold text-[#003C8F]"
              >
                Acessar dashboard
              </Link>
            </div>
          </>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {notice && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {notice}
          </p>
        )}
      </section>

      {stage === "processing" && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="vts-card mt-6 p-6"
        >
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin text-[#009DFF]" size={18} />
            <p className="font-semibold text-slate-800">
              IA processando seu diagnostico
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {iaStages.map((stageItem, idx) => {
              const isDone = idx < processingIndex;
              const isCurrent = idx === processingIndex;
              return (
                <div
                  key={stageItem}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    isDone
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : isCurrent
                        ? "border-[#009DFF] bg-[#F3FAFF] text-[#003C8F]"
                        : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {idx + 1}. {stageItem}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {stage === "result" && result && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <article className="vts-card p-6 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
              Resultado do diagnostico
            </p>
            <h2 className="vts-title mt-2 text-2xl font-bold">
              Nivel de maturidade: {result.maturidade}
            </h2>
            <p className="mt-2 text-slate-700">{result.respostaExecutiva}</p>
            <p className="mt-3 rounded-xl bg-[#F3FAFF] px-4 py-3 text-sm text-[#003C8F]">
              Leitura consultiva: sua empresa mostra potencial de evolucao
              rapido se tratar primeiro {result.problemaPrincipal.toLowerCase()}
              .
            </p>
          </article>

          <article className="vts-card p-6">
            <h3 className="vts-title text-lg font-semibold">
              Problema principal
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              {result.problemaPrincipal}
            </p>
          </article>

          <article className="vts-card p-6">
            <h3 className="vts-title text-lg font-semibold">Riscos</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {result.riscos.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <AlertTriangle size={15} className="mt-0.5 text-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="vts-card p-6">
            <h3 className="vts-title text-lg font-semibold">Oportunidades</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {result.oportunidades.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <TrendingUp size={15} className="mt-0.5 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="vts-card p-6 md:col-span-2">
            <h3 className="vts-title text-lg font-semibold">
              Plano inicial de 30 dias
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {result.planoInicial.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 text-[#009DFF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/senha"
                className="inline-flex items-center gap-2 rounded-full bg-[#009DFF] px-5 py-2 text-sm font-semibold text-white"
              >
                Criar senha e continuar <ArrowRight size={15} />
              </Link>
              <Link
                href="/assinatura"
                className="inline-flex items-center gap-2 rounded-full border border-[#009DFF] bg-white px-5 py-2 text-sm font-semibold text-[#003C8F]"
              >
                Ir para assinatura
              </Link>
            </div>
          </article>
        </motion.section>
      )}
    </main>
  );
}
