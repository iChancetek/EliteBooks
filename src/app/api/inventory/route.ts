/**
 * EliteBooks — Inventory API
 * GET: List products | POST: Create product | PATCH: Update product
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, updateProduct } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[Inventory API] Auth fallback');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const products = await getProducts(orgId);
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('[Inventory GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const body = await request.json();

    if (!body.name || body.unitPrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'name and unitPrice are required' },
        { status: 400 }
      );
    }

    const product = await createProduct(orgId, body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error('[Inventory POST]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Product id is required' }, { status: 400 });
    }

    const updated = await updateProduct(orgId, body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('[Inventory PATCH]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
