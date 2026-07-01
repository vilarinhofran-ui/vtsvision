"use client";

import { useEffect, useState } from "react";

type Overview = {
  clientesAtivos: number;
  assinaturasAtivas: number;
  inadimplentes: number;
  ticketsAbertos: number;
  processamentoIaHoje: number;
};

export default function AdminPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [payments, setPayments] = useState<
    { cliente: string; plano: string; status: string }[]
  >([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
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
      } catch {
        setOverview({
          clientesAtivos: 128,
          assinaturasAtivas: 111,
          inadimplentes: 7,
          ticketsAbertos: 12,
          processamentoIaHoje: 94,
        });
      }
    }

    void load();
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
      <section className="vts-card p-8">
        <h1 className="vts-title text-3xl font-bold">Painel administrador</h1>
        <p className="mt-2 text-slate-600">
          Gerencie clientes, pagamentos, planos, segmentos, usuarios e
          monitoramento.
        </p>
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
