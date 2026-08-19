/**
 * EliteBooks — Multi-Agent System Types & Schemas
 * Core domain types for 10 specialized agents + CFO Synthesizer, structured A2A messaging,
 * 5-tier AI Business Intelligence Feed, HITL approvals, and MCP tool schemas.
 */

export type AgentRole =
  | 'Accounting Agent'
  | 'Finance Agent'
  | 'Customer Agent'
  | 'Payments Agent'
  | 'Projects Agent'
  | 'Payroll Agent'
  | 'Tax Agent'
  | 'Reconciliation Agent'
  | 'Reporting Agent'
  | 'HR Agent'
  | 'CFO Agent'
  | 'Orchestrator';

export type UserRole =
  | 'Administrator'
  | 'Financial Manager'
  | 'Accountant'
  | 'Payroll Manager'
  | 'Business Manager'
  | 'AI Agent';

export type FeedSeverity = 'critical' | 'attention' | 'insight' | 'opportunity' | 'forecast';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'cancelled';

export interface StructuredA2AMessage {
  messageId: string;
  agentId: AgentRole;
  targetAgentId?: AgentRole;
  taskId: string;
  source: string;
  event: string;
  data: Record<string, unknown>;
  confidence: number; // 0.0 to 1.0
  recommendation: string;
  financialImpact: number; // Dollar amount (positive or negative)
  requiredAction?: string;
  approvalStatus: ApprovalStatus;
  timestamp: string;
}

export interface AIBusinessFeedItem {
  id: string;
  event: string;
  whyItMatters: string;
  severity: FeedSeverity;
  confidence: number; // 0.0 to 1.0
  financialImpact: number; // e.g. -2450 or +18400
  recommendedAction: string;
  sourceData: string;
  timestamp: string;
  responsibleAgent: AgentRole;
  approvalRequirement?: {
    requiresApproval: boolean;
    actionType: string;
    targetEntityId?: string;
    payload?: Record<string, unknown>;
    approvalStatus: ApprovalStatus;
  };
}

export interface HITLApprovalRequest {
  id: string;
  title: string;
  description: string;
  responsibleAgent: AgentRole;
  toolName: string;
  actionType: string;
  financialImpact: number;
  confidenceScore: number;
  evidence: string[];
  reasoning: string;
  payload: Record<string, unknown>;
  status: ApprovalStatus;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  executionResult?: Record<string, unknown>;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  vendor: string;
  amount: number;
  category: string;
  accountCode: string;
  status: 'posted' | 'pending_review' | 'flagged';
  confidenceScore?: number;
  suggestedCategory?: string;
  anomalyDetected?: boolean;
  anomalyReason?: string;
  isDuplicate?: boolean;
}

export interface CustomerFinancialProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  totalRevenue: number;
  outstandingBalance: number;
  overdueInvoicesCount: number;
  delinquencyRiskScore: number; // 0 to 100
  engagementScore: number; // 0 to 100
  lastInteractionDate: string;
  status: 'active' | 'at_risk' | 'delinquent' | 'lead';
}

export interface ProjectFinancialProfile {
  id: string;
  name: string;
  clientName: string;
  budgetAmount: number;
  actualCost: number;
  committedCost: number;
  revenue: number;
  estimatedMargin: number; // percentage
  actualMargin: number; // percentage
  isOverBudget: boolean;
  overBudgetPercentage: number;
  status: 'on_track' | 'warning' | 'over_budget' | 'completed';
}

export interface CashFlowForecastPoint {
  date: string;
  projectedInflow: number;
  projectedOutflow: number;
  netBalance: number;
  confidenceLower: number;
  confidenceUpper: number;
}
