'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

type Props = {
  isCorrect: boolean
  explanation?: string
  onNext: () => void
  isLast: boolean
}

export default function ExerciseFeedback({ isCorrect, explanation, onNext, isLast }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`mt-6 rounded-3xl p-6 border-2 ${
          isCorrect
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`text-5xl flex-shrink-0`}
          >
            {isCorrect ? '🎉' : '😅'}
          </motion.div>
          <div className="flex-1">
            <p className={`text-xl font-black mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect
                ? ['¡Excelente! Well done! 🌟', '¡Perfecto! Amazing! ⭐', '¡Correcto! Great job! 🎊'][Math.floor(Math.random() * 3)]
                : ['¡Casi! Almost there! 💪', '¡Sigue intentando! Keep going! 🔥', 'No te rindas! Don\'t give up! 💡'][Math.floor(Math.random() * 3)]
              }
            </p>
            {explanation && (
              <p className={`font-semibold text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                💡 {explanation}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={onNext}
          className={`mt-4 w-full font-black text-lg py-5 rounded-2xl ${
            isCorrect
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-400 hover:bg-red-500'
          }`}
        >
          {isLast ? '¡Ver resultados! 🏆' : 'Siguiente →'}
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
