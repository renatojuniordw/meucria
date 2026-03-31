import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { updateProfile } from '@/lib/repositories/profileRepo'
import { invalidateProfileCache } from '@/lib/cache'
import { sendPlanUpgradedEmail } from '@/lib/resend/templates/planUpgraded'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      // Find user by stripe_customer_id
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, plan')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        // Determine plan from price
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro' : 'basic'

        await updateProfile(profile.id, {
          plan: plan as 'basic' | 'pro',
          stripe_subscription_id: subscriptionId,
        })
        await invalidateProfileCache(profile.id)
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object
      const customerId = invoice.customer as string

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, plan')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.id)
        if (authUser?.user?.email) {
          const planName = profile.plan === 'pro' ? 'Pro' : 'Básico'
          await sendPlanUpgradedEmail(authUser.user.email, planName)
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer as string

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await updateProfile(profile.id, {
          plan: 'free',
          stripe_subscription_id: null,
        })
        await invalidateProfileCache(profile.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
