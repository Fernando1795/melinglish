import Link from 'next/link'
import { DEMO_LEVELS } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Penguin from '@/components/Penguin'
import { BookOpen, Zap, ChevronRight } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="space-y-8">
      {/* Bienvenida demo */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl p-8 text-white text-center">
        <Penguin mood="wave" size={120} className="mx-auto mb-4" />
        <h1 className="text-3xl font-black mb-2">¡Hola! Soy Pingu 🐧</h1>
        <p className="text-blue-100 font-semibold text-lg">
          Tu guía para aprender inglés de manera autodidacta
        </p>
        <p className="text-blue-200 font-medium mt-2 text-sm">
          Estás en modo demo — explora todo sin necesitar cuenta
        </p>
      </div>

      {/* Niveles disponibles */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-4">📚 Niveles disponibles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {DEMO_LEVELS.map(level => (
            <Link key={level.id} href={`/demo/levels/${level.id}`}>
              <div className="bg-white rounded-3xl border-2 border-blue-200 p-6 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <Badge className="bg-blue-100 text-blue-700 font-black text-base px-4 py-1">
                    Nivel {level.id}
                  </Badge>
                  <ChevronRight className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{level.title}</h3>
                <p className="text-gray-500 font-medium text-sm mb-4">{level.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {level.modules.length} módulos
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {level.total_hours}h contenido
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* A2 próximamente */}
          <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center opacity-60">
            <Badge className="bg-gray-100 text-gray-500 font-black text-base px-4 py-1 mb-3">Nivel A2</Badge>
            <p className="font-bold text-gray-400">🔜 Próximamente</p>
            <p className="text-gray-400 text-sm font-medium mt-1">En desarrollo</p>
          </div>
        </div>
      </div>

      {/* CTA crear cuenta */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl p-8 text-white text-center">
        <h3 className="text-2xl font-black mb-2">¿Te gustó? 🎉</h3>
        <p className="text-orange-100 font-medium mb-6">
          Crea tu cuenta para guardar tu progreso, ganar estrellas y desbloquear todo el contenido
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/register">
            <Button className="font-black bg-white text-orange-600 hover:bg-orange-50 rounded-2xl px-8 py-5 text-lg">
              Crear cuenta gratis
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="font-black border-2 border-white text-white hover:bg-white/20 rounded-2xl px-8 py-5 text-lg">
              Ver planes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
