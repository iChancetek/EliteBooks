/**
 * EliteBooks — Expense Agent Tools
 */

import { z } from 'zod';

export const categorizeExpenseSchema = z.object({
  vendor: z.string().describe('Vendor or merchant name'),
  amount: z.number().describe('Transaction amount'),
  description: z.string().optional().describe('Transaction description'),
  date: z.string().describe('Transaction date'),
});

export const matchReceiptSchema = z.object({
  receiptText: z.string().describe('OCR-extracted text from receipt'),
  transactionId: z.string().optional().describe('Bank transaction to match against'),
});

export const detectAnomalySchema = z.object({
  transactionId: z.string().describe('Transaction to analyze'),
  amount: z.number().describe('Transaction amount'),
  vendor: z.string().describe('Vendor name'),
  category: z.string().describe('Assigned category'),
});

export async function categorizeExpense(args: z.infer<typeof categorizeExpenseSchema>) {
  // In production, uses GPT-5.2 for intelligent categorization
  const categoryMap: Record<string, string> = {
    'aws': 'Software & SaaS', 'google': 'Software & SaaS', 'azure': 'Software & SaaS',
    'uber': 'Travel & Transport', 'lyft': 'Travel & Transport',
    'staples': 'Office & Supplies', 'amazon': 'Office & Supplies',
    'doordash': 'Meals & Entertainment', 'grubhub': 'Meals & Entertainment',
  };

  const vendorLower = args.vendor.toLowerCase();
  const category = Object.entries(categoryMap).find(([k]) => vendorLower.includes(k))?.[1] || 'Other';

  return {
    success: true,
    vendor: args.vendor,
    amount: args.amount,
    suggestedCategory: category,
    confidence: 0.94,
    alternativeCategories: ['Other', 'Operating Expense'],
  };
}

export async function matchReceipt(args: z.infer<typeof matchReceiptSchema>) {
  return {
    success: true,
    matched: true,
    extractedAmount: 289.50,
    extractedVendor: 'Staples',
    extractedDate: '2026-04-29',
    matchConfidence: 0.96,
    transactionId: args.transactionId || 'auto_matched',
  };
}

export async function detectAnomaly(args: z.infer<typeof detectAnomalySchema>) {
  return {
    transactionId: args.transactionId,
    isAnomaly: args.amount > 5000,
    riskLevel: args.amount > 10000 ? 'high' : args.amount > 5000 ? 'medium' : 'low',
    reason: args.amount > 5000 ? 'Amount significantly higher than average for this category' : null,
    averageForCategory: 850,
    recommendation: args.amount > 5000 ? 'Review required — amount exceeds typical range' : 'Transaction appears normal',
  };
}
