/**
 * EliteBooks — Customers API
 * GET: List customers | POST: Create customer | PATCH: Update customer | DELETE: Delete customer
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[Customers API] Auth fallback');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const customers = await getCustomers(orgId);
    return NextResponse.json({ success: true, data: customers });
  } catch (error: any) {
    console.error('[Customers GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required' },
        { status: 400 }
      );
    }

    const customer = await createCustomer(orgId, body);
    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error: any) {
    console.error('[Customers POST]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Customer id is required' }, { status: 400 });
    }

    const { id, ...updateData } = body;
    const customer = await updateCustomer(orgId, id, updateData);
    return NextResponse.json({ success: true, data: customer });
  } catch (error: any) {
    console.error('[Customers PATCH]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Customer id is required' }, { status: 400 });
    }

    await deleteCustomer(orgId, id);
    return NextResponse.json({ success: true, message: 'Customer deleted' });
  } catch (error: any) {
    console.error('[Customers DELETE]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
