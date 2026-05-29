import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCOP, PLANS } from '@/lib/stripe-config'
import { Check, Star, Zap, BookOpen, Trophy } from 'lucide-react'
import Penguin from '@/components/Penguin'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌟</span>
          <span className="text-2xl font-black text-blue-600">Melinglish</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="font-bold">Iniciar sesión</Button>
          </Link>
        </div>
      </nav>

      {/* Mensaje autodidacta */}
      <div className="bg-blue-600 text-white text-center py-3 px-6">
        <p className="font-bold text-sm md:text-base">
          🐧 <strong>Melinglish</strong> es tu herramienta para aprender y practicar inglés de manera <strong>autodidacta</strong> — aprende a tu propio ritmo, cuando quieras y donde quieras.
        </p>
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-12 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Pingüino */}
          <div className="flex-shrink-0">
            <Penguin mood="wave" size={220} />
          </div>

          {/* Texto hero */}
          <div className="text-left md:text-left">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-300 text-sm font-bold px-4 py-1">
              ✨ Niveles A1 y A2
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Aprende inglés de forma{' '}
              <span className="text-blue-600">divertida</span> 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-xl">
              Ejercicios interactivos que se adaptan a tu nivel. Completa oraciones,
              ordena palabras y elige la respuesta correcta. ¡Aprende jugando, sin necesitar un profesor!
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/register">
                <Button size="lg" className="text-lg font-black bg-blue-600 hover:bg-blue-700 px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  ¡Comenzar ahora! 🚀
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg font-bold px-8 py-6 rounded-2xl border-2 border-orange-400 text-orange-600 hover:bg-orange-50">
                  🎮 Probar demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { icon: '📚', value: '4', label: 'Módulos A1' },
            { icon: '⚡', value: '+35', label: 'Lecciones' },
            { icon: '🏆', value: '3', label: 'Tipos de ejercicio' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-500 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-12">
            ¿Por qué Melinglish? 🤔
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                bg: 'bg-yellow-50',
                title: 'Dificultad adaptativa',
                desc: 'Los ejercicios se ajustan solos según tu desempeño. ¡Siempre en tu nivel perfecto!',
              },
              {
                icon: <BookOpen className="w-8 h-8 text-blue-500" />,
                bg: 'bg-blue-50',
                title: '3 tipos de ejercicio',
                desc: 'Completa oraciones, ordena palabras o elige la respuesta correcta. ¡Nunca te aburres!',
              },
              {
                icon: <Trophy className="w-8 h-8 text-green-500" />,
                bg: 'bg-green-50',
                title: 'Sistema de estrellas',
                desc: 'Gana ⭐⭐⭐ en cada lección y mantén tu racha diaria. ¡El aprendizaje es un juego!',
              },
            ].map(f => (
              <div key={f.title} className={`${f.bg} rounded-3xl p-8 text-center`}>
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exercise Preview */}
      <section className="px-6 py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Así se ven los ejercicios 👀
          </h2>
          <p className="text-gray-600 font-medium mb-8">Interactivos, claros y divertidos</p>
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-blue-100 text-blue-700 font-bold">Nivel A1</Badge>
              <Badge className="bg-green-100 text-green-700 font-bold">Fácil ⭐</Badge>
            </div>
            <p className="text-lg font-bold text-gray-700 mb-6">
              ¿Cuál es la respuesta correcta?
            </p>
            <p className="text-2xl font-black text-gray-900 mb-8">
              &quot;She ___ a cat.&quot;
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['have', 'has', 'is', 'are'].map((opt, i) => (
                <button
                  key={opt}
                  className={`p-4 rounded-2xl font-bold text-lg border-2 transition-all ${
                    i === 1
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {opt} {i === 1 && '✓'}
                </button>
              ))}
            </div>
            <p className="mt-4 text-green-600 font-bold text-sm">
              ✅ ¡Excelente! &quot;Has&quot; es la forma correcta para she/he/it
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-4">
            Elige tu plan 💳
          </h2>
          <p className="text-center text-gray-600 font-medium mb-12">
            Cancela cuando quieras. Sin compromisos.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(PLANS).map(plan => (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 border-2 relative flex flex-col ${
                  plan.id === 'monthly'
                    ? 'border-orange-400 shadow-xl scale-105'
                    : 'border-gray-200'
                }`}
              >
                {plan.id === 'monthly' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white font-bold px-4 py-1">
                      ⭐ Más popular
                    </Badge>
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Star className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-500 font-medium mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-gray-900">
                    {formatCOP(plan.price)}
                  </span>
                  <span className="text-gray-500 font-semibold">
                    /{plan.id === 'weekly' ? 'semana' : plan.id === 'monthly' ? 'mes' : 'año'}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.id === 'weekly' && [
                    '14 horas de contenido',
                    'Nivel A1 parcial',
                    'Ejercicios interactivos',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2 font-semibold text-gray-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.id === 'monthly' && [
                    'Nivel A1 completo (30h)',
                    'Todos los módulos',
                    'Ejercicios interactivos',
                    'Seguimiento de progreso',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2 font-semibold text-gray-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.id === 'annual' && [
                    'Nivel A1 completo',
                    'Nivel A2 completo',
                    'Todo el contenido',
                    'Prioridad en nuevos temas',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2 font-semibold text-gray-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    className={`w-full font-black text-lg py-6 rounded-2xl ${
                      plan.id === 'monthly'
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Empezar ahora
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🌟</span>
          <span className="text-xl font-black text-white">Melinglish</span>
        </div>
        <p className="font-medium">© 2026 Melinglish. Aprende inglés, diviértete aprendiendo.</p>
      </footer>
    </div>
  )
}
