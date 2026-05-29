'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Penguin from '@/components/Penguin'

const LEVELS = [
  {
    id: 'A1',
    emoji: '🌱',
    title: 'Soy principiante',
    subtitle: 'Nivel A1',
    description: 'No sé nada o muy poco de inglés. Quiero empezar desde cero.',
    color: 'border-blue-400 bg-blue-50',
    selectedColor: 'border-blue-600 bg-blue-100 ring-4 ring-blue-300',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'A2',
    emoji: '🚀',
    title: 'Ya sé algo de inglés',
    subtitle: 'Nivel A2',
    description: 'Conozco lo básico y quiero mejorar mi inglés elemental.',
    color: 'border-purple-400 bg-purple-50',
    selectedColor: 'border-purple-600 bg-purple-100 ring-4 ring-purple-300',
    badge: 'bg-purple-100 text-purple-700',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    if (!selected) return
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase
      .from('profiles')
      .update({
        current_level: selected,
        onboarding_completed: true,
      })
      .eq('id', user.id)

    router.push('/pricing')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 py-10">
      {/* Ping bienvenida */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="mb-6"
      >
        <Penguin mood="excited" size={130} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8 max-w-md"
      >
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          ¡Bienvenido a Melinglish! 🎉
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Para darte el contenido perfecto, cuéntanos: <br />
          <strong className="text-gray-700">¿Cuál es tu nivel de inglés?</strong>
        </p>
      </motion.div>

      {/* Opciones de nivel */}
      <div className="w-full max-w-md space-y-4 mb-8">
        {LEVELS.map((level, i) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            onClick={() => setSelected(level.id)}
            className={`w-full rounded-3xl border-2 p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
              selected === level.id ? level.selectedColor : level.color
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{level.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xl font-black text-gray-900">{level.title}</p>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${level.badge}`}>
                    {level.subtitle}
                  </span>
                </div>
                <p className="text-gray-500 font-medium text-sm">{level.description}</p>
              </div>
              {/* Indicador de selección */}
              <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${
                selected === level.id
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}>
                {selected === level.id && (
                  <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info sobre planes */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl border-2 border-blue-100 p-4 mb-6 text-sm"
        >
          <p className="text-gray-600 font-semibold text-center">
            {selected === 'A1'
              ? '📚 Tu suscripción desbloqueará contenido del Nivel A1'
              : '🚀 Tu suscripción desbloqueará contenido del Nivel A2'}
          </p>
          <p className="text-gray-400 font-medium text-center text-xs mt-1">
            Con el plan anual accedes a A1 + A2 completos
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full font-black text-xl py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          {saving ? '⏳ Guardando...' : selected ? `Continuar con Nivel ${selected} →` : 'Selecciona tu nivel'}
        </Button>
      </motion.div>

      <p className="text-gray-400 font-medium text-sm mt-4 text-center">
        Puedes cambiar tu nivel más adelante desde tu perfil
      </p>
    </div>
  )
}
