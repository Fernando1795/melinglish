// Stripe SDK — solo usar en servidor (API routes, Server Components)
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export { PLANS, formatCOP, type PlanId } from './stripe-config'
