"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarRange,
  Gauge,
  Lightbulb,
  ShieldAlert,
  Target,
  Upload,
  LogOut,
  Wallet,
} from "lucide-react";
import { getSupabaseClient } from "../../lib/supabase";
import { useProtectedUser } from "../../lib/use-protected-user";
import { clearDemoAccess } from "../../lib/auth-session";
import { AppTopNav } from "../../components/app-top-nav";

type RawRow = Record<string, unknown>;
type ProcessedRow = {
  mes: string;
  faturamento: number;
  lucro: number;
  categoria: string;
};

type RevenuePoint = {
  mes: string;
  faturamento: number;
  lucro: number;
};

type CategoryPoint = {
  categoria: string;
  margem: number;
};

const defaultRevenueData: RevenuePoint[] = [
  { mes: "Jan", faturamento: 124000, lucro: 19800 },
  { mes: "Fev", faturamento: 132000, lucro: 20600 },
  { mes: "Mar", faturamento: 128500, lucro: 17800 },
  { mes: "Abr", faturamento: 139800, lucro: 22400 },
  { mes: "Mai", faturamento: 151200, lucro: 25100 },
  { mes: "Jun", faturamento: 148900, lucro: 23900 },
];

const defaultCategoryData: CategoryPoint[] = [
  { categoria: "Linha A", margem: 24 },
  { categoria: "Linha B", margem: 16 },
  { categoria: "Linha C", margem: 31 },
  { categoria: "Linha D", margem: 12 },
  { categoria: "Linha E", margem: 27 },
];

const monthNames: Record<string, string> = {
  "01": "Jan",
  "02": "Fev",
  "03": "Mar",
  "04": "Abr",
  "05": "Mai",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Set",
  "10": "Out",
  "11": "Nov",
  "12": "Dez",
};

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseNumber(input: unknown): number {
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;
  if (typeof input !== "string") return 0;

  const sanitized = input
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const numeric = Number(sanitized.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function asString(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function getMonthLabel(rawDate: unknown): string {
  const value = asString(rawDate);
  if (!value) return "Sem mes";

  const direct = /^\d{4}-\d{2}/.exec(value);
  if (direct) {
    const code = value.slice(5, 7);
    return monthNames[code] ?? value.slice(0, 7);
  }

  const brDate = /^\d{2}\/\d{2}\/\d{4}$/.test(value);
  if (brDate) {
    const code = value.slice(3, 5);
    return monthNames[code] ?? value;
  }

  return value.slice(0, 3).toUpperCase() + value.slice(3);
}

function getValueFromCandidates(row: RawRow, candidates: string[]) {
  const entries = Object.entries(row);
  for (const [key, value] of entries) {
    const normalized = normalizeKey(key);
    if (candidates.some((candidate) => normalized.includes(candidate))) {
      return value;
    }
  }
  return undefined;
}

function processRows(rows: RawRow[]): ProcessedRow[] {
  return rows
    .map((row) => {
      const dateRaw = getValueFromCandidates(row, [
        "data",
        "mes",
        "periodo",
        "month",
      ]);
      const revenueRaw = getValueFromCandidates(row, [
        "faturamento",
        "receita",
        "valor",
        "venda",
        "total",
        "amount",
      ]);
      const profitRaw = getValueFromCandidates(row, ["lucro", "profit"]);
      const costRaw = getValueFromCandidates(row, ["custo", "cost"]);
      const categoryRaw = getValueFromCandidates(row, [
        "categoria",
        "produto",
        "linha",
        "grupo",
        "category",
      ]);

      const faturamento = parseNumber(revenueRaw);
      const lucro =
        profitRaw !== undefined
          ? parseNumber(profitRaw)
          : faturamento - parseNumber(costRaw);
      const mes = getMonthLabel(dateRaw);
      const categoria = asString(categoryRaw) || "Sem categoria";

      return { mes, faturamento, lucro, categoria };
    })
    .filter((row) => row.faturamento > 0);
}

function formatMoney(value: number) {
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

function formatPercent(value: number) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, configError } = useProtectedUser();
  const [rows, setRows] = useState<ProcessedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [serverInfo, setServerInfo] = useState("");

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
    const saved = localStorage.getItem("vts-dashboard-rows");
    const savedFile = localStorage.getItem("vts-dashboard-file");

    if (saved) {
      try {
        setRows(JSON.parse(saved) as ProcessedRow[]);
      } catch {
        setRows([]);
      }
    }

    if (savedFile) {
      setFileName(savedFile);
    }
  }, []);

  useEffect(() => {
    async function loadLatestDatasetFromServer() {
      if (!user?.id) return;

      const hasLocalData = localStorage.getItem("vts-dashboard-rows");
      if (hasLocalData) return;

      try {
        const response = await fetch(
          `http://localhost:3001/datasets/latest?customerId=${encodeURIComponent(user.id)}`,
        );
        if (!response.ok) return;

        const latest = (await response.json()) as {
          fileName: string;
          rowCount: number;
          rows: ProcessedRow[];
        };

        if (!Array.isArray(latest.rows) || !latest.rows.length) return;

        setRows(latest.rows);
        setFileName(latest.fileName);
        setServerInfo(`Dataset recuperado do servidor: ${latest.fileName}`);
      } catch {
        // Sem backend disponivel: mantem fluxo local
      }
    }

    void loadLatestDatasetFromServer();
  }, [user?.id]);

  const revenueData = useMemo<RevenuePoint[]>(() => {
    if (!rows.length) return defaultRevenueData;

    const grouped = new Map<string, { faturamento: number; lucro: number }>();
    for (const row of rows) {
      const current = grouped.get(row.mes) ?? { faturamento: 0, lucro: 0 };
      current.faturamento += row.faturamento;
      current.lucro += row.lucro;
      grouped.set(row.mes, current);
    }

    return Array.from(grouped.entries()).map(([mes, values]) => ({
      mes,
      faturamento: Math.round(values.faturamento),
      lucro: Math.round(values.lucro),
    }));
  }, [rows]);

  const categoryData = useMemo<CategoryPoint[]>(() => {
    if (!rows.length) return defaultCategoryData;

    const grouped = new Map<string, { faturamento: number; lucro: number }>();
    for (const row of rows) {
      const current = grouped.get(row.categoria) ?? {
        faturamento: 0,
        lucro: 0,
      };
      current.faturamento += row.faturamento;
      current.lucro += row.lucro;
      grouped.set(row.categoria, current);
    }

    return Array.from(grouped.entries())
      .map(([categoria, values]) => {
        const margem =
          values.faturamento > 0
            ? (values.lucro / values.faturamento) * 100
            : 0;
        return { categoria, margem: Number(margem.toFixed(1)) };
      })
      .sort((a, b) => b.margem - a.margem)
      .slice(0, 8);
  }, [rows]);

  const totals = useMemo(() => {
    const faturamento = revenueData.reduce(
      (sum, point) => sum + point.faturamento,
      0,
    );
    const lucro = revenueData.reduce((sum, point) => sum + point.lucro, 0);
    const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0;

    const last = revenueData[revenueData.length - 1];
    const previous = revenueData[revenueData.length - 2];
    const growth =
      previous && previous.faturamento > 0
        ? ((last.faturamento - previous.faturamento) / previous.faturamento) *
          100
        : 0;

    return { faturamento, lucro, margem, growth };
  }, [revenueData]);

  const lowestCategory = categoryData[categoryData.length - 1];
  const highestCategory = categoryData[0];
  const criticalMarginGap = Math.max(0, 20 - totals.margem);
  const recoveryPotential = Math.max(
    0,
    totals.faturamento * (criticalMarginGap / 100),
  );
  const weeklyFocusPercent = Math.min(
    100,
    Math.max(35, Math.round(100 - criticalMarginGap * 4)),
  );

  const kpis = [
    {
      titulo: "Faturamento",
      valor: formatMoney(totals.faturamento),
      detalhe: `${totals.growth >= 0 ? "+" : ""}${totals.growth.toFixed(1).replace(".", ",")}% vs mes anterior`,
      icon: Wallet,
    },
    {
      titulo: "Lucro",
      valor: formatMoney(totals.lucro),
      detalhe: "Resultado acumulado no periodo enviado",
      icon: ArrowUpRight,
    },
    {
      titulo: "Margem",
      valor: formatPercent(totals.margem),
      detalhe:
        totals.margem >= 20
          ? "Acima de 20% (bom nivel)"
          : "Abaixo de 20% (ponto de atencao)",
      icon: Gauge,
    },
  ];

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user?.id) {
      setServerInfo(
        "Sessao invalida. Faca login novamente para salvar no servidor.",
      );
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<RawRow>(firstSheet, { defval: "" });

      const processed = processRows(data);
      if (!processed.length) {
        setMessage(
          "Nao encontrei colunas validas. Use cabecalhos como Data, Faturamento, Lucro/Custo e Categoria.",
        );
        return;
      }

      setRows(processed);
      setFileName(file.name);
      setMessage(`Arquivo ${file.name} carregado com sucesso.`);
      localStorage.setItem("vts-dashboard-rows", JSON.stringify(processed));
      localStorage.setItem("vts-dashboard-file", file.name);

      try {
        const saveResponse = await fetch("http://localhost:3001/datasets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: user.id,
            source: "web_upload",
            fileName: file.name,
            rows: processed,
          }),
        });

        if (saveResponse.ok) {
          setServerInfo("Dados tambem salvos no servidor.");
        } else {
          setServerInfo(
            "Dados salvos localmente. Servidor indisponivel no momento.",
          );
        }
      } catch {
        setServerInfo(
          "Dados salvos localmente. Inicie a API para salvar no servidor.",
        );
      }
    } catch {
      setMessage("Nao foi possivel ler o arquivo. Tente CSV, XLSX ou XLS.");
    }
  }

  function clearUploadedData() {
    setRows([]);
    setFileName("");
    setMessage("Dados locais removidos. Voltamos para o modelo demonstrativo.");
    setServerInfo("");
    localStorage.removeItem("vts-dashboard-rows");
    localStorage.removeItem("vts-dashboard-file");
  }

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10">
        <section className="vts-card p-8">
          <p className="text-sm text-slate-600">Validando sua sessao...</p>
        </section>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10">
        <section className="vts-card p-8">
          <p className="text-sm text-red-700">{configError}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="module-shell module-dashboard mx-auto min-h-screen w-full max-w-7xl px-6 py-10">
      <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/75 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="vts-logo-frame p-1">
            <Image
              src="/vts-logo.png"
              alt="VTS Vision"
              width={44}
              height={44}
              className="rounded-lg"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
              VTS Vision
            </p>
            <p className="text-xs text-slate-500">
              Painel de inteligencia empresarial
            </p>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-600">
          Conta ativa: {user?.email ?? "usuario autenticado"}
        </p>
      </section>

      <AppTopNav userEmail={user?.email} onSignOut={handleSignOut} />

      <section className="vts-glass rounded-3xl p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
          Analista Virtual VTS Vision
        </p>
        <h1 className="vts-title mt-2 text-3xl font-bold md:text-4xl">
          {rows.length
            ? "Painel alimentado com seus dados reais"
            : "Seu negocio cresceu em vendas, mas ainda perde margem"}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          {rows.length
            ? "O sistema analisou seu arquivo e atualizou automaticamente indicadores, tendencias e prioridades de acao."
            : "Envie seu CSV ou Excel para substituir os dados de exemplo e receber analise baseada no seu cenario."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#009DFF] px-5 py-3 text-sm font-semibold text-white">
            <Upload size={16} />
            Enviar CSV ou Excel
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={clearUploadedData}
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Limpar dados enviados
          </button>

          {fileName && (
            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600">
              Arquivo atual: {fileName}
            </span>
          )}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Colunas recomendadas: Data, Faturamento, Lucro (ou Custo) e Categoria.
        </p>

        {message && (
          <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
            {message}
          </p>
        )}

        {serverInfo && (
          <p className="mt-3 rounded-xl bg-[#E8F6FF] px-4 py-3 text-sm text-[#003C8F]">
            {serverInfo}
          </p>
        )}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {kpis.map(({ titulo, valor, detalhe, icon: Icon }, index) => (
          <motion.article
            key={titulo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="vts-card p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{titulo}</p>
              <Icon size={18} className="text-[#009DFF]" />
            </div>
            <p className="vts-title mt-4 text-3xl font-bold">{valor}</p>
            <p className="mt-2 text-sm text-slate-600">{detalhe}</p>
          </motion.article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="vts-card overflow-hidden p-0">
          <div className="bg-gradient-to-r from-[#003C8F] to-[#009DFF] px-6 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide">
              Analista Virtual VTS Vision
            </p>
            <h2 className="vts-title mt-1 text-2xl font-semibold">
              Diagnostico de hoje
            </h2>
          </div>
          <div className="space-y-4 p-6">
            <p className="text-sm text-slate-700">
              Seu faturamento esta evoluindo, mas a margem ainda nao acompanha o
              ritmo. O principal motivo esta na categoria{" "}
              <strong>{lowestCategory?.categoria ?? "mais sensivel"}</strong>,
              que precisa de revisao de preco e custo.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-[#003C8F]">
                  <ShieldAlert size={16} />
                  <p className="text-xs font-semibold uppercase">Risco</p>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Margem abaixo da meta ideal de 20%.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Target size={16} />
                  <p className="text-xs font-semibold uppercase">
                    Oportunidade
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Potencial de recuperar {formatMoney(recoveryPotential)} no
                  periodo.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <CalendarRange size={16} />
                  <p className="text-xs font-semibold uppercase">
                    Acao da semana
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Revisar os 10 itens de maior venda com menor margem.
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="vts-card p-6">
          <h3 className="vts-title text-lg font-semibold">
            Prioridade de execucao
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Quanto maior este indicador, mais perto da meta de margem voce esta.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-100 p-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#003C8F] to-[#009DFF]"
              style={{ width: `${weeklyFocusPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            {weeklyFocusPercent}% do plano recomendado ja mapeado
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-700">
            <li className="rounded-xl border border-slate-200 p-3">
              1. Ajustar precificacao da categoria{" "}
              {lowestCategory?.categoria ?? "mais critica"}.
            </li>
            <li className="rounded-xl border border-slate-200 p-3">
              2. Direcionar vendas para{" "}
              {highestCategory?.categoria ?? "categoria premium"}.
            </li>
            <li className="rounded-xl border border-slate-200 p-3">
              3. Acompanhar margem diaria dos produtos de maior receita.
            </li>
          </ul>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">
            Evolucao de faturamento e lucro
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Use esse grafico para acompanhar crescimento com qualidade de
            resultado.
          </p>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#009DFF" stopOpacity={0.35} />
                    <stop
                      offset="100%"
                      stopColor="#009DFF"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  formatter={(value) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return `R$ ${numericValue.toLocaleString("pt-BR")}`;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="faturamento"
                  stroke="#009DFF"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="lucro"
                  stroke="#003C8F"
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="vts-card p-6">
          <h2 className="vts-title text-xl font-semibold">
            Margem por categoria
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Priorize categorias acima de 25% e revise as abaixo de 15%.
          </p>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="categoria" />
                <YAxis unit="%" />
                <Tooltip
                  formatter={(value) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return `${numericValue}%`;
                  }}
                />
                <Bar dataKey="margem" fill="#003C8F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="vts-card p-6">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={18} />
            <h3 className="vts-title text-lg font-semibold">3 riscos agora</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              - Categoria mais sensivel:{" "}
              {lowestCategory?.categoria ?? "Linha D"}.
            </li>
            <li>- Queda de margem pode afetar lucro do mes seguinte.</li>
            <li>- Reveja precos e custos nos itens de maior volume.</li>
          </ul>
        </article>

        <article className="vts-card p-6">
          <div className="flex items-center gap-2 text-emerald-600">
            <Lightbulb size={18} />
            <h3 className="vts-title text-lg font-semibold">3 oportunidades</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              - Categoria com melhor margem:{" "}
              {highestCategory?.categoria ?? "Linha C"}.
            </li>
            <li>- Foque ofertas em produtos com maior retorno.</li>
            <li>- Crie meta semanal de margem minima por categoria.</li>
          </ul>
        </article>

        <article className="vts-card p-6">
          <div className="flex items-center gap-2 text-[#003C8F]">
            <ArrowUpRight size={18} />
            <h3 className="vts-title text-lg font-semibold">
              Acoes para 30 dias
            </h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>- Revisar os 15 produtos de maior faturamento.</li>
            <li>- Monitorar margem semanalmente no painel.</li>
            <li>- Definir alerta para margem abaixo de 15%.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
