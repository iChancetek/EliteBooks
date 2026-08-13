'use client';

import React, { useState } from 'react';
import {
  Bot, Mail, CheckCircle2, Copy, Check, FileText, Sparkles,
  Shield, DollarSign, TrendingUp, Layers, ChevronRight
} from 'lucide-react';

interface ExecutiveReportCardProps {
  content: string;
  agentUsed?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export default function ExecutiveReportCard({
  content,
  agentUsed = 'EliteBooks AI',
  suggestions = [],
  onSuggestionClick
}: ExecutiveReportCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to split transcript if multi-agent output
  const lines = content.split('\n\n');

  // Check if content contains an email draft
  const hasEmailDraft = content.includes('EXECUTIVE EMAIL DRAFT') || content.includes('Subject:');

  return (
    <div
      className="glass-card animate-scale-in"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
        border: '1px solid rgba(99, 131, 196, 0.35)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        borderRadius: 'var(--radius-xl)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Bot size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {agentUsed}
              </h3>
              <span className="badge badge-accent" style={{ fontSize: '11px' }}>
                <Sparkles size={12} /> Executive Analysis
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
              Autonomous multi-agent synthesis & formatted publication report
            </p>
          </div>
        </div>

        <button
          className="btn btn-sm btn-ghost"
          onClick={handleCopy}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
        >
          {copied ? <Check size={14} style={{ color: 'var(--color-positive)' }} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Report'}</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {lines.map((chunk, idx) => {
          // Check if chunk is an Agent Speech block (e.g. "Expense Agent: ...")
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
                  boxShadow: isEmailBlock ? '0 10px 25px rgba(139, 92, 246, 0.15)' : 'none'
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

                {/* Formatted Text Content */}
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.7,
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.01em'
                  }}
                >
                  {messageBody}
                </div>
              </div>
            );
          }

          // Fallback regular block
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
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              {chunk}
            </div>
          );
        })}
      </div>

      {/* Action Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recommended Next Actions:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {suggestions.map((s) => (
              <button
                key={s}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => onSuggestionClick && onSuggestionClick(s)}
              >
                <span>{s}</span>
                <ChevronRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
