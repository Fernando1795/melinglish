import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DEMO_LEVELS } from '@/lib/demo-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CTACard from '@/components/CTACard'
import { ChevronRight, BookOpen, Clock, Lock } from 'lucide-react'

type Props = { params: Promise<{ levelId: string }> }

// Solo el primer módulo es accesible en el demo
const FREE_DEMO_MODULE_INDEX = 0

export default async function DemoLevelPage({ params }: Props) {
  const { levelId } = await params
  const level = DEMO_LEVELS.find(l => l.id === levelId.toUpperCase())
  if (!level) notFound()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl p-8 text-white">
        <Link href="/demo" className="text-blue-200 hover:text-white font-bold text-sm mb-4 block">
          ← Volver al inicio
        </Link>
        <Badge className="bg-white/20 text-white font-black mb-3">Nivel {level.id}</Badge>
        <h1 className="text-3xl font-black mb-2">{level.title}</h1>
        <p className="text-blue-100 font-medium">{level.description}</p>

        {/* Indicador demo */}
        <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm">
          <span>🎮</span>
          <span className="font-semibold text-blue-100">
            Demo gratuito: acceso al <strong className="text-white">Módulo 1</strong> completo.
            Regístrate para desbloquear los 7 módulos restantes.
          </span>
        </div>
      </div>

      {/* Módulos */}
      {level.modules.map((module, idx) => {
        const isUnlocked = idx === FREE_DEMO_MODULE_INDEX

        return (
          <div
            key={module.id}
            className={`bg-white rounded-3xl border-2 overflow-hidden transition-all ${
              isUnlocked ? 'border-blue-100' : 'border-gray-200 opacity-75'
            }`}
          >
            {/* Header módulo */}
            <div className={`px-6 py-4 flex items-center gap-3 ${isUnlocked ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                isUnlocked ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                {isUnlocked ? module.emoji : '🔒'}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-black uppercase tracking-widest ${isUnlocked ? 'text-blue-400' : 'text-gray-400'}`}>
                  Módulo {idx + 1}
                </p>
                <h2 className="text-xl font-black text-gray-900">{module.title}</h2>
                <p className="text-gray-500 text-sm font-medium">{module.description}</p>
              </div>
              {!isUnlocked && (
                <Badge className="bg-orange-100 text-orange-700 font-bold text-xs">
                  🔒 Solo con cuenta
                </Badge>
              )}
            </div>

            {/* Si está bloqueado → CTA */}
            {!isUnlocked ? (
              <div className="px-6 py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-black text-gray-700 text-lg">Módulo bloqueado</p>
                  <p className="text-gray-500 font-medium text-sm mt-1">
                    Crea tu cuenta gratis para desbloquear este módulo y los {level.modules.length - 1} restantes
                  </p>
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/register">
                    <Button className="font-black bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 py-5">
                      Crear cuenta gratis →
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" className="font-bold border-2 rounded-2xl px-6 py-5">
                      Ver planes
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // Si está desbloqueado → mostrar lecciones
              <div className="divide-y divide-gray-100">
                {module.sections.map(section => (
                  <div key={section.id}>
                    <div className="px-6 py-3 bg-gray-50">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {section.title}
                      </p>
                    </div>
                    {section.lessons.map(lesson => (
                      <div key={lesson.id} className="px-6 py-4 flex items-center gap-4 hover:bg-blue-50 transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{lesson.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration_minutes} min
                            </span>
                            <span>{lesson.exercises.length} ejercicios</span>
                          </div>
                        </div>
                        <Link href={`/demo/lessons/${lesson.id}`}>
                          <Button size="sm" className="font-bold rounded-xl bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-transform">
                            Practicar
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <CTACard title="¿Quieres más? 🚀" />
    </div>
  )
}
