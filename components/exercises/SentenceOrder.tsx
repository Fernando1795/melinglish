'use client'

import { useState, useEffect } from 'react'
import { type SentenceOrderContent } from '@/lib/exercise-engine'
import { Button } from '@/components/ui/button'

type Props = {
  content: SentenceOrderContent
  onAnswer: (answer: string[]) => void
  disabled: boolean
  isCorrect: boolean | null
}

export default function SentenceOrder({ content, onAnswer, disabled, isCorrect }: Props) {
  const [available, setAvailable] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    // Mezclar palabras
    setAvailable([...content.words].sort(() => Math.random() - 0.5))
    setSelected([])
  }, [content])

  function pickWord(word: string, idx: number) {
    if (disabled) return
    const newAvailable = [...available]
    newAvailable.splice(idx, 1)
    setAvailable(newAvailable)
    setSelected([...selected, word])
  }

  function removeWord(word: string, idx: number) {
    if (disabled) return
    const newSelected = [...selected]
    newSelected.splice(idx, 1)
    setSelected(newSelected)
    setAvailable([...available, word])
  }

  function handleSubmit() {
    if (selected.length === content.words.length) {
      onAnswer(selected)
    }
  }

  const isComplete = selected.length === content.words.length

  return (
    <div className="space-y-6">
      <p className="text-center text-lg font-bold text-gray-600">
        Ordena las palabras para formar una oración correcta 👇
      </p>

      {/* Zona de construcción */}
      <div className={`min-h-16 rounded-2xl border-2 p-4 flex flex-wrap gap-2 transition-colors ${
        isCorrect === true
          ? 'border-green-400 bg-green-50'
          : isCorrect === false
          ? 'border-red-300 bg-red-50'
          : 'border-blue-300 bg-blue-50'
      }`}>
        {selected.length === 0 && !disabled && (
          <span className="text-gray-400 font-medium m-auto">Toca las palabras de abajo...</span>
        )}
        {selected.map((word, idx) => (
          <button
            key={`${word}-${idx}`}
            onClick={() => removeWord(word, idx)}
            disabled={disabled}
            className={`px-4 py-2 rounded-xl font-black text-base transition-all ${
              disabled
                ? isCorrect
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-red-400 text-white cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Respuesta correcta al fallar */}
      {disabled && !isCorrect && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-green-700 mb-2">✅ Orden correcto:</p>
          <div className="flex flex-wrap gap-2">
            {content.correct_order.map((word, idx) => (
              <span key={idx} className="px-3 py-1 bg-green-500 text-white rounded-lg font-bold text-sm">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Palabras disponibles */}
      <div className="flex flex-wrap gap-2 justify-center">
        {available.map((word, idx) => (
          <button
            key={`${word}-${idx}`}
            onClick={() => pickWord(word, idx)}
            disabled={disabled}
            className={`px-4 py-3 rounded-2xl border-2 font-black text-base transition-all ${
              disabled
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-default'
                : 'border-blue-300 bg-white text-blue-700 hover:bg-blue-100 hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      {!disabled && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="font-black rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 py-5 text-lg"
          >
            {isComplete ? '¡Listo! Verificar ✓' : `Selecciona ${content.words.length - selected.length} palabra(s) más`}
          </Button>
        </div>
      )}
    </div>
  )
}
