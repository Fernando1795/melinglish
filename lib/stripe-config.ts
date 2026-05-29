// Configuración de planes — segura para usar en cliente y servidor
export const PLANS = {
  weekly: {
    id: 'weekly',
    name: 'Semanal',
    price: 20000,
    currency: 'cop',
    interval: 'week' as const,
    priceId: process.env.STRIPE_PRICE_WEEKLY ?? '',
    hoursUnlocked: 14,
    description: '2 horas diarias × 7 días',
    color: 'from-blue-400 to-blue-600',
  },
  monthly: {
    id: 'monthly',
    name: 'Mensual',
    price: 70000,
    currency: 'cop',
    interval: 'month' as const,
    priceId: process.env.STRIPE_PRICE_MONTHLY ?? '',
    hoursUnlocked: 30,
    description: 'Nivel completo desbloqueado',
    color: 'from-orange-400 to-orange-600',
    popular: true,
  },
  annual: {
    id: 'annual',
    name: 'Anual',
    price: 750000,
    currency: 'cop',
    interval: 'year' as const,
    priceId: process.env.STRIPE_PRICE_ANNUAL ?? '',
    hoursUnlocked: 999,
    description: 'Todos los niveles A1 + A2',
    color: 'from-purple-400 to-purple-600',
  },
} as const

export type PlanId = keyof typeof PLANS

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
