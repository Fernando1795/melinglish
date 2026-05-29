import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DEMO_LEVELS } from '@/lib/demo-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, BookOpen, Clock } from 'lucide-react'

type Props = { params: Promise<{ levelId: string }> }

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
      </div>

      {/* Módulos */}
      {level.modules.map((module, idx) => (
        <div key={module.id} className="bg-white rounded-3xl border-2 border-blue-100 overflow-hidden">
          {/* Header módulo */}
          <div className="bg-blue-50 px-6 py-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">
              {module.emoji}
            </div>
            <div>
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Módulo {idx + 1}</p>
              <h2 className="text-xl font-black text-gray-900">{module.title}</h2>
              <p className="text-gray-500 text-sm font-medium">{module.description}</p>
            </div>
          </div>

          {/* Secciones y lecciones */}
          <div className="divide-y divide-gray-100">
            {module.sections.map(section => (
              <div key={section.id}>
                <div className="px-6 py-3 bg-gray-50">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {section.title}
                  </p>
                </div>
                {section.lessons.map((lesson, lessonIdx) => (
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

                {/* Lecciones dentro de secciones anidadas */}
                {(section as any).sections?.map((subsection: any) => (
                  <div key={subsection.id}>
                    <div className="px-6 py-2 bg-gray-50/50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pl-4">
                        {subsection.title}
                      </p>
                    </div>
                    {subsection.lessons?.map((lesson: any) => (
                      <div key={lesson.id} className="px-6 py-4 flex items-center gap-4 hover:bg-blue-50 transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{lesson.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration_minutes} min
                            </span>
                            <span>{lesson.exercises?.length} ejercicios</span>
                          </div>
                        </div>
                        <Link href={`/demo/lessons/${lesson.id}`}>
                          <Button size="sm" className="font-bold rounded-xl bg-purple-600 hover:bg-purple-700 group-hover:scale-105 transition-transform">
                            Practicar
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
