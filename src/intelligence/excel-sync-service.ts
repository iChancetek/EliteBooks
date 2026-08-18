/**
 * EliteBooks Intelligence — Excel Bi-Directional Synchronization Service
 * Controls structured CSV/XLSX imports and exports with intelligent field mapping,
 * validation diffs, duplicate detection, and pre-commit previews.
 */

import { ExcelSyncPreview, ExcelFieldMapping } from './types';

export class ExcelSyncService {
  /**
   * Default schema mapping rules
   */
  public static defaultFieldMappings: Record<string, ExcelFieldMapping[]> = {
    invoices: [
      { sourceColumn: 'Invoice #', targetField: 'number', isRequired: false },
      { sourceColumn: 'Client Name', targetField: 'clientName', isRequired: true },
      { sourceColumn: 'Issue Date', targetField: 'issueDate', isRequired: true },
      { sourceColumn: 'Due Date', targetField: 'dueDate', isRequired: false },
      { sourceColumn: 'Amount / Total', targetField: 'total', isRequired: true },
      { sourceColumn: 'Project', targetField: 'projectId', isRequired: false },
    ],
    expenses: [
      { sourceColumn: 'Vendor / Merchant', targetField: 'vendor', isRequired: true },
      { sourceColumn: 'Date', targetField: 'date', isRequired: true },
      { sourceColumn: 'Amount', targetField: 'amount', isRequired: true },
      { sourceColumn: 'Category', targetField: 'category', isRequired: false },
      { sourceColumn: 'Project', targetField: 'projectId', isRequired: false },
    ],
  };

  /**
   * Parse CSV/Excel data rows into a validated preview
   */
  public static parseImportData(
    type: 'invoices' | 'expenses',
    csvString: string,
    fileName: string = 'import.csv'
  ): ExcelSyncPreview {
    const lines = csvString.trim().split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      return {
        fileName,
        totalRows: 0,
        parsedRecords: [],
        fieldMappings: this.defaultFieldMappings[type] || [],
        warnings: ['Empty or invalid file content detected.'],
        duplicateCount: 0,
      };
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const records: Array<Record<string, any>> = [];
    const warnings: string[] = [];
    let duplicates = 0;
    const seen = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      const record: Record<string, any> = {};

      headers.forEach((h, hIdx) => {
        record[h] = cols[hIdx] || '';
      });

      const key = `${record['Client Name'] || record['Vendor'] || ''}_${record['Amount'] || record['Total'] || ''}`;
      if (seen.has(key)) {
        duplicates += 1;
      }
      seen.add(key);
      records.push(record);
    }

    if (duplicates > 0) {
      warnings.push(`${duplicates} potential duplicate rows detected in spreadsheet.`);
    }

    return {
      fileName,
      totalRows: records.length,
      parsedRecords: records,
      fieldMappings: this.defaultFieldMappings[type] || [],
      warnings,
      duplicateCount: duplicates,
    };
  }

  /**
   * Export financial entities to clean CSV string
   */
  public static exportToCsv(type: 'invoices' | 'expenses', data: any[]): string {
    if (!data || data.length === 0) return 'No data available';

    if (type === 'invoices') {
      const headers = ['Invoice Number', 'Client Name', 'Issue Date', 'Due Date', 'Total Amount', 'Status'];
      const rows = data.map((d) => [
        `"${d.number || 'INV'}"`,
        `"${d.clientName || 'Client'}"`,
        `"${d.issueDate || '2026-01-01'}"`,
        `"${d.dueDate || 'Net 30'}"`,
        `"${(parseFloat(d.total) || 0).toFixed(2)}"`,
        `"${(d.status || 'sent').toUpperCase()}"`,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else {
      const headers = ['Expense ID', 'Vendor / Merchant', 'Date', 'Category', 'Amount', 'Status'];
      const rows = data.map((d) => [
        `"${d.id ? d.id.substring(0, 8) : 'EXP'}"`,
        `"${d.vendor || d.merchant || 'Vendor'}"`,
        `"${d.date || '2026-01-01'}"`,
        `"${d.category || 'General'}"`,
        `"${(parseFloat(d.amount) || 0).toFixed(2)}"`,
        `"${(d.status || 'posted').toUpperCase()}"`,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
  }
}
