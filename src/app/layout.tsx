import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Lista de Mercado da Semana - Simples & Rápida",
  description: "Monte sua lista de compras de forma fácil com apenas um toque e envie diretamente pelo WhatsApp.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full antialiased font-sans`}>
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-200">
        {children}
      </body>
    </html>
  );
}
