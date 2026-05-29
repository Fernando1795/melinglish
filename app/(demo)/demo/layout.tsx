import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar demo */}
      <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/demo" className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-black text-blue-600">Melinglish</span>
            <Badge className="bg-orange-100 text-orange-700 font-bold text-xs">DEMO</Badge>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/demo/levels/A1">
              <span className="font-bold text-sm text-gray-600 hover:text-blue-600 hidden sm:block">📚 Nivel A1</span>
            </Link>
            <Link href="/register">
              <span className="font-bold text-sm text-blue-600 hover:text-blue-800 border-2 border-blue-600 rounded-xl px-3 py-1">
                Crear cuenta real →
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Banner demo */}
      <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm font-bold">
        🎮 Modo Demo — Explora la app sin registrarte · Los ejercicios son 100% reales
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
