"use client";

import { useEffect, useState } from "react";

type AlertsResponse = {
  totalAtivos: number;
  itens: string[];
};

export default function AlertasPage() {
  const [dados, setDados] = useState<AlertsResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "http://localhost:3001/alerts?customerId=cliente_demo",
        );
        const data = (await response.json()) as AlertsResponse;
        setDados(data);
      } catch {
        setDados({
          totalAtivos: 6,
          itens: [
            "Margem caiu",
            "Estoque critico",
            "Receita caiu",
            "Lucro negativo",
            "Meta distante",
            "Concentracao de clientes",
          ],
        });
      }
    }

    void load();
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <section className="vts-card p-8">
        <h1 className="vts-title text-3xl font-bold">Alertas inteligentes</h1>
        <p className="mt-2 text-slate-600">
          Avisos automativos para agir antes do problema crescer.
        </p>
        <p className="mt-4 rounded-xl bg-[#F3FAFF] px-4 py-2 text-sm font-semibold text-[#003C8F]">
          {dados
            ? `${dados.totalAtivos} alertas ativos no momento`
            : "Carregando alertas..."}
        </p>
      </section>

      <section className="mt-6 grid gap-3">
        {(dados?.itens ?? []).map((item) => (
          <article key={item} className="vts-card p-4 text-sm text-slate-700">
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}
