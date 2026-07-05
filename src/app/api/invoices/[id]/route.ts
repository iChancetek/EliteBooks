/**
 * EliteBooks — Single Invoice API
 * PATCH: Update invoice | DELETE: Remove invoice
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateInvoice, deleteInvoice, getInvoice } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[Invoice API] Auth fallback');
  }
  return 'default';
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orgId = await getOrgId(request);
    const invoice = await getInvoice(orgId, id);
    if (!invoice) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orgId = await getOrgId(request);
    const body = await request.json();
    const updated = await updateInvoice(orgId, id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orgId = await getOrgId(request);
    await deleteInvoice(orgId, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
