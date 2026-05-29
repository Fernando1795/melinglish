'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos. Intenta de nuevo.')
      setLoading(false)
      return
    }

    router.push('/app/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🌟</span>
        <span className="text-2xl font-black text-blue-600">Melinglish</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-2">¡Hola de nuevo! 👋</h1>
        <p className="text-gray-500 font-medium mb-8">Inicia sesión para continuar aprendiendo</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-600 font-semibold text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="rounded-xl border-2 py-5 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">Contraseña</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-xl border-2 py-5 font-medium"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-black text-lg py-6 rounded-2xl bg-blue-600 hover:bg-blue-700"
          >
            {loading ? '⏳ Ingresando...' : '¡Entrar! 🚀'}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-500 font-medium">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Regístrate gratis
          </Link>
        </p>
        <div className="text-center mt-3">
          <Link href="/demo" className="text-orange-500 font-bold hover:underline text-sm">
            🎮 O prueba el demo sin registrarte →
          </Link>
        </div>
      </div>
    </div>
  )
}
