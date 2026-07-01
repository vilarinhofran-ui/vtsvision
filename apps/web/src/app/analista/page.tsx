"use client";

import { FormEvent, useState } from "react";

type AnalystResponse = {
  resumoExecutivo: string;
  respostaConsultiva: string;
  riscos: string[];
  oportunidades: string[];
  acoes30Dias: string[];
};

export default function AnalistaPage() {
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState<AnalystResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/virtual-analyst/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: "cliente_demo",
            faturamento: 150000,
            lucro: 21000,
            custoMedio: 104000,
            perguntas: [
              pergunta || "Onde estou perdendo dinheiro?",
              "Qual e minha maior oportunidade de lucro?",
            ],
          }),
        },
      );

      const data = (await response.json()) as AnalystResponse;
      setResposta(data);
    } catch {
      setResposta({
        resumoExecutivo: "Seu faturamento subiu, mas sua margem pode melhorar.",
        respostaConsultiva:
          "Voce esta vendendo mais, porem parte do lucro esta sendo consumida por custo medio alto.",
        riscos: [
          "Margem abaixo do ideal.",
          "Dependencia de poucos produtos para gerar caixa.",
          "Falta de rotina semanal de decisao.",
        ],
        oportunidades: [
          "Ajustar preco dos itens de baixa margem.",
          "Priorizar produtos com maior retorno.",
          "Renegociar custo de compra dos itens de maior giro.",
        ],
        acoes30Dias: [
          "Revisar top 20 produtos por margem.",
          "Criar meta semanal de lucro.",
          "Acompanhar custo medio toda segunda-feira.",
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <section className="vts-card p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
          Analista Virtual VTS Vision
        </p>
        <h1 className="vts-title mt-2 text-3xl font-bold">
          Converse com seu consultor virtual
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Pergunte em linguagem simples. A IA responde com foco em acao e
          resultado.
        </p>

        <form className="mt-5 flex gap-2" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2"
            placeholder="Ex.: Onde estou perdendo dinheiro?"
            value={pergunta}
            onChange={(event) => setPergunta(event.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#009DFF] px-5 py-2 font-semibold text-white disabled:opacity-70"
          >
            {loading ? "Analisando..." : "Perguntar"}
          </button>
        </form>
      </section>

      {resposta && (
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="vts-card p-6 md:col-span-2">
            <h2 className="vts-title text-xl font-semibold">
              Leitura executiva
            </h2>
            <p className="mt-2 text-slate-700">{resposta.resumoExecutivo}</p>
            <p className="mt-2 text-slate-600">{resposta.respostaConsultiva}</p>
          </article>

          <article className="vts-card p-6">
            <h3 className="vts-title text-lg font-semibold">3 riscos</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {resposta.riscos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="vts-card p-6">
            <h3 className="vts-title text-lg font-semibold">3 oportunidades</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {resposta.oportunidades.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="vts-card p-6 md:col-span-2">
            <h3 className="vts-title text-lg font-semibold">
              Acoes para os proximos 30 dias
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {resposta.acoes30Dias.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      )}
    </main>
  );
}
