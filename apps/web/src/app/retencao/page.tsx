"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../lib/supabase";
import { useProtectedUser } from "../../lib/use-protected-user";
import { clearDemoAccess } from "../../lib/auth-session";
import { AppTopNav } from "../../components/app-top-nav";

export default function RetencaoPage() {
  const router = useRouter();
  const { user, loading, configError } = useProtectedUser();
  const [status, setStatus] = useState("");

  async function handleSignOut() {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // Em modo demo sem Supabase, apenas limpa a sessao local.
    } finally {
      clearDemoAccess();
      router.push("/login");
    }
  }

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
        <section className="vts-card p-8 text-sm text-slate-600">
          Validando sua sessao...
        </section>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
        <section className="vts-card p-8 text-sm text-red-700">
          {configError}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
      <AppTopNav userEmail={user?.email} onSignOut={handleSignOut} />

      <section className="vts-card p-8">
        <h1 className="vts-title text-3xl font-bold">
          Relatorio mensal automatico
        </h1>
        <p className="mt-2 text-slate-600">
          Todo mes o VTS Vision gera novo resumo executivo, novos insights,
          comparacao com mes anterior e plano atualizado.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setStatus("Novo relatorio mensal gerado com sucesso.")
            }
            className="rounded-xl bg-[#009DFF] px-4 py-2 text-sm font-semibold text-white"
          >
            Gerar novo relatorio
          </button>
          <button
            type="button"
            onClick={() =>
              setStatus("Resumo executivo compartilhado com a equipe.")
            }
            className="rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
          >
            Compartilhar resumo
          </button>
        </div>
        {status && (
          <p className="mt-3 rounded-xl bg-[#E8F6FF] px-4 py-2 text-sm text-[#003C8F]">
            {status}
          </p>
        )}
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
