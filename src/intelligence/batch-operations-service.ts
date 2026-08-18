/**
 * EliteBooks Intelligence — Batch Operations Service
 * Processes high-volume invoices, bulk expense classifications, and mass project cost allocations
 * with mandatory pre-execution safety previews.
 */

import { BatchOperationPreview, BatchOperationItem } from './types';

export class BatchOperationsService {
  /**
   * Validate and generate pre-execution preview for batch operations
   */
  public static previewBatch(
    type: 'invoice' | 'expense' | 'project_allocation',
    items: Array<Record<string, any>>
  ): BatchOperationPreview {
    const validatedItems: BatchOperationItem[] = [];
    let validCount = 0;
    let reviewCount = 0;
    let duplicateCount = 0;
    let totalVolume = 0;

    const seenKeys = new Set<string>();

    items.forEach((raw, idx) => {
      const amount = parseFloat(raw.amount || raw.total || '0') || 0;
      totalVolume += amount;

      const key = `${raw.clientName || raw.vendor || 'Unknown'}_${amount}_${raw.date || ''}`;
      let status: BatchOperationItem['status'] = 'valid';

      if (seenKeys.has(key)) {
        status = 'duplicate_warning';
        duplicateCount += 1;
      } else if (!raw.clientName && !raw.vendor) {
        status = 'requires_review';
        reviewCount += 1;
      } else if (amount <= 0) {
        status = 'requires_review';
        reviewCount += 1;
      } else {
        validCount += 1;
      }

      seenKeys.add(key);

      validatedItems.push({
        id: `batch_item_${idx + 1}`,
        type,
        summary: type === 'invoice'
          ? `Invoice for ${raw.clientName || 'Client'} — $${amount.toLocaleString()}`
          : `Expense: ${raw.vendor || 'Merchant'} ($${amount.toLocaleString()})`,
        amount,
        status,
        data: raw,
      });
    });

    return {
      batchId: `batch_${Date.now()}`,
      totalItems: items.length,
      validCount,
      reviewCount,
      duplicateCount,
      totalDollarVolume: totalVolume,
      items: validatedItems,
    };
  }
}
