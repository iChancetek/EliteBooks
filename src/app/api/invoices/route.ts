/**
 * EliteBooks — Invoices API
 * GET: List/filter invoices | POST: Create invoice
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, createInvoice } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

async function getOrgId(request: NextRequest): Promise<string> {
  // Extract user from Authorization header, fall back to default org
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid; // Use UID as orgId for now (single-tenant per user)
    }
  } catch (e) {
    console.warn('[Invoices API] Auth fallback to default org');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || undefined;
    const month = searchParams.get('month') || undefined;

    const invoices = await getInvoices(orgId, { year, month });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    console.error('[Invoices GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const body = await request.json();

    if (!body.clientName || !body.total) {
      return NextResponse.json(
        { success: false, error: 'clientName and total are required' },
        { status: 400 }
      );
    }

    const invoice = await createInvoice(orgId, body);
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    console.error('[Invoices POST]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
