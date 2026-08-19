/**
 * EliteBooks Financial HR — Compliance Engine & Worker Classification Auditor
 * Evaluates IRS 20-factor worker classification tests to prevent 1099 vs W-2 misclassification penalties
 * and audits Form W-4 / Form I-9 documentation posture.
 */

import { WorkerClassificationAudit, HREmployeeProfile } from './types';

export class HRComplianceEngine {
  /**
   * Audit contractor payment records against IRS Common Law rules
   */
  public static auditWorkerClassifications(
    contractorPayments: Array<{ name: string; totalPaid: number; invoiceCount: number; isExclusive?: boolean }>
  ): WorkerClassificationAudit[] {
    return contractorPayments.map((c) => {
      const isHighVolume = c.totalPaid >= 50000;
      const isRecurring = c.invoiceCount >= 10;
      const isExclusive = c.isExclusive ?? (c.invoiceCount >= 12);

      let behavioralScore = 20; // 0 = independent, 100 = employee
      let financialScore = 25;
      let relationshipScore = 20;
      const reasons: string[] = [];

      if (isHighVolume) {
        financialScore += 30;
        reasons.push('High annual compensation volume exceeding typical ad-hoc contractor thresholds');
      }

      if (isRecurring) {
        relationshipScore += 30;
        reasons.push('High frequency recurring billing pattern resembling regular pay cycles');
      }

      if (isExclusive) {
        behavioralScore += 35;
        reasons.push('Worker exhibits continuous key-contributor characteristics for primary business functions');
      }

      const overall = Math.round((behavioralScore + financialScore + relationshipScore) / 3);

      let risk: WorkerClassificationAudit['classificationRisk'] = 'low_risk_contractor';
      let remediation = 'Contractor agreement on file. Continue regular milestone-based invoicing.';

      if (overall >= 70) {
        risk = 'high_risk_misclassification';
        remediation = 'Strongly recommend reviewing with legal counsel to transition to W-2 employee status or re-structure as independent statement of work (SOW).';
      } else if (overall >= 45) {
        risk = 'moderate_review_recommended';
        remediation = 'Ensure active master services agreement (MSA) and proof of external business entity (LLC/Corp) are on file.';
      }

      return {
        contractorId: `audit_${c.name.toLowerCase().replace(/\s+/g, '_')}`,
        contractorName: c.name,
        totalPaymentsAnnual: c.totalPaid,
        contractType: 'Independent Contractor (1099)',
        behavioralControlScore: behavioralScore,
        financialControlScore: financialScore,
        relationshipTypeScore: relationshipScore,
        overallIndependenceScore: 100 - overall,
        classificationRisk: risk,
        reasons: reasons.length > 0 ? reasons : ['Normal contractor project deliverables and independent tooling.'],
        recommendedRemediation: remediation,
      };
    });
  }

  /**
   * Audit W-4 and I-9 compliance across employee roster
   */
  public static auditTaxDocumentCompliance(employees: HREmployeeProfile[]): {
    w4ComplianceRate: number;
    i9ComplianceRate: number;
    pendingActionCount: number;
  } {
    if (employees.length === 0) {
      return { w4ComplianceRate: 100, i9ComplianceRate: 100, pendingActionCount: 0 };
    }

    const verifiedW4 = employees.filter((e) => e.w4Status === 'verified').length;
    const verifiedI9 = employees.filter((e) => e.i9Status === 'verified').length;
    const pending = employees.filter((e) => e.w4Status === 'pending' || e.i9Status === 'pending').length;

    return {
      w4ComplianceRate: Math.round((verifiedW4 / employees.length) * 100),
      i9ComplianceRate: Math.round((verifiedI9 / employees.length) * 100),
      pendingActionCount: pending,
    };
  }
}
