export type ExerciseType = 'fill_blank' | 'sentence_order' | 'multiple_choice'
export type Difficulty = 1 | 2 | 3

export type Exercise = {
  id: string
  type: ExerciseType
  difficulty: Difficulty
  content: FillBlankContent | SentenceOrderContent | MultipleChoiceContent
}

export type FillBlankContent = {
  sentence: string
  answer: string
  hint?: string
}

export type SentenceOrderContent = {
  words: string[]
  correct_order: string[]
}

export type MultipleChoiceContent = {
  question: string
  options: string[]
  correct: string
  explanation?: string
}

export type SessionState = {
  currentDifficulty: Difficulty
  streak: number
  consecutiveErrors: number
  correctCount: number
  totalAnswered: number
  exerciseHistory: { id: string; correct: boolean }[]
}

export function createSession(): SessionState {
  return {
    currentDifficulty: 1,
    streak: 0,
    consecutiveErrors: 0,
    correctCount: 0,
    totalAnswered: 0,
    exerciseHistory: [],
  }
}

export function updateSession(state: SessionState, exerciseId: string, correct: boolean): SessionState {
  const newState = { ...state }
  newState.totalAnswered++
  newState.exerciseHistory = [...state.exerciseHistory, { id: exerciseId, correct }]

  if (correct) {
    newState.correctCount++
    newState.streak = state.streak + 1
    newState.consecutiveErrors = 0
    // Sube dificultad después de 3 correctas seguidas
    if (newState.streak >= 3 && newState.currentDifficulty < 3) {
      newState.currentDifficulty = (newState.currentDifficulty + 1) as Difficulty
      newState.streak = 0
    }
  } else {
    newState.streak = 0
    newState.consecutiveErrors = state.consecutiveErrors + 1
    // Baja dificultad después de 2 errores seguidos
    if (newState.consecutiveErrors >= 2 && newState.currentDifficulty > 1) {
      newState.currentDifficulty = (newState.currentDifficulty - 1) as Difficulty
      newState.consecutiveErrors = 0
    }
  }

  return newState
}

export function calculateScore(state: SessionState): number {
  if (state.totalAnswered === 0) return 0
  return Math.round((state.correctCount / state.totalAnswered) * 100)
}

export function calculateStars(score: number): 0 | 1 | 2 | 3 {
  if (score >= 90) return 3
  if (score >= 70) return 2
  if (score >= 50) return 1
  return 0
}

export function selectNextExercise(
  exercises: Exercise[],
  state: SessionState,
  answeredIds: Set<string>
): Exercise | null {
  const remaining = exercises.filter(e => !answeredIds.has(e.id))
  if (remaining.length === 0) return null

  // Prefer exercises matching current difficulty
  const atDifficulty = remaining.filter(e => e.difficulty === state.currentDifficulty)
  if (atDifficulty.length > 0) {
    return atDifficulty[Math.floor(Math.random() * atDifficulty.length)]
  }

  // Fall back to any remaining exercise
  return remaining[0]
}

export function checkAnswer(exercise: Exercise, userAnswer: string | string[]): boolean {
  switch (exercise.type) {
    case 'fill_blank': {
      const content = exercise.content as FillBlankContent
      return userAnswer.toString().trim().toLowerCase() === content.answer.toLowerCase()
    }
    case 'multiple_choice': {
      const content = exercise.content as MultipleChoiceContent
      return userAnswer.toString() === content.correct
    }
    case 'sentence_order': {
      const content = exercise.content as SentenceOrderContent
      const answer = Array.isArray(userAnswer) ? userAnswer : userAnswer.split(' ')
      return JSON.stringify(answer) === JSON.stringify(content.correct_order)
    }
  }
}
