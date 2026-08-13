'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, Send, DollarSign, FileText, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, Mic, Bot, Zap, CreditCard,
  BarChart3, Receipt, PieChart, Clock, AlertTriangle, ShieldCheck, Layers, Cpu
} from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { useAgent } from '@/hooks/useAgent';
import { useVoice } from '@/hooks/useVoice';
import { useAuth } from '@/hooks/useAuth';

import DeepDiveModal, { DeepDiveData } from '@/components/DeepDiveModal';
import ColorfulBarChart from '@/components/ColorfulBarChart';
import ColorfulPieChart from '@/components/ColorfulPieChart';
import PageAgentCopilot from '@/components/PageAgentCopilot';
import ExecutiveReportCard from '@/components/ExecutiveReportCard';
import { AIBusinessFeed } from '@/components/AIBusinessFeed';
import { HITLApprovalCenter } from '@/components/HITLApprovalCenter';
import { AIAuditCenter } from '@/components/AIAuditCenter';
import { AIAssistedCreationModal } from '@/components/AIAssistedCreationModal';
import { AIBusinessFeedService } from '@/lib/feed-service';
import { AIBusinessFeedItem, HITLApprovalRequest } from '@/types/agent-system';

const quickActions = [
  { label: 'Forecast 90-day cash flow', icon: DollarSign, color: '#10b981' },
  { label: 'Create Acme invoice $12,000', icon: FileText, color: '#3b82f6' },
  { label: 'Check payroll budget anomalies', icon: Users, color: '#f59e0b' },
  { label: 'Why did expenses increase?', icon: TrendingUp, color: '#8b5cf6' },
  { label: 'Find un-reconciled items', icon: Receipt, color: '#ec4899' },
  { label: 'Run full CFO financial audit', icon: Sparkles, color: '#06b6d4' },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [command, setCommand] = useState('');
  const { isLoading, response, error, sendMessage, clearResponse } = useAgent();
  const { isRecording, startRecording, stopRecording } = useVoice();
  const [selectedDeepDive, setSelectedDeepDive] = useState<DeepDiveData | null>(null);

  // AI Creation Modal State
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [creationModalType, setCreationModalType] = useState<'invoice' | 'expense'>('invoice');
  const [creationInitialData, setCreationInitialData] = useState<any>(null);

  // AI Feed & Approvals State
  const [feedItems, setFeedItems] = useState<AIBusinessFeedItem[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<HITLApprovalRequest[]>([]);
  const [activeApprovalRequest, setActiveApprovalRequest] = useState<HITLApprovalRequest | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'approvals' | 'audit'>('feed');

  const [snapshot, setSnapshot] = useState({
    revenue: { value: 210500, change: 12.4 },
    expenses: { value: 124300, change: 7.2 },
    profit: { value: 86200, change: 18.5 },
    cashFlow: { value: 145200.50, change: 9.3 },
  });

  const loadDashboardData = useCallback(() => {
    // Load feeds and pending approvals
    setFeedItems(AIBusinessFeedService.getFeedItems());
    setPendingApprovals(AIBusinessFeedService.getPendingApprovals());
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isLoading) return;
    
    await sendMessage(command);
    setCommand('');
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;
    setCommand(action);
    await sendMessage(action);
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const transcript = await stopRecording();
      if (transcript) {
        setCommand(transcript);
        await sendMessage(transcript);
      }
    } else {
      await startRecording();
    }
  };

  const handleOpenApprovalModal = (targetEntityId: string) => {
    const req = pendingApprovals.find((r) => r.id === targetEntityId) || pendingApprovals[0] || null;
    setActiveApprovalRequest(req);
    setIsApprovalModalOpen(true);
  };

  const handleApproveAction = (requestId: string) => {
    AIBusinessFeedService.approveRequest(requestId);
    loadDashboardData();
  };

  const handleRejectAction = (requestId: string) => {
    AIBusinessFeedService.rejectRequest(requestId);
    loadDashboardData();
  };

  // Chart Datasets
  const monthlyData = [
    { name: 'Mar', Revenue: 142000, Expenses: 98000 },
    { name: 'Apr', Revenue: 158000, Expenses: 104000 },
    { name: 'May', Revenue: 175000, Expenses: 112000 },
    { name: 'Jun', Revenue: 190000, Expenses: 118000 },
    { name: 'Jul', Revenue: 198000, Expenses: 121000 },
    { name: 'Aug', Revenue: 210500, Expenses: 124300 },
  ];

  const categoryPieData = [
    { name: 'Software & SaaS', value: 38500, color: '#3b82f6' },
    { name: 'Payroll & Salaries', value: 48000, color: '#10b981' },
    { name: 'Rent & Facilities', value: 16500, color: '#f59e0b' },
    { name: 'Cloud Infrastructure', value: 12500, color: '#8b5cf6' },
    { name: 'Marketing & Subs', value: 8800, color: '#ec4899' },
  ];

  return (
    <div className="cmd-center">
      {/* Deep Dive Modal */}
      <DeepDiveModal
        data={selectedDeepDive}
        onClose={() => setSelectedDeepDive(null)}
        onAskAgent={(q) => {
          setCommand(q);
          sendMessage(q);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* HITL Approval Modal */}
      <HITLApprovalCenter
        request={activeApprovalRequest}
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onApprove={handleApproveAction}
        onReject={handleRejectAction}
      />

      {/* Page Copilot Banner */}
      <PageAgentCopilot
        agentName="CFO Strategist & Orchestrator"
        badgeText="10 Specialized Agents Active"
        insights={[
          `Quarterly Revenue operating at $210,500 (+12.4% YoY), primarily driven by enterprise expansion.`,
          `Operating margin expanded to 40.9% (+5 percentage point improvement).`,
          `30/60/90-Day Treasury Forecast projects cash reserves reaching $182,000 with strong liquidity runway.`
        ]}
        suggestedActions={[
          'Why did expenses increase this month?',
          'Forecast cash flow for next 6 months',
          'Audit Project Alpha budget overrun'
        ]}
        color="#3b82f6"
      />

      {/* Welcome + Command Input */}
      <section className="cmd-hero">
        <div className="cmd-greeting">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            EliteBooks Financial Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Accounting that runs itself — 10 autonomous specialized agents observing, forecasting, and executing for you.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 12px', borderRadius: '20px' }}>
            <Cpu size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Reasoning Model:</span>
            <select
              style={{
                background: 'transparent',
                color: '#f59e0b',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="GPT-5.4 Mini" style={{ background: '#0f172a', color: '#f59e0b' }}>⚡ GPT-5.4 Mini (Default Multi-Agent Orchestrator)</option>
              <option value="Gemini 3.7 Flash" style={{ background: '#0f172a', color: '#f59e0b' }}>♊ Gemini 3.7 Flash (High Speed & Reasoning)</option>
              <option value="Gemini 3.7 Pro" style={{ background: '#0f172a', color: '#f59e0b' }}>♊ Gemini 3.7 Pro (Deep Financial Strategy)</option>
              <option value="Claude 3.5 Sonnet" style={{ background: '#0f172a', color: '#f59e0b' }}>🎯 Claude 3.5 Sonnet (Strategic Audit)</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="cmd-input-wrap" id="command-form">
          <Sparkles size={20} className={`cmd-input-icon ${isLoading ? 'animate-pulse text-amber-400' : ''}`} />
          <input
            type="text"
            className="cmd-input"
            placeholder={isLoading ? "Coordinating specialized agents..." : "Ask CFO Agent or instruct your AI finance department..."}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            id="command-input"
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            type="button"
            className={`cmd-mic-btn ${isRecording ? 'listening' : ''}`}
            onClick={handleVoiceToggle}
            aria-label="Voice input"
            disabled={isLoading}
          >
            <Mic size={18} />
          </button>
          <button type="submit" className="cmd-send-btn" disabled={!command.trim() || isLoading} aria-label="Send command">
            <Send size={18} />
          </button>
        </form>

        {/* Agent Response */}
        {response && (
          <ExecutiveReportCard
            content={response.message}
            agentUsed={response.agentUsed || 'CFO Agent'}
            suggestions={response.suggestions}
            onSuggestionClick={(s) => sendMessage(s)}
            onClear={clearResponse}
            onOpenCreationModal={(type) => {
              setCreationModalType(type);
              setIsCreationModalOpen(true);
            }}
            onAskFollowUp={() => {
              const el = document.getElementById('command-input');
              if (el) {
                el.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        )}

        {error && (
          <div className="cmd-error glass-card animate-shake">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Actions & AI Guided Launchers */}
        <div className="cmd-quick-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setCreationModalType('invoice');
              setIsCreationModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              color: '#93c5fd',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} style={{ color: '#60a5fa' }} />
            <span>Create Invoice (AI Assisted)</span>
          </button>

          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setCreationModalType('expense');
              setIsCreationModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(236, 72, 153, 0.25))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fcd34d',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} style={{ color: '#f59e0b' }} />
            <span>Log Expense (AI Assisted)</span>
          </button>

          {quickActions.map((action) => (
            <button 
              key={action.label} 
              className="cmd-quick-btn" 
              onClick={() => handleQuickAction(action.label)}
              disabled={isLoading}
            >
              <action.icon size={16} style={{ color: action.color }} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Financial Snapshot Metrics */}
      <section className="cmd-snapshot">
        <div className="cmd-section-header">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-100">
            <BarChart3 size={18} className="text-amber-400" />
            Financial Intelligence Snapshot
          </h2>
          <span className="badge badge-accent flex items-center gap-1">
            <Clock size={12} /> Real-Time
          </span>
        </div>
        <div className="cmd-metrics">
          {[
            { label: 'Sales Revenue', ...snapshot.revenue, icon: CreditCard, color: '#10b981' },
            { label: 'Operating Expenses', ...snapshot.expenses, icon: Receipt, color: '#f43f5e' },
            { label: 'Net Profit', ...snapshot.profit, icon: PieChart, color: '#3b82f6' },
            { label: 'Cash Reserves', ...snapshot.cashFlow, icon: DollarSign, color: '#8b5cf6' },
          ].map((metric) => (
            <div 
              key={metric.label} 
              className="cmd-metric glass-card cursor-pointer hover:border-amber-500/40 transition-all"
              onClick={() => setSelectedDeepDive({
                title: metric.label,
                type: metric.label.toLowerCase().includes('revenue') ? 'revenue' : metric.label.toLowerCase().includes('expense') ? 'expenses' : metric.label.toLowerCase().includes('profit') ? 'profit' : 'cash',
                value: metric.value,
                change: metric.change,
                icon: metric.icon,
                color: metric.color
              })}
            >
              <div className="cmd-metric-header">
                <div className="cmd-metric-icon" style={{ background: `${metric.color}15`, color: metric.color }}>
                  <metric.icon size={18} />
                </div>
                <span className={`cmd-metric-change ${metric.change > 0 ? 'positive' : 'negative'}`}>
                  {metric.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {formatPercent(Math.abs(metric.change))}
                </span>
              </div>
              <span className="cmd-metric-value value-financial">
                {formatCurrency(metric.value)}
              </span>
              <span className="cmd-metric-label">{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Analytics */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        <ColorfulBarChart
          title="Revenue vs Operating Expenses"
          subtitle="Monthly comparative breakdown across active ledger periods"
          data={monthlyData}
          series={[
            { key: 'Revenue', label: 'Revenue ($)', color: '#10b981' },
            { key: 'Expenses', label: 'Expenses ($)', color: '#f43f5e' },
          ]}
        />
        <ColorfulPieChart
          title="Expense Category Distribution"
          subtitle="Real-time spend breakdown by domain category"
          data={categoryPieData}
          centerText={formatCurrency(snapshot.expenses.value)}
          centerSubtext="Total OPEX"
        />
      </section>

      {/* Primary Intelligence Section: Feed, Approvals, & Audit */}
      <section className="space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'feed'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              AI Business Intelligence Feed ({feedItems.length})
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'approvals'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Pending HITL Approvals ({pendingApprovals.filter(p => p.status === 'pending').length})
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'audit'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              SHA-256 Audit Center
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'feed' && (
          <AIBusinessFeed
            items={feedItems}
            onOpenApprovalModal={handleOpenApprovalModal}
            onExecuteAction={(item) => {
              if (item.approvalRequirement?.targetEntityId) {
                handleOpenApprovalModal(item.approvalRequirement.targetEntityId);
              }
            }}
          />
        )}

        {activeTab === 'approvals' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Human-in-the-Loop Pending Approvals Drawer
            </h3>
            <div className="space-y-4">
              {pendingApprovals.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold rounded uppercase">
                        {req.status}
                      </span>
                      <h4 className="text-base font-bold text-slate-100">{req.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{req.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>Agent: <strong className="text-slate-200">{req.responsibleAgent}</strong></span>
                      <span>Impact: <strong className="text-red-400">${Math.abs(req.financialImpact).toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setActiveApprovalRequest(req);
                        setIsApprovalModalOpen(true);
                      }}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-all"
                    >
                      Review & Authorize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && <AIAuditCenter orgId="default" />}
      </section>

      {/* AI Guided Creation Modal (Human-in-the-Loop) */}
      <AIAssistedCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        type={creationModalType}
        initialData={creationInitialData}
        onSuccess={() => fetchSnapshot()}
      />

      <style>{`
        .cmd-center {
          max-width: 1040px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .cmd-hero {
          text-align: center;
          animation: fadeInUp 0.6s var(--ease-out-expo) both;
        }

        .cmd-input-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          margin-top: var(--space-6);
          margin-bottom: var(--space-6);
          transition: all var(--duration-fast) var(--ease-smooth);
          box-shadow: var(--shadow-md);
        }
        .cmd-input-wrap:focus-within {
          border-color: var(--color-accent-primary);
          box-shadow: var(--shadow-md), 0 0 0 3px var(--color-accent-subtle);
        }
        .cmd-input-icon { color: var(--color-accent-primary); flex-shrink: 0; }
        .cmd-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: var(--text-lg);
          color: var(--color-text-primary);
          font-family: var(--font-sans);
        }
        .cmd-input::placeholder { color: var(--color-text-muted); }

        .cmd-mic-btn, .cmd-send-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          border: none;
          background: var(--color-bg-tertiary);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--duration-fast);
          flex-shrink: 0;
        }
        .cmd-mic-btn:hover, .cmd-send-btn:hover {
          background: var(--color-accent-subtle);
          color: var(--color-accent-primary);
        }
        .cmd-mic-btn.listening {
          background: rgba(244, 63, 94, 0.15);
          color: var(--color-negative);
          animation: pulse 1.5s infinite;
        }
        .cmd-send-btn:disabled { opacity: 0.3; cursor: default; }

        .cmd-quick-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-3);
        }
        .cmd-quick-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-full);
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-smooth);
          font-family: var(--font-sans);
        }
        .cmd-quick-btn:hover {
          border-color: var(--color-border-accent);
          color: var(--color-text-primary);
          background: var(--color-accent-subtle);
          transform: translateY(-1px);
        }

        .cmd-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }
        .cmd-metric {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
        }
        .cmd-metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }
        .cmd-metric-icon {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
        }
        .cmd-metric-change {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
        }
        .cmd-metric-change.positive { color: var(--color-positive); }
        .cmd-metric-change.negative { color: var(--color-negative); }
        .cmd-metric-value {
          font-size: var(--text-2xl);
          color: var(--color-text-primary);
          margin-bottom: var(--space-1);
        }
        .cmd-metric-label {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          font-weight: var(--weight-medium);
        }

        @media (max-width: 768px) {
          .cmd-metrics { grid-template-columns: repeat(2, 1fr); }
          .cmd-quick-actions { justify-content: stretch; }
          .cmd-quick-btn { flex: 1; justify-content: center; min-width: 140px; }
        }
      `}</style>
    </div>
  );
}
