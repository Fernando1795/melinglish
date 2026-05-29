import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Melinglish — Aprende Inglés",
  description: "Aprende inglés de forma divertida con ejercicios interactivos adaptados a tu nivel.",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased font-nunito">
        {children}
      </body>
    </html>
  )
}
