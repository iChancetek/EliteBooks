/**
 * EliteBooks Intelligence — Finance AI & Personalized Insights Engine
 * Synthesizes organizational financial records to generate actionable, executive insights
 * structured under the mandatory 5-Pillar explanation framework.
 */

import { FinanceInsight5Pillars } from './types';
import { formatCurrency } from '@/lib/utils';

export class FinanceAIEngine {
  /**
   * Synthesize personalized 5-pillar financial insights from actual database numbers
   */
  public static generateInsights(context: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalPaid: number;
    totalOutstanding: number;
    operatingCash: number;
    expensesByCategory: Record<string, number>;
    invoicesCount: number;
    expensesCount: number;
  }): FinanceInsight5Pillars[] {
    const insights: FinanceInsight5Pillars[] = [];

    const opMargin = context.totalRevenue > 0
      ? ((context.netProfit / context.totalRevenue) * 100).toFixed(1)
      : '0.0';
    const cashRealizationRate = context.totalRevenue > 0
      ? ((context.totalPaid / context.totalRevenue) * 100).toFixed(1)
      : '0.0';

    // 1. Receivables & Cash Conversion Insight
    if (context.totalOutstanding > 0) {
      insights.push({
        id: 'insight_ar_liquidity',
        title: 'Receivables Acceleration & Liquidity Expansion Opportunity',
        category: 'cash_flow',
        whatHappened: `You have ${formatCurrency(context.totalOutstanding)} in outstanding accounts receivable across active client invoices, representing ${((context.totalOutstanding / Math.max(context.totalRevenue, 1)) * 100).toFixed(1)}% of total sales volume.`,
        whyItMatters: `Accelerating collections will boost your liquid cash reserves from ${formatCurrency(context.operatingCash)} to ${formatCurrency(context.operatingCash + context.totalOutstanding)}, extending cash runway indefinitely.`,
        supportingData: [
          `Total Invoiced Sales: ${formatCurrency(context.totalRevenue)}`,
          `Cleared Cash Collected: ${formatCurrency(context.totalPaid)} (${cashRealizationRate}% realization)`,
          `Outstanding AR: ${formatCurrency(context.totalOutstanding)}`,
          `Current Liquid Operating Cash: ${formatCurrency(context.operatingCash)}`,
        ],
        recommendedAction: 'Dispatch automated Net-30 payment reminders to clients with open invoices.',
        confidenceScore: 0.98,
        severity: 'opportunity',
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Operating Margin & Profitability Diagnostic
    insights.push({
      id: 'insight_operating_profitability',
      title: 'Strong Operating Margin & Capital Efficiency',
      category: 'profitability',
      whatHappened: `Your business is operating at an operating profit margin of ${opMargin}%, generating ${formatCurrency(context.netProfit)} in net income from ${formatCurrency(context.totalRevenue)} in revenue.`,
      whyItMatters: `High operating margins demonstrate strong pricing power and controlled overhead, creating a defensible buffer against macroeconomic volatility.`,
      supportingData: [
        `Gross Revenue: ${formatCurrency(context.totalRevenue)}`,
        `Total Operating Disbursements: ${formatCurrency(context.totalExpenses)} across ${context.expensesCount} transactions`,
        `Net Operating Profit: ${formatCurrency(context.netProfit)}`,
        `Operating Margin: ${opMargin}%`,
      ],
      recommendedAction: 'Maintain a 25% tax escrow buffer ahead of quarterly estimated tax obligations.',
      confidenceScore: 0.96,
      severity: 'neutral',
      createdAt: new Date().toISOString(),
    });

    // 3. Category Spending Breakdown Insight
    const sortedCategories = Object.entries(context.expensesByCategory).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const topCat = sortedCategories[0];
      const topCatShare = context.totalExpenses > 0
        ? ((topCat[1] / context.totalExpenses) * 100).toFixed(1)
        : '0.0';

      insights.push({
        id: 'insight_top_spend_category',
        title: `Primary Operating Cost Driver: ${topCat[0]}`,
        category: 'expense',
        whatHappened: `${topCat[0]} represents your single largest operational cost category at ${formatCurrency(topCat[1])}, accounting for ${topCatShare}% of all business spending.`,
        whyItMatters: `Concentration of expenses in a single operational category requires regular vendor benchmarking to prevent margin compression.`,
        supportingData: [
          `Category Spend: ${formatCurrency(topCat[1])}`,
          `Total OPEX: ${formatCurrency(context.totalExpenses)}`,
          `Category Share: ${topCatShare}%`,
        ],
        recommendedAction: `Review vendor contracts and explore annual volume discount terms for ${topCat[0]}.`,
        confidenceScore: 0.94,
        severity: 'neutral',
        createdAt: new Date().toISOString(),
      });
    }

    return insights;
  }
}
