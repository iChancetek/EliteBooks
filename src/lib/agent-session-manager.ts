/**
 * EliteBooks — Agent Session & Conversation History Manager
 * Manages persistent multi-turn conversation threads, session archiving,
 * auto-saving, and 60-day soft-delete recovery.
 */

export interface ConversationTurn {
  id: string;
  sender: 'user' | 'agent';
  query?: string;
  message: string;
  agentUsed: string;
  timestamp: string;
  suggestions?: string[];
  graphRagContext?: string;
  auditTrail?: any[];
}

export interface AgentSession {
  id: string;
  title: string;
  agentName: string;
  turns: ConversationTurn[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null; // Null if active, ISO string if soft-deleted
}

const STORAGE_KEY = 'elite_agent_sessions_v2';
const ACTIVE_SESSION_KEY = 'elite_active_session_id';
const RETENTION_DAYS = 60;

export class AgentSessionManager {
  /**
   * Load all sessions from localStorage
   */
  static getSessions(includeDeleted = false): AgentSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const all: AgentSession[] = JSON.parse(raw);

      // Auto-purge items deleted more than 60 days ago
      const now = Date.now();
      const valid = all.filter((s) => {
        if (!s.deletedAt) return true;
        const deletedTime = new Date(s.deletedAt).getTime();
        const daysOld = (now - deletedTime) / (1000 * 60 * 60 * 24);
        return daysOld <= RETENTION_DAYS;
      });

      if (valid.length !== all.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      }

      if (includeDeleted) return valid;
      return valid.filter((s) => !s.deletedAt);
    } catch (e) {
      console.error('[SessionManager] Error loading sessions:', e);
      return [];
    }
  }

  /**
   * Get deleted sessions available for 60-day recovery
   */
  static getDeletedSessions(): AgentSession[] {
    const all = this.getSessions(true);
    return all.filter((s) => !!s.deletedAt);
  }

  /**
   * Get active session by ID or create new one
   */
  static getActiveSession(agentName = 'EliteBooks Orchestrator'): AgentSession {
    if (typeof window === 'undefined') {
      return this.createNewSession(agentName);
    }

    const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
    const sessions = this.getSessions(false);

    if (activeId) {
      const existing = sessions.find((s) => s.id === activeId);
      if (existing) return existing;
    }

    // If no active session, get the most recent or create new
    if (sessions.length > 0) {
      const mostRecent = sessions[0];
      localStorage.setItem(ACTIVE_SESSION_KEY, mostRecent.id);
      return mostRecent;
    }

    return this.createNewSession(agentName);
  }

  /**
   * Create a new session
   */
  static createNewSession(agentName = 'EliteBooks Orchestrator', title?: string): AgentSession {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSession: AgentSession = {
      id,
      title: title || `Financial Analysis Session`,
      agentName,
      turns: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    if (typeof window !== 'undefined') {
      const sessions = this.getSessions(true);
      sessions.unshift(newSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_KEY, id);
    }

    return newSession;
  }

  /**
   * Append a conversation turn to the active session
   */
  static appendTurn(sessionId: string, turn: ConversationTurn): AgentSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessions = this.getSessions(true);
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return null;

      session.turns.push(turn);
      session.updatedAt = new Date().toISOString();

      // Update session title based on first query if generic
      if (session.turns.length === 1 && turn.query) {
        session.title = turn.query.length > 40 ? `${turn.query.substring(0, 37)}...` : turn.query;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      return session;
    } catch (e) {
      console.error('[SessionManager] Error appending turn:', e);
      return null;
    }
  }

  /**
   * Soft-delete a session (marked for 60-day recovery)
   */
  static deleteSession(sessionId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const sessions = this.getSessions(true);
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return false;

      session.deletedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

      // If active session was deleted, clear active pointer
      const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (activeId === sessionId) {
        const remaining = sessions.filter((s) => !s.deletedAt && s.id !== sessionId);
        if (remaining.length > 0) {
          localStorage.setItem(ACTIVE_SESSION_KEY, remaining[0].id);
        } else {
          localStorage.removeItem(ACTIVE_SESSION_KEY);
        }
      }

      return true;
    } catch (e) {
      console.error('[SessionManager] Error deleting session:', e);
      return false;
    }
  }

  /**
   * Recover a soft-deleted session (within 60-day window)
   */
  static recoverSession(sessionId: string): AgentSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessions = this.getSessions(true);
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return null;

      session.deletedAt = null;
      session.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_KEY, session.id);
      return session;
    } catch (e) {
      console.error('[SessionManager] Error recovering session:', e);
      return null;
    }
  }

  /**
   * Set active session ID
   */
  static setActiveSessionId(sessionId: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
  }
}
