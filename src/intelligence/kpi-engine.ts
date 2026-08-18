/**
 * EliteBooks Intelligence — Custom KPI Engine & Formula Evaluator
 * Safely evaluates user-defined arithmetic formulas and generates real-time business metrics
 * with configurable warning/alert thresholds.
 */

import { CustomKPI } from './types';

export class CustomKPIEngine {
  private static defaultKPIs: CustomKPI[] = [
    {
      id: 'kpi_gross_margin',
      name: 'Gross Profit Margin',
      description: 'Percentage of total sales revenue retained after direct operational costs',
      formula: '(NetOperatingProfit / TotalRevenue) * 100',
      dataSource: 'general_ledger',
      period: 'all_time',
      currentValue: 0,
      targetValue: 35.0,
      warningThreshold: 25.0,
      alertThreshold: 15.0,
      frequency: 'real_time',
      visualization: 'percent',
      isAlertActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'kpi_cash_runway',
      name: 'Operating Cash Runway',
      description: 'Months of liquid runway remaining based on current monthly expense burn',
      formula: 'OperatingCash / (TotalExpenses / 12)',
      dataSource: 'general_ledger',
      period: 'all_time',
      currentValue: 0,
      targetValue: 12.0,
      warningThreshold: 6.0,
      alertThreshold: 3.0,
      frequency: 'daily',
      visualization: 'number',
      isAlertActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'kpi_ar_realization',
      name: 'AR Cash Realization Rate',
      description: 'Percentage of invoiced revenue successfully collected as cleared cash',
      formula: '(ClearedCashCollections / TotalRevenue) * 100',
      dataSource: 'invoices',
      period: 'all_time',
      currentValue: 0,
      targetValue: 80.0,
      warningThreshold: 50.0,
      alertThreshold: 30.0,
      frequency: 'real_time',
      visualization: 'percent',
      isAlertActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'kpi_project_margin',
      name: 'Project Gross Margin',
      description: 'Net profitability margin across all active enterprise projects',
      formula: '((ProjectRevenue - ProjectCosts) / ProjectRevenue) * 100',
      dataSource: 'projects',
      period: 'all_time',
      currentValue: 0,
      targetValue: 30.0,
      warningThreshold: 20.0,
      alertThreshold: 10.0,
      frequency: 'weekly',
      visualization: 'percent',
      isAlertActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  /**
   * Safely evaluate a mathematical KPI formula against a variable dictionary
   */
  public static evaluateFormula(formula: string, variables: Record<string, number>): number {
    if (!formula || typeof formula !== 'string') return 0;

    // Standardize variable names (case-insensitive replace)
    let sanitizedFormula = formula;
    const sortedKeys = Object.keys(variables).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      const val = variables[key];
      const safeVal = isNaN(val) ? 0 : val;
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      sanitizedFormula = sanitizedFormula.replace(regex, safeVal.toString());
    }

    // Only allow digits, decimals, parentheses, and standard arithmetic operators (+, -, *, /, %)
    const validMathRegex = /^[\d\s\.\(\)\+\-\*\/\%]+$/;
    if (!validMathRegex.test(sanitizedFormula)) {
      console.warn('[KPI Engine] Invalid characters in formula:', sanitizedFormula);
      return 0;
    }

    try {
      // Safe arithmetic evaluator function
      const compute = new Function(`return (${sanitizedFormula})`);
      const result = compute();
      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        return 0;
      }
      return parseFloat(result.toFixed(2));
    } catch (e) {
      console.warn('[KPI Engine] Evaluation failed for formula:', formula, e);
      return 0;
    }
  }

  /**
   * Compute live values and alert states for all KPIs
   */
  public static calculateKPIs(
    kpis: CustomKPI[],
    liveContext: {
      totalRevenue: number;
      totalExpenses: number;
      netProfit: number;
      clearedCash: number;
      outstandingAR: number;
      operatingCash: number;
      projectRevenue?: number;
      projectCosts?: number;
    }
  ): CustomKPI[] {
    const variables: Record<string, number> = {
      TotalRevenue: liveContext.totalRevenue,
      Revenue: liveContext.totalRevenue,
      TotalExpenses: liveContext.totalExpenses,
      Expenses: liveContext.totalExpenses,
      NetOperatingProfit: liveContext.netProfit,
      NetProfit: liveContext.netProfit,
      GrossProfit: liveContext.netProfit,
      ClearedCashCollections: liveContext.clearedCash,
      ClearedCash: liveContext.clearedCash,
      OutstandingAR: liveContext.outstandingAR,
      AccountsReceivable: liveContext.outstandingAR,
      OperatingCash: liveContext.operatingCash,
      CashBalance: liveContext.operatingCash,
      ProjectRevenue: liveContext.projectRevenue || (liveContext.totalRevenue * 0.7),
      ProjectCosts: liveContext.projectCosts || (liveContext.totalExpenses * 0.6),
    };

    return kpis.map((kpi) => {
      const val = this.evaluateFormula(kpi.formula, variables);
      let isAlert = false;
      let alertMsg: string | undefined = undefined;

      if (kpi.alertThreshold !== undefined && val <= kpi.alertThreshold) {
        isAlert = true;
        alertMsg = `Critical Alert: ${kpi.name} (${val}${kpi.visualization === 'percent' ? '%' : ''}) is below critical threshold (${kpi.alertThreshold}${kpi.visualization === 'percent' ? '%' : ''})`;
      } else if (kpi.warningThreshold !== undefined && val <= kpi.warningThreshold) {
        isAlert = true;
        alertMsg = `Warning: ${kpi.name} (${val}${kpi.visualization === 'percent' ? '%' : ''}) has fallen below target (${kpi.targetValue}${kpi.visualization === 'percent' ? '%' : ''})`;
      }

      return {
        ...kpi,
        currentValue: val,
        isAlertActive: isAlert,
        alertMessage: alertMsg,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  /**
   * Get default starter KPIs
   */
  public static getDefaults(): CustomKPI[] {
    return JSON.parse(JSON.stringify(this.defaultKPIs));
  }
}
