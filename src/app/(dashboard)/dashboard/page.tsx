'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, Send, DollarSign, FileText, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, Mic, Bot, Zap, CreditCard,
  BarChart3, Receipt, PieChart, Clock, AlertTriangle, ShieldCheck, Layers, Cpu
} from 'lucide-react';
import { formatCurrency, formatPercent, parseLocalDate } from '@/lib/utils';
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
import { SOCComplianceCenter } from '@/components/SOCComplianceCenter';
import { AIAssistedCreationModal } from '@/components/AIAssistedCreationModal';
import MultiPeriodForecastCard from '@/components/MultiPeriodForecastCard';
import { useForecast } from '@/hooks/useForecast';
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
  const forecast = useForecast('cashflow');

  // AI Creation Modal State
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [creationModalType, setCreationModalType] = useState<'invoice' | 'expense'>('invoice');
  const [creationInitialData, setCreationInitialData] = useState<any>(null);

  // AI Feed & Approvals State
  const [feedItems, setFeedItems] = useState<AIBusinessFeedItem[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<HITLApprovalRequest[]>([]);
  const [activeApprovalRequest, setActiveApprovalRequest] = useState<HITLApprovalRequest | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'approvals' | 'audit' | 'soc'>('feed');

  const [rawReportData, setRawReportData] = useState<any>(null);
  const [snapshot, setSnapshot] = useState({
    revenue: { value: 0, change: 0 },
    expenses: { value: 0, change: 0 },
    profit: { value: 0, change: 0 },
    cashFlow: { value: 0, change: 0 },
  });
  const [monthlyData, setMonthlyData] = useState<{ name: string; Revenue: number; Expenses: number }[]>([]);
  const [categoryPieData, setCategoryPieData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [copilotInsights, setCopilotInsights] = useState<string[]>([
    'Autonomous agents active and monitoring general ledger double-entry balances in real-time.',
    'All transaction disbursements, payroll accruals, and invoice aging reconciled continuously.',
  ]);

  const loadDashboardData = useCallback(async () => {
    // Load feeds and pending approvals
    setFeedItems(AIBusinessFeedService.getFeedItems());
    setPendingApprovals(AIBusinessFeedService.getPendingApprovals());

    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setRawReportData(d);
        const rev = d.totalRevenue || 0;
        const exp = d.totalExpenses || 0;
        const prof = d.netProfit || 0;
        const cash = (d.totalPaid || 0) - exp;

        setSnapshot({
          revenue: { value: rev, change: 0 },
          expenses: { value: exp, change: 0 },
          profit: { value: prof, change: 0 },
          cashFlow: { value: cash, change: 0 },
        });

        // Compute real monthly chart data from invoices and expenses
        const monthMap: Record<string, { Revenue: number; Expenses: number }> = {};
        (d.invoices || []).forEach((inv: any) => {
          const dateStr = inv.issueDate || inv.createdAt;
          if (dateStr) {
            const m = parseLocalDate(dateStr).toLocaleString('default', { month: 'short' });
            if (!monthMap[m]) monthMap[m] = { Revenue: 0, Expenses: 0 };
            monthMap[m].Revenue += (inv.total || 0);
          }
        });
        (d.expenses || []).filter((e: any) => e.status !== 'deleted' && !e.isPersonal).forEach((ex: any) => {
          const dateStr = ex.date || ex.createdAt;
          if (dateStr) {
            const m = parseLocalDate(dateStr).toLocaleString('default', { month: 'short' });
            if (!monthMap[m]) monthMap[m] = { Revenue: 0, Expenses: 0 };
            monthMap[m].Expenses += (ex.amount || 0);
          }
        });

        const dynamicMonthly = Object.entries(monthMap).map(([name, vals]) => ({
          name,
          Revenue: vals.Revenue,
          Expenses: vals.Expenses,
        }));
        setMonthlyData(dynamicMonthly.length > 0 ? dynamicMonthly : [
          { name: 'Current Period', Revenue: rev, Expenses: exp }
        ]);

        // Compute real category pie data
        const catColors: Record<string, string> = {
          'Cloud Services': '#0ea5e9',
          'Software & SaaS': '#8b5cf6',
          'Office & Supplies': '#3b82f6',
          'Meals & Entertainment': '#ec4899',
          'Travel & Transport': '#f59e0b',
          'Rent & Utilities': '#10b981',
          'Marketing': '#f43f5e',
          'Professional Services': '#06b6d4',
          'Subscriptions': '#d946ef',
          'Miscellaneous': '#64748b',
        };

        const dynamicPie = Object.entries(d.expensesByCategory || {}).map(([name, val]) => ({
          name,
          value: Number(val) || 0,
          color: catColors[name] || '#3b82f6'
        })).filter(c => c.value > 0);
        setCategoryPieData(dynamicPie);

        // Ground Copilot insights in real numbers
        setCopilotInsights([
          `Total Recorded Revenue is ${formatCurrency(rev)} with Operating Expenses of ${formatCurrency(exp)}.`,
          `Net Profit stands at ${formatCurrency(prof)} (${d.profitMargin ? d.profitMargin.toFixed(1) : '0.0'}% margin).`,
          `Accounts Receivable has ${formatCurrency(d.totalOutstanding || 0)} pending collections.`,
        ]);
      }
    } catch (e) {
      console.error('Failed to load real dashboard summary:', e);
    }
  }, [user]);

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
        insights={copilotInsights}
        suggestedActions={[
          'Why did expenses increase this month?',
          'Forecast cash flow for next 6 months',
          'Audit Project Alpha budget overrun'
        ]}
        color="#3b82f6"
        isLoading={isLoading}
        onAction={(cmd) => {
          sendMessage(cmd);
          const form = document.getElementById('command-form');
          if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
          }
        }}
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
              style={{ position: 'relative', overflow: 'hidden' }}
              onClick={() => setSelectedDeepDive({
                title: metric.label,
                type: metric.label.toLowerCase().includes('revenue') ? 'revenue' : metric.label.toLowerCase().includes('expense') ? 'expenses' : metric.label.toLowerCase().includes('profit') ? 'profit' : 'cash',
                value: metric.value,
                change: metric.change,
                icon: metric.icon,
                color: metric.color,
                reportData: rawReportData,
              })}
              title={`Click for comprehensive ${metric.label} breakdown & live itemized audit`}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <span className="cmd-metric-label">{metric.label}</span>
                <span 
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: metric.color,
                    background: `${metric.color}15`,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  Breakdown →
                </span>
              </div>
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

      {/* Autonomous Forecasting Engine */}
      <section style={{ marginTop: '1rem' }}>
        <MultiPeriodForecastCard
          title="Financial Forecasting Engine"
          domain="cashflow"
          monthlyData={forecast.monthly.dataPoints}
          quarterlyData={forecast.quarterly.dataPoints}
          annualData={forecast.annual.dataPoints}
          projectedTotal={forecast.monthly.projectedTotal}
          growthRate={forecast.monthly.growthRate}
          confidence={forecast.monthly.confidence}
          trendDirection={forecast.monthly.trendDirection}
          avgMonthlyValue={forecast.monthly.avgMonthlyValue}
          scenarioSummary={forecast.monthly.scenarioSummary}
          onDeepDive={(horizon) => setSelectedDeepDive({
            title: `${horizon} Cash Flow Forecast`,
            type: 'cash',
            value: forecast.monthly.projectedTotal,
            change: forecast.monthly.growthRate,
            icon: TrendingUp,
            color: '#10b981',
            reportData: rawReportData,
          })}
        />
      </section>

      {/* Primary Intelligence Section: Feed, Approvals, & Audit */}
      <section style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Navigation Bar */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              whiteSpace: 'nowrap',
              background: activeTab === 'feed' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'feed' ? '#0f172a' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: activeTab === 'feed' ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Zap size={16} />
            <span>AI Business Intelligence Feed</span>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              padding: '2px 7px', 
              borderRadius: '100px', 
              background: activeTab === 'feed' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === 'feed' ? '#0f172a' : '#ffffff'
            }}>
              {feedItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              whiteSpace: 'nowrap',
              background: activeTab === 'approvals' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'approvals' ? '#0f172a' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: activeTab === 'approvals' ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <ShieldCheck size={16} />
            <span>Pending HITL Approvals</span>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              padding: '2px 7px', 
              borderRadius: '100px', 
              background: activeTab === 'approvals' ? 'rgba(0, 0, 0, 0.25)' : pendingApprovals.filter(p => p.status === 'pending').length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === 'approvals' ? '#0f172a' : pendingApprovals.filter(p => p.status === 'pending').length > 0 ? '#f87171' : '#ffffff'
            }}>
              {pendingApprovals.filter(p => p.status === 'pending').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              whiteSpace: 'nowrap',
              background: activeTab === 'audit' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'audit' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: activeTab === 'audit' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Layers size={16} />
            <span>SHA-256 Audit Center</span>
          </button>

          <button
            onClick={() => setActiveTab('soc')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              whiteSpace: 'nowrap',
              background: activeTab === 'soc' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'soc' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: activeTab === 'soc' ? '0 4px 14px rgba(6, 182, 212, 0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <ShieldCheck size={16} />
            <span>SOC 1 & SOC 2 Governance</span>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              padding: '2px 7px', 
              borderRadius: '100px', 
              background: activeTab === 'soc' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(6, 182, 212, 0.2)',
              color: activeTab === 'soc' ? '#ffffff' : '#22d3ee'
            }}>
              100% READY
            </span>
          </button>
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
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <ShieldCheck size={20} color="#f59e0b" />
              Human-in-the-Loop Pending Approvals Drawer
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingApprovals.filter(p => p.status === 'pending').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                  <ShieldCheck size={32} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>No Pending Authorizations</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                    All financial operations, payouts, and automated postings have been verified and approved.
                  </div>
                </div>
              ) : (
                pendingApprovals.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', textTransform: 'uppercase' }}>
                          {req.status}
                        </span>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{req.title}</h4>
                      </div>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', margin: '4px 0 0 0' }}>{req.description}</p>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                        <span>Agent: <strong style={{ color: '#ffffff' }}>{req.responsibleAgent}</strong></span>
                        <span>Impact: <strong style={{ color: '#f87171' }}>${Math.abs(req.financialImpact).toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setActiveApprovalRequest(req);
                          setIsApprovalModalOpen(true);
                        }}
                        className="btn btn-primary"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontSize: '12px', fontWeight: 800, padding: '8px 16px' }}
                      >
                        Review & Authorize
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && <AIAuditCenter orgId="default" />}
        {activeTab === 'soc' && <SOCComplianceCenter />}
      </section>

      {/* AI Guided Creation Modal (Human-in-the-Loop) */}
      <AIAssistedCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        type={creationModalType}
        initialData={creationInitialData}
        onSuccess={() => loadDashboardData()}
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
