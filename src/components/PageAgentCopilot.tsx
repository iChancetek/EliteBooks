'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Zap, ArrowRight, CheckCircle2, ChevronRight, Network, Loader2, AlertCircle } from 'lucide-react';
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

  const isExecuting = parentLoading !== undefined ? parentLoading : internalLoading;

  const handleAction = async (action: string) => {
    setActiveAction(action);

    if (onAction) {
      onAction(action);
    } else {
      await sendMessage(action);
    }

    setTimeout(() => setActiveAction(null), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div
        className="glass-card animate-fade-in-up"
        style={{
          padding: 'var(--space-5)',
          border: `1px solid ${color}35`,
          background: `linear-gradient(135deg, var(--color-glass-bg), ${color}10)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          boxShadow: `0 10px 25px -5px ${color}15`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ background: `${color}20`, color: color, padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', display: 'flex' }}>
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
                  {agentName}
                </h3>
                <span className="badge" style={{ background: `${color}20`, color: color, fontSize: '11px', fontWeight: 600 }}>
                  <Zap size={12} /> {badgeText}
                </span>
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', fontSize: '11px', fontWeight: 600 }}>
                  <Network size={12} /> GraphRAG Engine Active
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Autonomous intelligence & GraphRAG knowledge graph continuously reasoning over page data.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction(`Provide a comprehensive domain analysis and audit report for ${agentName}.`)}
            className="btn btn-sm btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: `${color}25`, border: `1px solid ${color}40`, color: '#fff', fontWeight: 600 }}
            disabled={isExecuting}
          >
            {isExecuting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} style={{ color: color }} />}
            <span>{isExecuting ? 'Synthesizing...' : 'Ask Agent'}</span>
          </button>
        </div>

        {/* Insights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
          {insights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <ChevronRight size={16} style={{ color: color, flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                {insight}
              </span>
            </div>
          ))}
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
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
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
