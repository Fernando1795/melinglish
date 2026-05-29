import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEffectiveSubscription, getAccessibleHoursForLevel } from '@/lib/content-access'
import LessonClient from './LessonClient'

type Props = { params: Promise<{ lessonId: string }> }

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [lessonRes, subscriptionRes, profileRes] = await Promise.all([
    supabase
      .from('lessons')
      .select('*, sections(title, modules(title, level_id))')
      .eq('id', lessonId)
      .single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
    supabase.from('profiles').select('role, current_level, weekly_days_accumulated').eq('id', user.id).single(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lesson    = lessonRes.data as any
  const subscription = subscriptionRes.data
  const profile   = profileRes.data

  if (!lesson) notFound()

  // Admins tienen acceso sin restricción
  const isAdmin = profile?.role === 'admin'
  if (!isAdmin) {
    const effectiveSub = getEffectiveSubscription(subscription, false)
    const levelId = lesson.sections?.modules?.level_id ?? 'A1'
    const currentLevel = profile?.current_level ?? 'A1'
    const weeklyDays = profile?.weekly_days_accumulated ?? 0
    const accessibleHours = getAccessibleHoursForLevel(levelId, effectiveSub, currentLevel, weeklyDays)
    const hasAccess = accessibleHours >= 999 || lesson.cumulative_hours <= accessibleHours
    if (!hasAccess) redirect('/pricing')
  }

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
      introVideoUrl={lesson.intro_video_url ?? undefined}
      keyConcepts={lesson.key_concepts ?? []}
    />
  )
}
