import { notFound, redirect } from 'next/navigation'
import { getDemoLesson, DEMO_LEVELS } from '@/lib/demo-data'
import DemoLessonClient from './DemoLessonClient'

type Props = { params: Promise<{ lessonId: string }> }

// Solo el primer módulo es accesible en el demo
function isLessonInFreeModule(lessonId: string): boolean {
  const level = DEMO_LEVELS.find(l => l.id === 'A1')
  if (!level) return false
  const freeModule = level.modules[0] // Módulo 1 únicamente
  for (const section of freeModule.sections) {
    if (section.lessons.some(l => l.id === lessonId)) return true
  }
  return false
}

export default async function DemoLessonPage({ params }: Props) {
  const { lessonId } = await params
  const lesson = getDemoLesson(lessonId)
  if (!lesson) notFound()

  // Si la lección no es del módulo 1, redirige a registro
  if (!isLessonInFreeModule(lessonId)) {
    redirect('/register?from=demo')
  }

  return <DemoLessonClient lesson={lesson} />
}
