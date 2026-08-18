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
  RefreshCw,
  Send,
  Loader2,
  X,
  History,
  RotateCcw,
  Trash2,
  PlusCircle,
  MessageSquare,
  Clock
} from 'lucide-react';
import GraphRAGTopologyCard from './GraphRAGTopologyCard';
import RichMessageContent from './RichMessageContent';
import { ConversationTurn, AgentSession, AgentSessionManager } from '@/lib/agent-session-manager';

interface ExecutiveReportCardProps {
  content?: string;
  turns?: ConversationTurn[];
  agentUsed?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => Promise<any> | void;
  onClear?: () => void;
  onAskFollowUp?: () => void;
  onStartNewSession?: () => void;
  onOpenCreationModal?: (type: 'invoice' | 'expense') => void;
}

export default function ExecutiveReportCard({
  content = '',
  turns: propTurns,
  agentUsed = 'CFO Strategist & Orchestrator',
  suggestions = [],
  onSuggestionClick,
  onClear,
  onAskFollowUp,
  onStartNewSession,
  onOpenCreationModal,
}: ExecutiveReportCardProps) {
  const [copied, setCopied] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [sessionList, setSessionList] = useState<AgentSession[]>([]);
  const [deletedList, setDeletedList] = useState<AgentSession[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fallback single-turn array if turns prop not provided
  const turns: ConversationTurn[] = (propTurns && propTurns.length > 0)
    ? propTurns
    : content
    ? [{
        id: 'turn_default',
        sender: 'agent',
        message: content,
        agentUsed: agentUsed,
        timestamp: 'Just now',
        suggestions,
      }]
    : [];

  const handleCopy = () => {
    const fullText = turns.map(t => `${t.query ? `User: ${t.query}\n` : ''}${t.agentUsed}: ${t.message}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText || content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = turns.map(t => `${t.query ? `### User Inquiry:\n${t.query}\n\n` : ''}### ${t.agentUsed} Analysis:\n${t.message}`).join('\n\n---\n\n');
    const blob = new Blob([fullText || content], { type: 'text/markdown;charset=utf-8;' });
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

    try {
      if (onSuggestionClick) {
        await onSuggestionClick(query);
      }
    } finally {
      setIsSubmitting(false);
    }
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

  const openHistory = () => {
    setSessionList(AgentSessionManager.getSessions(false));
    setDeletedList(AgentSessionManager.getDeletedSessions());
    setIsHistoryModalOpen(true);
  };

  const handleRecoverSession = (sessionId: string) => {
    AgentSessionManager.recoverSession(sessionId);
    setSessionList(AgentSessionManager.getSessions(false));
    setDeletedList(AgentSessionManager.getDeletedSessions());
    if (onSuggestionClick) {
      window.location.reload();
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    AgentSessionManager.deleteSession(sessionId);
    setSessionList(AgentSessionManager.getSessions(false));
    setDeletedList(AgentSessionManager.getDeletedSessions());
  };

  // Latest suggestions from last turn or props
  const latestSuggestions = turns.length > 0 && turns[turns.length - 1].suggestions?.length
    ? turns[turns.length - 1].suggestions!
    : suggestions;

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
      {/* Header with Title & Controls */}
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
              Multi-agent financial intelligence & verified general ledger synthesis (Session Auto-Saved)
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
          {onStartNewSession && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={onStartNewSession}
              title="Start a new clean chat session"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#60a5fa' }}
            >
              <PlusCircle size={14} />
              <span>New Session</span>
            </button>
          )}

          <button
            className="btn btn-sm btn-ghost"
            onClick={openHistory}
            title="View saved sessions and 60-day recovery archive"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
          >
            <History size={14} />
            <span>Sessions / 60-Day Archive</span>
          </button>

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
            title="Copy conversation to clipboard"
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

      {/* Multi-Turn Conversation Thread (All Questions & Answers Preserved) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {turns.map((turn, tIdx) => (
          <div key={turn.id || tIdx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {/* User Question Bubble */}
            {turn.query && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '90%',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                  Q
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
                  {turn.query}
                </div>
                {turn.timestamp && (
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: 'auto' }}>
                    {turn.timestamp}
                  </span>
                )}
              </div>
            )}

            {/* Agent Verified Multi-Chunk Response */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {turn.message.split('\n\n').filter(Boolean).map((chunk, idx) => {
                const isAgentLine = chunk.includes('Agent') || chunk.includes('Officer') || chunk.includes('Engine') || chunk.includes('Strategist');
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
                        <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--color-text-primary)' }}>
                          <RichMessageContent content={messageBody} />
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 1.7,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <RichMessageContent content={chunk} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {isSubmitting && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#93c5fd', fontSize: '13px' }}>
            <Loader2 size={16} className="animate-spin" />
            <span>Agents are synthesizing multi-agent ledger intelligence...</span>
          </div>
        )}
      </div>

      {/* Suggested Follow-Ups & Input Box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} style={{ color: '#60a5fa' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            Recommended Actionable Next Steps:
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
            Click any button to execute prompt →
          </span>
        </div>

        {/* Quick Action Suggestion Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(latestSuggestions && latestSuggestions.length > 0
            ? latestSuggestions
            : [
                'What is our net operating profit?',
                'Break down operating expenses by category',
                'Forecast 30/60/90-day cash flow',
                'Check overdue invoice aging',
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

      {/* 60-Day Sessions Archive & Recovery Modal */}
      {isHistoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsHistoryModalOpen(false)}
        >
          <div
            className="glass-card animate-scale-in"
            style={{
              width: '560px',
              maxWidth: '100%',
              maxHeight: '80vh',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} style={{ color: '#3b82f6' }} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Saved Sessions & 60-Day Recovery</h4>
              </div>
              <button className="btn btn-ghost btn-xs" onClick={() => setIsHistoryModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Sessions ({sessionList.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {sessionList.length === 0 ? (
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', padding: '10px 0' }}>No active sessions recorded yet.</div>
                  ) : (
                    sessionList.map((s) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-secondary)' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={11} /> {new Date(s.updatedAt).toLocaleString()} • {s.turns.length} message(s)
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSession(s.id)}
                          className="btn btn-ghost btn-xs"
                          title="Move to 60-Day Trash"
                          style={{ color: '#f43f5e' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {deletedList.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-border-secondary)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RotateCcw size={13} /> 60-Day Recovery Trash ({deletedList.length})
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', margin: '2px 0 8px 0' }}>
                    Deleted sessions can be restored within 60 days before permanent auto-purge.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {deletedList.map((s) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.title}</div>
                          <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                            Deleted {new Date(s.deletedAt!).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRecoverSession(s.id)}
                          className="btn btn-xs btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <RotateCcw size={12} /> Recover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
