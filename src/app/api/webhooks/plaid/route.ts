/**
 * EliteBooks — Plaid Webhook Handler
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookType = body.webhook_type;
    const webhookCode = body.webhook_code;

    console.log(`[Plaid Webhook] ${webhookType}: ${webhookCode}`);

    switch (webhookType) {
      case 'TRANSACTIONS':
        if (webhookCode === 'SYNC_UPDATES_AVAILABLE') {
          // New transactions available — trigger Expense Agent
          console.log(`[Plaid] New transactions available for item: ${body.item_id}`);
          // TODO: Fetch new transactions and pass to Expense Agent for categorization
        }
        break;

      case 'ITEM':
        if (webhookCode === 'ERROR') {
          console.log(`[Plaid] Item error: ${body.item_id}`, body.error);
          // Notify user of connection issue
        }
        break;

      case 'AUTH':
        console.log(`[Plaid] Auth webhook: ${webhookCode}`);
        break;

      default:
        console.log(`[Plaid] Unhandled webhook: ${webhookType}/${webhookCode}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Plaid Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
