/**
 * EliteBooks — Forecast API
 * GET: Multi-period forecasting engine — computes MoM, QoQ, and YoY projections
 * from real Firestore data using statistical forecasting (weighted moving averages).
 *
 * Query params:
 *   ?domain=revenue|expenses|payroll|personal|cashflow|finops
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, getExpenses, getPayStubs } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';
import {
  computeMonthlyForecast,
  computeQuarterlyForecast,
  computeAnnualForecast,
  ForecastableRecord,
} from '@/lib/forecasting-engine';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[Forecast API] Auth fallback');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'cashflow';

    // Fetch real data from Firestore
    const [invoices, expenses, payStubs] = await Promise.all([
      getInvoices(orgId).catch(() => []),
      getExpenses(orgId).catch(() => []),
      getPayStubs(orgId).catch(() => []),
    ]);

    // Convert to ForecastableRecords
    const revenueRecords: ForecastableRecord[] = (invoices as any[]).map((inv: any) => ({
      date: inv.date || inv.issueDate || inv.createdAt || new Date().toISOString(),
      amount: inv.total || inv.amount || 0,
      category: 'Revenue',
      type: 'income',
    }));

    const expenseRecords: ForecastableRecord[] = (expenses as any[])
      .filter((e: any) => e.status !== 'deleted' && !e.isPersonal)
      .map((exp: any) => ({
        date: exp.date || exp.createdAt || new Date().toISOString(),
        amount: exp.amount || 0,
        category: exp.category || 'General',
        type: 'expense',
      }));

    const personalRecords: ForecastableRecord[] = (expenses as any[])
      .filter((e: any) => e.status !== 'deleted' && e.isPersonal)
      .map((exp: any) => ({
        date: exp.date || exp.createdAt || new Date().toISOString(),
        amount: exp.amount || 0,
        category: exp.category || 'Personal',
        type: 'personal',
      }));

    const payrollRecords: ForecastableRecord[] = (payStubs as any[]).map((stub: any) => ({
      date: stub.payDate || stub.createdAt || new Date().toISOString(),
      amount: stub.netPay || stub.grossPay || stub.amount || 0,
      category: 'Payroll',
      type: 'payroll',
    }));

    // Select records based on domain
    let targetRecords: ForecastableRecord[];

    switch (domain) {
      case 'revenue':
        targetRecords = revenueRecords;
        break;
      case 'expenses':
      case 'finops':
        targetRecords = expenseRecords;
        break;
      case 'personal':
        targetRecords = personalRecords;
        break;
      case 'payroll':
        targetRecords = payrollRecords;
        break;
      case 'cashflow':
      default:
        // Cash flow = inflows - outflows
        targetRecords = [
          ...revenueRecords,
          ...expenseRecords.map(r => ({ ...r, amount: -r.amount })),
        ];
        break;
    }

    // Compute all three horizons
    const monthly = computeMonthlyForecast(targetRecords);
    const quarterly = computeQuarterlyForecast(targetRecords);
    const annual = computeAnnualForecast(targetRecords);

    return NextResponse.json({
      success: true,
      domain,
      monthly,
      quarterly,
      annual,
    });
  } catch (error: any) {
    console.error('[Forecast GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
