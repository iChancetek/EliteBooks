'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, ArrowRight, Activity, BarChart3,
  ChevronRight, Zap, MessageSquare, Loader2, Shield
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useAgent } from '@/hooks/useAgent';
import { formatCurrency } from '@/lib/utils';

export interface ForecastDataPoint {
  label: string;
  actual?: number;
  projected?: number;
  bull?: number;
  bear?: number;
  isPredicted: boolean;
}

interface MultiPeriodForecastCardProps {
  title: string;
  /** Type of records to forecast: 'revenue' | 'expenses' | 'payroll' | 'personal' | 'cashflow' | 'finops' */
  domain: string;
  /** Pre-computed forecast data points if the parent page already has them */
  monthlyData?: ForecastDataPoint[];
  quarterlyData?: ForecastDataPoint[];
  annualData?: ForecastDataPoint[];
  /** Metrics to display */
  projectedTotal?: number;
  growthRate?: number;
  confidence?: string;
  trendDirection?: 'UP' | 'DOWN' | 'FLAT';
  avgMonthlyValue?: number;
  scenarioSummary?: { base: number; bull: number; bear: number };
  /** Callback for deep dive */
  onDeepDive?: (horizon: string) => void;
}

const CustomForecastTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        fontSize: '12px',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', fontSize: '10px' }}>
          {label}
        </div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', color: entry.color, margin: '2px 0' }}>
            <span style={{ fontWeight: 500 }}>{entry.name}:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MultiPeriodForecastCard({
  title,
  domain,
  monthlyData = [],
  quarterlyData = [],
  annualData = [],
  projectedTotal = 0,
  growthRate = 0,
  confidence = 'INSUFFICIENT_DATA',
  trendDirection = 'FLAT',
  avgMonthlyValue = 0,
  scenarioSummary = { base: 0, bull: 0, bear: 0 },
  onDeepDive,
}: MultiPeriodForecastCardProps) {
  const [activeHorizon, setActiveHorizon] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [mounted, setMounted] = useState(false);
  const { isLoading: isAiLoading, response: aiResponse, sendMessage } = useAgent();
  const [hasAsked, setHasAsked] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const currentData = useMemo(() => {
    switch (activeHorizon) {
      case 'monthly': return monthlyData;
      case 'quarterly': return quarterlyData;
      case 'annual': return annualData;
    }
  }, [activeHorizon, monthlyData, quarterlyData, annualData]);

  // Transform for Recharts
  const chartData = useMemo(() => {
    return currentData.map(d => ({
      name: d.label,
      Actual: d.actual || null,
      Projected: d.projected || null,
      Bull: d.bull || null,
      Bear: d.bear || null,
      isPredicted: d.isPredicted,
    }));
  }, [currentData]);

  const firstPredictedLabel = chartData.find(d => d.isPredicted)?.name;

  const horizonLabel = activeHorizon === 'monthly' ? '30-Day (MoM)' :
                       activeHorizon === 'quarterly' ? 'Quarterly (QoQ)' : 'Annual (YoY)';

  const TrendIcon = trendDirection === 'UP' ? TrendingUp : trendDirection === 'DOWN' ? TrendingDown : ArrowRight;
  const trendColor = trendDirection === 'UP' ? '#10b981' : trendDirection === 'DOWN' ? '#f43f5e' : '#60a5fa';

  const handleAskForecast = async () => {
    const horizonText = activeHorizon === 'monthly' ? 'next month' :
                        activeHorizon === 'quarterly' ? 'next quarter' : 'next year';
    const query = `Forecast ${domain} for ${horizonText}. Provide Base, Bull, and Bear scenarios with confidence analysis.`;
    setHasAsked(true);
    await sendMessage(query);
  };

  const confidenceBadge = {
    HIGH: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
    MEDIUM: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
    LOW: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' },
    INSUFFICIENT_DATA: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)' },
  }[confidence] || { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)' };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.3))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.4), 0 0 20px -5px rgba(16, 185, 129, 0.15)',
      }}
    >
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
          }}>
            <Activity size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{
                fontSize: '10px', fontWeight: 800, color: confidenceBadge.color,
                background: confidenceBadge.bg, border: `1px solid ${confidenceBadge.border}`,
                padding: '1px 6px', borderRadius: '100px', textTransform: 'uppercase',
              }}>
                {confidence} Confidence
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>•</span>
              <span style={{ fontSize: '10px', color: trendColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <TrendIcon size={12} /> {growthRate > 0 ? '+' : ''}{growthRate}% {trendDirection}
              </span>
            </div>
          </div>
        </div>

        {/* Horizon Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '8px' }}>
          {(['monthly', 'quarterly', 'annual'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setActiveHorizon(h)}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none',
                fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                background: activeHorizon === h ? '#10b981' : 'transparent',
                color: activeHorizon === h ? '#fff' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s',
              }}
            >
              {h === 'monthly' ? '30-Day' : h === 'quarterly' ? 'Quarter' : '12-Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase' }}>Avg Monthly</span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono, monospace)', marginTop: '2px' }}>
            {formatCurrency(avgMonthlyValue)}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase' }}>Base</span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono, monospace)', marginTop: '2px' }}>
            {formatCurrency(scenarioSummary.base)}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase' }}>Bull (+15%)</span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#22c55e', fontFamily: 'var(--font-mono, monospace)', marginTop: '2px' }}>
            {formatCurrency(scenarioSummary.bull)}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase' }}>Bear (-15%)</span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono, monospace)', marginTop: '2px' }}>
            {formatCurrency(scenarioSummary.bear)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: '240px', minWidth: 0, minHeight: '240px', zIndex: 1 }}>
        {mounted && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastActualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastProjectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastBullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastBearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip content={<CustomForecastTooltip />} />
              {firstPredictedLabel && (
                <ReferenceLine x={firstPredictedLabel} stroke="#3b82f6" strokeDasharray="4 4"
                  label={{ value: 'Forecast →', fill: '#3b82f6', fontSize: 10, position: 'top' }} />
              )}
              <Area type="monotone" dataKey="Bull" stroke="#22c55e" strokeWidth={1} strokeDasharray="4 4"
                fillOpacity={1} fill="url(#forecastBullGrad)" name="Bull (+15%)" connectNulls />
              <Area type="monotone" dataKey="Bear" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 4"
                fillOpacity={1} fill="url(#forecastBearGrad)" name="Bear (-15%)" connectNulls />
              <Area type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={2.5}
                fillOpacity={1} fill="url(#forecastActualGrad)" name="Actual" connectNulls />
              <Area type="monotone" dataKey="Projected" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="6 3"
                fillOpacity={1} fill="url(#forecastProjectedGrad)" name="Projected (Base)" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
            <Activity size={28} style={{ opacity: 0.3 }} />
            <span>Insufficient data to generate forecast. Add transactions to build projection history.</span>
          </div>
        )}
      </div>

      {/* AI Response Panel */}
      {hasAsked && (
        <div style={{ zIndex: 1 }}>
          {isAiLoading ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981' }}>
              <Loader2 size={14} className="pulse-animation" />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Forecasting Agent analyzing multi-period projections...</span>
            </div>
          ) : aiResponse ? (
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Zap size={14} color="#10b981" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>{aiResponse.agentUsed}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
                {aiResponse.message}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', zIndex: 1, flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={handleAskForecast}
          disabled={isAiLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px', border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', fontSize: '12px', fontWeight: 700,
            cursor: isAiLoading ? 'not-allowed' : 'pointer',
            opacity: isAiLoading ? 0.6 : 1,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s',
          }}
        >
          <MessageSquare size={14} /> Consult Forecasting Copilot
        </button>
        {onDeepDive && (
          <button
            onClick={() => onDeepDive(activeHorizon)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981', fontSize: '11px', fontWeight: 700,
              padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Deep Dive <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
