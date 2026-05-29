import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DISPOSABLE_EMAIL_DOMAINS } from '@/lib/disposable-emails'

// ── Rate limiting en memoria ──────────────────────────────────────────────────
// (por instancia serverless — primera línea de defensa)
const ipAttempts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT   = 5
const WINDOW_MS    = 15 * 60 * 1000 // 15 minutos

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function checkRateLimit(ip: string): boolean {
  const now   = Date.now()
  const entry = ipAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ── Verificar token de Cloudflare Turnstile ───────────────────────────────────
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // Turnstile no configurado → se omite

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  })
  const data = await res.json() as { success: boolean }
  return data.success
}

// ── Handler POST /api/register ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getIp(req)

  // 1. Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera 15 minutos antes de intentar de nuevo.' },
      { status: 429 }
    )
  }

  const body = await req.json() as {
    email?: string
    password?: string
    fullName?: string
    turnstileToken?: string
  }
  const { email, password, fullName, turnstileToken } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos.' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'La contraseña debe tener mínimo 6 caracteres.' }, { status: 400 })
  }

  // 2. Verificar Turnstile (solo si está configurado)
  const turnstileOk = await verifyTurnstile(turnstileToken ?? '', ip)
  if (!turnstileOk) {
    return NextResponse.json(
      { error: 'Verificación de seguridad fallida. Intenta de nuevo.' },
      { status: 400 }
    )
  }

  // 3. Bloquear dominios de email desechables
  const domain = email.toLowerCase().split('@')[1] ?? ''
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return NextResponse.json(
      { error: 'Los emails temporales no están permitidos. Usa tu email real.' },
      { status: 400 }
    )
  }

  // 4. Crear usuario con Admin API (email auto-confirmado, sin necesidad de SMTP)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email.toLowerCase().trim(),
    password,
    user_metadata: { full_name: fullName ?? '' },
    email_confirm: true, // ← sin confirmación de email, sin SMTP
  })

  if (error) {
    // Mensajes de error en español
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'Este email ya tiene una cuenta. ¿Ya tienes cuenta? Inicia sesión.' },
        { status: 409 }
      )
    }
    if (error.message.includes('invalid') && error.message.includes('email')) {
      return NextResponse.json({ error: 'El formato del email no es válido.' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, userId: data.user?.id }, { status: 201 })
}
