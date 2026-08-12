/**
 * EliteBooks — LangGraph Conditional Edge Routers
 * Determines dynamic flow transitions based on state parameters and execution flags.
 */

import { EliteBooksAgentState } from './agent-state';

export type NextStep =
  | 'memoryRetrievalNode'
  | 'graphExtractorNode'
  | 'routerNode'
  | 'specializedAgentNode'
  | 'a2aBridgeNode'
  | 'humanApprovalNode'
  | 'memoryPersistenceNode'
  | 'END';

/**
 * Conditional router following memory loading
 */
export function routeFromMemory(state: EliteBooksAgentState): NextStep {
  if (state.cachedOutputs?.response) {
    return 'routerNode'; // Fast-path via cache
  }
  return 'graphExtractorNode';
}

/**
 * Conditional router following GraphRAG extraction
 */
export function routeFromGraphRAG(state: EliteBooksAgentState): NextStep {
  return 'routerNode';
}

/**
 * Conditional router following Orchestrator Router decision
 */
export function routeFromRouter(state: EliteBooksAgentState): NextStep {
  if (state.finalOutput) {
    return 'END'; // Already answered via cache
  }

  if (state.requiresApproval) {
    return 'humanApprovalNode';
  }

  // If query needs multi-agent collaboration (Invoicing/Expense)
  if (['Invoicing Agent', 'Expense Agent'].includes(state.currentAgent)) {
    return 'a2aBridgeNode';
  }

  return 'specializedAgentNode';
}

/**
 * Conditional router following A2A Delegation Bridge
 */
export function routeFromA2ABridge(state: EliteBooksAgentState): NextStep {
  return 'specializedAgentNode';
}

/**
 * Conditional router following Specialized Agent execution
 */
export function routeFromSpecializedAgent(state: EliteBooksAgentState): NextStep {
  return 'memoryPersistenceNode';
}

/**
 * Conditional router following Human Approval check
 */
export function routeFromHumanApproval(state: EliteBooksAgentState): NextStep {
  return 'memoryPersistenceNode';
}

/**
 * Conditional router following Memory Persistence
 */
export function routeFromPersistence(state: EliteBooksAgentState): NextStep {
  return 'END';
}
