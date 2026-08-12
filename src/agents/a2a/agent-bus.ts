/**
 * EliteBooks — Agent-to-Agent (A2A) Inter-Agent Communication Bus
 * Allows specialized agents, copilots, and assistants to exchange structured messages, delegate sub-tasks, and share graph payloads.
 */

export interface AgentToAgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  intent: string;
  payload: Record<string, unknown>;
  handoffToken?: string;
  depth: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  responsePayload?: Record<string, unknown>;
}

export class AgentCommunicationBus {
  private static instance: AgentCommunicationBus;
  private messageLog: AgentToAgentMessage[] = [];
  private readonly MAX_DELEGATION_DEPTH = 4;

  private constructor() {}

  public static getInstance(): AgentCommunicationBus {
    if (!AgentCommunicationBus.instance) {
      AgentCommunicationBus.instance = new AgentCommunicationBus();
    }
    return AgentCommunicationBus.instance;
  }

  /**
   * Dispatch an Agent-to-Agent message for delegation or information sharing
   */
  public async dispatch(
    fromAgent: string,
    toAgent: string,
    intent: string,
    payload: Record<string, unknown>,
    depth: number = 1
  ): Promise<AgentToAgentMessage> {
    if (depth > this.MAX_DELEGATION_DEPTH) {
      throw new Error(
        `A2A Delegation depth limit (${this.MAX_DELEGATION_DEPTH}) exceeded between ${fromAgent} and ${toAgent}`
      );
    }

    const message: AgentToAgentMessage = {
      id: `a2a_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fromAgent,
      toAgent,
      intent,
      payload,
      depth,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    this.messageLog.push(message);
    console.log(
      `[A2A Communication] ${fromAgent} ➔ ${toAgent} | Intent: "${intent}" (Depth ${depth})`
    );

    // Simulate inter-agent execution synthesis
    const response = await this.executeInterAgentTask(toAgent, intent, payload);
    message.status = 'completed';
    message.responsePayload = response;

    return message;
  }

  /**
   * Internal execution handler for processing delegated sub-agent requests
   */
  private async executeInterAgentTask(
    targetAgent: string,
    intent: string,
    payload: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    switch (targetAgent.toLowerCase()) {
      case 'cashflow agent':
      case 'cash flow agent':
        return {
          forecast30Days: 145000,
          liquidityRiskScore: 0.12,
          recommendation: 'Safe to extend Net-30 billing terms.',
          verifiedBy: 'Cash Flow Agent',
        };

      case 'compliance agent':
        return {
          compliancePassed: true,
          auditFlagged: false,
          applicableTaxRate: '8.875%',
          verifiedBy: 'Compliance Agent',
        };

      case 'ledger agent':
        return {
          journalEntriesPosted: 2,
          balancedDebitCredit: true,
          verifiedBy: 'Ledger Agent',
        };

      case 'expense agent':
        return {
          categorized: 'Software Subscription',
          taxDeductible: true,
          verifiedBy: 'Expense Agent',
        };

      default:
        return {
          status: 'acknowledged',
          message: `Sub-task "${intent}" processed by ${targetAgent}`,
          receivedPayload: payload,
        };
    }
  }

  /**
   * Retrieve message log for audit and state graph context
   */
  public getHistory(): AgentToAgentMessage[] {
    return [...this.messageLog];
  }

  /**
   * Clear message history
   */
  public clear(): void {
    this.messageLog = [];
  }
}

export const agentBus = AgentCommunicationBus.getInstance();
