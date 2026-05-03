/**
 * EliteBooks — Ledger Agent Tools
 * Functions that agents can invoke for bookkeeping operations
 */

import { z } from 'zod';

export const createJournalEntrySchema = z.object({
  description: z.string().describe('Description of the financial transaction'),
  date: z.string().describe('Date of the transaction in ISO format'),
  postings: z.array(z.object({
    accountId: z.string().describe('Account ID to post to'),
    accountName: z.string().describe('Human-readable account name'),
    amount: z.number().describe('Amount of the posting'),
    type: z.enum(['debit', 'credit']).describe('Whether this is a debit or credit'),
  })).min(2).describe('At least 2 postings (debit + credit) required for double-entry'),
  reference: z.string().optional().describe('External reference number'),
});

export const getAccountBalanceSchema = z.object({
  accountId: z.string().describe('The account ID to check'),
});

export const getTrialBalanceSchema = z.object({
  asOfDate: z.string().optional().describe('Date for the trial balance, defaults to today'),
});

export const reconcileAccountSchema = z.object({
  accountId: z.string().describe('Account to reconcile'),
  bankBalance: z.number().describe('The bank statement balance to reconcile against'),
  asOfDate: z.string().describe('Date of reconciliation'),
});

// Tool implementations
export async function createJournalEntry(args: z.infer<typeof createJournalEntrySchema>) {
  // Validate double-entry: total debits must equal total credits
  const totalDebits = args.postings.filter(p => p.type === 'debit').reduce((s, p) => s + p.amount, 0);
  const totalCredits = args.postings.filter(p => p.type === 'credit').reduce((s, p) => s + p.amount, 0);

  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    return { success: false, error: `Double-entry violation: debits (${totalDebits}) ≠ credits (${totalCredits})` };
  }

  // In production, this writes to Firestore via atomic batch
  const entryId = `JE-${Date.now()}`;
  return {
    success: true,
    entryId,
    description: args.description,
    totalDebits,
    totalCredits,
    postingCount: args.postings.length,
    status: 'posted',
  };
}

export async function getAccountBalance(args: z.infer<typeof getAccountBalanceSchema>) {
  // In production, fetches from Firestore
  return {
    accountId: args.accountId,
    balance: 127400,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  };
}

export async function getTrialBalance(_args: z.infer<typeof getTrialBalanceSchema>) {
  return {
    asOfDate: _args.asOfDate || new Date().toISOString(),
    totalDebits: 205546,
    totalCredits: 205546,
    isBalanced: true,
    accountCount: 24,
  };
}

export async function reconcileAccount(args: z.infer<typeof reconcileAccountSchema>) {
  return {
    accountId: args.accountId,
    bookBalance: 127400,
    bankBalance: args.bankBalance,
    difference: 127400 - args.bankBalance,
    status: Math.abs(127400 - args.bankBalance) < 0.01 ? 'reconciled' : 'discrepancy_found',
    unmatchedTransactions: 0,
  };
}
