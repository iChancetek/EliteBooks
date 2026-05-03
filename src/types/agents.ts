/* ═══════════════════════════════════════════════════════════════
   EliteBooks — Agent Types
   ═══════════════════════════════════════════════════════════════ */

export type AgentType =
  | 'orchestrator'
  | 'ledger'
  | 'expense'
  | 'invoicing'
  | 'cashflow'
  | 'payroll'
  | 'compliance';

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  agentType?: AgentType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AgentAction {
  id: string;
  orgId: string;
  agentType: AgentType;
  action: string;
  description: string;
  entityType?: string;
  entityId?: string;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'requires_approval';
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AgentContext {
  orgId: string;
  userId: string;
  conversationHistory: AgentMessage[];
  activeAgents: AgentType[];
  financialContext?: {
    currentMonth: string;
    revenue: number;
    expenses: number;
    cashBalance: number;
  };
}

export interface AgentResponse {
  message: string;
  actions: AgentAction[];
  handoffTo?: AgentType;
  requiresApproval: boolean;
  suggestions?: string[];
}

export interface AgentToolCall {
  toolName: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  executedAt?: string;
}
