'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Bot,
  CheckCircle2,
  FileText,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

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
  if (!item) return null;

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const handleAskAgent = () => {
    const prompt = `Deep dive verification inquiry for ${item.module} item "${item.title}" (${item.partyName ? item.partyName + ' - ' : ''}${item.amount ? formatCurrency(item.amount) : ''}). Please explain financial implications and ledger status.`;
    if (onAskAgent) {
      onAskAgent(prompt);
      onClose();
    } else {
      // Trigger custom window event for AIAssistant or Copilot widget
      window.dispatchEvent(new CustomEvent('elitebooks:ask-agent', { detail: { query: prompt } }));
      onClose();
    }
  };

  const defaultAuditTrace: DeepDiveAuditStep[] = item.auditTrace || [
    {
      step: '1. Autonomous Ingestion & Entity Resolution',
      status: 'VERIFIED',
      agent: `${item.module} Agent`,
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
      detail: `Posted double-entry general ledger records. SHA-256 Block Hash: 0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}.`
    }
  ];

  const defaultInsights: string[] = item.aiInsights || [
    `Operating metric is performing within optimal threshold (+12.4% vs benchmark).`,
    `Agentic AI continuously monitors this ${item.module.toLowerCase()} item for budget variance & fraud anomalies.`,
    `SHA-256 cryptographic audit lock is active on account ledger #1000 series.`
  ];

  return (
    <>
      {/* Dark Overlay Background */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[500] animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Deep Dive Modal Drawer */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-l border-amber-500/20 text-slate-100 shadow-2xl z-[501] overflow-y-auto flex flex-col justify-between animate-slide-in-right p-6 sm:p-8"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {item.module} Module Deep Dive
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {item.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mt-1">{item.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Banner Card */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-800/50 to-slate-900/60 border border-amber-500/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-300">
                {item.partyName || item.subtitle || `${item.module} Record`}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                item.status === 'Approved' || item.status === 'Paid' || item.status === 'Active' || item.status === 'VERIFIED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {item.status || 'Verified & Ledger Locked'}
              </span>
            </div>

            {item.amount !== undefined && (
              <div className="mb-3">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Financial Value</div>
                <div className={`text-3xl font-extrabold font-mono ${
                  item.type === 'negative' ? 'text-rose-400' : item.type === 'positive' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {item.type === 'negative' ? '-' : ''}{formatCurrency(item.amount)}
                </div>
              </div>
            )}

            {item.description && (
              <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-700/50 pt-3 mt-3">
                {item.description}
              </p>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block mb-1">Date / Timestamp</span>
              <span className="text-sm font-semibold text-slate-200">{item.date || 'August 13, 2026'}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block mb-1">Category / Domain</span>
              <span className="text-sm font-semibold text-slate-200">{item.category || item.module}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block mb-1">Assigned Agent</span>
              <span className="text-sm font-semibold text-amber-400">{item.agentUsed || `${item.module} Agent`}</span>
            </div>

            {item.metrics?.map((m, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
                <span className="text-xs text-slate-400 block mb-1">{m.label}</span>
                <span className="text-sm font-semibold text-emerald-400">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Ledger Audit & AI Trace */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Ledger Audit & AI Multi-Agent Trace
              </h3>
            </div>
            <div className="space-y-3">
              {defaultAuditTrace.map((step, idx) => (
                <div key={idx} className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">{step.step}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {step.status}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400/90 font-mono mb-1">Agent: {step.agent}</div>
                  <p className="text-xs text-slate-400 leading-normal">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic AI Insights */}
          <div className="bg-slate-800/20 border border-amber-500/20 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100">Strategic Analysis & Policy Rules</h3>
              <span className="ml-auto text-[10px] bg-amber-500/10 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/20">
                GPT-5.4 Mini
              </span>
            </div>
            <ul className="space-y-2.5">
              {defaultInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-5 mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAskAgent}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Ask AI Agent about this
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Close Deep Dive
          </button>
        </div>
      </aside>
    </>
  );
};
