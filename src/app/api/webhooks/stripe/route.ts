/**
 * EliteBooks — Stripe Webhook Handler
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // In production: verify webhook signature with stripe.webhooks.constructEvent()
    const event = JSON.parse(body);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log(`[Stripe Webhook] Payment succeeded: ${event.data.object.id}`);
        // Mark invoice as paid, create journal entry
        break;

      case 'payment_intent.payment_failed':
        console.log(`[Stripe Webhook] Payment failed: ${event.data.object.id}`);
        // Send payment failure notification
        break;

      case 'invoice.payment_succeeded':
        console.log(`[Stripe Webhook] Invoice paid: ${event.data.object.id}`);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
