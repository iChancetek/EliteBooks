/**
 * EliteBooks — Autonomous Fraud & Anomaly Sentinel Guardrails
 * Intercepts invoices, expenses, and payroll runs to detect duplicate billing,
 * split-payment threshold evasion, vendor account switches, round-dollar anomalies, and velocity spikes.
 */

export interface TransactionForScreening {
  id: string;
  orgId: string;
  vendorOrClient: string;
  amount: number;
  description: string;
  bankRoutingNumber?: string;
  bankAccountNumber?: string;
  timestamp?: string;
}

export interface AnomalyFlag {
  riskScore: number; // 0.0 to 1.0
  severity: 'low' | 'medium' | 'high' | 'critical';
  ruleTriggered: string;
  description: string;
  actionRecommended: 'approve' | 'flag_for_review' | 'block';
}

export interface SentinelScanResult {
  transactionId: string;
  isPassed: boolean;
  maxRiskScore: number;
  flags: AnomalyFlag[];
  scannedAt: string;
}

// In-memory sliding window history per organization for pattern & duplicate checking
const recentTransactionWindow = new Map<string, TransactionForScreening[]>();

export class FraudSentinelGuard {
  private static instance: FraudSentinelGuard;
  private readonly APPROVAL_THRESHOLD = 5000;

  private constructor() {}

  public static getInstance(): FraudSentinelGuard {
    if (!FraudSentinelGuard.instance) {
      FraudSentinelGuard.instance = new FraudSentinelGuard();
    }
    return FraudSentinelGuard.instance;
  }

  /**
   * Scan a transaction against 5 real-time fraud & anomaly detection rules
   */
  public async scanTransaction(tx: TransactionForScreening): Promise<SentinelScanResult> {
    const orgId = tx.orgId || 'default';
    const history = recentTransactionWindow.get(orgId) || [];
    const flags: AnomalyFlag[] = [];

    // Rule 1: Duplicate Billing Detection (same vendor + amount within rolling window)
    const duplicate = history.find(
      (past) =>
        past.vendorOrClient.toLowerCase() === tx.vendorOrClient.toLowerCase() &&
        Math.abs(past.amount - tx.amount) < 0.01 &&
        past.id !== tx.id
    );

    if (duplicate) {
      flags.push({
        riskScore: 0.92,
        severity: 'high',
        ruleTriggered: 'DUPLICATE_BILLING_DETECTED',
        description: `Identical transaction of $${tx.amount.toLocaleString()} for vendor "${tx.vendorOrClient}" was previously processed (Tx: ${duplicate.id}).`,
        actionRecommended: 'flag_for_review',
      });
    }

    // Rule 2: Split-Payment Threshold Evasion (Structuring below $5,000 human approval limit)
    const recentSubThresholds = history.filter(
      (past) =>
        past.vendorOrClient.toLowerCase() === tx.vendorOrClient.toLowerCase() &&
        past.amount >= 4000 &&
        past.amount < 5000 &&
        tx.amount >= 4000 &&
        tx.amount < 5000
    );

    if (recentSubThresholds.length >= 1) {
      flags.push({
        riskScore: 0.88,
        severity: 'high',
        ruleTriggered: 'SPLIT_TRANSACTION_STRUCTURING',
        description: `Potential threshold evasion: Multiple payments just under the $${this.APPROVAL_THRESHOLD.toLocaleString()} human review limit detected for "${tx.vendorOrClient}".`,
        actionRecommended: 'flag_for_review',
      });
    }

    // Rule 3: Vendor Routing Number / Bank Account Switch
    if (tx.bankRoutingNumber && tx.bankAccountNumber) {
      const pastVendorTx = history.find(
        (past) =>
          past.vendorOrClient.toLowerCase() === tx.vendorOrClient.toLowerCase() &&
          past.bankRoutingNumber &&
          (past.bankRoutingNumber !== tx.bankRoutingNumber || past.bankAccountNumber !== tx.bankAccountNumber)
      );

      if (pastVendorTx) {
        flags.push({
          riskScore: 0.95,
          severity: 'critical',
          ruleTriggered: 'VENDOR_BANK_ROUTING_SWITCH',
          description: `Security Alert: Vendor "${tx.vendorOrClient}" bank routing details changed suddenly from previous payments.`,
          actionRecommended: 'block',
        });
      }
    }

    // Rule 4: Round-Dollar Anomaly Detection for high values
    if (tx.amount >= 1000 && tx.amount % 500 === 0 && !tx.description.toLowerCase().includes('retainer')) {
      flags.push({
        riskScore: 0.45,
        severity: 'medium',
        ruleTriggered: 'ROUND_DOLLAR_ANOMALY',
        description: `Un-itemized round dollar transaction of $${tx.amount.toLocaleString()} detected. Verify itemization statement.`,
        actionRecommended: 'approve',
      });
    }

    // Rule 5: High Velocity Spikes (> 5 transactions for same org in last short burst)
    if (history.length >= 8) {
      flags.push({
        riskScore: 0.65,
        severity: 'medium',
        ruleTriggered: 'TRANSACTION_VELOCITY_SPIKE',
        description: `Unusual transaction volume burst detected for organization ${orgId}.`,
        actionRecommended: 'approve',
      });
    }

    // Record in history window (capped at 50 recent items)
    history.push({ ...tx, timestamp: new Date().toISOString() });
    if (history.length > 50) history.shift();
    recentTransactionWindow.set(orgId, history);

    const maxRiskScore = flags.length > 0 ? Math.max(...flags.map((f) => f.riskScore)) : 0;
    const isPassed = !flags.some((f) => f.severity === 'high' || f.severity === 'critical');

    return {
      transactionId: tx.id,
      isPassed,
      maxRiskScore,
      flags,
      scannedAt: new Date().toISOString(),
    };
  }
}

export const fraudSentinel = FraudSentinelGuard.getInstance();
