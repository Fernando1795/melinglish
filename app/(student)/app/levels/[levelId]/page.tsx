import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAccessibleHoursForLevel, getEffectiveSubscription } from '@/lib/content-access'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, ChevronRight, BookOpen } from 'lucide-react'

type Props = { params: Promise<{ levelId: string }> }

export default async function LevelPage({ params }: Props) {
  const { levelId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: level }, { data: modules }, { data: subscription }, { data: profile }] = await Promise.all([
    supabase.from('levels').select('*').eq('id', levelId.toUpperCase()).single(),
    supabase
      .from('modules')
      .select('*, sections(*, lessons(id, title, duration_minutes, cumulative_hours, order_index, is_published))')
      .eq('level_id', levelId.toUpperCase())
      .order('order_index'),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
    supabase.from('profiles').select('current_level, weekly_days_accumulated, role').eq('id', user.id).single(),
  ])

  if (!level) notFound()

  const isAdmin = profile?.role === 'admin'
  const effectiveSub = getEffectiveSubscription(subscription, isAdmin)
  const currentLevel = profile?.current_level ?? 'A1'
  const weeklyDays = profile?.weekly_days_accumulated ?? 0

  // Horas accesibles para ESTE nivel específico (cascada entre niveles para semanal)
  const accessibleHours = getAccessibleHoursForLevel(
    levelId.toUpperCase(),
    effectiveSub,
    currentLevel,
    weeklyDays
  )

  // Progreso del usuario en este nivel
  const { data: progress } = await supabase
    .from('user_progress')
    .select('lesson_id, completed')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedIds = new Set(progress?.map(p => p.lesson_id) ?? [])

  return (
    <div className="space-y-6">
      {/* Header del nivel */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl p-8 text-white">
        <Link href="/app/dashboard" className="text-blue-200 hover:text-white font-bold text-sm mb-4 block">
          ← Volver al inicio
        </Link>
        <Badge className="bg-white/20 text-white font-black mb-3">Nivel {level.id}</Badge>
        <h1 className="text-3xl font-black mb-2">{level.title}</h1>
        <p className="text-blue-100 font-medium">{level.description}</p>
      </div>

      {/* Módulos */}
      {(modules ?? []).map((module, moduleIdx) => (
        <div key={module.id} className="bg-white rounded-3xl border-2 border-blue-100 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
              {moduleIdx + 1}
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">{module.title}</h2>
              {module.description && (
                <p className="text-gray-500 text-sm font-medium">{module.description}</p>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {(module.sections ?? []).map((section: { id: string; title: string; lessons: { id: string; title: string; duration_minutes: number; cumulative_hours: number; order_index: number; is_published: boolean }[] }) => (
              <div key={section.id}>
                <div className="px-6 py-3 bg-gray-50">
                  <p className="text-sm font-black text-gray-500 uppercase tracking-wide">
                    {section.title}
                  </p>
                </div>
                {(section.lessons ?? [])
                  .filter((l: { is_published: boolean }) => l.is_published)
                  .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
                  .map((lesson: { id: string; title: string; duration_minutes: number; cumulative_hours: number }) => {
                    const isAccessible = isAdmin || (
                      accessibleHours >= 999 || lesson.cumulative_hours <= accessibleHours
                    )
                    const isCompleted = completedIds.has(lesson.id)

                    return (
                      <div
                        key={lesson.id}
                        className={`px-6 py-4 flex items-center gap-4 transition-colors ${
                          isAccessible ? 'hover:bg-blue-50' : 'opacity-60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isAccessible
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? '✓' : isAccessible ? <BookOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{lesson.title}</p>
                          <p className="text-sm text-gray-400 font-medium">{lesson.duration_minutes} min</p>
                        </div>

                        {isAccessible ? (
                          <Link href={`/app/lessons/${lesson.id}`}>
                            <Button size="sm" className="font-bold rounded-xl bg-blue-600 hover:bg-blue-700">
                              {isCompleted ? 'Repetir' : 'Empezar'}
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/pricing">
                            <Button size="sm" variant="outline" className="font-bold rounded-xl border-2">
                              🔒 Plan
                            </Button>
                          </Link>
                        )}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      ))}

      {(!modules || modules.length === 0) && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">📚</div>
          <p className="font-bold text-xl">Contenido próximamente</p>
          <p className="font-medium mt-2">Estamos preparando las lecciones de este nivel</p>
        </div>
      )}
    </div>
  )
}
