"use client";

import { FormEvent, useState } from "react";

type BenchmarkData = {
  segmento: string;
  margemAtual: number;
  mediaSegmento: number;
  leitura: string;
  gap: number;
};

export default function BenchmarkPage() {
  const [segmento, setSegmento] = useState("Comercio");
  const [margem, setMargem] = useState("18");
  const [resultado, setResultado] = useState<BenchmarkData | null>(null);

  async function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/benchmark?segmento=${encodeURIComponent(segmento)}&margem=${encodeURIComponent(margem)}`,
      );
      const data = (await response.json()) as BenchmarkData;
      setResultado(data);
    } catch {
      setResultado({
        segmento,
        margemAtual: Number(margem),
        mediaSegmento: 26,
        leitura:
          "Voce esta abaixo da media. Existe espaco para aumentar lucro.",
        gap: 8,
      });
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12">
      <section className="vts-card p-8">
        <h1 className="vts-title text-3xl font-bold">Benchmark</h1>
        <p className="mt-2 text-slate-600">
          Compare sua empresa com negocios parecidos do mesmo segmento.
        </p>

        <form
          className="mt-6 grid gap-3 md:grid-cols-2"
          onSubmit={handleCompare}
        >
          <label className="text-sm text-slate-700">
            Segmento
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={segmento}
              onChange={(event) => setSegmento(event.target.value)}
            />
          </label>
          <label className="text-sm text-slate-700">
            Sua margem (%)
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={margem}
              onChange={(event) => setMargem(event.target.value)}
            />
          </label>

          <button
            className="rounded-xl bg-[#009DFF] px-4 py-2 font-semibold text-white md:col-span-2"
            type="submit"
          >
            Comparar agora
          </button>
        </form>
      </section>

      {resultado && (
        <section className="vts-card mt-6 p-6 text-sm text-slate-700">
          <p>
            Sua margem: <strong>{resultado.margemAtual}%</strong>
          </p>
          <p>
            Media do segmento: <strong>{resultado.mediaSegmento}%</strong>
          </p>
          <p className="mt-2">{resultado.leitura}</p>
          <p className="mt-2">Gap atual: {resultado.gap} pontos percentuais.</p>
        </section>
      )}
    </main>
  );
}
