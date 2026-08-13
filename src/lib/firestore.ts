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

// Automatic Seed Helper for New Users
async function ensureSeeded(orgId: string) {
  try {
    const seedMarker = await orgCollection(orgId, 'meta').doc('seeded').get();
    if (seedMarker.exists) return;

    const now = new Date().toISOString();
    const dateStr = now.split('T')[0];
    const batch = adminDb.batch();

    // 1. Seed Expenses
    const sampleExpenses = [
      { vendor: 'Google Cloud Platform', amount: 1420.50, category: 'Software & SaaS', date: dateStr, description: 'Cloud Infrastructure & API Hosting', status: 'approved', isPersonal: false, isFinOps: true, resourceType: 'Compute/GPU' },
      { vendor: 'Staples Office Supplies', amount: 342.10, category: 'Office & Supplies', date: dateStr, description: 'Ergonomic chairs & paper supplies', status: 'approved', isPersonal: false },
      { vendor: 'Uber Business Travel', amount: 84.50, category: 'Travel & Transport', date: dateStr, description: 'Client meeting transit', status: 'approved', isPersonal: false },
      { vendor: 'Whole Foods Market', amount: 165.40, category: 'Groceries', date: dateStr, description: 'Weekly groceries', status: 'approved', isPersonal: true },
      { vendor: 'Netflix & Spotify', amount: 35.98, category: 'Subscriptions', date: dateStr, description: 'Personal media subscriptions', status: 'approved', isPersonal: true }
    ];
    sampleExpenses.forEach(exp => {
      const ref = orgCollection(orgId, 'expenses').doc();
      batch.set(ref, { ...exp, orgId, aiCategorized: true, aiConfidence: 0.98, createdAt: now, updatedAt: now });
    });

    // 2. Seed Invoices
    const sampleInvoices = [
      { number: 'INV-2026-0001', clientName: 'Acme Corp', clientEmail: 'billing@acme.com', issueDate: dateStr, dueDate: dateStr, status: 'paid', total: 8500.00, amountPaid: 8500.00, amountDue: 0, lineItems: [{ description: 'AI Development', quantity: 1, unitPrice: 8500 }] },
      { number: 'INV-2026-0002', clientName: 'Starlight Tech', clientEmail: 'ap@starlight.io', issueDate: dateStr, dueDate: dateStr, status: 'sent', total: 4200.00, amountPaid: 0, amountDue: 4200.00, lineItems: [{ description: 'Cloud Consulting', quantity: 1, unitPrice: 4200 }] }
    ];
    sampleInvoices.forEach(inv => {
      const ref = orgCollection(orgId, 'invoices').doc();
      batch.set(ref, { ...inv, orgId, createdAt: now, updatedAt: now });
    });

    // 3. Seed Products
    const sampleProducts = [
      { name: 'Enterprise License Key', sku: 'LIC-ENT-001', category: 'Software', quantity: 50, reorderPoint: 10, unitPrice: 299.00, costPrice: 50.00, isActive: true },
      { name: 'Hardware Security Key', sku: 'HW-SEC-002', category: 'Hardware', quantity: 20, reorderPoint: 5, unitPrice: 85.00, costPrice: 30.00, isActive: true }
    ];
    sampleProducts.forEach(prod => {
      const ref = orgCollection(orgId, 'products').doc();
      batch.set(ref, { ...prod, orgId, createdAt: now, updatedAt: now });
    });

    // 4. Seed Employees
    const sampleEmployees = [
      { firstName: 'Sarah', lastName: 'Connor', email: 'sarah@company.com', role: 'Lead Architect', department: 'Engineering', employmentType: 'full_time', salary: 145000, isActive: true },
      { firstName: 'Alex', lastName: 'Mercer', email: 'alex@company.com', role: 'Senior Developer', department: 'Engineering', employmentType: 'full_time', salary: 120000, isActive: true }
    ];
    sampleEmployees.forEach(emp => {
      const ref = orgCollection(orgId, 'employees').doc();
      batch.set(ref, { ...emp, orgId, createdAt: now, updatedAt: now });
    });

    // Mark Seeded
    batch.set(orgCollection(orgId, 'meta').doc('seeded'), { seededAt: now });
    await batch.commit();
  } catch (e) {
    console.error('Error seeding default data:', e);
  }
}

// ═══════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════

export async function getInvoices(orgId: string, filter?: DateFilter) {
  await ensureSeeded(orgId);
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
  await ensureSeeded(orgId);
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
  await ensureSeeded(orgId);
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
  await ensureSeeded(orgId);
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

  const businessExpenses = expenses.filter((exp: any) => exp.status !== 'deleted' && !exp.isPersonal);
  const totalExpenses = businessExpenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Expense breakdown by category (Business only)
  const expensesByCategory: Record<string, number> = {};
  businessExpenses.forEach((exp: any) => {
    expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + (exp.amount || 0);
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
