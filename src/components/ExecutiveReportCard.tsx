'use client';

import React, { useState } from 'react';
import {
  Bot, Mail, Copy, Check, FileText, Sparkles,
  Download, MessageSquarePlus, X, Cpu, ChevronRight, Bookmark
} from 'lucide-react';

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
  const [selectedModel, setSelectedModel] = useState('GPT-5.4 Mini');

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EliteBooks_Executive_Report_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to split transcript if multi-agent output
  const lines = content.split('\n\n');

  return (
    <div
      className="glass-card animate-scale-in relative"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
        border: '1px solid rgba(99, 131, 196, 0.35)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
            }}
          >
            <Bot size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {agentUsed}
              </h3>
              <span className="badge badge-accent" style={{ fontSize: '11px' }}>
                <Sparkles size={12} /> Executive Analysis
              </span>

              {/* Model Selector Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '8px' }}>
                <Cpu size={12} style={{ color: '#f59e0b' }} />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{
                    background: 'transparent',
                    color: '#f59e0b',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="GPT-5.4 Mini" style={{ background: '#0f172a', color: '#f59e0b' }}>⚡ GPT-5.4 Mini (Default Orchestrator)</option>
                  <option value="Gemini 3.7 Flash" style={{ background: '#0f172a', color: '#f59e0b' }}>♊ Gemini 3.7 Flash (High Speed & Reasoning)</option>
                  <option value="Gemini 3.7 Pro" style={{ background: '#0f172a', color: '#f59e0b' }}>♊ Gemini 3.7 Pro (Deep Financial Strategy)</option>
                  <option value="Claude 3.5 Sonnet" style={{ background: '#0f172a', color: '#f59e0b' }}>🎯 Claude 3.5 Sonnet (Strategic Audit)</option>
                </select>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
              Autonomous multi-agent synthesis using <strong style={{ color: '#f59e0b' }}>{selectedModel}</strong>
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
            <Download size={14} style={{ color: '#60a5fa' }} />
            <span>Download</span>
          </button>

          <button
            className="btn btn-sm btn-ghost"
            onClick={handleCopy}
            title="Copy report text to clipboard"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--color-positive)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              if (onAskFollowUp) onAskFollowUp();
              const el = document.getElementById('command-input');
              if (el) {
                el.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title="Ask follow-up question or issue a new task"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }}
          >
            <MessageSquarePlus size={14} />
            <span>Ask Follow-Up / New Task</span>
          </button>

          {onClear && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={onClear}
              title="Dismiss / Clear active report"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#f43f5e' }}
            >
              <X size={14} />
              <span>Dismiss</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {lines.map((chunk, idx) => {
          const agentMatch = chunk.match(/^([A-Za-z0-9\s&]+Agent|Compliance Officer|Ledger Agent):\s*([\s\S]+)/);

          if (agentMatch) {
            const agentName = agentMatch[1].trim();
            const messageBody = agentMatch[2].trim();
            const isEmailBlock = messageBody.includes('EXECUTIVE EMAIL DRAFT') || messageBody.includes('Subject:');

            return (
              <div
                key={idx}
                style={{
                  background: isEmailBlock ? 'rgba(15, 23, 42, 0.95)' : 'rgba(30, 41, 59, 0.5)',
                  border: isEmailBlock ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  boxShadow: isEmailBlock ? '0 10px 25px rgba(139, 92, 246, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isEmailBlock ? <Mail size={16} style={{ color: '#a78bfa' }} /> : <FileText size={16} style={{ color: '#60a5fa' }} />}
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: isEmailBlock ? '#a78bfa' : '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {agentName}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                    Verified Output
                  </span>
                </div>

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
          <span style={{ fontSize: '11px', color: '#60a5fa', cursor: 'pointer' }} onClick={onAskFollowUp}>
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
              style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#f8fafc' }}
              onClick={() => onSuggestionClick && onSuggestionClick(s)}
            >
              <span>{s}</span>
              <ChevronRight size={12} style={{ color: '#60a5fa' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
