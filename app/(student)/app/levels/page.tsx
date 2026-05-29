import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isSubscriptionActive } from '@/lib/content-access'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Lock, Zap } from 'lucide-react'

export default async function LevelsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: levels }, { data: subscription }] = await Promise.all([
    supabase.from('levels').select('*').order('order_index'),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
  ])

  const hasSubscription = isSubscriptionActive(subscription)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gray-900">📚 Niveles de inglés</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {(levels ?? []).map(level => {
          const isA1 = level.id === 'A1'
          const isUnlocked = hasSubscription && (subscription?.plan === 'annual' || isA1)

          return (
            <div
              key={level.id}
              className={`bg-white rounded-3xl border-2 p-8 transition-all ${
                isUnlocked ? 'border-blue-200 hover:border-blue-400 hover:shadow-lg' : 'border-gray-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className={`font-black text-base px-4 py-1 ${isA1 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  Nivel {level.id}
                </Badge>
                {isUnlocked ? (
                  <BookOpen className="w-7 h-7 text-blue-500" />
                ) : (
                  <Lock className="w-7 h-7 text-gray-400" />
                )}
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2">{level.title}</h2>
              <p className="text-gray-500 font-medium mb-4">{level.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-400 font-semibold mb-6">
                <Zap className="w-4 h-4" />
                <span>{level.total_hours} horas de contenido</span>
              </div>

              {isUnlocked ? (
                <Link href={`/app/levels/${level.id}`}>
                  <Button className="w-full font-black rounded-2xl bg-blue-600 hover:bg-blue-700 py-5">
                    Explorar nivel →
                  </Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button variant="outline" className="w-full font-bold rounded-2xl border-2 py-5">
                    🔒 Desbloquear con plan Anual
                  </Button>
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
