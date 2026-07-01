"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Bot, TrendingUp } from "lucide-react";
import { getSupabaseClient } from "../../lib/supabase";
import { useProtectedUser } from "../../lib/use-protected-user";
import { clearDemoAccess } from "../../lib/auth-session";
import { AppTopNav } from "../../components/app-top-nav";

const insights = [
  "Seu faturamento aumentou 12% no periodo analisado.",
  "Os produtos A e B representam 48% das vendas totais.",
  "A margem da categoria com maior volume esta abaixo da meta.",
  "Existe potencial de recuperar lucro ajustando preco e mix.",
];

export default function InsightsPage() {
  const router = useRouter();
  const { user, loading, configError } = useProtectedUser();
  const [insightsAtivos, setInsightsAtivos] = useState(insights);
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
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-14">
        <section className="vts-card p-8 text-sm text-slate-600">
          Validando sua sessao...
        </section>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-14">
        <section className="vts-card p-8 text-sm text-red-700">
          {configError}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-14">
      <AppTopNav userEmail={user?.email} onSignOut={handleSignOut} />

      <section className="vts-card p-8">
        <div className="flex items-center gap-2 text-[#003C8F]">
          <Bot size={18} />
          <p className="text-xs font-semibold uppercase tracking-wide">
            Insights da IA
          </p>
        </div>
        <h1 className="vts-title mt-2 text-3xl font-bold">
          A IA explica seus resultados
        </h1>
        <p className="mt-2 text-slate-600">
          Tudo em linguagem simples e com foco no que fazer agora.
        </p>

        <div className="mt-6 space-y-3">
          {insightsAtivos.map((insight) => (
            <article
              key={insight}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
            >
              {insight}
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setInsightsAtivos((prev) => [prev[1], prev[2], prev[3], prev[0]]);
            setStatus("Insights atualizados com base nos dados mais recentes.");
          }}
          className="mt-5 rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
        >
          Atualizar insights
        </button>

        {status && (
          <p className="mt-3 rounded-xl bg-[#E8F6FF] px-4 py-2 text-sm text-[#003C8F]">
            {status}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#009DFF] px-4 py-2 font-semibold text-white"
          >
            Ver dashboard <ArrowRight size={16} />
          </Link>
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 rounded-xl border border-[#009DFF] px-4 py-2 font-semibold text-[#003C8F]"
          >
            Gerar novo diagnostico <TrendingUp size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
