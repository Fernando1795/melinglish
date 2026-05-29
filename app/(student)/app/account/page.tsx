import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCOP } from '@/lib/content-access'
import { PLANS } from '@/lib/stripe-config'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
  ])

  const plan = subscription ? PLANS[subscription.plan as keyof typeof PLANS] : null
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900">Mi cuenta 👤</h1>

      {/* Perfil */}
      <div className="bg-white rounded-3xl border-2 border-blue-100 p-6">
        <h2 className="text-lg font-black text-gray-700 mb-4">Información personal</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 font-semibold">Nombre</span>
            <span className="font-bold text-gray-900">{profile?.full_name ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 font-semibold">Email</span>
            <span className="font-bold text-gray-900">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Suscripción */}
      <div className="bg-white rounded-3xl border-2 border-blue-100 p-6">
        <h2 className="text-lg font-black text-gray-700 mb-4">Mi suscripción</h2>

        {subscription && plan ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-black text-gray-900">Plan {plan.name}</p>
                <p className="text-gray-500 font-medium">{plan.description}</p>
              </div>
              <Badge className="bg-green-100 text-green-700 font-bold">Activo ✓</Badge>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Precio</span>
                <span className="font-black">{formatCOP(plan.price)}/{plan.id === 'weekly' ? 'semana' : plan.id === 'monthly' ? 'mes' : 'año'}</span>
              </div>
              {periodEnd && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Próxima renovación</span>
                  <span className="font-bold">{periodEnd}</span>
                </div>
              )}
            </div>
            <form action="/api/portal" method="POST">
              <Button type="submit" variant="outline" className="w-full font-bold rounded-2xl border-2 py-5">
                Gestionar suscripción →
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🔓</div>
            <p className="text-gray-500 font-bold mb-4">No tienes suscripción activa</p>
            <Link href="/pricing">
              <Button className="font-black bg-orange-500 hover:bg-orange-600 rounded-2xl px-8 py-5">
                Ver planes →
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Cerrar sesión */}
      <div className="bg-white rounded-3xl border-2 border-red-100 p-6">
        <h2 className="text-lg font-black text-gray-700 mb-4">Sesión</h2>
        <form action="/api/auth/signout" method="POST">
          <Button type="submit" variant="outline" className="font-bold rounded-2xl border-2 border-red-200 text-red-500 hover:bg-red-50">
            Cerrar sesión
          </Button>
        </form>
      </div>
    </div>
  )
}
