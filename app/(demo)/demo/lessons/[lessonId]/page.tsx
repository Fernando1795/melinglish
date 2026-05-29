import { notFound } from 'next/navigation'
import { getDemoLesson } from '@/lib/demo-data'
import DemoLessonClient from './DemoLessonClient'

type Props = { params: Promise<{ lessonId: string }> }

export default async function DemoLessonPage({ params }: Props) {
  const { lessonId } = await params
  const lesson = getDemoLesson(lessonId)
  if (!lesson) notFound()

  return <DemoLessonClient lesson={lesson} />
}
