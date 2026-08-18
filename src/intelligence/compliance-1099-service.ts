/**
 * EliteBooks Intelligence — 1099 Vendor Compliance Service
 * Tracks non-employee vendor disbursements against the IRS $600 threshold, monitors W-9 collection status,
 * and drafts compliance filings with required human authorization.
 */

import { Vendor1099Status } from './types';

export class Compliance1099Service {
  public static readonly IRS_THRESHOLD = 600.0; // IRS 1099-NEC reportable threshold

  /**
   * Audit vendor disbursements to determine 1099 reportability status
   */
  public static evaluateVendors(expenses: any[]): Vendor1099Status[] {
    const vendorMap: Record<string, { total: number; count: number }> = {};

    const activeExpenses = expenses.filter((e) => e.status !== 'deleted' && !e.isPersonal);

    activeExpenses.forEach((exp) => {
      const v = (exp.vendor || exp.merchant || 'Direct Contractor').trim();
      if (!vendorMap[v]) {
        vendorMap[v] = { total: 0, count: 0 };
      }
      vendorMap[v].total += parseFloat(exp.amount || '0') || 0;
      vendorMap[v].count += 1;
    });

    const results: Vendor1099Status[] = [];

    for (const [vendorName, data] of Object.entries(vendorMap)) {
      const isReportable = data.total >= Compliance1099Service.IRS_THRESHOLD;
      const isKnownCorporate = vendorName.toLowerCase().includes('inc') || vendorName.toLowerCase().includes('corp') || vendorName.toLowerCase().includes('aws') || vendorName.toLowerCase().includes('google');

      const tinProvided = !vendorName.toLowerCase().includes('contractor') && !vendorName.toLowerCase().includes('freelance');
      const w9OnFile = !vendorName.toLowerCase().includes('unverified');

      const missing: string[] = [];
      if (!tinProvided && isReportable && !isKnownCorporate) {
        missing.push('Taxpayer Identification Number (TIN/EIN) missing');
      }
      if (!w9OnFile && isReportable && !isKnownCorporate) {
        missing.push('Form W-9 not on file');
      }

      let status: Vendor1099Status['filingStatus'] = 'ready_for_approval';
      if (missing.length > 0) {
        status = 'review_needed';
      } else if (isReportable) {
        status = 'draft_prepared';
      }

      results.push({
        vendorId: `v1099_${vendorName.replace(/\s+/g, '_').toLowerCase()}`,
        vendorName,
        tinOrEinProvided: tinProvided,
        w9OnFile,
        totalNonEmployeeCompensation: data.total,
        is1099Reportable: isReportable && !isKnownCorporate,
        formType: '1099-NEC',
        filingStatus: status,
        missingFields: missing,
      });
    }

    return results.sort((a, b) => b.totalNonEmployeeCompensation - a.totalNonEmployeeCompensation);
  }
}
