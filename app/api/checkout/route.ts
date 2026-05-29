import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS, type PlanId } from '@/lib/stripe'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limiting por IP — máx 3 intentos de checkout por 5 minutos
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'

  const { allowed, remaining, resetIn } = checkRateLimit(ip, 'checkout')
  if (!allowed) {
    return NextResponse.json(
      { error: `Demasiados intentos. Espera ${resetIn} segundos.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(resetIn),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  // Verificar autenticación
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Validar y sanitizar el body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const { planId } = body as { planId?: string }

  // Validar que el planId sea uno de los planes válidos (previene inyección)
  if (!planId || !['weekly', 'monthly', 'annual'].includes(planId)) {
    return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
  }

  const plan = PLANS[planId as PlanId]
  if (!plan || !plan.priceId) {
    return NextResponse.json({ error: 'Plan no configurado' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    customer_email: user.email,
    metadata: {
      userId: user.id,
      planId,
      // Timestamp para auditoría
      createdAt: new Date().toISOString(),
    },
    success_url: `${appUrl}/app/dashboard?success=true`,
    cancel_url: `${appUrl}/pricing`,
    // Expira en 30 minutos (evita sesiones huérfanas)
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  })

  return NextResponse.json(
    { url: session.url },
    {
      headers: {
        'X-RateLimit-Remaining': String(remaining),
        'Cache-Control': 'no-store',
      },
    }
  )
}
