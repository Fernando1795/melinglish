import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

type SubData = {
  id: string
  status: string
  current_period_end: number
}

async function retrieveSub(id: string): Promise<SubData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await stripe.subscriptions.retrieve(id)) as any
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  // Rechazar si no viene la firma (previene requests directos al endpoint)
  if (!sig) {
    return NextResponse.json({ error: 'Firma requerida' }, { status: 400 })
  }

  // Verificar que el webhook viene de Stripe (criptográficamente)
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  // Verificar que el evento no es demasiado antiguo (previene replay attacks)
  const eventAge = Date.now() / 1000 - (event.created ?? 0)
  if (eventAge > 300) { // 5 minutos
    return NextResponse.json({ error: 'Evento expirado' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, planId } = session.metadata!

      const sub = await retrieveSub(session.subscription as string)

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: sub.id,
        plan: planId,
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }, { onConflict: 'stripe_subscription_id' })
      break
    }

    case 'invoice.payment_succeeded': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any
      const subId = invoice.subscription as string
      const sub = await retrieveSub(subId)

      await supabase
        .from('subscriptions')
        .update({
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subId)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.updated': {
      const sub = await retrieveSub((event.data.object as Stripe.Subscription).id)
      await supabase
        .from('subscriptions')
        .update({
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
