'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Zap, ArrowRight, CheckCircle2, ChevronRight, Network, Loader2, AlertCircle, Compass, BarChart3, Database } from 'lucide-react';
import { useAgent } from '@/hooks/useAgent';
import ExecutiveReportCard from './ExecutiveReportCard';

interface PageAgentCopilotProps {
  agentName: string;
  badgeText?: string;
  insights: string[];
  suggestedActions: string[];
  color?: string;
  onAction?: (action: string) => void;
  isLoading?: boolean;
}

export default function PageAgentCopilot({
  agentName,
  badgeText = 'Autonomous Agent Active',
  insights,
  suggestedActions,
  color = '#3b82f6',
  onAction,
  isLoading: parentLoading,
}: PageAgentCopilotProps) {
  const { sendMessage, isLoading: internalLoading, response, error, clearResponse } = useAgent();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [clickedInsightIndex, setClickedInsightIndex] = useState<number | null>(null);

  const isExecuting = parentLoading !== undefined ? parentLoading : internalLoading;

  const handleAction = async (action: string, insightIdx?: number) => {
    setActiveAction(action);
    if (insightIdx !== undefined) {
      setClickedInsightIndex(insightIdx);
    }

    if (onAction) {
      onAction(action);
    } else {
      await sendMessage(action);
    }

    setTimeout(() => {
      setActiveAction(null);
      setClickedInsightIndex(null);
    }, 2000);
  };

  const getInsightPrompt = (insight: string, idx: number) => {
    return `Investigate and provide multi-agent GraphRAG deep dive for: "${insight}"`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div
        className="glass-card animate-fade-in-up"
        style={{
          padding: 'var(--space-5)',
          border: `1px solid ${color}45`,
          background: `linear-gradient(135deg, var(--color-glass-bg), ${color}12)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          boxShadow: `0 12px 30px -5px ${color}20`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ background: `${color}25`, color: color, padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', display: 'flex' }}>
              <Bot size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
                  {agentName}
                </h3>
                <span className="badge" style={{ background: `${color}25`, color: color, fontSize: '11px', fontWeight: 600 }}>
                  <Zap size={12} /> {badgeText}
                </span>
                <button
                  type="button"
                  onClick={() => handleAction('Explore GraphRAG Financial Knowledge Graph relationships and entity nodes.')}
                  className="badge cursor-pointer"
                  style={{
                    background: 'rgba(139, 92, 246, 0.25)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    color: '#c4b5fd',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                  }}
                  title="Click to view GraphRAG Knowledge Graph nodes"
                >
                  <Network size={12} /> GraphRAG Engine Active
                </button>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                Autonomous intelligence & GraphRAG knowledge graph continuously reasoning over live ledger data. <strong style={{ color: color }}>Click any card below to investigate.</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction(`Provide a comprehensive domain analysis and audit report for ${agentName}.`)}
            className="btn btn-sm btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              background: `linear-gradient(135deg, ${color}35, ${color}15)`,
              border: `1px solid ${color}60`,
              color: '#fff',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '8px',
              boxShadow: `0 4px 12px ${color}25`,
            }}
            disabled={isExecuting}
          >
            {isExecuting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} style={{ color: color }} />}
            <span>{isExecuting ? 'Synthesizing...' : 'Ask Agent'}</span>
          </button>
        </div>

        {/* Clickable Insights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
          {insights.map((insight, idx) => {
            const isThisClicked = clickedInsightIndex === idx || activeAction === getInsightPrompt(insight, idx);
            return (
              <div
                key={idx}
                onClick={() => !isExecuting && handleAction(getInsightPrompt(insight, idx), idx)}
                style={{
                  background: isThisClicked ? `${color}25` : 'rgba(15, 23, 42, 0.65)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  border: isThisClicked ? `1px solid ${color}` : `1px solid rgba(255, 255, 255, 0.08)`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: isExecuting ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isThisClicked ? 'scale(0.99)' : 'none',
                  boxShadow: isThisClicked ? `0 0 15px ${color}35` : '0 4px 10px rgba(0,0,0,0.2)',
                }}
                className="copilot-insight-box hover:border-amber-400"
              >
                {isThisClicked && isExecuting ? (
                  <Loader2 size={16} className="animate-spin" style={{ color: color, flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <ChevronRight size={16} style={{ color: color, flexShrink: 0, marginTop: '2px' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                    {insight}
                  </span>
                  <span style={{ fontSize: '10px', color: color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                    <BarChart3 size={10} /> Click to investigate with GraphRAG →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggested Actions */}
        {suggestedActions && suggestedActions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', paddingTop: 'var(--space-2)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Agent Workflows:
            </span>
            {suggestedActions.map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                className="btn btn-sm btn-ghost"
                style={{
                  fontSize: '11px',
                  background: activeAction === action ? `${color}30` : 'var(--color-bg-secondary)',
                  border: `1px solid ${color}30`,
                  color: 'var(--color-text-primary)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
                disabled={isExecuting}
              >
                {activeAction === action ? (
                  <CheckCircle2 size={12} style={{ color: color }} />
                ) : isExecuting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <ArrowRight size={12} style={{ color: color }} />
                )}
                <span>{action}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Standalone Embedded Response Card (if not handled by parent page) */}
      {!onAction && response && (
        <ExecutiveReportCard
          content={response.message}
          agentUsed={response.agentUsed || agentName}
          suggestions={response.suggestions}
          onSuggestionClick={(s) => sendMessage(s)}
          onClear={clearResponse}
        />
      )}

      {!onAction && error && (
        <div className="cmd-error glass-card animate-shake" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', color: '#f43f5e' }}>
          <AlertCircle size={16} />
          <span style={{ fontSize: '13px' }}>{error}</span>
        </div>
      )}
    </div>
  );
}
