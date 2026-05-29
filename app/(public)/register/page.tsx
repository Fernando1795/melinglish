'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Declara el objeto global de Turnstile (cargado por el script externo)
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        'expired-callback': () => void
        'error-callback': () => void
        theme: string
        size: string
      }) => string
      reset: (widgetId: string) => void
    }
  }
}

export default function RegisterPage() {
  const router       = useRouter()
  const [fullName, setFullName]       = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef  = useRef<HTMLDivElement>(null)
  const widgetIdRef   = useRef<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Cargar Cloudflare Turnstile si está configurado
  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return

    const script = document.createElement('script')
    script.src   = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      if (!window.turnstile || !turnstileRef.current) return
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
        'error-callback':   () => setTurnstileToken(null),
        theme: 'light',
        size: 'normal',
      })
    }

    return () => { document.head.removeChild(script) }
  }, [siteKey])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Si Turnstile está activo y aún no hay token → esperar
    if (siteKey && !turnstileToken) {
      setError('Completa la verificación de seguridad.')
      setLoading(false)
      return
    }

    // Llamar a la API server-side (con rate limit + bloqueo de emails desechables)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, turnstileToken }),
    })

    const data = await res.json() as { error?: string; success?: boolean }

    if (!res.ok || data.error) {
      setError(data.error ?? 'No se pudo crear la cuenta.')
      setLoading(false)
      // Resetear Turnstile en error
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken(null)
      }
      return
    }

    // Registro exitoso → iniciar sesión automáticamente
    const supabase = createClient()
    await supabase.auth.signInWithPassword({ email, password })

    router.push('/app/onboarding')
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

          {/* Widget de Cloudflare Turnstile (solo si está configurado) */}
          {siteKey && (
            <div className="flex justify-center">
              <div ref={turnstileRef} />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || (!!siteKey && !turnstileToken)}
            className="w-full font-black text-lg py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
