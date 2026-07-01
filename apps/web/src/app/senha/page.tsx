"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [termos, setTermos] = useState(false);
  const [lgpd, setLgpd] = useState(false);
  const [privacidade, setPrivacidade] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("Use ao menos 6 caracteres na senha.");
      return;
    }

    if (senha !== confirmar) {
      setErro("As senhas precisam ser iguais.");
      return;
    }

    if (!termos || !lgpd || !privacidade) {
      setErro("Voce precisa aceitar os termos para continuar.");
      return;
    }

    try {
      await fetch("http://localhost:3001/onboarding/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "cliente_demo",
          senha,
          aceitarTermos: termos ? "sim" : "nao",
          aceitarLgpd: lgpd ? "sim" : "nao",
          aceitarPrivacidade: privacidade ? "sim" : "nao",
        }),
      });
    } catch {
      // fluxo local segue normalmente
    }

    router.push("/assinatura");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-12">
      <section className="vts-card p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
          Etapa 4 de 6
        </p>
        <h1 className="vts-title mt-2 text-3xl font-bold">Criar senha</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sua conta esta quase pronta. Falta so proteger seu acesso.
        </p>

        {erro && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            Senha
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm text-slate-700">
            Confirmar senha
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              type="password"
              value={confirmar}
              onChange={(event) => setConfirmar(event.target.value)}
              required
            />
          </label>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={termos}
              onChange={() => setTermos((v) => !v)}
            />
            <span>Aceito os Termos de Uso.</span>
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={lgpd}
              onChange={() => setLgpd((v) => !v)}
            />
            <span>Aceito as regras da LGPD.</span>
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={privacidade}
              onChange={() => setPrivacidade((v) => !v)}
            />
            <span>Aceito a Politica de Privacidade.</span>
          </label>

          <button
            className="w-full rounded-xl bg-[#009DFF] px-4 py-2 font-semibold text-white"
            type="submit"
          >
            Continuar para assinatura
          </button>
        </form>

        <Link
          href="/diagnostico"
          className="mt-5 inline-block text-sm font-semibold text-[#003C8F]"
        >
          Voltar ao diagnostico
        </Link>
      </section>
    </main>
  );
}
