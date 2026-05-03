'use client';

import { useState, useCallback } from 'react';
import type { AgentResponse } from '@/types/agents';

interface UseAgentReturn {
  isLoading: boolean;
  response: AgentResponse | null;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearResponse: () => void;
}

export function useAgent(): UseAgentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          orgId: 'default', // TODO: Get from auth context
          userId: 'current', // TODO: Get from auth context
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Agent request failed');
      }

      setResponse({
        message: data.message,
        actions: data.actions || [],
        requiresApproval: data.requiresApproval || false,
        suggestions: data.suggestions || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return { isLoading, response, error, sendMessage, clearResponse };
}
