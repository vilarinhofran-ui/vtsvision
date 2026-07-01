"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

type AppTopNavProps = {
  userEmail?: string;
  onSignOut?: () => void;
};

const menu = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/importar", label: "Importar" },
  { href: "/insights", label: "Insights" },
  { href: "/analista", label: "Analista" },
  { href: "/alertas", label: "Alertas" },
  { href: "/benchmark", label: "Benchmark" },
  { href: "/retencao", label: "Retencao" },
  { href: "/admin", label: "Admin" },
];

export function AppTopNav({ userEmail, onSignOut }: AppTopNavProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="mb-5 space-y-3">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
        <p className="text-sm font-semibold text-slate-600">
          Conta ativa: {userEmail ?? "usuario autenticado"}
        </p>
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <LogOut size={14} /> Sair
          </button>
        )}
      </section>

      <nav className="flex flex-wrap gap-2">
        {menu.map((item) => {
          const active = isClient && pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active
                  ? "border-[#003C8F] bg-[#003C8F] text-white"
                  : "border-[#009DFF] bg-white text-[#003C8F]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
