"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { getSupabaseClient } from "../../lib/supabase";
import { setAuthCookie } from "../../lib/auth-session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(() => {
    if (typeof window === "undefined") return false;
    const query = new URLSearchParams(window.location.search);
    return query.get("registered") === "1";
  });
  const [nextPath, setNextPath] = useState(() => {
    if (typeof window === "undefined") return "/importar";
    const query = new URLSearchParams(window.location.search);
    const requestedPath = query.get("next");
    return requestedPath && requestedPath.startsWith("/")
      ? requestedPath
      : "/importar";
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setRegistrationSuccess(query.get("registered") === "1");

    const requestedPath = query.get("next");
    if (requestedPath && requestedPath.startsWith("/")) {
      setNextPath(requestedPath);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setErrorMessage("Nao foi possivel entrar. Confira e-mail e senha.");
        return;
      }

      setAuthCookie();
      router.push(nextPath);
    } catch {
      setErrorMessage(
        "Configure o Supabase no arquivo .env.local para usar o login real.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="module-shell module-login mx-auto min-h-screen w-full max-w-md px-6 py-14">
      <section className="vts-card module-panel p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="vts-logo-frame p-1.5">
            <Image
              src="/vts-logo.png"
              alt="VTS Vision"
              width={52}
              height={52}
              className="rounded-lg"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
              VTS Vision
            </p>
            <p className="text-xs text-slate-500">Acesso seguro ao painel</p>
          </div>
        </div>

        <h1 className="vts-title mt-2 text-3xl font-bold">
          Bem-vindo de volta
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Acesse sua conta para continuar sua analise.
        </p>

        {registrationSuccess && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Conta criada com sucesso. Agora faca login.
          </p>
        )}

        {errorMessage && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            E-mail
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                className="w-full outline-none"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </label>

          <label className="block text-sm text-slate-700">
            Senha
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                className="w-full outline-none"
                placeholder="********"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                minLength={6}
                required
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#009DFF] px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/cadastro" className="font-semibold text-[#003C8F]">
            Criar conta
          </Link>
          <Link href={nextPath} className="text-slate-500 underline">
            Continuar fluxo
          </Link>
        </div>
      </section>
    </main>
  );
}
