import { PLANS, type PlanId } from './stripe-config'

export type Subscription = {
  plan: string
  status: string
  current_period_end: string
}

export function getAccessibleHours(subscription: Subscription | null): number {
  if (!subscription || subscription.status !== 'active') return 0

  const plan = PLANS[subscription.plan as PlanId]
  if (!plan) return 0

  return plan.hoursUnlocked
}

export function canAccessAllLevels(subscription: Subscription | null): boolean {
  if (!subscription || subscription.status !== 'active') return false
  return subscription.plan === 'annual'
}

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false
  return subscription.status === 'active'
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
