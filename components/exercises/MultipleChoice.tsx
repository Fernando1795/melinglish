'use client'

import { type MultipleChoiceContent } from '@/lib/exercise-engine'

type Props = {
  content: MultipleChoiceContent
  onAnswer: (answer: string) => void
  disabled: boolean
  selected: string | null
  isCorrect: boolean | null
}

export default function MultipleChoice({ content, onAnswer, disabled, selected, isCorrect }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xl font-black text-gray-900 text-center leading-relaxed">
        {content.question}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {content.options.map(option => {
          const isSelected = selected === option
          const isRight = option === content.correct
          let style = 'bg-gray-50 border-2 border-gray-200 text-gray-800 hover:border-blue-400 hover:bg-blue-50'

          if (disabled) {
            if (isRight) style = 'bg-green-500 border-2 border-green-500 text-white'
            else if (isSelected && !isRight) style = 'bg-red-100 border-2 border-red-400 text-red-800'
            else style = 'bg-gray-50 border-2 border-gray-200 text-gray-400'
          } else if (isSelected) {
            style = 'bg-blue-100 border-2 border-blue-500 text-blue-800'
          }

          return (
            <button
              key={option}
              onClick={() => !disabled && onAnswer(option)}
              disabled={disabled}
              className={`${style} p-5 rounded-2xl font-black text-lg transition-all duration-200 text-left flex items-center gap-3 ${
                !disabled ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer' : 'cursor-default'
              } ${isSelected && !disabled ? 'animate-bounce-in' : ''}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                disabled && isRight ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {disabled && isRight ? '✓' : disabled && isSelected && !isRight ? '✗' : option[0].toUpperCase()}
              </span>
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
