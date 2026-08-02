import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Meu Mercado • Lista de Compras da Família",
  description: "Monte e compartilhe sua lista de compras da semana com sua família em tempo real! Fácil, rápido e integrado com WhatsApp.",
  openGraph: {
    title: "🛒 Meu Mercado • Lista da Família",
    description: "Monte e compartilhe sua lista de compras da semana de forma simples e rápida com sua família via WhatsApp!",
    url: "https://mercado-app-alpha.vercel.app",
    siteName: "Meu Mercado",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Meu Mercado App",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#EA580C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full antialiased font-sans`}>
      <body className="min-h-full bg-amber-50/20 text-slate-900 flex flex-col selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}
