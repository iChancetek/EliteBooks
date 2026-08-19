import { NextRequest, NextResponse } from 'next/server';
import { getFinancialSummary } from '@/lib/firestore';
import { CustomKPIEngine } from '@/intelligence/kpi-engine';
import { ProjectManagementAIEngine } from '@/intelligence/project-management-ai';
import { BooksQualityAIEngine } from '@/intelligence/books-quality-ai';
import { FinanceAIEngine } from '@/intelligence/finance-ai';
import { DimensionsService } from '@/intelligence/dimensions-service';
import { WorkflowAutomationEngine } from '@/intelligence/automation-engine';
import { Compliance1099Service } from '@/intelligence/compliance-1099-service';
import { MileageTravelService } from '@/intelligence/mileage-travel-service';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get('x-org-id') || 'default';
    const summary = await getFinancialSummary(orgId);

    const projects = ProjectManagementAIEngine.getProjects();
    const allocations = ProjectManagementAIEngine.evaluateAllocations(
      (summary.expenses || []).map((e: any, idx: number) => ({
        id: e.id || `exp_${idx}`,
        description: e.description || e.vendor || 'Disbursement',
        amount: e.amount || 0,
        date: e.date || '2026-01-01',
      })),
      projects
    );
    const proposals = ProjectManagementAIEngine.detectNewProjectProposals(summary.invoices || []);

    const { healthScore, findings } = BooksQualityAIEngine.auditBooksQuality(
      summary.expenses || [],
      summary.invoices || [],
      projects
    );
    const quarterlyReport = BooksQualityAIEngine.generateQuarterlyReport(
      'Q1 2026',
      summary.expenses || [],
      summary.invoices || [],
      projects
    );

    const insights = FinanceAIEngine.generateInsights({
      totalRevenue: summary.totalRevenue || 0,
      totalExpenses: summary.totalExpenses || 0,
      netProfit: summary.netProfit || 0,
      totalPaid: summary.totalPaid || 0,
      totalOutstanding: summary.totalOutstanding || 0,
      operatingCash: (summary.totalPaid || 0) - (summary.totalExpenses || 0),
      expensesByCategory: summary.expensesByCategory || {},
      invoicesCount: (summary.invoices || []).length,
      expensesCount: (summary.expenses || []).length,
    });

    const kpis = CustomKPIEngine.calculateKPIs(CustomKPIEngine.getDefaults(), {
      totalRevenue: summary.totalRevenue || 0,
      totalExpenses: summary.totalExpenses || 0,
      netProfit: summary.netProfit || 0,
      clearedCash: summary.totalPaid || 0,
      outstandingAR: summary.totalOutstanding || 0,
      operatingCash: (summary.totalPaid || 0) - (summary.totalExpenses || 0),
    });

    return NextResponse.json({
      success: true,
      data: {
        healthScore,
        findings,
        quarterlyReport,
        kpis,
        insights,
        projects,
        allocations,
        proposals,
        classes: DimensionsService.getClasses(),
        locations: DimensionsService.getLocations(),
        automationRules: WorkflowAutomationEngine.getRules(),
        trips: MileageTravelService.getTrips(),
        vendors1099: Compliance1099Service.evaluateVendors(summary.expenses || []),
      },
    });
  } catch (error: any) {
    console.error('[Intelligence API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'ocr_receipt' || action === 'process_receipt_vision') {
      const { ReceiptIntelligenceService } = await import('@/intelligence/receipt-intelligence');
      const result = await ReceiptIntelligenceService.processReceiptWithVision(
        payload?.fileName || 'receipt.png',
        payload?.fileDataUri
      );
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: 'Unknown intelligence action' }, { status: 400 });
  } catch (error: any) {
    console.error('[Intelligence POST Action Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
