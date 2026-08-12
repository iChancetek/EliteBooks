/**
 * EliteBooks — Unified LangGraph State Definition
 * Defines the state schema passed through all LangGraph nodes and edges.
 */

import { MessageBufferItem, ShortTermMemoryState } from '../memory/short-term-memory';
import { AgentToAgentMessage } from '../a2a/agent-bus';

export interface AuditLogEntry {
  nodeName: string;
  action: string;
  agentUsed: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface PendingAction {
  id: string;
  actionType: string;
  amount?: number;
  description: string;
  requiresUserApproval: boolean;
}

export interface EliteBooksAgentState {
  // Primary identifiers
  sessionId: string;
  orgId: string;
  userId: string;

  // Active user query & message history
  userQuery: string;
  messages: MessageBufferItem[];

  // Routing and Agent Delegation
  currentAgent: string;
  targetAgent?: string;
  handoffReason?: string;

  // GraphRAG & Multi-layer Memory
  graphRagContext: string;
  shortTermMemory?: ShortTermMemoryState;
  longTermMemories: Array<{ content: string; score: number; category: string }>;

  // Cache & Shared Cross-Agent Context
  cachedOutputs: Record<string, unknown>;
  sharedContext: Record<string, unknown>;
  a2aMessages: AgentToAgentMessage[];

  // Execution Control & Human-In-The-Loop Safety
  requiresApproval: boolean;
  pendingActions: PendingAction[];
  finalOutput?: string;

  // Audit & Telemetry Trace
  auditTrail: AuditLogEntry[];
}
