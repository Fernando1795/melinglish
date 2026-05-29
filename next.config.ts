import type { NextConfig } from 'next'

const securityHeaders = [
  // Evita que la app sea embebida en iframes de otros sitios (clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Evita que el navegador adivine el tipo de contenido (sniffing)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Fuerza HTTPS por 1 año (solo en producción)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Controla qué información se envía en el header Referer
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restringe acceso a features del navegador
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Evita XSS — solo permite scripts del propio dominio y CDNs necesarios
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
      "media-src 'self' https:",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  // Evita exponer información del servidor en los headers
  poweredByHeader: false,
}

export default nextConfig
