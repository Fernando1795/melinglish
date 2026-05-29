'use client'

import { useState } from 'react'
import { type FillBlankContent } from '@/lib/exercise-engine'
import { Button } from '@/components/ui/button'

type Props = {
  content: FillBlankContent
  onAnswer: (answer: string) => void
  disabled: boolean
  isCorrect: boolean | null
}

export default function FillBlank({ content, onAnswer, disabled, isCorrect }: Props) {
  const [value, setValue] = useState('')

  const parts = content.sentence.split('___')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) onAnswer(value.trim())
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-2xl font-black text-gray-900 leading-relaxed">
          {parts[0]}
          <span className={`inline-block mx-2 px-4 py-1 rounded-xl border-b-4 min-w-[100px] text-center transition-colors ${
            isCorrect === true
              ? 'bg-green-100 border-green-500 text-green-800'
              : isCorrect === false
              ? 'bg-red-100 border-red-400 text-red-800'
              : 'bg-blue-50 border-blue-400 text-blue-800'
          }`}>
            {disabled ? (isCorrect ? value : content.answer) : (value || '___')}
          </span>
          {parts[1]}
        </p>
      </div>

      {content.hint && (
        <p className="text-center text-sm text-gray-400 font-semibold italic">
          💡 Pista: {content.hint}
        </p>
      )}

      {!disabled && (
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Escribe la palabra..."
            autoFocus
            className="flex-1 border-2 border-blue-200 rounded-2xl px-5 py-4 font-bold text-lg focus:outline-none focus:border-blue-500 bg-white"
          />
          <Button
            type="submit"
            disabled={!value.trim()}
            className="font-black rounded-2xl bg-blue-600 hover:bg-blue-700 px-6"
          >
            ✓
          </Button>
        </form>
      )}

      {disabled && !isCorrect && (
        <p className="text-center text-red-500 font-bold">
          Tu respuesta: &quot;{value}&quot;
        </p>
      )}
    </div>
  )
}
