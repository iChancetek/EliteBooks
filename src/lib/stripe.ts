/**
 * EliteBooks — Stripe Client Configuration
 */

// Stripe client will be initialized when keys are provided
export const STRIPE_CONFIG = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};

/**
 * Create a payment intent for an invoice
 */
export async function createPaymentIntent(amount: number, currency = 'usd', invoiceId: string) {
  // In production, use the stripe npm package:
  // const stripe = new Stripe(STRIPE_CONFIG.secretKey);
  // return await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency, metadata: { invoiceId } });

  console.log(`[Stripe] Creating payment intent: $${amount} for invoice ${invoiceId}`);
  return {
    id: `pi_${Date.now()}`,
    clientSecret: `pi_${Date.now()}_secret`,
    amount: Math.round(amount * 100),
    currency,
    status: 'requires_payment_method',
  };
}

/**
 * Create an invoice payment link
 */
export async function createPaymentLink(invoiceId: string, amount: number, description: string) {
  console.log(`[Stripe] Creating payment link for invoice ${invoiceId}`);
  return {
    id: `plink_${Date.now()}`,
    url: `https://checkout.stripe.com/pay/${invoiceId}`,
    amount: Math.round(amount * 100),
  };
}
