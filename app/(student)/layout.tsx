import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentNavbar from '@/components/layout/StudentNavbar'
import { getEffectiveSubscription } from '@/lib/content-access'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, current_level, onboarding_completed')
    .eq('id', user.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const isAdmin = profile?.role === 'admin'
  const effectiveSub = getEffectiveSubscription(subscription, isAdmin)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentNavbar
        userName={profile?.full_name ?? user.email ?? 'Estudiante'}
        subscription={effectiveSub}
        isAdmin={isAdmin}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
