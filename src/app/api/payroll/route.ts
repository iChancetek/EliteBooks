/**
 * EliteBooks — Payroll API
 * GET: List employees | POST: Create employee or run payroll
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, createEmployee, createPayStub, getPayStubs } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[Payroll API] Auth fallback');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'employees' or 'paystubs'

    if (type === 'paystubs') {
      const year = searchParams.get('year') || undefined;
      const month = searchParams.get('month') || undefined;
      const stubs = await getPayStubs(orgId, { year, month });
      return NextResponse.json({ success: true, data: stubs });
    }

    const employees = await getEmployees(orgId);
    return NextResponse.json({ success: true, data: employees });
  } catch (error: any) {
    console.error('[Payroll GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const body = await request.json();

    if (body.action === 'run_payroll') {
      // Run payroll: create pay stubs for all active employees
      const employees = await getEmployees(orgId);
      if (employees.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No active employees found. Add employees first.' },
          { status: 400 }
        );
      }

      const today = new Date();
      const payDate = today.toISOString().split('T')[0];
      const periodStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

      const stubs = [];
      for (const emp of employees as any[]) {
        const monthlySalary = (emp.salary || 0) / 12;
        const federalTax = monthlySalary * 0.12;
        const stateTax = monthlySalary * 0.05;
        const socialSecurity = monthlySalary * 0.062;
        const medicare = monthlySalary * 0.0145;
        const netPay = monthlySalary - federalTax - stateTax - socialSecurity - medicare;

        const stub = await createPayStub(orgId, {
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          payPeriodStart: periodStart,
          payPeriodEnd: periodEnd,
          payDate,
          grossPay: monthlySalary,
          federalTax,
          stateTax,
          socialSecurity,
          medicare,
          otherDeductions: 0,
          netPay,
        });
        stubs.push(stub);
      }

      return NextResponse.json({ success: true, data: stubs, message: `Payroll processed for ${stubs.length} employees` }, { status: 201 });
    }

    // Default: create employee
    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { success: false, error: 'firstName and lastName are required' },
        { status: 400 }
      );
    }

    const employee = await createEmployee(orgId, body);
    return NextResponse.json({ success: true, data: employee }, { status: 201 });
  } catch (error: any) {
    console.error('[Payroll POST]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
