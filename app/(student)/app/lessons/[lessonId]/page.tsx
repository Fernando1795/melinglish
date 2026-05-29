import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSubscriptionActive, getAccessibleHours } from '@/lib/content-access'
import LessonClient from './LessonClient'

type Props = { params: Promise<{ lessonId: string }> }

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: lesson }, { data: subscription }] = await Promise.all([
    supabase
      .from('lessons')
      .select('*, sections(title, modules(title, level_id))')
      .eq('id', lessonId)
      .single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
  ])

  if (!lesson) notFound()

  // Verificar acceso
  const accessibleHours = getAccessibleHours(subscription)
  const hasAccess = isSubscriptionActive(subscription) && (
    accessibleHours >= 999 || lesson.cumulative_hours <= accessibleHours
  )

  if (!hasAccess) redirect('/pricing')

  const { data: exercises } = await supabase
    .from('lesson_blocks')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index')

  return (
    <LessonClient
      lesson={lesson}
      exercises={exercises ?? []}
      userId={user.id}
    />
  )
}
