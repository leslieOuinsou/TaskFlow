import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Taskflow - Gestion de Tâches",
  description: "Application professionnelle de gestion de demandes internes.",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${openSans.variable} font-sans antialiased text-brand-text`}>
        <Sidebar />
        <main className="min-h-screen bg-brand-bg lg:ml-72 pt-14 lg:pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
