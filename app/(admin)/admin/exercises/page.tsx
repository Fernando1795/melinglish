import { createClient } from '@/lib/supabase/server'
import ExercisesAdmin from './ExercisesAdmin'

export default async function ExercisesPage() {
  const supabase = await createClient()

  const [{ data: lessons }, { data: exercises }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, title, sections(title, modules(title))')
      .eq('is_published', true)
      .order('order_index'),
    supabase
      .from('lesson_blocks')
      .select('*')
      .order('order_index'),
  ])

  return <ExercisesAdmin lessons={lessons ?? []} exercises={exercises ?? []} />
}
