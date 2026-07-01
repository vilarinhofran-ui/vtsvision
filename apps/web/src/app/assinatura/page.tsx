"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { planos } from "../../lib/vts-data";

type Gateway = "stripe" | "mercado_pago" | "asaas";
type Metodo = "pix" | "cartao";

export default function AssinaturaPage() {
  const router = useRouter();
  const [plano, setPlano] = useState("Business");
  const [gateway, setGateway] = useState<Gateway>("stripe");
  const [metodo, setMetodo] = useState<Metodo>("pix");
  const [loading, setLoading] = useState(false);

  const planoEscolhido = useMemo(
    () => planos.find((item) => item.nome === plano) ?? planos[1],
    [plano],
  );

  async function iniciarAssinatura() {
    setLoading(true);

    try {
      await fetch("http://localhost:3001/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "cliente_demo",
          plano,
          gateway,
          metodo,
        }),
      });
    } catch {
      // segue fluxo local
    } finally {
      setLoading(false);
      router.push("/importar");
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
      <section className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
          Etapa 5 de 6
        </p>
        <h1 className="vts-title mt-2 text-3xl font-bold">Ativar assinatura</h1>
        <p className="mt-2 text-slate-600">
          Recomendamos o plano Business para liberar IA completa e alertas
          automaticos.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {planos.map((item) => (
          <button
            key={item.nome}
            onClick={() => setPlano(item.nome)}
            className={`vts-card p-5 text-left ${plano === item.nome ? "border-[#009DFF]" : ""}`}
            type="button"
          >
            <p className="vts-title text-xl font-semibold">{item.nome}</p>
            <p className="mt-1 text-lg font-bold text-[#003C8F]">
              {item.preco}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {item.itens.map((linha) => (
                <li key={linha}>{linha}</li>
              ))}
            </ul>
          </button>
        ))}
      </section>

      <section className="vts-card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          Gateway de pagamento
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={gateway}
            onChange={(event) => setGateway(event.target.value as Gateway)}
          >
            <option value="stripe">Stripe</option>
            <option value="mercado_pago">Mercado Pago</option>
            <option value="asaas">Asaas</option>
          </select>
        </label>

        <label className="text-sm text-slate-700">
          Metodo
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={metodo}
            onChange={(event) => setMetodo(event.target.value as Metodo)}
          >
            <option value="pix">Pix</option>
            <option value="cartao">Cartao</option>
          </select>
        </label>

        <div className="rounded-2xl bg-[#F3FAFF] p-4 text-sm text-slate-700 md:col-span-2">
          <p className="font-semibold">Resumo</p>
          <p className="mt-1">Plano: {planoEscolhido.nome}</p>
          <p>Valor: {planoEscolhido.preco}</p>
          <p>Garantia: 7 dias. Depois, cobranca automatica a cada 30 dias.</p>
        </div>

        <button
          onClick={iniciarAssinatura}
          disabled={loading}
          className="rounded-xl bg-[#009DFF] px-5 py-2 font-semibold text-white disabled:opacity-70 md:col-span-2"
          type="button"
        >
          {loading ? "Ativando..." : "Ativar e continuar"}
        </button>
      </section>

      <Link
        href="/senha"
        className="mt-5 inline-block text-sm font-semibold text-[#003C8F]"
      >
        Voltar
      </Link>
    </main>
  );
}
