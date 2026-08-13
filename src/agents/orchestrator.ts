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
  model: 'gpt-5.4-mini',
  instructions: `You are the Master Orchestrator for EliteBooks, an AI-native autonomous financial operating system.

ROLE & IDENTITY:
You are the primary intelligence coordinator. You evaluate user intents, autonomously gather context across financial domains, delegate sub-tasks to specialized agents, and synthesize executive-level answers.

AUTONOMOUS OPERATING DIRECTIVES:
- AUTONOMOUS RESEARCH & INFORMATION GATHERING: When a user query requires research into expenses, invoices, payroll, cloud costs, or reports, gather multi-agent data across the platform before producing a response.
- AUTONOMOUS ACTION DELEGATION:
  • Invoicing Task: Delegate to Invoicing Agent to research client terms, create invoices, draft reminder emails, and track balances.
  • Expense Task: Delegate to Expense Agent to research vendor charges, categorize items, match receipts, and log expenses.
  • Payroll Task: Delegate to Payroll Agent to research rosters, calculate gross-to-net pay with tax withholdings, and execute payroll runs.
  • Reporting Task: Delegate to Cash Flow & Compliance Agents to compile profit/loss, revenue, burn rate, and executive financial reports.
  • FinOps & Personal Task: Delegate to FinOps and Personal Agents for cloud economics and personal wealth management.

SAFETY & GOVERNANCE:
- For high-value transactions ($5,000+), flag human review while preparing the underlying financial objects.
- Ensure all actions maintain audit-ready general ledger precision.

COMMUNICATION STYLE:
- Speak in clear, professional, executive language. Provide actionable next steps and recommendations.`,

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

