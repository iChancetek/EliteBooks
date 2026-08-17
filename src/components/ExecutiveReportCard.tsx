'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Bot,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import GraphRAGTopologyCard from './GraphRAGTopologyCard';

interface ExecutiveReportCardProps {
  content: string;
  agentUsed?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  onClear?: () => void;
  onAskFollowUp?: () => void;
  onOpenCreationModal?: (type: 'invoice' | 'expense') => void;
}

export default function ExecutiveReportCard({
  content,
  agentUsed = 'CFO Strategist & Orchestrator',
  suggestions = [],
  onSuggestionClick,
  onClear,
  onAskFollowUp,
  onOpenCreationModal,
}: ExecutiveReportCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Claude 3.7 Sonnet');
  const [followUpText, setFollowUpText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EliteBooks_Executive_Report_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFocusFollowUp = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (onAskFollowUp) {
      onAskFollowUp();
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || isSubmitting) return;

    const query = followUpText.trim();
    setIsSubmitting(true);
    setFollowUpText('');

    if (onSuggestionClick) {
      await onSuggestionClick(query);
    }

    setTimeout(() => setIsSubmitting(false), 1500);
  };

  const handleItemClick = (item: string) => {
    const lower = item.toLowerCase();
    if (onOpenCreationModal && (lower.includes('invoice builder') || lower.includes('create invoice') || lower.includes('invoice (ai assisted)'))) {
      onOpenCreationModal('invoice');
      return;
    }
    if (onOpenCreationModal && (lower.includes('expense logger') || lower.includes('log expense') || lower.includes('create expense') || lower.includes('expense (ai assisted)'))) {
      onOpenCreationModal('expense');
      return;
    }
    if (onSuggestionClick) {
      onSuggestionClick(item);
    }
  };

  // Split response by Agent if formatted with multi-agent synthesis
  const agentChunks = content.split('\n\n').filter(Boolean);

  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        padding: 'var(--space-6)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 138, 0.25))',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 25px -5px rgba(59, 130, 246, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        position: 'relative',
      }}
    >
      {/* Header with Title & Model Selection */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', display: 'flex', color: '#fff' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
                {agentUsed}
              </h3>
              <span className="badge badge-primary" style={{ fontSize: '11px', fontWeight: 600 }}>
                Executive Analysis
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
              Multi-agent financial intelligence & verified general ledger synthesis
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
          <button
            className="btn btn-sm btn-ghost"
            onClick={handleDownload}
            title="Download report as Markdown file (.md)"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          <button
            className="btn btn-sm btn-ghost"
            onClick={handleCopy}
            title="Copy report to clipboard"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
          >
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            className="btn btn-sm btn-secondary"
            onClick={handleFocusFollowUp}
            title="Ask a follow-up question or request an additional analysis"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#93c5fd' }}
          >
            <RefreshCw size={13} />
            <span>Ask Follow-Up / New Task</span>
          </button>

          {onClear && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={onClear}
              title="Dismiss report card"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}
            >
              <X size={14} />
              <span>Dismiss</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Report Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {agentChunks.map((chunk, idx) => {
          const isAgentLine = chunk.includes('Agent') || chunk.includes('Officer') || chunk.includes('Engine');
          const firstColon = chunk.indexOf(':');

          if (isAgentLine && firstColon !== -1 && firstColon < 40) {
            const agentName = chunk.substring(0, firstColon).trim();
            const messageBody = chunk.substring(firstColon + 1).trim();
            const isGraphRAG = agentName.includes('GraphRAG') || messageBody.includes('GRAPHRAG') || messageBody.includes('KNOWLEDGE GRAPH');

            const isGraphAgent = agentName.includes('GraphRAG');
            const isCFO = agentName.includes('CFO');
            const agentColor = isGraphAgent ? '#a855f7' : isCFO ? '#10b981' : '#3b82f6';
            const agentBg = isGraphAgent 
              ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(15, 23, 42, 0.9))' 
              : 'rgba(15, 23, 42, 0.65)';
            const agentBorder = isGraphAgent 
              ? '1px solid rgba(168, 85, 247, 0.4)' 
              : '1px solid rgba(255, 255, 255, 0.08)';

            return (
              <div
                key={idx}
                style={{
                  background: agentBg,
                  border: agentBorder,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  boxShadow: isGraphAgent ? '0 10px 25px -5px rgba(168, 85, 247, 0.2)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agentColor, boxShadow: `0 0 8px ${agentColor}` }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: agentColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {agentName}
                    </span>
                  </div>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      fontWeight: 700,
                      color: isGraphAgent ? '#c084fc' : 'var(--color-text-tertiary)', 
                      background: isGraphAgent ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                      border: isGraphAgent ? '1px solid rgba(168, 85, 247, 0.3)' : undefined,
                      padding: '2px 8px', 
                      borderRadius: '12px' 
                    }}
                  >
                    {isGraphAgent ? 'Vector Graph Verified' : 'Verified Output'}
                  </span>
                </div>

                {isGraphRAG ? (
                  <GraphRAGTopologyCard rawText={messageBody} />
                ) : (
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      lineHeight: 1.7,
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {messageBody}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={idx}
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 1.7,
                color: 'var(--color-text-primary)',
                whiteSpace: 'pre-wrap',
                background: 'rgba(30, 41, 59, 0.3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              {chunk}
            </div>
          );
        })}
      </div>

      {/* Action Suggestions & Quick Next Steps */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recommended Actionable Next Steps:
          </span>
          <span style={{ fontSize: '11px', color: '#60a5fa', cursor: 'pointer' }} onClick={handleFocusFollowUp}>
            Click any button to execute prompt →
          </span>
        </div>

        {/* Interactive Guided Action Launchers */}
        {onOpenCreationModal && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <button
              className="btn btn-sm"
              onClick={() => onOpenCreationModal('invoice')}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                color: '#93c5fd',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={14} style={{ color: '#60a5fa' }} />
              <span>⚡ Open AI Invoice Builder (HITL)</span>
            </button>

            <button
              className="btn btn-sm"
              onClick={() => onOpenCreationModal('expense')}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(236, 72, 153, 0.25))',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fcd34d',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={14} style={{ color: '#f59e0b' }} />
              <span>⚡ Open AI Expense Logger (HITL)</span>
            </button>
          </div>
        )}

        {/* Quick Action Suggestion Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(suggestions && suggestions.length > 0
            ? suggestions
            : [
                'Why did expenses increase this month?',
                'Walk me through creating an expense',
                'Forecast 90-day cash flow',
                'Create a client invoice for Acme $12,000',
              ]
          ).map((s) => (
            <button
              key={s}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#f8fafc', cursor: 'pointer' }}
              onClick={() => handleItemClick(s)}
            >
              <span>{s}</span>
              <ChevronRight size={12} style={{ color: '#60a5fa' }} />
            </button>
          ))}
        </div>

        {/* Interactive Inline Follow-up & Chat Input Form */}
        <form
          onSubmit={handleFollowUpSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '10px',
            padding: '4px 8px',
            marginTop: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Bot size={18} style={{ color: '#60a5fa', marginLeft: '6px', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            placeholder={`Ask a follow-up question or instruct ${agentUsed}...`}
            disabled={isSubmitting}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '13px',
              padding: '8px 6px',
            }}
          />
          <button
            type="submit"
            disabled={!followUpText.trim() || isSubmitting}
            className="btn btn-sm btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: (!followUpText.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
              opacity: (!followUpText.trim() || isSubmitting) ? 0.6 : 1,
            }}
          >
            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
