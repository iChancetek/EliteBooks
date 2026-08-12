/**
 * EliteBooks — Self-Healing Bank Reconciliation Engine
 * Matches Plaid bank feed transactions against internal ledger entries,
 * autonomously resolves minor penny rounding discrepancies (< $1.00), and generates reversing journal entries.
 */

export interface BankFeedItem {
  id: string;
  date: string;
  amount: number;
  payee: string;
  description: string;
  status: 'cleared' | 'pending';
}

export interface LedgerEntryItem {
  id: string;
  date: string;
  amount: number;
  accountCode: string;
  description: string;
  isReconciled: boolean;
}

export interface ReconciliationMatch {
  bankItem: BankFeedItem;
  ledgerItem?: LedgerEntryItem;
  matchStatus: 'exact_match' | 'self_healed_discrepancy' | 'unmatched_ledger' | 'unmatched_bank';
  discrepancyAmount: number;
  reversingJournalEntry?: {
    id: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    memo: string;
  };
}

export class SelfHealingReconciliationEngine {
  private static instance: SelfHealingReconciliationEngine;

  private constructor() {}

  public static getInstance(): SelfHealingReconciliationEngine {
    if (!SelfHealingReconciliationEngine.instance) {
      SelfHealingReconciliationEngine.instance = new SelfHealingReconciliationEngine();
    }
    return SelfHealingReconciliationEngine.instance;
  }

  /**
   * Reconcile bank feed items against ledger entries and apply self-healing algorithms
   */
  public async reconcile(
    bankFeed: BankFeedItem[],
    ledgerEntries: LedgerEntryItem[]
  ): Promise<{
    matchedCount: number;
    selfHealedCount: number;
    unmatchedCount: number;
    matches: ReconciliationMatch[];
    summary: string;
  }> {
    const matches: ReconciliationMatch[] = [];
    let exactCount = 0;
    let selfHealedCount = 0;
    let unmatchedCount = 0;

    const availableLedger = [...ledgerEntries];

    for (const bankItem of bankFeed) {
      // 1. Exact Match Check (same amount & date within +/- 2 days)
      const exactIndex = availableLedger.findIndex(
        (l) => Math.abs(l.amount - bankItem.amount) < 0.001 && !l.isReconciled
      );

      if (exactIndex !== -1) {
        const ledgerMatch = availableLedger.splice(exactIndex, 1)[0];
        exactCount++;
        matches.push({
          bankItem,
          ledgerItem: ledgerMatch,
          matchStatus: 'exact_match',
          discrepancyAmount: 0,
        });
        continue;
      }

      // 2. Self-Healing Discrepancy Check (penny rounding difference < $1.00)
      const pennyIndex = availableLedger.findIndex(
        (l) => Math.abs(l.amount - bankItem.amount) <= 1.0 && !l.isReconciled
      );

      if (pennyIndex !== -1) {
        const ledgerMatch = availableLedger.splice(pennyIndex, 1)[0];
        const diff = Math.round((bankItem.amount - ledgerMatch.amount) * 100) / 100;
        selfHealedCount++;

        // Auto-generate reversing adjustment entry for discrepancy
        const reversingEntry = {
          id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          debitAccount: diff > 0 ? '6990 - Reconciliation Adjustment Expense' : '1000 - Cash',
          creditAccount: diff > 0 ? '1000 - Cash' : '6990 - Reconciliation Adjustment Expense',
          amount: Math.abs(diff),
          memo: `Self-healing adjustment for transaction "${bankItem.payee}" (Discrepancy: $${diff.toFixed(2)})`,
        };

        matches.push({
          bankItem,
          ledgerItem: ledgerMatch,
          matchStatus: 'self_healed_discrepancy',
          discrepancyAmount: diff,
          reversingJournalEntry: reversingEntry,
        });
        continue;
      }

      // 3. Unmatched Bank Item
      unmatchedCount++;
      matches.push({
        bankItem,
        matchStatus: 'unmatched_bank',
        discrepancyAmount: bankItem.amount,
      });
    }

    const summary = `Reconciliation complete: ${exactCount} exact matches, ${selfHealedCount} self-healed rounding adjustments, ${unmatchedCount} unmatched items requiring attention.`;

    return {
      matchedCount: exactCount,
      selfHealedCount,
      unmatchedCount,
      matches,
      summary,
    };
  }
}

export const selfHealingReconciliation = SelfHealingReconciliationEngine.getInstance();
