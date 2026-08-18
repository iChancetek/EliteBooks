'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AgentResponse } from '@/types/agents';
import { useAuth } from '@/hooks/useAuth';
import { AgentSessionManager, AgentSession, ConversationTurn } from '@/lib/agent-session-manager';

interface UseAgentReturn {
  isLoading: boolean;
  response: AgentResponse | null;
  currentTurn: ConversationTurn | null;
  turns: ConversationTurn[];
  activeSession: AgentSession | null;
  sessions: AgentSession[];
  deletedSessions: AgentSession[];
  error: string | null;
  sendMessage: (message: string) => Promise<AgentResponse | null>;
  startNewSession: (agentName?: string) => void;
  deleteCurrentSession: () => void;
  deleteSessionById: (sessionId: string) => void;
  recoverSessionById: (sessionId: string) => void;
  switchSession: (sessionId: string) => void;
  clearResponse: () => void;
}

export function useAgent(defaultAgentName = 'EliteBooks Orchestrator'): UseAgentReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<AgentSession | null>(null);
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [deletedSessions, setDeletedSessions] = useState<AgentSession[]>([]);

  // Load active session and all sessions from localStorage
  const refreshSessions = useCallback(() => {
    try {
      const active = AgentSessionManager.getActiveSession(defaultAgentName);
      const allActive = AgentSessionManager.getSessions(false);
      const allDeleted = AgentSessionManager.getDeletedSessions();
      setActiveSession(active);
      setSessions(allActive);
      setDeletedSessions(allDeleted);
    } catch (e) {
      console.error('[useAgent] Failed to load sessions:', e);
    }
  }, [defaultAgentName]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const turns = activeSession?.turns || [];
  const currentTurn = turns.length > 0 ? turns[turns.length - 1] : null;

  // Single response compatibility object for older components
  const response: AgentResponse | null = currentTurn
    ? {
        message: currentTurn.message,
        agentUsed: currentTurn.agentUsed,
        suggestions: currentTurn.suggestions || [],
        actions: [],
        requiresApproval: false,
      }
    : null;

  const sendMessage = useCallback(
    async (message: string): Promise<AgentResponse | null> => {
      if (!message || !message.trim()) return null;

      setIsLoading(true);
      setError(null);

      // Ensure active session exists
      let session = activeSession;
      if (!session) {
        session = AgentSessionManager.getActiveSession(defaultAgentName);
        setActiveSession(session);
      }

      const turnId = `turn_${Date.now()}`;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (user) {
          const token = await user.getIdToken();
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/agents', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message,
            sessionId: session.id,
            orgId: user?.uid || 'default',
            userId: user?.uid || 'anonymous',
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Agent request failed');
        }

        const turn: ConversationTurn = {
          id: turnId,
          sender: 'agent',
          query: message,
          message: data.message || 'Analysis completed successfully.',
          agentUsed: data.agentUsed || defaultAgentName,
          timestamp: timeStr,
          suggestions: data.suggestions || [],
          graphRagContext: data.graphRagContext,
          auditTrail: data.auditTrail,
        };

        const updated = AgentSessionManager.appendTurn(session.id, turn);
        if (updated) {
          setActiveSession({ ...updated });
        }
        refreshSessions();

        const agentResponse: AgentResponse = {
          message: turn.message,
          agentUsed: turn.agentUsed,
          actions: data.actions || [],
          requiresApproval: data.requiresApproval || false,
          suggestions: data.suggestions || [],
        };

        return agentResponse;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, activeSession, defaultAgentName, refreshSessions]
  );

  const startNewSession = useCallback(
    (agentName?: string) => {
      const newSess = AgentSessionManager.createNewSession(agentName || defaultAgentName);
      setActiveSession(newSess);
      refreshSessions();
    },
    [defaultAgentName, refreshSessions]
  );

  const deleteCurrentSession = useCallback(() => {
    if (activeSession) {
      AgentSessionManager.deleteSession(activeSession.id);
      refreshSessions();
    }
  }, [activeSession, refreshSessions]);

  const deleteSessionById = useCallback(
    (sessionId: string) => {
      AgentSessionManager.deleteSession(sessionId);
      refreshSessions();
    },
    [refreshSessions]
  );

  const recoverSessionById = useCallback(
    (sessionId: string) => {
      const recovered = AgentSessionManager.recoverSession(sessionId);
      if (recovered) {
        setActiveSession(recovered);
      }
      refreshSessions();
    },
    [refreshSessions]
  );

  const switchSession = useCallback(
    (sessionId: string) => {
      AgentSessionManager.setActiveSessionId(sessionId);
      refreshSessions();
    },
    [refreshSessions]
  );

  const clearResponse = useCallback(() => {
    if (activeSession) {
      startNewSession(activeSession.agentName);
    }
  }, [activeSession, startNewSession]);

  return {
    isLoading,
    response,
    currentTurn,
    turns,
    activeSession,
    sessions,
    deletedSessions,
    error,
    sendMessage,
    startNewSession,
    deleteCurrentSession,
    deleteSessionById,
    recoverSessionById,
    switchSession,
    clearResponse,
  };
}
