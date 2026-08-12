/**
 * EliteBooks — Short-Term Session Memory Manager
 * Maintains active working window, turn-by-turn conversation buffer, active drafts, and ephemeral task state.
 */

export interface MessageBufferItem {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  agentName?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ShortTermMemoryState {
  sessionId: string;
  orgId: string;
  userId: string;
  messages: MessageBufferItem[];
  activeDrafts: {
    invoiceDraft?: Record<string, unknown>;
    payrollDraft?: Record<string, unknown>;
    expenseDraft?: Record<string, unknown>;
    journalDraft?: Record<string, unknown>;
  };
  lastAgentUsed?: string;
  activeIntent?: string;
  pendingApprovals: Array<{
    id: string;
    action: string;
    amount?: number;
    description: string;
    requestedAt: string;
  }>;
  updatedAt: string;
}

const sessionStore = new Map<string, ShortTermMemoryState>();

export class ShortTermMemoryManager {
  /**
   * Retrieve short-term memory snapshot for a session
   */
  public static async getSession(
    sessionId: string,
    orgId: string = 'default',
    userId: string = 'anonymous'
  ): Promise<ShortTermMemoryState> {
    if (!sessionStore.has(sessionId)) {
      const newState: ShortTermMemoryState = {
        sessionId,
        orgId,
        userId,
        messages: [],
        activeDrafts: {},
        pendingApprovals: [],
        updatedAt: new Date().toISOString(),
      };
      sessionStore.set(sessionId, newState);
      return newState;
    }

    return sessionStore.get(sessionId)!;
  }

  /**
   * Append a message to the working conversation buffer
   */
  public static async addMessage(
    sessionId: string,
    message: MessageBufferItem,
    maxWindow: number = 20
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    session.messages.push(message);

    // Keep active working memory window trimmed to maxWindow items
    if (session.messages.length > maxWindow) {
      session.messages = session.messages.slice(-maxWindow);
    }

    session.updatedAt = new Date().toISOString();
    sessionStore.set(sessionId, session);
  }

  /**
   * Update active drafts or pending state in short-term memory
   */
  public static async updateSession(
    sessionId: string,
    updates: Partial<ShortTermMemoryState>
  ): Promise<ShortTermMemoryState> {
    const session = await this.getSession(sessionId);
    const updated = {
      ...session,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    sessionStore.set(sessionId, updated);
    return updated;
  }

  /**
   * Clear short-term session state
   */
  public static async clearSession(sessionId: string): Promise<void> {
    sessionStore.delete(sessionId);
  }

  /**
   * Return formatted conversation prompt history from short-term memory
   */
  public static formatMessageWindow(messages: MessageBufferItem[]): string {
    if (messages.length === 0) return 'No previous interaction history.';
    return messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.agentName ? `(${m.agentName}) ` : ''}${m.role.toUpperCase()}: ${m.content}`
      )
      .join('\n');
  }
}
