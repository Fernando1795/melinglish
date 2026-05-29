import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAccessibleHours, isSubscriptionActive, formatCOP } from '@/lib/content-access'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Lock, Zap } from 'lucide-react'
import Penguin from '@/components/Penguin'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: subscription }, { data: levels }] = await Promise.all([
    supabase.from('profiles').select('full_name, current_level').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
    supabase.from('levels').select('id, title, description, total_hours, order_index').order('order_index'),
  ])

  const accessibleHours = getAccessibleHours(subscription)
  const hasSubscription = isSubscriptionActive(subscription)
  const firstName = (profile?.full_name ?? user.email ?? '').split(' ')[0]

  // Progreso del usuario
  const { data: progress } = await supabase
    .from('user_progress')
    .select('lesson_id, completed')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedLessons = progress?.length ?? 0

  return (
    <div className="space-y-8">
      {/* Mensaje autodidacta */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-5 py-3 flex items-center gap-3 text-sm font-semibold text-blue-700">
        <span className="text-xl">🐧</span>
        <span>
          <strong>Melinglish</strong> es tu herramienta de aprendizaje autodidacta — practica inglés a tu ritmo, sin necesitar un profesor.
        </span>
      </div>

      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-100 font-semibold text-lg">¡Hola, {firstName}! 👋</p>
            <h1 className="text-3xl font-black mt-1">
              {completedLessons === 0
                ? '¡Listo para aprender inglés? 🚀'
                : `¡Sigue así! Llevas ${completedLessons} lecciones ⭐`}
            </h1>
          </div>
          <Penguin mood={completedLessons > 0 ? 'excited' : 'wave'} size={100} />
        </div>

        {hasSubscription && (
          <div className="mt-6 bg-white/20 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white">Plan {subscription?.plan}</span>
              <span className="text-blue-100 text-sm font-semibold">
                {accessibleHours >= 999 ? 'Todo desbloqueado' : `${accessibleHours}h desbloqueadas`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alerta sin suscripción */}
      {!hasSubscription && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-5xl">🔓</div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-black text-orange-800 mb-1">¡Desbloquea el contenido!</h3>
            <p className="text-orange-600 font-medium">
              Elige un plan y accede a todos los ejercicios de inglés
            </p>
          </div>
          <Link href="/pricing">
            <Button className="bg-orange-500 hover:bg-orange-600 font-black text-white rounded-2xl px-6 py-5">
              Ver planes
            </Button>
          </Link>
        </div>
      )}

      {/* Niveles */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-4">📚 Mis niveles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {(levels ?? []).map(level => {
            const isA1 = level.id === 'A1'
            const isUnlocked = hasSubscription && (
              subscription?.plan === 'annual' || isA1
            )

            return (
              <div
                key={level.id}
                className={`rounded-3xl border-2 p-6 transition-all ${
                  isUnlocked
                    ? 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge className={`mb-2 font-black ${isA1 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      Nivel {level.id}
                    </Badge>
                    <h3 className="text-xl font-black text-gray-900">{level.title}</h3>
                    <p className="text-gray-500 font-medium text-sm mt-1">{level.description}</p>
                  </div>
                  {isUnlocked ? (
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold mb-4">
                  <Zap className="w-4 h-4" />
                  <span>{level.total_hours} horas de contenido</span>
                </div>

                {isUnlocked ? (
                  <Link href={`/app/levels/${level.id}`}>
                    <Button className="w-full font-black rounded-2xl bg-blue-600 hover:bg-blue-700">
                      Ir al nivel →
                    </Button>
                  </Link>
                ) : (
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full font-bold rounded-2xl border-2">
                      🔒 Desbloquear
                    </Button>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: '⭐', value: completedLessons.toString(), label: 'Lecciones completadas' },
          { icon: '🔥', value: '0', label: 'Días de racha' },
          { icon: '🏆', value: '0', label: 'Estrellas ganadas' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border-2 border-gray-100 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-blue-600">{stat.value}</div>
            <div className="text-xs text-gray-500 font-semibold mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
