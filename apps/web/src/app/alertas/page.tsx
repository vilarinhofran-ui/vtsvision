"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../lib/supabase";
import { useProtectedUser } from "../../lib/use-protected-user";
import { clearDemoAccess } from "../../lib/auth-session";
import { AppTopNav } from "../../components/app-top-nav";

type AlertsResponse = {
  totalAtivos: number;
  itens: string[];
};

export default function AlertasPage() {
  const router = useRouter();
  const { user, loading, configError } = useProtectedUser();
  const [dados, setDados] = useState<AlertsResponse | null>(null);
  const [status, setStatus] = useState("");

  async function loadAlerts() {
    try {
      const response = await fetch(
        "http://localhost:3001/alerts?customerId=cliente_demo",
      );
      const data = (await response.json()) as AlertsResponse;
      setDados(data);
      setStatus("Alertas atualizados agora.");
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
      setStatus("API indisponivel. Exibindo alertas demo.");
    }
  }

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

  useEffect(() => {
    void loadAlerts();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
        <section className="vts-card p-8 text-sm text-slate-600">
          Validando sua sessao...
        </section>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
        <section className="vts-card p-8 text-sm text-red-700">
          {configError}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <AppTopNav userEmail={user?.email} onSignOut={handleSignOut} />

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
        <button
          type="button"
          onClick={() => void loadAlerts()}
          className="mt-4 rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
        >
          Atualizar alertas
        </button>
        {status && (
          <p className="mt-3 rounded-xl bg-white px-4 py-2 text-sm text-slate-700">
            {status}
          </p>
        )}
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
