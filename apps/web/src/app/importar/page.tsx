"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cable, Database, FileSpreadsheet, Link2 } from "lucide-react";
import { getSupabaseClient } from "../../lib/supabase";
import { useProtectedUser } from "../../lib/use-protected-user";
import { clearDemoAccess } from "../../lib/auth-session";
import { AppTopNav } from "../../components/app-top-nav";

export default function ImportarPage() {
  const router = useRouter();
  const { user, loading, configError } = useProtectedUser();
  const [integrationInfo, setIntegrationInfo] = useState("");

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
        <h1 className="vts-title text-3xl font-bold">Importar dados</h1>
        <p className="mt-2 text-slate-600">
          Escolha como deseja importar seus dados para gerar o dashboard.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-[#003C8F]">
              <FileSpreadsheet size={18} />
              <p className="font-semibold">Enviar Excel ou CSV</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Use o modulo de upload inteligente no dashboard.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex rounded-xl bg-[#009DFF] px-4 py-2 text-sm font-semibold text-white"
            >
              Abrir dashboard
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-[#003C8F]">
              <Link2 size={18} />
              <p className="font-semibold">Conectar Google Sheets</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Fluxo preparado para integracao com sua conta.
            </p>
            <button
              className="mt-4 rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
              onClick={() =>
                setIntegrationInfo(
                  "Google Sheets conectado em modo demo. Proxima etapa: escolher a planilha e atualizar dados.",
                )
              }
            >
              Conectar conta
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-[#003C8F]">
              <Cable size={18} />
              <p className="font-semibold">Integrar API</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Envie dados de ERP ou CRM por endpoint seguro.
            </p>
            <button
              className="mt-4 rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
              onClick={() =>
                setIntegrationInfo(
                  `Token demo gerado para ${user?.email ?? "cliente"}: vts_demo_${Date.now().toString().slice(-6)}`,
                )
              }
            >
              Gerar token
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-[#003C8F]">
              <Database size={18} />
              <p className="font-semibold">Conectar banco de dados</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Fluxo preparado para PostgreSQL e outros bancos SQL.
            </p>
            <button
              className="mt-4 rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
              onClick={() =>
                setIntegrationInfo(
                  "Conexao de banco iniciada. Informe host, porta, usuario e senha para concluir.",
                )
              }
            >
              Configurar conexao
            </button>
          </article>
        </div>

        {integrationInfo && (
          <p className="mt-5 rounded-xl bg-[#E8F6FF] px-4 py-3 text-sm text-[#003C8F]">
            {integrationInfo}
          </p>
        )}
      </section>
    </main>
  );
}
