/**
 * EliteBooks — Reports API
 * GET: Financial summary with aggregations from real Firestore data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFinancialSummary } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[Reports API] Auth fallback');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || undefined;
    const month = searchParams.get('month') || undefined;

    const summary = await getFinancialSummary(orgId, { year, month });
    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    console.error('[Reports GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
