/**
 * Rate Limiter simple con Edge-compatible Map
 * Protege endpoints críticos contra ataques de fuerza bruta
 * En producción con múltiples instancias → usar Upstash Redis
 */

type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

type RateLimitConfig = {
  /** Requests máximos permitidos en la ventana */
  limit: number
  /** Ventana de tiempo en segundos */
  windowSecs: number
}

const CONFIGS: Record<string, RateLimitConfig> = {
  // Login: 5 intentos por minuto por IP
  auth: { limit: 5, windowSecs: 60 },
  // Checkout: 3 intentos por 5 minutos por IP (evita spam de pagos)
  checkout: { limit: 3, windowSecs: 300 },
  // API general: 60 requests por minuto
  api: { limit: 60, windowSecs: 60 },
}

export function checkRateLimit(
  identifier: string,
  type: keyof typeof CONFIGS = 'api'
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = CONFIGS[type]
  const key = `${type}:${identifier}`
  const now = Date.now()

  const entry = store.get(key)

  // Si no existe o ya expiró la ventana → reset
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowSecs * 1000 })
    return { allowed: true, remaining: config.limit - 1, resetIn: config.windowSecs }
  }

  // Si superó el límite → bloquear
  if (entry.count >= config.limit) {
    const resetIn = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, resetIn }
  }

  // Incrementar contador
  entry.count++
  store.set(key, entry)
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetIn: Math.ceil((entry.resetAt - now) / 1000),
  }
}

/** Limpia entradas expiradas cada 5 minutos para evitar memory leaks */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key)
    }
  }, 5 * 60 * 1000)
}
