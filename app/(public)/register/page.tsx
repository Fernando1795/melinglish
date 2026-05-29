'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError('No se pudo crear la cuenta. Intenta con otro email.')
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
        <h1 className="text-3xl font-black text-gray-900 mb-2">¡Bienvenido! 🎉</h1>
        <p className="text-gray-500 font-medium mb-8">Crea tu cuenta y empieza a aprender inglés</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-600 font-semibold text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">Nombre completo</Label>
            <Input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Tu nombre"
              required
              className="rounded-xl border-2 py-5 font-medium"
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              required
              className="rounded-xl border-2 py-5 font-medium"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-black text-lg py-6 rounded-2xl bg-blue-600 hover:bg-blue-700"
          >
            {loading ? '⏳ Creando cuenta...' : '¡Crear mi cuenta! 🚀'}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-500 font-medium">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
