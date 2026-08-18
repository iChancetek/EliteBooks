'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { ForecastDataPoint } from '@/components/MultiPeriodForecastCard';

interface ForecastHorizonData {
  dataPoints: ForecastDataPoint[];
  projectedTotal: number;
  growthRate: number;
  confidence: string;
  trendDirection: 'UP' | 'DOWN' | 'FLAT';
  avgMonthlyValue: number;
  scenarioSummary: { base: number; bull: number; bear: number };
}

interface UseForecastReturn {
  isLoading: boolean;
  monthly: ForecastHorizonData;
  quarterly: ForecastHorizonData;
  annual: ForecastHorizonData;
  refresh: () => Promise<void>;
}

const EMPTY_HORIZON: ForecastHorizonData = {
  dataPoints: [],
  projectedTotal: 0,
  growthRate: 0,
  confidence: 'INSUFFICIENT_DATA',
  trendDirection: 'FLAT',
  avgMonthlyValue: 0,
  scenarioSummary: { base: 0, bull: 0, bear: 0 },
};

/**
 * Hook that fetches forecasting data from the /api/forecast endpoint.
 * @param domain - 'revenue' | 'expenses' | 'payroll' | 'personal' | 'cashflow' | 'finops'
 */
export function useForecast(domain: string): UseForecastReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [monthly, setMonthly] = useState<ForecastHorizonData>(EMPTY_HORIZON);
  const [quarterly, setQuarterly] = useState<ForecastHorizonData>(EMPTY_HORIZON);
  const [annual, setAnnual] = useState<ForecastHorizonData>(EMPTY_HORIZON);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/forecast?domain=${encodeURIComponent(domain)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        if (json.monthly) setMonthly(json.monthly);
        if (json.quarterly) setQuarterly(json.quarterly);
        if (json.annual) setAnnual(json.annual);
      }
    } catch (e) {
      console.error('[useForecast] Failed to load forecast:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user, domain]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { isLoading, monthly, quarterly, annual, refresh };
}
