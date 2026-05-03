/* ═══════════════════════════════════════════════════════════════
   EliteBooks — Core Accounting Types
   Double-entry bookkeeping, invoicing, expenses, payroll
   ═══════════════════════════════════════════════════════════════ */

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export type AccountSubtype =
  | 'cash' | 'bank' | 'accounts_receivable' | 'inventory' | 'fixed_asset' | 'other_asset'
  | 'accounts_payable' | 'credit_card' | 'loan' | 'other_liability'
  | 'owners_equity' | 'retained_earnings'
  | 'sales' | 'service_revenue' | 'other_income'
  | 'cost_of_goods' | 'operating_expense' | 'payroll_expense' | 'tax_expense' | 'other_expense';

export interface Account {
  id: string;
  orgId: string;
  name: string;
  type: AccountType;
  subtype: AccountSubtype;
  number: string;
  balance: number;
  currency: string;
  isActive: boolean;
  description?: string;
  parentAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Posting {
  accountId: string;
  accountName: string;
  amount: number;
  type: 'debit' | 'credit';
  description?: string;
}

export interface AuditEvent {
  timestamp: string;
  action: string;
  userId?: string;
  agentId?: string;
  details: string;
}

export interface JournalEntry {
  id: string;
  orgId: string;
  date: string;
  description: string;
  reference: string;
  postings: Posting[];
  status: 'draft' | 'posted' | 'voided';
  createdBy: string;
  agentId?: string;
  auditTrail: AuditEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
}

export interface RecurringSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  nextDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  orgId: string;
  number: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'partial' | 'overdue' | 'void';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  recurring?: RecurringSchedule;
  stripePaymentIntentId?: string;
  journalEntryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  orgId: string;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  receiptUrl?: string;
  bankTransactionId?: string;
  plaidTransactionId?: string;
  aiCategorized: boolean;
  aiConfidence: number;
  status: 'pending' | 'approved' | 'rejected' | 'reconciled';
  approvedBy?: string;
  journalEntryId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  employmentType: 'full_time' | 'part_time' | 'contractor';
  salary: number;
  payFrequency: 'weekly' | 'biweekly' | 'monthly';
  startDate: string;
  isActive: boolean;
  bankAccount?: { routingNumber: string; accountNumber: string };
  taxInfo?: { filingStatus: string; allowances: number; additionalWithholding: number };
  createdAt: string;
  updatedAt: string;
}

export interface PayStub {
  id: string;
  orgId: string;
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  otherDeductions: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  journalEntryId?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  orgId: string;
  name: string;
  sku: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  reorderPoint: number;
  category?: string;
  supplier?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankConnection {
  id: string;
  orgId: string;
  institutionName: string;
  institutionId: string;
  plaidAccessToken: string;
  plaidItemId: string;
  accounts: BankAccount[];
  status: 'active' | 'error' | 'disconnected';
  lastSyncAt?: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  plaidAccountId: string;
  name: string;
  officialName?: string;
  type: string;
  subtype?: string;
  mask?: string;
  currentBalance?: number;
  availableBalance?: number;
  linkedAccountId?: string;
}

export interface BankTransaction {
  id: string;
  orgId: string;
  plaidTransactionId: string;
  bankConnectionId: string;
  bankAccountId: string;
  date: string;
  name: string;
  merchantName?: string;
  amount: number;
  category?: string[];
  pending: boolean;
  matched: boolean;
  expenseId?: string;
  createdAt: string;
}

export type ReportType = 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'trial_balance';

export interface ReportPeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashOnHand: number;
  accountsReceivable: number;
  accountsPayable: number;
  revenueChange: number;
  expenseChange: number;
  profitChange: number;
}
