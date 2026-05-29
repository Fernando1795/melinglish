'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  type Exercise,
  createSession, updateSession, calculateScore,
  calculateStars, selectNextExercise, checkAnswer,
} from '@/lib/exercise-engine'
import { type DemoLesson } from '@/lib/demo-data'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Penguin from '@/components/Penguin'
import CTACard from '@/components/CTACard'
import VideoPlayer from '@/components/exercises/VideoPlayer'
import MultipleChoice from '@/components/exercises/MultipleChoice'
import FillBlank from '@/components/exercises/FillBlank'
import SentenceOrder from '@/components/exercises/SentenceOrder'
import ExerciseFeedback from '@/components/exercises/ExerciseFeedback'

type Phase = 'intro' | 'video' | 'exercise' | 'feedback' | 'result'

export default function DemoLessonClient({ lesson }: { lesson: DemoLesson }) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [session, setSession] = useState(createSession())
  const [answeredIds] = useState(new Set<string>())
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [userAnswer, setUserAnswer] = useState<string | string[] | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [completedCount, setCompletedCount] = useState(0)

  const exercises = lesson.exercises as Exercise[]
  const total = exercises.length
  const progress = total > 0 ? (completedCount / total) * 100 : 0

  function startLesson() {
    // Siempre pasa por la fase de video (con URL o con placeholder)
    setPhase('video')
  }

  function startExercises() {
    const first = selectNextExercise(exercises, createSession(), new Set())
    setCurrentExercise(first)
    setPhase('exercise')
  }

  const handleAnswer = useCallback((answer: string | string[]) => {
    if (!currentExercise) return
    const correct = checkAnswer(currentExercise, answer)
    setUserAnswer(answer)
    setIsCorrect(correct)
    setSession(prev => updateSession(prev, currentExercise.id, correct))
    setPhase('feedback')
  }, [currentExercise])

  function handleNext() {
    if (!currentExercise) return
    answeredIds.add(currentExercise.id)
    setCompletedCount(answeredIds.size)

    if (answeredIds.size >= total) {
      setPhase('result')
      return
    }

    const next = selectNextExercise(exercises, session, answeredIds)
    setCurrentExercise(next)
    setUserAnswer(null)
    setIsCorrect(null)
    setPhase('exercise')
  }

  function resetLesson() {
    setPhase('video')
    setSession(createSession())
    answeredIds.clear()
    setCompletedCount(0)
    setCurrentExercise(null)
    setUserAnswer(null)
    setIsCorrect(null)
  }

  const score = calculateScore(session)
  const stars = calculateStars(score)
  const explanation = currentExercise
    ? (currentExercise.content as { explanation?: string }).explanation
    : undefined

  /* ── VIDEO ── */
  if (phase === 'video') {
    return (
      <VideoPlayer
        lessonTitle={lesson.title}
        moduleTitle="Melinglish · A1"
        videoUrl={lesson.intro_video_url}
        keyConcepts={lesson.key_concepts}
        onContinue={startExercises}
      />
    )
  }

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Penguin mood="wave" size={150} />
        </motion.div>
        <div>
          <Badge className="bg-orange-100 text-orange-700 font-bold mb-3">🎮 Demo</Badge>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{lesson.title}</h1>
          <p className="text-gray-500 font-medium">{total} ejercicios · Dificultad adaptativa ⚡</p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center text-sm font-bold text-gray-400">
          <span>✏️ Completar</span>
          <span>🔤 Ordenar</span>
          <span>✅ Elegir</span>
        </div>
        <Button
          onClick={startLesson}
          className="font-black text-xl py-7 px-12 rounded-3xl bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          ¡Empezar! 🚀
        </Button>
        <Link href="/demo/levels/A1" className="text-gray-400 hover:text-blue-600 font-semibold text-sm">
          ← Volver a lecciones
        </Link>
      </div>
    )
  }

  /* ── RESULTADO ── */
  if (phase === 'result') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Penguin mood={stars >= 2 ? 'celebrate' : 'happy'} size={150} />
        </motion.div>

        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-1">
            {stars === 3 ? '¡Perfecto!' : stars === 2 ? '¡Muy bien!' : '¡Bien hecho!'}
          </h1>
          <p className="text-gray-500 font-semibold">Lección completada</p>
        </div>

        <div className="flex gap-2 text-4xl">
          {[1, 2, 3].map(s => (
            <motion.span
              key={s}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: s * 0.2, type: 'spring' }}
            >
              {s <= stars ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>

        <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 w-full max-w-sm">
          <div className="text-5xl font-black text-blue-600 mb-1">{score}%</div>
          <p className="text-gray-500 font-semibold">
            {session.correctCount} de {session.totalAnswered} correctas
          </p>
        </div>

        {/* CTA cuenta real */}
        <CTACard
          title="¡Guarda tu progreso! 🌟"
          subtitle="Crea tu cuenta gratis para conservar tus estrellas y continuar desde donde lo dejaste"
        />

        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/demo/levels/A1">
            <Button variant="outline" className="font-bold rounded-2xl border-2 px-6 py-4">
              ← Más lecciones
            </Button>
          </Link>
          <Button onClick={resetLesson} className="font-black rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-4">
            Repetir 🔄
          </Button>
        </div>
      </motion.div>
    )
  }

  /* ── EJERCICIO + FEEDBACK ── */
  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <div className="flex items-center gap-4">
        <Link href="/demo/levels/A1" className="text-gray-400 hover:text-gray-600 font-black text-lg">✕</Link>
        <Progress value={progress} className="flex-1 h-3 rounded-full" />
        <span className="text-sm font-black text-gray-500 whitespace-nowrap">
          {completedCount}/{total}
        </span>
      </div>

      {/* Tarjeta ejercicio */}
      <div className="bg-white rounded-3xl border-2 border-blue-100 p-8 min-h-64">
        <div className="flex items-center gap-2 mb-8">
          <Badge className={`font-bold ${
            session.currentDifficulty === 1 ? 'bg-green-100 text-green-700'
            : session.currentDifficulty === 2 ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
          }`}>
            {session.currentDifficulty === 1 ? '⭐ Fácil'
              : session.currentDifficulty === 2 ? '⭐⭐ Medio'
              : '⭐⭐⭐ Difícil'}
          </Badge>
          <Badge variant="outline" className="font-semibold text-gray-500">
            {currentExercise?.type === 'fill_blank' ? '✏️ Completar'
              : currentExercise?.type === 'sentence_order' ? '🔤 Ordenar'
              : '✅ Elegir'}
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentExercise?.type === 'multiple_choice' && (
              <MultipleChoice
                content={currentExercise.content as Parameters<typeof MultipleChoice>[0]['content']}
                onAnswer={handleAnswer}
                disabled={phase === 'feedback'}
                selected={typeof userAnswer === 'string' ? userAnswer : null}
                isCorrect={isCorrect}
              />
            )}
            {currentExercise?.type === 'fill_blank' && (
              <FillBlank
                content={currentExercise.content as Parameters<typeof FillBlank>[0]['content']}
                onAnswer={handleAnswer}
                disabled={phase === 'feedback'}
                isCorrect={isCorrect}
              />
            )}
            {currentExercise?.type === 'sentence_order' && (
              <SentenceOrder
                content={currentExercise.content as Parameters<typeof SentenceOrder>[0]['content']}
                onAnswer={handleAnswer}
                disabled={phase === 'feedback'}
                isCorrect={isCorrect}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {phase === 'feedback' && isCorrect !== null && (
          <ExerciseFeedback
            isCorrect={isCorrect}
            explanation={explanation}
            onNext={handleNext}
            isLast={completedCount + 1 >= total}
          />
        )}
      </div>

      {/* Racha */}
      {session.streak > 1 && phase === 'exercise' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-orange-500 font-black text-lg"
        >
          🔥 ¡Racha de {session.streak}! ¡Sigue así!
        </motion.div>
      )}
    </div>
  )
}
