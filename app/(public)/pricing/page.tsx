'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS, formatCOP } from '@/lib/stripe-config'
import { Check, Star } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(planId: string) {
    setLoading(planId)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else if (res.status === 401) {
      router.push('/register')
    }
    setLoading(null)
  }

  const planFeatures = {
    weekly: ['14 horas de contenido', 'Nivel A1 parcial', '3 tipos de ejercicios', 'Dificultad adaptativa'],
    monthly: ['Nivel A1 completo (30h)', 'Todos los módulos', '3 tipos de ejercicios', 'Seguimiento de progreso', 'Sistema de estrellas'],
    annual: ['Nivel A1 completo', 'Nivel A2 completo', 'Todo el contenido', '3 tipos de ejercicios', 'Acceso a novedades', 'Mejor valor 💰'],
  } as const

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🌟</span>
          <span className="text-2xl font-black text-blue-600">Melinglish</span>
        </Link>
        <Link href="/login">
          <Button variant="outline" className="font-bold rounded-xl">Iniciar sesión</Button>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Elige tu plan 🎯</h1>
          <p className="text-xl text-gray-600 font-medium">
            Sin compromisos. Cancela cuando quieras.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.values(PLANS).map(plan => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 border-2 relative flex flex-col ${
                plan.id === 'monthly'
                  ? 'border-orange-400 shadow-2xl scale-105 bg-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.id === 'monthly' && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white font-black px-4 py-1.5 text-sm">
                    ⭐ Más popular
                  </Badge>
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5`}>
                <Star className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-1">{plan.name}</h2>
              <p className="text-gray-500 font-semibold mb-5">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-black text-gray-900">
                  {formatCOP(plan.price)}
                </span>
                <span className="text-gray-500 font-semibold">
                  /{plan.id === 'weekly' ? 'semana' : plan.id === 'monthly' ? 'mes' : 'año'}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {planFeatures[plan.id as keyof typeof planFeatures].map(f => (
                  <li key={f} className="flex items-center gap-2 font-semibold text-gray-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full font-black text-lg py-6 rounded-2xl ${
                  plan.id === 'monthly'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading === plan.id ? '⏳ Procesando...' : `Empezar ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500 font-medium">
          ¿Tienes preguntas?{' '}
          <Link href="/" className="text-blue-600 font-bold hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
