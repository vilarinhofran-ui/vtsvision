"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../lib/supabase";
import { useProtectedUser } from "../../lib/use-protected-user";
import { clearDemoAccess } from "../../lib/auth-session";
import { AppTopNav } from "../../components/app-top-nav";

type Overview = {
  clientesAtivos: number;
  assinaturasAtivas: number;
  inadimplentes: number;
  ticketsAbertos: number;
  processamentoIaHoje: number;
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, configError } = useProtectedUser();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [payments, setPayments] = useState<
    { cliente: string; plano: string; status: string }[]
  >([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  async function loadOverview() {
    try {
      const [o, p, l] = await Promise.all([
        fetch("http://localhost:3001/admin/overview"),
        fetch("http://localhost:3001/admin/payments"),
        fetch("http://localhost:3001/admin/logs"),
      ]);

      setOverview((await o.json()) as Overview);
      setPayments(
        (await p.json()) as {
          cliente: string;
          plano: string;
          status: string;
        }[],
      );
      setLogs((await l.json()) as string[]);
      setStatusMessage("Painel admin atualizado com sucesso.");
    } catch {
      setOverview({
        clientesAtivos: 128,
        assinaturasAtivas: 111,
        inadimplentes: 7,
        ticketsAbertos: 12,
        processamentoIaHoje: 94,
      });
      setStatusMessage("API indisponivel. Exibindo dados demo do admin.");
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
    void loadOverview();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
        <section className="vts-card p-8 text-sm text-slate-600">
          Validando sua sessao...
        </section>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
        <section className="vts-card p-8 text-sm text-red-700">
          {configError}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
      <AppTopNav userEmail={user?.email} onSignOut={handleSignOut} />

      <section className="vts-card p-8">
        <h1 className="vts-title text-3xl font-bold">Painel administrador</h1>
        <p className="mt-2 text-slate-600">
          Gerencie clientes, pagamentos, planos, segmentos, usuarios e
          monitoramento.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadOverview()}
            className="rounded-xl bg-[#009DFF] px-4 py-2 text-sm font-semibold text-white"
          >
            Atualizar painel
          </button>
          <button
            type="button"
            onClick={() => {
              setPayments((prev) => [
                ...prev,
                {
                  cliente: "Novo Cliente Demo",
                  plano: "Business",
                  status: "pago",
                },
              ]);
              setStatusMessage("Cliente demo cadastrado no painel.");
            }}
            className="rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
          >
            Cadastrar cliente demo
          </button>
          <button
            type="button"
            onClick={() => {
              setLogs((prev) => [
                `[INFO] Plano Starter criado em ${new Date().toLocaleTimeString("pt-BR")}`,
                ...prev,
              ]);
              setStatusMessage("Novo plano demo registrado no log.");
            }}
            className="rounded-xl border border-[#009DFF] px-4 py-2 text-sm font-semibold text-[#003C8F]"
          >
            Criar plano demo
          </button>
        </div>
        {statusMessage && (
          <p className="mt-3 rounded-xl bg-[#E8F6FF] px-4 py-2 text-sm text-[#003C8F]">
            {statusMessage}
          </p>
        )}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-5">
        <article className="vts-card p-4">
          <p className="text-xs">Clientes</p>
          <p className="text-xl font-bold">{overview?.clientesAtivos ?? "-"}</p>
        </article>
        <article className="vts-card p-4">
          <p className="text-xs">Assinaturas</p>
          <p className="text-xl font-bold">
            {overview?.assinaturasAtivas ?? "-"}
          </p>
        </article>
        <article className="vts-card p-4">
          <p className="text-xs">Inadimplentes</p>
          <p className="text-xl font-bold">{overview?.inadimplentes ?? "-"}</p>
        </article>
        <article className="vts-card p-4">
          <p className="text-xs">Tickets</p>
          <p className="text-xl font-bold">{overview?.ticketsAbertos ?? "-"}</p>
        </article>
        <article className="vts-card p-4">
          <p className="text-xs">IA hoje</p>
          <p className="text-xl font-bold">
            {overview?.processamentoIaHoje ?? "-"}
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">Pagamentos</h2>
          <div className="mt-3 space-y-2 text-sm">
            {payments.map((item) => (
              <p key={item.cliente}>
                {item.cliente} - {item.plano} - {item.status}
              </p>
            ))}
          </div>
        </article>

        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">
            Logs e monitoramento
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            {logs.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
