import { PLANS, type PlanId } from './stripe-config'

export type Subscription = {
  plan: string
  status: string
  current_period_end: string
}

// Orden y horas totales de cada nivel (agregar A2, A3... aquí cuando existan)
const LEVEL_ORDER = ['A1', 'A2'] as const
const LEVEL_HOURS: Record<string, number> = {
  A1: 70,
  A2: 30,
}

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false
  return subscription.status === 'active'
}

/**
 * Calcula cuántas horas del nivel indicado puede ver el usuario.
 *
 * Anual   → 999h (todo desbloqueado)
 * Mensual → horas totales del nivel elegido (current_level), 0 en otros
 * Semanal → acumulativo: weekly_days × 2h, cascada entre niveles
 *            Ej: 21 días = 42h → A1(70h) completo no → 42h de A1
 *                22 días = 44h → 44h ≤ 70 → 44h de A1
 *                36 días = 72h → A1 lleno (70h) + 2h de A2
 */
export function getAccessibleHoursForLevel(
  levelId: string,
  subscription: Subscription | null,
  currentLevel: string,
  weeklyDaysAccumulated: number
): number {
  if (!subscription || subscription.status !== 'active') return 0

  switch (subscription.plan) {
    case 'annual':
      return 999 // Todos los niveles completos

    case 'monthly':
      // Mensual desbloquea SOLO el nivel elegido en onboarding
      return levelId === currentLevel ? (LEVEL_HOURS[levelId] ?? 999) : 0

    case 'weekly': {
      const totalHours = weeklyDaysAccumulated * 2
      // Calcula cuántas horas "consume" cada nivel anterior antes de llegar a este
      let consumed = 0
      for (const level of LEVEL_ORDER) {
        if (level === levelId) {
          // El sobrante disponible para este nivel
          const available = Math.max(0, totalHours - consumed)
          return Math.min(available, LEVEL_HOURS[level] ?? 0)
        }
        consumed += LEVEL_HOURS[level] ?? 0
        if (consumed > totalHours) return 0 // No llega a este nivel
      }
      return 0
    }

    default:
      return 0
  }
}

/**
 * Determina si el usuario puede acceder a UN NIVEL específico.
 * (tiene al menos 1 hora de ese nivel desbloqueada)
 */
export function canAccessLevel(
  levelId: string,
  subscription: Subscription | null,
  currentLevel: string,
  weeklyDaysAccumulated: number = 0
): boolean {
  return getAccessibleHoursForLevel(levelId, subscription, currentLevel, weeklyDaysAccumulated) > 0
}

/**
 * Retrocompatibilidad: devuelve las horas del nivel actual del usuario.
 * Usado en páginas que aún no reciben weeklyDaysAccumulated.
 */
export function getAccessibleHours(subscription: Subscription | null): number {
  if (!subscription || subscription.status !== 'active') return 0
  const plan = PLANS[subscription.plan as PlanId]
  if (!plan) return 0
  return plan.hoursUnlocked
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
