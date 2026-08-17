'use client';

import { useState, useCallback } from 'react';
import type { AgentResponse } from '@/types/agents';
import { useAuth } from '@/hooks/useAuth';

interface UseAgentReturn {
  isLoading: boolean;
  response: AgentResponse | null;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearResponse: () => void;
}

export function useAgent(): UseAgentReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

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
          orgId: user?.uid || 'default',
          userId: user?.uid || 'anonymous',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Agent request failed');
      }

      setResponse({
        message: data.message,
        agentUsed: data.agentUsed || 'CFO Agent',
        actions: data.actions || [],
        requiresApproval: data.requiresApproval || false,
        suggestions: data.suggestions || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return { isLoading, response, error, sendMessage, clearResponse };
}
