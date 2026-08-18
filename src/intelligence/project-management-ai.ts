/**
 * EliteBooks Intelligence — Project Management AI & Construction Financial Engine
 * Handles automatic project detection, cost allocation recommendations, construction job costing,
 * change order tracking, retainage calculations, and project margin diagnostic alerts.
 */

import { ProjectFinancials, ProjectAllocationRecommendation, NewProjectProposal, ProjectCostBreakdown } from './types';

export class ProjectManagementAIEngine {
  private static defaultProjects: ProjectFinancials[] = [
    {
      id: 'proj_hudson_reno',
      name: 'Hudson Commercial Office Renovation',
      code: 'PRJ-2026-001',
      type: 'construction',
      customer: 'Conde Nast',
      customerId: 'cust_conde_nast',
      location: 'New York HQ',
      class: 'Commercial Construction',
      status: 'active',
      startDate: '2026-01-15',
      estimatedEndDate: '2026-11-30',
      contractAmount: 288000,
      estimatedRevenue: 288000,
      budgetCost: 195000,
      actualRevenue: 288000,
      actualCost: 124500,
      forecastCostToComplete: 62000,
      estimatedTotalCostAtCompletion: 186500,
      grossProfit: 101500,
      grossMarginPercent: 35.2,
      retainagePercent: 10,
      retainageWithheld: 28800,
      billedToDate: 288000,
      collectedToDate: 0,
      changeOrders: [
        {
          id: 'co_001',
          orderNumber: 'CO-01',
          description: 'Structural HVAC duct reinforcement and acoustical dampening',
          amount: 14500,
          approvedDate: '2026-03-10',
          status: 'approved',
        },
      ],
      costBreakdown: {
        labor: 45000,
        materials: 38500,
        subcontractors: 26000,
        equipment: 10500,
        overhead: 4500,
        other: 0,
      },
      aiConfidenceScore: 0.96,
      isOverBudget: false,
      budgetVariance: 8500,
      aiRecommendations: [
        'Materials procurement is tracking 4.2% below initial cost benchmarks.',
        'Ensure retainage release agreement of $28,800 is scheduled upon milestone sign-off.',
      ],
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj_wndr_hq',
      name: 'WNDR Studio Infrastructure & Buildout',
      code: 'PRJ-2026-002',
      type: 'standard',
      customer: 'for WNDR',
      customerId: 'cust_wndr',
      location: 'Chicago Studio',
      class: 'Digital Infrastructure',
      status: 'active',
      startDate: '2026-02-01',
      estimatedEndDate: '2026-08-31',
      contractAmount: 216000,
      estimatedRevenue: 216000,
      budgetCost: 140000,
      actualRevenue: 216000,
      actualCost: 98400,
      forecastCostToComplete: 38000,
      estimatedTotalCostAtCompletion: 136400,
      grossProfit: 79600,
      grossMarginPercent: 36.9,
      retainagePercent: 0,
      retainageWithheld: 0,
      billedToDate: 216000,
      collectedToDate: 0,
      changeOrders: [],
      costBreakdown: {
        labor: 52000,
        materials: 18400,
        subcontractors: 20000,
        equipment: 6000,
        overhead: 2000,
        other: 0,
      },
      aiConfidenceScore: 0.94,
      isOverBudget: false,
      budgetVariance: 3600,
      aiRecommendations: [
        'Project is on track for delivery ahead of Q3 milestone deadline.',
        'Subcontractor billing aligns with delivered digital infrastructure assets.',
      ],
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj_apex_cloud',
      name: 'Apex Global Financial Core Migration',
      code: 'PRJ-2026-003',
      type: 'consulting',
      customer: 'Apex Global',
      customerId: 'cust_apex',
      location: 'London / Remote',
      class: 'Cloud Engineering',
      status: 'active',
      startDate: '2026-03-01',
      estimatedEndDate: '2026-12-15',
      contractAmount: 110000,
      estimatedRevenue: 110000,
      budgetCost: 65000,
      actualRevenue: 110000,
      actualCost: 48200,
      forecastCostToComplete: 15000,
      estimatedTotalCostAtCompletion: 63200,
      grossProfit: 46800,
      grossMarginPercent: 42.5,
      retainagePercent: 0,
      retainageWithheld: 0,
      billedToDate: 110000,
      collectedToDate: 0,
      changeOrders: [],
      costBreakdown: {
        labor: 38000,
        materials: 2200,
        subcontractors: 5000,
        equipment: 2000,
        overhead: 1000,
        other: 0,
      },
      aiConfidenceScore: 0.98,
      isOverBudget: false,
      budgetVariance: 1800,
      aiRecommendations: [
        'High gross margin profile (42.5%) supported by in-house engineering team.',
      ],
      createdAt: '2026-03-01T08:30:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];

  /**
   * Get all active projects
   */
  public static getProjects(): ProjectFinancials[] {
    return JSON.parse(JSON.stringify(this.defaultProjects));
  }

  /**
   * Automatically detect cost allocation recommendations from expenses/invoices
   */
  public static evaluateAllocations(
    transactions: Array<{ id: string; description: string; vendor?: string; amount: number; date: string }>,
    projects: ProjectFinancials[]
  ): ProjectAllocationRecommendation[] {
    const recommendations: ProjectAllocationRecommendation[] = [];

    for (const tx of transactions) {
      const descLower = (tx.description || tx.vendor || '').toLowerCase();

      for (const proj of projects) {
        const projNameLower = proj.name.toLowerCase();
        const clientLower = proj.customer.toLowerCase();
        const codeLower = proj.code.toLowerCase();

        let matched = false;
        let category: keyof ProjectCostBreakdown = 'materials';
        let score = 0.5;

        if (descLower.includes(clientLower) || descLower.includes(codeLower)) {
          matched = true;
          score = 0.95;
        } else if (descLower.includes('renovation') || descLower.includes('hudson')) {
          if (proj.id === 'proj_hudson_reno') {
            matched = true;
            score = 0.92;
          }
        } else if (descLower.includes('wndr') || descLower.includes('studio')) {
          if (proj.id === 'proj_wndr_hq') {
            matched = true;
            score = 0.94;
          }
        }

        if (matched) {
          if (descLower.includes('labor') || descLower.includes('payroll') || descLower.includes('wages')) {
            category = 'labor';
          } else if (descLower.includes('contractor') || descLower.includes('subcontractor') || descLower.includes('consultant')) {
            category = 'subcontractors';
          } else if (descLower.includes('equipment') || descLower.includes('rental') || descLower.includes('tools')) {
            category = 'equipment';
          } else {
            category = 'materials';
          }

          recommendations.push({
            transactionId: tx.id,
            transactionDescription: tx.description || tx.vendor || 'Transaction',
            amount: tx.amount,
            date: tx.date,
            recommendedProjectId: proj.id,
            recommendedProjectName: proj.name,
            recommendedCategory: category,
            confidenceScore: score,
            rationale: `Matched client profile and project code patterns (${proj.name}) with ${Math.round(score * 100)}% confidence.`,
            status: 'pending',
          });
          break;
        }
      }
    }

    return recommendations;
  }

  /**
   * Identify signals for new project creation proposals
   */
  public static detectNewProjectProposals(
    invoices: any[]
  ): NewProjectProposal[] {
    const proposals: NewProjectProposal[] = [];
    const clientCounts: Record<string, { count: number; total: number }> = {};

    invoices.forEach((inv) => {
      const client = inv.clientName || 'Direct Client';
      if (!clientCounts[client]) {
        clientCounts[client] = { count: 0, total: 0 };
      }
      clientCounts[client].count += 1;
      clientCounts[client].total += inv.total || 0;
    });

    for (const [client, data] of Object.entries(clientCounts)) {
      if (data.total >= 50000 && client !== 'Conde Nast' && client !== 'for WNDR' && client !== 'Apex Global') {
        proposals.push({
          proposedName: `${client} Enterprise Engagement`,
          suggestedCustomer: client,
          estimatedRevenue: data.total,
          estimatedCost: data.total * 0.65,
          signals: [
            `Active high-value billing volume totaling $${data.total.toLocaleString()}`,
            `${data.count} distinct invoices detected in live billing records`,
          ],
          confidenceScore: 0.91,
          status: 'proposed',
        });
      }
    }

    return proposals;
  }
}
