"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Bot, LogOut, TrendingUp } from "lucide-react";
import { getSupabaseClient } from "../../lib/supabase";
import { useProtectedUser } from "../../lib/use-protected-user";
import { clearAuthCookie } from "../../lib/auth-session";

const insights = [
  "Seu faturamento aumentou 12% no periodo analisado.",
  "Os produtos A e B representam 48% das vendas totais.",
  "A margem da categoria com maior volume esta abaixo da meta.",
  "Existe potencial de recuperar lucro ajustando preco e mix.",
];

export default function InsightsPage() {
  const router = useRouter();
  const { user, loading, configError } = useProtectedUser();

  async function handleSignOut() {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } finally {
      clearAuthCookie();
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
      <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-600">
          Conta ativa: {user?.email ?? "usuario autenticado"}
        </p>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          <LogOut size={14} /> Sair
        </button>
      </section>

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
          {insights.map((insight) => (
            <article
              key={insight}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
            >
              {insight}
            </article>
          ))}
        </div>

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
