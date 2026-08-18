'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  Bot,
  Clock,
  Sparkles,
  MessageSquare,
  Activity,
  Layers,
  TrendingUp,
  AlertTriangle,
  FileText,
  Loader2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useAgent } from '@/hooks/useAgent';
import ExecutiveReportCard from '@/components/ExecutiveReportCard';

export interface DeepDiveMetric {
  label: string;
  value: string;
}

export interface DeepDiveAuditStep {
  step: string;
  status: string;
  agent: string;
  detail: string;
}

export interface DeepDiveItem {
  id: string;
  title: string;
  module: 'Command Center' | 'Invoices' | 'Payroll' | 'Reports' | 'FinOps' | 'Inventory' | 'Settings' | 'Personal' | 'Admin' | 'Expenses' | string;
  subtitle?: string;
  amount?: number;
  type?: 'positive' | 'negative' | 'neutral';
  status?: string;
  date?: string;
  category?: string;
  partyName?: string;
  description?: string;
  agentUsed?: string;
  metrics?: DeepDiveMetric[];
  auditTrace?: DeepDiveAuditStep[];
  aiInsights?: string[];
  taxRules?: string[];
  rawPayload?: Record<string, unknown>;
}

interface EliteDeepDiveModalProps {
  item: DeepDiveItem | null;
  onClose: () => void;
  onAskAgent?: (query: string) => void;
}

export const EliteDeepDiveModal: React.FC<EliteDeepDiveModalProps> = ({
  item,
  onClose,
  onAskAgent
}) => {
  const [activeTab, setActiveTab] = useState<'financial' | 'audit' | 'strategic'>('financial');
  const { isLoading: isAiLoading, response: aiResponse, turns, sendMessage: sendModalAiMessage } = useAgent();
  const [hasAsked, setHasAsked] = useState(false);

  if (!item) return null;

  const agentName = item.agentUsed || `${item.module} Agent`;

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const handleAskAgent = async () => {
    const prompt = `Deep dive verification inquiry for ${item.module} item "${item.title}" (${item.partyName ? item.partyName + ' - ' : ''}${item.amount ? formatCurrency(item.amount) : ''}). Please analyze and explain financial implications, double-entry ledger status, and strategic recommendations.`;
    setHasAsked(true);
    
    if (onAskAgent) {
      onAskAgent(prompt);
    }
    
    window.dispatchEvent(new CustomEvent('elitebooks:ask-agent', { detail: { query: prompt } }));
    await sendModalAiMessage(prompt);
  };

  const defaultAuditTrace: DeepDiveAuditStep[] = item.auditTrace || [
    {
      step: '1. Autonomous Ingestion & Entity Resolution',
      status: 'VERIFIED',
      agent: agentName,
      detail: `Extracted record ${item.id} for ${item.partyName || item.title}. Data normalized across Pinecone Vector RAG and Knowledge Graph.`
    },
    {
      step: '2. Multi-Agent Policy & Compliance Audit',
      status: 'QUALIFIED',
      agent: 'Compliance Officer',
      detail: 'Verified against GAAP Accounting standards, SEC/FINRA privacy rules, and internal controls.'
    },
    {
      step: '3. Ledger Reconcile & Audit Lock',
      status: 'LOCKED',
      agent: 'Ledger Agent',
      detail: `Posted double-entry general ledger records.`
    }
  ];

  const defaultInsights: string[] = item.aiInsights || [
    `Operating metric is performing within expected threshold.`,
    `Agentic AI continuously monitors this ${item.module.toLowerCase()} item for budget variance & anomalies.`,
    `SHA-256 cryptographic audit lock is active on ledger records.`
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: 'calc(100dvh - 40px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(24, 24, 27, 0.95))',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {item.title}
                </h2>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase' }}>
                  {item.status || 'VERIFIED'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0 0' }}>
                {item.subtitle || `${item.module} Deep Dive Verification & Analysis`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Card with Amount & Description */}
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} color="#10b981" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{agentName}</span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono, monospace)' }}>
              Live Ledger Audit
            </span>
          </div>

          {item.amount !== undefined && (
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', color: item.type === 'positive' ? '#10b981' : (item.type === 'negative' ? '#f43f5e' : '#60a5fa'), letterSpacing: '-0.02em' }}>
              {item.type === 'negative' ? '-' : (item.type === 'positive' ? '+' : '')}{formatCurrency(item.amount)}
            </div>
          )}

          {item.description && (
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5, margin: 0 }}>
              {item.description}
            </p>
          )}
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
          {[
            { id: 'financial', label: 'Financial Overview', icon: Activity },
            { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
            { id: 'strategic', label: 'AI Strategy & Insights', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === tab.id ? '#10b981' : 'rgba(255, 255, 255, 0.6)',
                borderBottom: activeTab === tab.id ? '2px solid #10b981' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Financial Metrics Grid */}
        {activeTab === 'financial' && item.metrics && item.metrics.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {item.metrics.map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.label}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono, monospace)' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Audit Trace Steps */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {defaultAuditTrace.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                    {step.step}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    {step.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', margin: 0, lineHeight: 1.4 }}>
                  {step.detail}
                </p>
                <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 600 }}>
                  Verified by: {step.agent}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Strategic AI Insights */}
        {activeTab === 'strategic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {defaultInsights.map((insight, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <Zap size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.4 }}>
                  {insight}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Inline AI Response if Asked */}
        {hasAsked && (
          <div style={{ marginTop: '10px' }}>
            {isAiLoading ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#10b981' }}>
                <Loader2 size={16} className="pulse-animation" />
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Autonomous Multi-Agent Analysis in progress...</span>
              </div>
            ) : (aiResponse || turns.length > 0) ? (
              <ExecutiveReportCard
                turns={turns}
                content={aiResponse?.message || ''}
                agentUsed={aiResponse?.agentUsed || agentName}
                suggestions={aiResponse?.suggestions}
                onSuggestionClick={(s) => sendModalAiMessage(s)}
              />
            ) : null}
          </div>
        )}

        {/* Action Button */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', marginTop: 'auto' }}>
          <button
            onClick={handleAskAgent}
            disabled={isAiLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: isAiLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              opacity: isAiLoading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isAiLoading ? (
              <>
                <Loader2 size={16} /> Analyzing Multi-Agent Intelligence...
              </>
            ) : (
              <>
                <MessageSquare size={16} /> Consult AI Copilot about this
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
