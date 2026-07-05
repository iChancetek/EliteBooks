/**
 * EliteBooks — Expenses API
 * GET: List/filter expenses | POST: Create expense
 */

import { NextRequest, NextResponse } from 'next/server';
import { getExpenses, createExpense } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[Expenses API] Auth fallback');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || undefined;
    const month = searchParams.get('month') || undefined;

    const expenses = await getExpenses(orgId, { year, month });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error: any) {
    console.error('[Expenses GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const body = await request.json();

    if (!body.vendor || !body.amount) {
      return NextResponse.json(
        { success: false, error: 'vendor and amount are required' },
        { status: 400 }
      );
    }

    const expense = await createExpense(orgId, body);
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error: any) {
    console.error('[Expenses POST]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
