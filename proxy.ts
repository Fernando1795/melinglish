import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Bloquear user-agents sospechosos (bots comunes) ──────────────────
  const ua = request.headers.get('user-agent') ?? ''
  const suspiciousUAs = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'python-requests/2.']
  if (suspiciousUAs.some(s => ua.toLowerCase().includes(s))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── Bloquear acceso directo al webhook desde navegadores ─────────────
  if (pathname === '/api/webhooks/stripe' && request.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }

  // ── Bloquear rutas admin de acceso externo sin autenticación ─────────
  // (verificación adicional fuera de Supabase)
  if (pathname.startsWith('/admin') && request.method !== 'GET' && request.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isStudentRoute = pathname.startsWith('/app')
  const isAdminRoute = pathname.startsWith('/admin')

  // Proteger rutas privadas
  if ((isStudentRoute || isAdminRoute) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Proteger rutas admin solo para admins
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/app/dashboard', request.url))
    }
  }

  // Redirigir usuarios logueados fuera de login/register
  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  // Si el usuario no completó el onboarding → redirigir (excepto si ya está ahí o es admin)
  if (user && isStudentRoute && pathname !== '/app/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, role')
      .eq('id', user.id)
      .single()

    if (profile && !profile.onboarding_completed && profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/app/onboarding', request.url))
    }
  }

  // Añadir headers de seguridad extra en todas las respuestas
  supabaseResponse.headers.set('X-Request-ID', crypto.randomUUID())
  supabaseResponse.headers.set('Cache-Control', 'no-store, must-revalidate')

  return supabaseResponse
}

export const config = {
  matcher: [
    '/app/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/api/webhooks/:path*',
    '/api/checkout',
    '/api/register',
  ],
}
