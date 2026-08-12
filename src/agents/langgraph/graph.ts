/**
 * EliteBooks — Master LangGraph State Machine
 * Links Nodes, Edges, Short/Long-Term Memory, GraphRAG, and A2A Communication into a compiled graph runner.
 */

import { EliteBooksAgentState } from './agent-state';
import {
  memoryRetrievalNode,
  graphExtractorNode,
  routerNode,
  specializedAgentNode,
  a2aBridgeNode,
  humanApprovalNode,
  memoryPersistenceNode,
} from './nodes';
import {
  routeFromMemory,
  routeFromGraphRAG,
  routeFromRouter,
  routeFromA2ABridge,
  routeFromSpecializedAgent,
  routeFromHumanApproval,
  NextStep,
} from './edges';

export interface GraphExecutionResult {
  success: boolean;
  message: string;
  agentUsed: string;
  sessionId: string;
  graphRagContext: string;
  a2aMessages: any[];
  auditTrail: any[];
  pendingActions: any[];
}

/**
 * Execute the master EliteBooks LangGraph State Machine
 */
export async function runEliteBooksGraph(
  userQuery: string,
  orgId: string = 'default',
  userId: string = 'anonymous',
  sessionId: string = `sess_${Date.now()}`
): Promise<GraphExecutionResult> {
  // Initialize baseline state
  let state: EliteBooksAgentState = {
    sessionId,
    orgId,
    userId,
    userQuery,
    messages: [],
    currentAgent: 'Orchestrator',
    graphRagContext: '',
    longTermMemories: [],
    cachedOutputs: {},
    sharedContext: {},
    a2aMessages: [],
    requiresApproval: false,
    pendingActions: [],
    auditTrail: [
      {
        nodeName: 'start',
        action: 'Initialized LangGraph Execution',
        agentUsed: 'System',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    // Step 1: Memory Retrieval Node
    const memUpdate = await memoryRetrievalNode(state);
    state = { ...state, ...memUpdate };

    // Step 2: Edge route after memory
    let nextStep: NextStep = routeFromMemory(state);

    if (nextStep === 'graphExtractorNode') {
      const graphUpdate = await graphExtractorNode(state);
      state = { ...state, ...graphUpdate };
      nextStep = routeFromGraphRAG(state);
    }

    // Step 3: Router Node (Orchestrator)
    if (nextStep === 'routerNode') {
      const routerUpdate = await routerNode(state);
      state = { ...state, ...routerUpdate };
      nextStep = routeFromRouter(state);
    }

    // Fast return if answered via cache
    if (state.finalOutput && nextStep === 'END') {
      return {
        success: true,
        message: state.finalOutput,
        agentUsed: state.currentAgent,
        sessionId: state.sessionId,
        graphRagContext: state.graphRagContext,
        a2aMessages: state.a2aMessages,
        auditTrail: state.auditTrail,
        pendingActions: state.pendingActions,
      };
    }

    // Step 4: Intercept if Human Approval is Required
    if (nextStep === 'humanApprovalNode') {
      const approvalUpdate = await humanApprovalNode(state);
      state = { ...state, ...approvalUpdate };

      // Persist partial state and return approval warning
      await memoryPersistenceNode(state);

      return {
        success: false,
        message: state.finalOutput || 'Approval required before executing high value action.',
        agentUsed: state.currentAgent,
        sessionId: state.sessionId,
        graphRagContext: state.graphRagContext,
        a2aMessages: state.a2aMessages,
        auditTrail: state.auditTrail,
        pendingActions: state.pendingActions,
      };
    }

    // Step 5: A2A Bridge Node if multi-agent collaboration required
    if (nextStep === 'a2aBridgeNode') {
      const a2aUpdate = await a2aBridgeNode(state);
      state = { ...state, ...a2aUpdate };
      nextStep = routeFromA2ABridge(state);
    }

    // Step 6: Specialized Agent Execution Node
    if (nextStep === 'specializedAgentNode') {
      const agentUpdate = await specializedAgentNode(state);
      state = { ...state, ...agentUpdate };
      nextStep = routeFromSpecializedAgent(state);
    }

    // Step 7: Memory & Cache Persistence Node
    if (nextStep === 'memoryPersistenceNode') {
      const persistUpdate = await memoryPersistenceNode(state);
      state = { ...state, ...persistUpdate };
    }

    return {
      success: true,
      message: state.finalOutput || 'Task completed successfully.',
      agentUsed: state.currentAgent,
      sessionId: state.sessionId,
      graphRagContext: state.graphRagContext,
      a2aMessages: state.a2aMessages,
      auditTrail: state.auditTrail,
      pendingActions: state.pendingActions,
    };
  } catch (error) {
    console.error('[LangGraph Master Graph Error]:', error);
    return {
      success: false,
      message: 'An error occurred during multi-agent graph execution.',
      agentUsed: state.currentAgent || 'Orchestrator',
      sessionId: state.sessionId,
      graphRagContext: '',
      a2aMessages: state.a2aMessages,
      auditTrail: state.auditTrail,
      pendingActions: [],
    };
  }
}
