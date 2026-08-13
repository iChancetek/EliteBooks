/**
 * EliteBooks — LangGraph Node Handlers
 * Functional node processors for state transformation across the agent execution graph.
 */

import { EliteBooksAgentState } from './agent-state';
import { ShortTermMemoryManager } from '../memory/short-term-memory';
import { LongTermMemoryManager } from '../memory/long-term-memory';
import { GraphRAGManager } from '../memory/graph-rag';
import { agentCache } from '../memory/agent-cache';
import { agentBus } from '../a2a/agent-bus';
import { piiVault } from '@/security/pii-vault';
import getOpenAIClient from '@/lib/openai';

/**
 * 1. Memory Retrieval Node: Loads Short-Term, Long-Term, and Cache context
 */
export async function memoryRetrievalNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: memoryRetrievalNode] Loading context for org ${state.orgId}`);

  // Anonymize user query in RAM before querying vectors or long term memory
  const maskedQuery = piiVault.mask(state.userQuery, state.sessionId);

  // Fetch short term session state
  const shortTermState = await ShortTermMemoryManager.getSession(
    state.sessionId,
    state.orgId,
    state.userId
  );

  // Fetch long term memory from Pinecone vector store using masked query
  const longTermMems = await LongTermMemoryManager.queryMemory(
    state.orgId,
    maskedQuery,
    3
  );

  // Check cache for previous matching query
  const cacheKey = agentCache.generateKey(`query:${state.orgId}`, maskedQuery);
  const cachedResponse = await agentCache.get<string>(cacheKey);

  const auditEntry = {
    nodeName: 'memoryRetrievalNode',
    action: 'Loaded Short & Long-Term Memory (PII/PHI Masked)',
    agentUsed: 'Memory System',
    timestamp: new Date().toISOString(),
  };

  return {
    shortTermMemory: shortTermState,
    longTermMemories: longTermMems,
    cachedOutputs: cachedResponse ? { response: cachedResponse } : {},
    auditTrail: [...state.auditTrail, auditEntry],
  };
}


/**
 * 2. GraphRAG Extractor Node: Extracts Entities/Relations and performs Graph-Vector Fusion Search
 */
export async function graphExtractorNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: graphExtractorNode] Performing GraphRAG extraction`);

  // Extract entities from user query
  await GraphRAGManager.extractGraphEntities(state.orgId, state.userQuery);

  // Retrieve Graph-Vector Fusion context
  const fusionContext = await GraphRAGManager.fusionSearch(
    state.orgId,
    state.userQuery,
    3
  );

  const auditEntry = {
    nodeName: 'graphExtractorNode',
    action: 'Extracted Financial Graph Entities & Fusion Subgraph',
    agentUsed: 'GraphRAG Engine',
    timestamp: new Date().toISOString(),
  };

  return {
    graphRagContext: fusionContext,
    auditTrail: [...state.auditTrail, auditEntry],
  };
}

/**
 * 3. Router Node (Orchestrator): Determines agent routing or direct response
 */
export async function routerNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: routerNode] Routing user query: "${state.userQuery}"`);

  // Check cache hit
  if (state.cachedOutputs.response) {
    return {
      currentAgent: 'Cache Engine',
      finalOutput: state.cachedOutputs.response as string,
      auditTrail: [
        ...state.auditTrail,
        {
          nodeName: 'routerNode',
          action: 'Cache Hit — Fast Return',
          agentUsed: 'Cache',
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  const queryLower = state.userQuery.toLowerCase();
  let targetAgent = 'EliteBooks Orchestrator';

  if (queryLower.includes('invoice') || queryLower.includes('bill')) {
    targetAgent = 'Invoicing Agent';
  } else if (queryLower.includes('expense') || queryLower.includes('receipt') || queryLower.includes('categorize')) {
    targetAgent = 'Expense Agent';
  } else if (queryLower.includes('payroll') || queryLower.includes('employee') || queryLower.includes('salary')) {
    targetAgent = 'Payroll Agent';
  } else if (queryLower.includes('cash') || queryLower.includes('profit') || queryLower.includes('forecast') || queryLower.includes('burn')) {
    targetAgent = 'Cash Flow Agent';
  } else if (queryLower.includes('reconcile') || queryLower.includes('journal') || queryLower.includes('ledger')) {
    targetAgent = 'Ledger Agent';
  } else if (queryLower.includes('tax') || queryLower.includes('audit') || queryLower.includes('compliance')) {
    targetAgent = 'Compliance Agent';
  } else if (queryLower.includes('cloud') || queryLower.includes('finops') || queryLower.includes('aws') || queryLower.includes('gpu')) {
    targetAgent = 'FinOps Agent';
  } else if (queryLower.includes('personal') || queryLower.includes('debt') || queryLower.includes('budget')) {
    targetAgent = 'Personal Agent';
  }

  // Run Autonomous Fraud & Anomaly Sentinel Guardrail check
  const amountMatch = state.userQuery.match(/\$?\s*([0-9,]+(\.[0-9]{2})?)/);
  let requiresApproval = false;
  const pendingActions = [];

  if (amountMatch) {
    const rawVal = parseFloat(amountMatch[1].replace(/,/g, ''));

    // Execute Fraud Sentinel Scan
    const { fraudSentinel } = await import('../guards/fraud-sentinel');
    const sentinelResult = await fraudSentinel.scanTransaction({
      id: `tx_${Date.now()}`,
      orgId: state.orgId,
      vendorOrClient: targetAgent,
      amount: rawVal,
      description: state.userQuery,
    });

    if (!sentinelResult.isPassed || rawVal >= 5000) {
      requiresApproval = true;
      pendingActions.push({
        id: `act_${Date.now()}`,
        actionType: sentinelResult.flags[0]?.ruleTriggered || 'high_value_transaction',
        amount: rawVal,
        description: sentinelResult.flags[0]?.description || `Financial action involving $${rawVal.toLocaleString()} requires user approval.`,
        requiresUserApproval: true,
      });
    }
  }

  const auditEntry = {
    nodeName: 'routerNode',
    action: `Routed request to ${targetAgent} (Fraud Sentinel Active)`,
    agentUsed: 'Orchestrator Node',
    timestamp: new Date().toISOString(),
  };

  return {
    currentAgent: targetAgent,
    targetAgent,
    requiresApproval,
    pendingActions,
    auditTrail: [...state.auditTrail, auditEntry],
  };

}

/**
 * 4. Specialized Agent Node: Invokes Universal Multi-Agent Autonomous Collaboration
 */
export async function specializedAgentNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: specializedAgentNode] Executing Multi-Agent Collaboration for ${state.currentAgent}`);

  const { runUniversalAgentCollaboration } = await import('../a2a/universal-collaboration');

  const collabRes = await runUniversalAgentCollaboration(
    state.userQuery,
    state.currentAgent || 'EliteBooks Orchestrator',
    state
  );

  const auditEntry = {
    nodeName: 'specializedAgentNode',
    action: `Executed Universal Multi-Agent Autonomous Collaboration for ${state.currentAgent} (PII/PHI Shield & SHA-256 Audit Lock Active)`,
    agentUsed: state.currentAgent || 'Multi-Agent Collaboration Engine',
    timestamp: new Date().toISOString(),
  };

  return {
    finalOutput: collabRes.transcript,
    a2aMessages: [...state.a2aMessages, ...collabRes.a2aMessages],
    auditTrail: [...state.auditTrail, auditEntry],
  };
}



/**
 * 5. Agent-to-Agent (A2A) Bridge Node: Facilitates inter-agent sub-task delegation
 */
export async function a2aBridgeNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: a2aBridgeNode] Initiating Inter-Agent A2A Delegation`);

  // Example A2A collaboration: Invoicing agent asks Cash Flow Agent for balance check
  let a2aMsg = null;
  if (state.currentAgent === 'Invoicing Agent') {
    a2aMsg = await agentBus.dispatch(
      'Invoicing Agent',
      'Cash Flow Agent',
      'Verify credit terms safety for invoice',
      { query: state.userQuery }
    );
  } else if (state.currentAgent === 'Expense Agent') {
    a2aMsg = await agentBus.dispatch(
      'Expense Agent',
      'Compliance Agent',
      'Audit tax deductibility status for receipt',
      { query: state.userQuery }
    );
  }

  const auditEntry = {
    nodeName: 'a2aBridgeNode',
    action: a2aMsg ? `A2A Message sent: ${a2aMsg.fromAgent} -> ${a2aMsg.toAgent}` : 'A2A Check Completed',
    agentUsed: 'A2A Communication Bus',
    timestamp: new Date().toISOString(),
  };

  return {
    a2aMessages: [...state.a2aMessages, ...(a2aMsg ? [a2aMsg] : [])],
    auditTrail: [...state.auditTrail, auditEntry],
  };
}

/**
 * 6. Human Approval Interceptor Node
 */
export async function humanApprovalNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: humanApprovalNode] Pausing execution for human approval`);

  const pendingMsg = state.pendingActions[0]?.description || 'Transaction requires manual human review.';
  const output = `⚠️ [HUMAN APPROVAL REQUIRED]: ${pendingMsg}\n\nPlease confirm to proceed with execution.`;

  return {
    finalOutput: output,
    auditTrail: [
      ...state.auditTrail,
      {
        nodeName: 'humanApprovalNode',
        action: 'Intercepted operation — Pending User Sign-off',
        agentUsed: 'Safety Guardrail',
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * 6b. MCP & Tavily Tool Execution Node: Executes tools requested by agents or query intent
 */
export async function toolExecutionNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: toolExecutionNode] Executing MCP/Tavily tools`);
  const { MCPToolBridge } = await import('./mcp-bridge');

  let toolResult = null;
  const queryLower = state.userQuery.toLowerCase();

  // If query asks for external market news, tax rules, or web lookup -> execute Tavily
  if (queryLower.includes('search') || queryLower.includes('news') || queryLower.includes('rate') || queryLower.includes('law')) {
    toolResult = await MCPToolBridge.executeTool('tavily_search', { query: state.userQuery, topic: 'finance' });
  }

  const auditEntry = {
    nodeName: 'toolExecutionNode',
    action: toolResult ? `Executed Tool: ${toolResult.toolName}` : 'No tool required',
    agentUsed: 'MCP Tool Execution Node',
    timestamp: new Date().toISOString(),
  };

  return {
    sharedContext: { ...state.sharedContext, lastToolOutput: toolResult },
    auditTrail: [...state.auditTrail, auditEntry],
  };
}


/**
 * 7. Memory Persistence Node: Saves new turns to short-term, long-term memory, and cache
 */
export async function memoryPersistenceNode(
  state: EliteBooksAgentState
): Promise<Partial<EliteBooksAgentState>> {
  console.log(`[LangGraph Node: memoryPersistenceNode] Persisting state and memories`);

  if (state.finalOutput) {
    // 1. Add turn to short term memory buffer
    await ShortTermMemoryManager.addMessage(state.sessionId, {
      role: 'user',
      content: state.userQuery,
      timestamp: new Date().toISOString(),
    });

    await ShortTermMemoryManager.addMessage(state.sessionId, {
      role: 'assistant',
      content: state.finalOutput,
      agentName: state.currentAgent,
      timestamp: new Date().toISOString(),
    });

    // 2. Cache final output for 5 minutes
    const cacheKey = agentCache.generateKey(`query:${state.orgId}`, state.userQuery);
    await agentCache.set(cacheKey, state.finalOutput, 300000, ['agent_queries']);

    // 3. Store long-term memory entry unconditionally for every interaction
    if (state.userQuery) {
      await LongTermMemoryManager.storeMemory(
        state.orgId,
        `Interaction [${state.currentAgent}]: User asked "${state.userQuery}". Outcome: ${state.finalOutput ? state.finalOutput.substring(0, 300) : ''}`,
        'transaction',
        { agent: state.currentAgent, sessionId: state.sessionId }
      ).catch((err) => console.warn('[Memory Storage Error]', err));
    }
  }

  // 4. Append Cryptographic SHA-256 block to audit chain
  const { auditLock } = await import('@/security/audit-lock');
  const auditBlock = auditLock.appendBlock(
    state.orgId,
    `EXECUTE_${state.currentAgent.toUpperCase().replace(/\s+/g, '_')}`,
    state.currentAgent,
    {
      query: state.userQuery,
      outputSnippet: state.finalOutput ? state.finalOutput.substring(0, 100) : '',
      sessionId: state.sessionId,
    }
  );

  const auditEntry = {
    nodeName: 'memoryPersistenceNode',
    action: `Persisted Memory & Cryptographic Audit Block #${auditBlock.index} (${auditBlock.blockHash.substring(0, 10)}...)`,
    agentUsed: 'Memory Persistence Node',
    timestamp: new Date().toISOString(),
  };

  return {
    auditTrail: [...state.auditTrail, auditEntry],
  };
}

