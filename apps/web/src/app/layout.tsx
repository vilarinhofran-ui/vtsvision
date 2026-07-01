import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTS Vision",
  description: "Decida com Dados. Cresca com Visao.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
