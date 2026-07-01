export default function RetencaoPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
      <section className="vts-card p-8">
        <h1 className="vts-title text-3xl font-bold">
          Relatorio mensal automatico
        </h1>
        <p className="mt-2 text-slate-600">
          Todo mes o VTS Vision gera novo resumo executivo, novos insights,
          comparacao com mes anterior e plano atualizado.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">Resumo executivo</h2>
          <p className="mt-2 text-sm text-slate-700">
            Seu faturamento subiu 8%, porem sua margem caiu 1,7 ponto. O foco do
            proximo ciclo e recuperar lucro por produto.
          </p>
        </article>

        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">Plano atualizado</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            <li>Revisar itens com baixa margem toda semana.</li>
            <li>Ativar alerta para queda de receita acima de 5%.</li>
            <li>Comparar desempenho por categoria com o mes anterior.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
