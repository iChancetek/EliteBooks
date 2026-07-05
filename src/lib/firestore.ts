/**
 * EliteBooks — Firestore Service Layer
 * Production CRUD operations for all entities using Firebase Admin SDK
 */

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// ─── Types ───
export interface DateFilter {
  year?: string;
  month?: string;
}

function buildDateRange(filter: DateFilter): { start: string; end: string } | null {
  if (!filter.year || filter.year === 'All Years') return null;

  const year = parseInt(filter.year);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (!filter.month || filter.month === 'All Months') {
    return { start: `${year}-01-01`, end: `${year}-12-31` };
  }

  if (filter.month.startsWith('Wk')) {
    // Week filters: Wk 1 = days 1-7, Wk 2 = 8-14, Wk 3 = 15-21, Wk 4 = 22-31
    // Requires knowing the current month context, return full year for now
    return { start: `${year}-01-01`, end: `${year}-12-31` };
  }

  const monthIdx = months.indexOf(filter.month);
  if (monthIdx === -1) return null;

  const m = (monthIdx + 1).toString().padStart(2, '0');
  const lastDay = new Date(year, monthIdx + 1, 0).getDate();
  return { start: `${year}-${m}-01`, end: `${year}-${m}-${lastDay}` };
}

// ─── Collection Helpers ───
function orgCollection(orgId: string, collectionName: string) {
  return adminDb.collection('organizations').doc(orgId).collection(collectionName);
}

// ═══════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════

export async function getInvoices(orgId: string, filter?: DateFilter) {
  let query: FirebaseFirestore.Query = orgCollection(orgId, 'invoices').orderBy('createdAt', 'desc');

  const range = filter ? buildDateRange(filter) : null;
  if (range) {
    query = query.where('issueDate', '>=', range.start).where('issueDate', '<=', range.end);
  }

  const snapshot = await query.limit(500).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getInvoice(orgId: string, invoiceId: string) {
  const doc = await orgCollection(orgId, 'invoices').doc(invoiceId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createInvoice(orgId: string, data: Record<string, any>) {
  const now = new Date().toISOString();
  const count = (await orgCollection(orgId, 'invoices').count().get()).data().count;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const invoice = {
    ...data,
    orgId,
    number: data.number || invoiceNumber,
    status: data.status || 'draft',
    amountPaid: data.amountPaid || 0,
    amountDue: data.total || 0,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await orgCollection(orgId, 'invoices').add(invoice);
  return { id: ref.id, ...invoice };
}

export async function updateInvoice(orgId: string, invoiceId: string, data: Record<string, any>) {
  const ref = orgCollection(orgId, 'invoices').doc(invoiceId);
  await ref.update({ ...data, updatedAt: new Date().toISOString() });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

export async function deleteInvoice(orgId: string, invoiceId: string) {
  await orgCollection(orgId, 'invoices').doc(invoiceId).delete();
  return { success: true };
}

// ═══════════════════════════════════════════
// EXPENSES
// ═══════════════════════════════════════════

export async function getExpenses(orgId: string, filter?: DateFilter) {
  let query: FirebaseFirestore.Query = orgCollection(orgId, 'expenses').orderBy('date', 'desc');

  const range = filter ? buildDateRange(filter) : null;
  if (range) {
    query = query.where('date', '>=', range.start).where('date', '<=', range.end);
  }

  const snapshot = await query.limit(500).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createExpense(orgId: string, data: Record<string, any>) {
  const now = new Date().toISOString();
  const expense = {
    ...data,
    orgId,
    aiCategorized: data.aiCategorized ?? false,
    aiConfidence: data.aiConfidence ?? 1.0,
    status: data.status || 'pending',
    createdAt: now,
    updatedAt: now,
  };

  const ref = await orgCollection(orgId, 'expenses').add(expense);
  return { id: ref.id, ...expense };
}

export async function updateExpense(orgId: string, expenseId: string, data: Record<string, any>) {
  const ref = orgCollection(orgId, 'expenses').doc(expenseId);
  await ref.update({ ...data, updatedAt: new Date().toISOString() });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

export async function deleteExpense(orgId: string, expenseId: string) {
  // Soft delete — mark as deleted with a TTL
  await orgCollection(orgId, 'expenses').doc(expenseId).update({
    status: 'deleted',
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { success: true };
}

// ═══════════════════════════════════════════
// EMPLOYEES (Payroll)
// ═══════════════════════════════════════════

export async function getEmployees(orgId: string) {
  const snapshot = await orgCollection(orgId, 'employees')
    .where('isActive', '==', true)
    .orderBy('lastName', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createEmployee(orgId: string, data: Record<string, any>) {
  const now = new Date().toISOString();
  const employee = {
    ...data,
    orgId,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await orgCollection(orgId, 'employees').add(employee);
  return { id: ref.id, ...employee };
}

export async function updateEmployee(orgId: string, employeeId: string, data: Record<string, any>) {
  const ref = orgCollection(orgId, 'employees').doc(employeeId);
  await ref.update({ ...data, updatedAt: new Date().toISOString() });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

// ═══════════════════════════════════════════
// PAY STUBS (Payroll Runs)
// ═══════════════════════════════════════════

export async function getPayStubs(orgId: string, filter?: DateFilter) {
  let query: FirebaseFirestore.Query = orgCollection(orgId, 'paystubs').orderBy('payDate', 'desc');

  const range = filter ? buildDateRange(filter) : null;
  if (range) {
    query = query.where('payDate', '>=', range.start).where('payDate', '<=', range.end);
  }

  const snapshot = await query.limit(200).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createPayStub(orgId: string, data: Record<string, any>) {
  const now = new Date().toISOString();
  const stub = { ...data, orgId, status: 'processed', createdAt: now };
  const ref = await orgCollection(orgId, 'paystubs').add(stub);
  return { id: ref.id, ...stub };
}

// ═══════════════════════════════════════════
// PRODUCTS (Inventory)
// ═══════════════════════════════════════════

export async function getProducts(orgId: string) {
  const snapshot = await orgCollection(orgId, 'products')
    .where('isActive', '==', true)
    .orderBy('name', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createProduct(orgId: string, data: Record<string, any>) {
  const now = new Date().toISOString();
  const product = {
    ...data,
    orgId,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await orgCollection(orgId, 'products').add(product);
  return { id: ref.id, ...product };
}

export async function updateProduct(orgId: string, productId: string, data: Record<string, any>) {
  const ref = orgCollection(orgId, 'products').doc(productId);
  await ref.update({ ...data, updatedAt: new Date().toISOString() });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

// ═══════════════════════════════════════════
// FINANCIAL SUMMARY (Reports / Dashboard)
// ═══════════════════════════════════════════

export async function getFinancialSummary(orgId: string, filter?: DateFilter) {
  const [invoices, expenses] = await Promise.all([
    getInvoices(orgId, filter),
    getExpenses(orgId, filter),
  ]);

  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  const totalPaid = invoices
    .filter((inv: any) => inv.status === 'paid')
    .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  const totalOutstanding = invoices
    .filter((inv: any) => inv.status !== 'paid' && inv.status !== 'void')
    .reduce((sum: number, inv: any) => sum + (inv.amountDue || 0), 0);
  const totalOverdue = invoices
    .filter((inv: any) => inv.status === 'overdue')
    .reduce((sum: number, inv: any) => sum + (inv.amountDue || 0), 0);

  const totalExpenses = expenses
    .filter((exp: any) => exp.status !== 'deleted')
    .reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Expense breakdown by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach((exp: any) => {
    if (exp.status !== 'deleted') {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + (exp.amount || 0);
    }
  });

  // Invoice breakdown by status
  const invoicesByStatus: Record<string, number> = {};
  invoices.forEach((inv: any) => {
    invoicesByStatus[inv.status] = (invoicesByStatus[inv.status] || 0) + 1;
  });

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    totalPaid,
    totalOutstanding,
    totalOverdue,
    invoiceCount: invoices.length,
    expenseCount: expenses.length,
    expensesByCategory,
    invoicesByStatus,
    invoices,
    expenses,
  };
}
