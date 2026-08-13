/**
 * EliteBooks — Proactive AI Business Intelligence Feed Engine
 * Scans financial data streams, anomaly detectors, and forecasts to generate real-time,
 * actionable feed items categorized across 5 severity levels.
 */

import { AIBusinessFeedItem, HITLApprovalRequest } from '@/types/agent-system';

// In-memory store for feed items & approval requests
let mockFeedItems: AIBusinessFeedItem[] = [
  {
    id: 'feed_001',
    event: 'Split Transaction / Anomaly Flagged',
    whyItMatters: '$2,450 charge from Substack Inc billed under Office Supplies. Typical recurring software patterns suggest misclassification.',
    severity: 'attention',
    confidence: 0.94,
    financialImpact: -2450.0,
    recommendedAction: 'Reclassify transaction to "Software & SaaS" account code 6100.',
    sourceData: 'Transaction #tx_104 [Substack Inc]',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    responsibleAgent: 'Accounting Agent',
    approvalRequirement: {
      requiresApproval: false,
      actionType: 'categorize_transaction',
      targetEntityId: 'tx_104',
      payload: { transactionId: 'tx_104', category: 'Software & SaaS', accountCode: '6100' },
      approvalStatus: 'pending',
    },
  },
  {
    id: 'feed_002',
    event: 'Three Invoices Overdue ($18,400 Total)',
    whyItMatters: 'Acme Corp ($12,000) is 16 days overdue; Starlight Tech ($6,400) is 12 days overdue. Impacting Q3 operating liquidity.',
    severity: 'attention',
    confidence: 0.98,
    financialImpact: 18400.0,
    recommendedAction: 'Dispatch automated payment reminders with updated payment link.',
    sourceData: 'Accounts Receivable Subledger',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    responsibleAgent: 'Payments Agent',
    approvalRequirement: {
      requiresApproval: false,
      actionType: 'send_payment_reminder',
      targetEntityId: 'inv_881',
      payload: { invoiceId: 'inv_881', recipientEmail: 'billing@acme.com' },
      approvalStatus: 'pending',
    },
  },
  {
    id: 'feed_003',
    event: 'Project Alpha Budget Overrun Alert (+17%)',
    whyItMatters: 'Project Alpha actual costs reached $58,500 vs $50,000 budget, reducing projected margin from 31% to 22%.',
    severity: 'critical',
    confidence: 0.96,
    financialImpact: -8500.0,
    recommendedAction: 'Reallocate contractor headcount and review software license allocation for Project Alpha.',
    sourceData: 'Projects Ledger & Time Tracking API',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    responsibleAgent: 'Projects Agent',
  },
  {
    id: 'feed_004',
    event: '90-Day Cash Flow Surplus Forecast (+18.4%)',
    whyItMatters: 'Strong recurring enterprise contract collections project net cash reserves growing to $182,000 by November 2026.',
    severity: 'forecast',
    confidence: 0.91,
    financialImpact: 36800.0,
    recommendedAction: 'Evaluate deployment of surplus capital into high-yield treasury reserve or strategic hiring.',
    sourceData: '30/60/90 Day Treasury Forecast Model',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    responsibleAgent: 'Finance Agent',
  },
  {
    id: 'feed_005',
    event: 'SaaS Subscription Optimization Opportunity',
    whyItMatters: 'Unused software seats across 3 tools identified. Potential annual cost savings of $4,200.',
    severity: 'opportunity',
    confidence: 0.89,
    financialImpact: 4200.0,
    recommendedAction: 'Downgrade license tier prior to upcoming annual auto-renewal.',
    sourceData: 'FinOps Vendor Audit Engine',
    timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
    responsibleAgent: 'CFO Agent',
  },
  {
    id: 'feed_006',
    event: 'High-Value Payment Authorization Request ($12,500)',
    whyItMatters: 'Quarterly Cloud Infrastructure payout to Amazon Web Services exceeds policy limit of $5,000.',
    severity: 'critical',
    confidence: 0.99,
    financialImpact: -12500.0,
    recommendedAction: 'Requires explicit Human-in-the-Loop approval before disbursement.',
    sourceData: 'Accounts Payable Outflow Stream',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    responsibleAgent: 'Payments Agent',
    approvalRequirement: {
      requiresApproval: true,
      actionType: 'execute_approved_action',
      targetEntityId: 'req_aws_pay_125',
      payload: { approvalId: 'req_aws_pay_125', amount: 12500, vendor: 'Amazon Web Services' },
      approvalStatus: 'pending',
    },
  },
];

let pendingApprovals: HITLApprovalRequest[] = [
  {
    id: 'req_aws_pay_125',
    title: 'Authorize AWS Infrastructure Payout ($12,500.00)',
    description: 'Quarterly cloud computing payment to Amazon Web Services. Verified FOCUS 1.3 usage receipt attached.',
    responsibleAgent: 'Payments Agent',
    toolName: 'execute_approved_action',
    actionType: 'Disburse Accounts Payable Outflow',
    financialImpact: -12500.0,
    confidenceScore: 0.99,
    evidence: [
      'AWS Master Agreement Contract #AWS-88392',
      'Usage metrics verified matching CloudWatch billing API',
      'Pre-approved under Q3 Cloud Infrastructure Budget',
    ],
    reasoning: 'Payment exceeds automated execution threshold of $5,000.00 and requires human authorization.',
    payload: { vendor: 'Amazon Web Services', amount: 12500.0, accountCode: '2000' },
    status: 'pending',
    requestedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
];

export class AIBusinessFeedService {
  public static getFeedItems(): AIBusinessFeedItem[] {
    return [...mockFeedItems];
  }

  public static getPendingApprovals(): HITLApprovalRequest[] {
    return [...pendingApprovals];
  }

  public static approveRequest(requestId: string, user: string = 'Financial Controller'): boolean {
    const reqIndex = pendingApprovals.findIndex((r) => r.id === requestId);
    if (reqIndex !== -1) {
      pendingApprovals[reqIndex].status = 'approved';
      pendingApprovals[reqIndex].approvedAt = new Date().toISOString();
      pendingApprovals[reqIndex].approvedBy = user;

      // Update feed item if associated
      const feedItem = mockFeedItems.find(
        (f) => f.approvalRequirement && f.approvalRequirement.targetEntityId === requestId
      );
      if (feedItem && feedItem.approvalRequirement) {
        feedItem.approvalRequirement.approvalStatus = 'approved';
      }
      return true;
    }
    return false;
  }

  public static rejectRequest(requestId: string, user: string = 'Financial Controller'): boolean {
    const reqIndex = pendingApprovals.findIndex((r) => r.id === requestId);
    if (reqIndex !== -1) {
      pendingApprovals[reqIndex].status = 'rejected';
      const feedItem = mockFeedItems.find(
        (f) => f.approvalRequirement && f.approvalRequirement.targetEntityId === requestId
      );
      if (feedItem && feedItem.approvalRequirement) {
        feedItem.approvalRequirement.approvalStatus = 'rejected';
      }
      return true;
    }
    return false;
  }
}
