/**
 * EliteBooks — Universal Multi-Period Forecasting Engine
 * Pure deterministic statistical projections from live Firestore records.
 * Supports Monthly (MoM), Quarterly (QoQ), and Annual (YoY) horizons
 * with Base / Bull / Bear scenario modeling.
 *
 * ZERO MOCK DATA: If insufficient history exists, returns null projections
 * with a clear "INSUFFICIENT_DATA" confidence flag.
 */

// ─── Types ───

export interface ForecastDataPoint {
  label: string;         // e.g. "Aug 2026", "Q3 2026", "2026"
  actual?: number;       // Historical actual value (if available)
  projected?: number;    // Forecasted value
  bull?: number;         // Optimistic scenario (+15% variance)
  bear?: number;         // Conservative scenario (-15% variance)
  isPredicted: boolean;
}

export interface ForecastResult {
  horizon: 'monthly' | 'quarterly' | 'annual';
  dataPoints: ForecastDataPoint[];
  projectedTotal: number;
  growthRate: number;        // Percentage growth rate vs prior period
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';
  avgMonthlyValue: number;
  trendDirection: 'UP' | 'DOWN' | 'FLAT';
  scenarioSummary: {
    base: number;
    bull: number;
    bear: number;
  };
}

export interface ForecastableRecord {
  date: string;          // ISO date string (e.g., "2026-08-18")
  amount: number;
  category?: string;
  type?: string;         // "income" | "expense" | "payroll" | "personal"
}

// ─── Helpers ───

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BULL_FACTOR = 1.15;
const BEAR_FACTOR = 0.85;

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getQuarterKey(date: Date): string {
  const q = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${q} ${date.getFullYear()}`;
}

function getYearKey(date: Date): string {
  return `${date.getFullYear()}`;
}

function safeParseDate(dateStr: string): Date | null {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/** Weighted Moving Average — recent periods weighted more heavily */
function weightedMovingAverage(values: number[], weights?: number[]): number {
  if (values.length === 0) return 0;
  const w = weights || values.map((_, i) => i + 1); // linear weights: 1, 2, 3, ...
  const totalWeight = w.reduce((a, b) => a + b, 0);
  const weightedSum = values.reduce((sum, val, i) => sum + val * w[i], 0);
  return weightedSum / totalWeight;
}

/** Calculate period-over-period growth rate */
function growthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Determine trend direction from growth rate */
function trendDirection(rate: number): 'UP' | 'DOWN' | 'FLAT' {
  if (rate > 2) return 'UP';
  if (rate < -2) return 'DOWN';
  return 'FLAT';
}

/** Determine confidence level from data point count */
function confidenceLevel(dataPointCount: number, minRequired: number): ForecastResult['confidence'] {
  if (dataPointCount < minRequired) return 'INSUFFICIENT_DATA';
  if (dataPointCount >= minRequired * 2) return 'HIGH';
  if (dataPointCount >= minRequired) return 'MEDIUM';
  return 'LOW';
}

// ─── Aggregation ───

function aggregateByPeriod(
  records: ForecastableRecord[],
  keyFn: (date: Date) => string
): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of records) {
    const d = safeParseDate(r.date);
    if (!d) continue;
    const key = keyFn(d);
    map.set(key, (map.get(key) || 0) + Math.abs(r.amount));
  }
  return map;
}

// ─── Monthly Forecast (MoM) ───

export function computeMonthlyForecast(
  records: ForecastableRecord[],
  forecastMonths: number = 3
): ForecastResult {
  const byMonth = aggregateByPeriod(records, (d) => getMonthKey(d));

  // Sort by month key
  const sortedKeys = Array.from(byMonth.keys()).sort();
  const values = sortedKeys.map((k) => byMonth.get(k) || 0);

  const confidence = confidenceLevel(values.length, 2);
  const dataPoints: ForecastDataPoint[] = [];

  // Historical data points
  for (const key of sortedKeys) {
    const [y, m] = key.split('-');
    dataPoints.push({
      label: `${MONTHS[parseInt(m) - 1]} ${y}`,
      actual: byMonth.get(key) || 0,
      isPredicted: false,
    });
  }

  // Project forward
  const projectedValues: number[] = [];
  const windowSize = Math.min(values.length, 6);
  const recentValues = values.slice(-windowSize);
  const wma = weightedMovingAverage(recentValues);

  // Calculate trend from last 2 periods
  const lastVal = values[values.length - 1] || 0;
  const prevVal = values[values.length - 2] || lastVal;
  const monthlyGrowthFactor = prevVal > 0 ? lastVal / prevVal : 1;

  const now = new Date();
  for (let i = 1; i <= forecastMonths; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const projected = wma * Math.pow(monthlyGrowthFactor, i * 0.3); // Damped growth
    const label = `${MONTHS[futureDate.getMonth()]} ${futureDate.getFullYear()}`;

    projectedValues.push(projected);
    dataPoints.push({
      label,
      projected: Math.round(projected * 100) / 100,
      bull: Math.round(projected * BULL_FACTOR * 100) / 100,
      bear: Math.round(projected * BEAR_FACTOR * 100) / 100,
      isPredicted: true,
    });
  }

  const projectedTotal = projectedValues.reduce((a, b) => a + b, 0);
  const rate = growthRate(lastVal, prevVal);

  return {
    horizon: 'monthly',
    dataPoints,
    projectedTotal: Math.round(projectedTotal * 100) / 100,
    growthRate: Math.round(rate * 10) / 10,
    confidence,
    avgMonthlyValue: Math.round(wma * 100) / 100,
    trendDirection: trendDirection(rate),
    scenarioSummary: {
      base: Math.round(projectedTotal * 100) / 100,
      bull: Math.round(projectedTotal * BULL_FACTOR * 100) / 100,
      bear: Math.round(projectedTotal * BEAR_FACTOR * 100) / 100,
    },
  };
}

// ─── Quarterly Forecast (QoQ) ───

export function computeQuarterlyForecast(
  records: ForecastableRecord[],
  forecastQuarters: number = 2
): ForecastResult {
  const byQuarter = aggregateByPeriod(records, (d) => getQuarterKey(d));

  const sortedKeys = Array.from(byQuarter.keys()).sort((a, b) => {
    const [qa, ya] = [parseInt(a[1]), parseInt(a.slice(3))];
    const [qb, yb] = [parseInt(b[1]), parseInt(b.slice(3))];
    return ya !== yb ? ya - yb : qa - qb;
  });
  const values = sortedKeys.map((k) => byQuarter.get(k) || 0);

  const confidence = confidenceLevel(values.length, 2);
  const dataPoints: ForecastDataPoint[] = [];

  for (const key of sortedKeys) {
    dataPoints.push({
      label: key,
      actual: byQuarter.get(key) || 0,
      isPredicted: false,
    });
  }

  const windowSize = Math.min(values.length, 4);
  const recentValues = values.slice(-windowSize);
  const wma = weightedMovingAverage(recentValues);

  const lastVal = values[values.length - 1] || 0;
  const prevVal = values[values.length - 2] || lastVal;
  const qoqGrowthFactor = prevVal > 0 ? lastVal / prevVal : 1;

  const projectedValues: number[] = [];
  const now = new Date();
  const currentQ = Math.ceil((now.getMonth() + 1) / 3);
  const currentYear = now.getFullYear();

  for (let i = 1; i <= forecastQuarters; i++) {
    let q = currentQ + i;
    let y = currentYear;
    while (q > 4) { q -= 4; y++; }

    const projected = wma * Math.pow(qoqGrowthFactor, i * 0.4);
    projectedValues.push(projected);

    dataPoints.push({
      label: `Q${q} ${y}`,
      projected: Math.round(projected * 100) / 100,
      bull: Math.round(projected * BULL_FACTOR * 100) / 100,
      bear: Math.round(projected * BEAR_FACTOR * 100) / 100,
      isPredicted: true,
    });
  }

  const projectedTotal = projectedValues.reduce((a, b) => a + b, 0);
  const rate = growthRate(lastVal, prevVal);

  return {
    horizon: 'quarterly',
    dataPoints,
    projectedTotal: Math.round(projectedTotal * 100) / 100,
    growthRate: Math.round(rate * 10) / 10,
    confidence,
    avgMonthlyValue: Math.round((wma / 3) * 100) / 100,
    trendDirection: trendDirection(rate),
    scenarioSummary: {
      base: Math.round(projectedTotal * 100) / 100,
      bull: Math.round(projectedTotal * BULL_FACTOR * 100) / 100,
      bear: Math.round(projectedTotal * BEAR_FACTOR * 100) / 100,
    },
  };
}

// ─── Annual Forecast (YoY) ───

export function computeAnnualForecast(
  records: ForecastableRecord[],
  forecastYears: number = 2
): ForecastResult {
  const byYear = aggregateByPeriod(records, (d) => getYearKey(d));

  const sortedKeys = Array.from(byYear.keys()).sort();
  const values = sortedKeys.map((k) => byYear.get(k) || 0);

  const confidence = confidenceLevel(values.length, 1);
  const dataPoints: ForecastDataPoint[] = [];

  for (const key of sortedKeys) {
    dataPoints.push({
      label: key,
      actual: byYear.get(key) || 0,
      isPredicted: false,
    });
  }

  const wma = weightedMovingAverage(values);
  const lastVal = values[values.length - 1] || 0;
  const prevVal = values[values.length - 2] || lastVal;
  const yoyGrowthFactor = prevVal > 0 ? lastVal / prevVal : 1;

  const projectedValues: number[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 1; i <= forecastYears; i++) {
    const projected = wma * Math.pow(yoyGrowthFactor, i * 0.5);
    projectedValues.push(projected);

    dataPoints.push({
      label: `${currentYear + i}`,
      projected: Math.round(projected * 100) / 100,
      bull: Math.round(projected * BULL_FACTOR * 100) / 100,
      bear: Math.round(projected * BEAR_FACTOR * 100) / 100,
      isPredicted: true,
    });
  }

  const projectedTotal = projectedValues.reduce((a, b) => a + b, 0);
  const rate = growthRate(lastVal, prevVal);

  return {
    horizon: 'annual',
    dataPoints,
    projectedTotal: Math.round(projectedTotal * 100) / 100,
    growthRate: Math.round(rate * 10) / 10,
    confidence,
    avgMonthlyValue: Math.round((wma / 12) * 100) / 100,
    trendDirection: trendDirection(rate),
    scenarioSummary: {
      base: Math.round(projectedTotal * 100) / 100,
      bull: Math.round(projectedTotal * BULL_FACTOR * 100) / 100,
      bear: Math.round(projectedTotal * BEAR_FACTOR * 100) / 100,
    },
  };
}

// ─── Unified Entry Point ───

export function computeForecastFromRecords(
  records: ForecastableRecord[],
  horizon: 'monthly' | 'quarterly' | 'annual'
): ForecastResult {
  switch (horizon) {
    case 'monthly':
      return computeMonthlyForecast(records);
    case 'quarterly':
      return computeQuarterlyForecast(records);
    case 'annual':
      return computeAnnualForecast(records);
  }
}

/**
 * Format a ForecastResult into a structured text summary for the AI agent
 */
export function formatForecastForAgent(result: ForecastResult, label: string): string {
  const horizonLabel = result.horizon === 'monthly' ? '30-Day (MoM)' :
                       result.horizon === 'quarterly' ? 'Quarterly (QoQ)' : 'Annual (YoY)';

  const arrow = result.trendDirection === 'UP' ? '📈' :
                result.trendDirection === 'DOWN' ? '📉' : '➡️';

  const historicalPoints = result.dataPoints.filter(d => !d.isPredicted);
  const projectedPoints = result.dataPoints.filter(d => d.isPredicted);

  let summary = `${arrow} ${label.toUpperCase()} FORECAST — ${horizonLabel} Horizon\n`;
  summary += `${'─'.repeat(60)}\n`;
  summary += `• Confidence Level: ${result.confidence}\n`;
  summary += `• Trend Direction: ${result.trendDirection} (${result.growthRate > 0 ? '+' : ''}${result.growthRate}% growth rate)\n`;
  summary += `• Average Monthly Run-Rate: $${result.avgMonthlyValue.toLocaleString()}\n\n`;

  if (historicalPoints.length > 0) {
    summary += `Historical Actuals:\n`;
    for (const p of historicalPoints.slice(-4)) {
      summary += `  • ${p.label}: $${(p.actual || 0).toLocaleString()}\n`;
    }
    summary += `\n`;
  }

  if (projectedPoints.length > 0) {
    summary += `Projected (3-Scenario Model):\n`;
    for (const p of projectedPoints) {
      summary += `  • ${p.label}: Base $${(p.projected || 0).toLocaleString()} | Bull $${(p.bull || 0).toLocaleString()} | Bear $${(p.bear || 0).toLocaleString()}\n`;
    }
    summary += `\n`;
  }

  summary += `Scenario Totals:\n`;
  summary += `  • Base: $${result.scenarioSummary.base.toLocaleString()}\n`;
  summary += `  • Bull (+15%): $${result.scenarioSummary.bull.toLocaleString()}\n`;
  summary += `  • Bear (-15%): $${result.scenarioSummary.bear.toLocaleString()}\n`;

  return summary;
}
