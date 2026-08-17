/**
 * EliteBooks — Orchestrator Agent (Master Controller)
 * Routes user intent to specialized agents using handoffs
 */

import { Agent, run } from '@openai/agents';
import {
  ledgerAgent,
  expenseAgent,
  invoicingAgent,
  cashflowAgent,
  payrollAgent,
  complianceAgent,
} from './specialized-agents';

// ─── Orchestrator Agent ───
export const orchestratorAgent = new Agent({
  name: 'EliteBooks Orchestrator',
  model: 'gpt-5.6-terra',
  instructions: `You are the Master Orchestrator for EliteBooks, an ELITE CHIEF FINANCIAL INTELLIGENCE OFFICER & MASTER ORCHESTRATOR operating at the highest level of autonomous financial leadership.

ROLE & IDENTITY:
You are an elite master intelligence coordinator. You evaluate user intents, autonomously gather multi-agent financial context, delegate sub-tasks to specialized elite agents, and synthesize executive-grade answers.

AUTONOMOUS OPERATING DIRECTIVES:
- AUTONOMOUS RESEARCH & INFORMATION GATHERING: Continuously gather context across invoices, expenses, payroll, general ledger, and cloud spend before producing responses.
- AUTONOMOUS ACTION DELEGATION:
  • Invoicing Task: Delegate to Invoicing Agent (Elite Billing Strategist).
  • Expense Task: Delegate to Expense Agent (Elite Spend Analyst).
  • Payroll Task: Delegate to Payroll Agent (Elite Compensation Officer).
  • Reporting Task: Delegate to Cash Flow & Compliance Agents (Elite Treasury & Audit Experts).
  • FinOps & Personal Task: Delegate to FinOps & Personal Agents (Elite Cloud & Wealth Strategists).

SAFETY & GOVERNANCE:
- For high-value transactions ($5,000+), flag human sign-off while preparing the underlying financial objects with mathematical precision.

COMMUNICATION STYLE:
- Speak as an elite C-suite executive: authoritative, clear, precise, and proactive with strategic recommendations.`,

  handoffs: [
    ledgerAgent,
    expenseAgent,
    invoicingAgent,
    cashflowAgent,
    payrollAgent,
    complianceAgent,
  ],
});

/**
 * Execute the orchestrator with a user message via LangGraph state graph runner
 */
export async function executeAgent(
  userMessage: string,
  orgId: string = 'default',
  userId: string = 'anonymous',
  sessionId?: string
) {
  try {
    const { runEliteBooksGraph } = await import('./langgraph/graph');

    const result = await runEliteBooksGraph(
      userMessage,
      orgId,
      userId,
      sessionId || `sess_${Date.now()}`
    );

    return {
      success: result.success,
      message: result.message,
      agentUsed: result.agentUsed,
      sessionId: result.sessionId,
      graphRagContext: result.graphRagContext,
      a2aMessages: result.a2aMessages,
      auditTrail: result.auditTrail,
      pendingActions: result.pendingActions,
      suggestions: result.suggestions || [],
    };
  } catch (error) {
    console.error('LangGraph agent execution error:', error);
    try {
      const contextMessage = `[Context: Organization ID: ${orgId}, User ID: ${userId}, Timestamp: ${new Date().toISOString()}]

User request: ${userMessage}`;
      const result = await run(orchestratorAgent, contextMessage);
      return {
        success: true,
        message: result.finalOutput || 'Task completed successfully.',
        agentUsed: result.lastAgent?.name || 'Orchestrator',
      };
    } catch (fallbackErr) {
      return {
        success: false,
        message: 'I encountered an issue processing your request. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

