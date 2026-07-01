"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../lib/supabase";

type FormData = {
  nome: string;
  empresa: string;
  whatsapp: string;
  email: string;
  cep: string;
  estado: string;
  cidade: string;
  rua: string;
  bairro: string;
  numero: string;
  complemento: string;
  senha: string;
};

const initialData: FormData = {
  nome: "",
  empresa: "",
  whatsapp: "",
  email: "",
  cep: "",
  estado: "",
  cidade: "",
  rua: "",
  bairro: "",
  numero: "",
  complemento: "",
  senha: "",
};

const STORAGE_KEY = "vts:cadastrar:draft";

type FieldErrors = Partial<Record<keyof FormData, string>>;

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<FormData>;
      setForm((prev) => ({ ...prev, ...parsed }));
      setDraftLoaded(true);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  async function handleCepBlur() {
    const cep = form.cep.replace(/\D/g, "");
    if (!cep) return;

    if (cep.length !== 8) {
      setFieldErrors((prev) => ({
        ...prev,
        cep: "CEP deve conter 8 digitos.",
      }));
      return;
    }

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.cep;
      return next;
    });

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      setForm((prev) => ({
        ...prev,
        estado: data.uf || "",
        cidade: data.localidade || "",
        rua: data.logradouro || "",
        bairro: data.bairro || "",
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        cep: "CEP nao encontrado. Confira e tente novamente.",
      }));
    }
  }

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const completionRate = useMemo(() => {
    const requiredFields: (keyof FormData)[] = [
      "nome",
      "empresa",
      "whatsapp",
      "email",
      "cep",
      "estado",
      "cidade",
      "rua",
      "bairro",
      "numero",
      "senha",
    ];
    const done = requiredFields.filter(
      (field) => form[field].trim().length > 0,
    ).length;
    return Math.round((done / requiredFields.length) * 100);
  }, [form]);

  function validateForm() {
    const errors: FieldErrors = {};

    if (form.nome.trim().length < 3) errors.nome = "Informe nome completo.";
    if (form.empresa.trim().length < 2)
      errors.empresa = "Informe nome da empresa.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Email invalido.";
    if (form.senha.length < 6)
      errors.senha = "Senha deve ter ao menos 6 caracteres.";
    if (form.whatsapp.replace(/\D/g, "").length < 10) {
      errors.whatsapp = "WhatsApp invalido.";
    }
    if (form.cep && form.cep.replace(/\D/g, "").length !== 8) {
      errors.cep = "CEP deve conter 8 digitos.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
    setForm(initialData);
    setFieldErrors({});
    setDraftLoaded(false);
    setMessage("Rascunho limpo. Voce pode recomecar o cadastro.");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");

    if (!validateForm()) {
      setErrorMessage("Revise os campos destacados para continuar.");
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: {
            nome: form.nome,
            empresa: form.empresa,
            whatsapp: form.whatsapp,
            endereco: {
              cep: form.cep,
              estado: form.estado,
              cidade: form.cidade,
              rua: form.rua,
              bairro: form.bairro,
              numero: form.numero,
              complemento: form.complemento,
            },
          },
        },
      });

      if (error) {
        setErrorMessage(
          "Nao foi possivel criar sua conta. Verifique os dados.",
        );
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      setMessage("Conta criada com sucesso. Redirecionando para login...");
      router.push("/login?registered=1");
    } catch {
      setErrorMessage(
        "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="module-shell module-cadastro mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="vts-logo-frame p-1.5">
          <Image
            src="/vts-logo.png"
            alt="VTS Vision"
            width={56}
            height={56}
            className="rounded-lg"
            priority
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#003C8F]">
            VTS Vision
          </p>
          <p className="text-xs text-slate-500">
            Ativacao da conta empresarial
          </p>
        </div>
      </div>

      <h1 className="vts-title text-3xl font-bold">Cadastro</h1>
      <p className="mt-2 text-slate-600">
        Preencha o basico para liberar seu diagnostico inteligente.
      </p>

      <section className="vts-card module-panel mt-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Progresso do cadastro
            </p>
            <p className="text-xs text-slate-500">
              {completionRate}% concluido
              {draftLoaded ? " - retomado automaticamente" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
          >
            Limpar rascunho
          </button>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-[#009DFF]"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </section>

      {message && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <form
        className="vts-card module-panel mt-8 grid gap-4 p-6 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        {[
          ["nome", "Nome"],
          ["empresa", "Empresa"],
          ["whatsapp", "WhatsApp"],
          ["email", "Email"],
          ["cep", "CEP"],
          ["estado", "Estado"],
          ["cidade", "Cidade"],
          ["rua", "Rua"],
          ["bairro", "Bairro"],
          ["numero", "Numero"],
          ["complemento", "Complemento"],
          ["senha", "Senha"],
        ].map(([field, label]) => (
          <label
            key={field}
            className="flex flex-col gap-1 text-sm text-slate-700"
          >
            {label}
            <input
              type={field === "senha" ? "password" : "text"}
              value={form[field as keyof FormData]}
              onChange={(event) =>
                updateField(field as keyof FormData, event.target.value)
              }
              onBlur={field === "cep" ? handleCepBlur : undefined}
              required={
                field === "email" ||
                field === "nome" ||
                field === "empresa" ||
                field === "senha"
              }
              minLength={field === "senha" ? 6 : undefined}
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-[#009DFF]"
            />
            {fieldErrors[field as keyof FormData] && (
              <span className="text-xs font-medium text-red-600">
                {fieldErrors[field as keyof FormData]}
              </span>
            )}
          </label>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#009DFF] px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </div>
      </form>
    </main>
  );
}
