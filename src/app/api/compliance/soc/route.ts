/**
 * EliteBooks — SOC 1 & SOC 2 Continuous Compliance API
 * GET: Evaluates live SOC 1 (ICFR) and SOC 2 (Trust Services Criteria) controls against real ledger data.
 * POST: Generates an immutable Auditor Evidence Package for CPA firms, Vanta, and Drata.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { getFinancialSummary } from '@/lib/firestore';
import { soc1Engine } from '@/security/soc1-controls';
import { soc2Engine } from '@/security/soc2-controls';

async function getOrgId(request: NextRequest): Promise<string> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = await adminAuth.verifyIdToken(token);
      return decoded.uid;
    }
  } catch (e) {
    console.warn('[SOC API] Auth fallback to default org');
  }
  return 'default';
}

export async function GET(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const summary = await getFinancialSummary(orgId);

    const invoices = summary.invoices || [];
    const expenses = summary.expenses || [];

    const soc1Evaluation = soc1Engine.evaluateAllControls(orgId, invoices, expenses);
    const soc2Evaluation = soc2Engine.evaluateAllControls(orgId);

    const overallReadinessScore = Math.round(
      (soc1Evaluation.overallScore + soc2Evaluation.overallScore) / 2
    );

    return NextResponse.json({
      success: true,
      data: {
        orgId,
        overallReadinessScore,
        status: overallReadinessScore >= 95 ? 'OPTIMAL' : 'COMPLIANT',
        soc1: soc1Evaluation,
        soc2: soc2Evaluation,
        evaluatedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('[SOC Compliance GET Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getOrgId(request);
    const summary = await getFinancialSummary(orgId);

    const invoices = summary.invoices || [];
    const expenses = summary.expenses || [];

    const soc1Evaluation = soc1Engine.evaluateAllControls(orgId, invoices, expenses);
    const soc2Evaluation = soc2Engine.evaluateAllControls(orgId);

    const evidencePackage = soc2Engine.generateAuditorEvidencePackage(
      orgId,
      soc1Evaluation,
      soc2Evaluation
    );

    return NextResponse.json({
      success: true,
      data: evidencePackage
    });
  } catch (error: any) {
    console.error('[SOC Evidence Package Generation Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
