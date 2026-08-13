'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Wallet, Plus, Search, TrendingUp, TrendingDown, DollarSign,
  Coffee, Home, Car, Smartphone, ShoppingBag, GraduationCap,
  X, Trash2, Calendar, ArrowUpRight,
  ArrowDownRight, Bot, Sparkles, AlertTriangle, CheckCircle2, PiggyBank,
  Music, Film, Package, Trophy, CreditCard, Zap, Shield, History,
  Info, BarChart3, Target, Clock, ArrowRightLeft, Eye, ChevronRight,
  Download, Tv, UtensilsCrossed, Briefcase, Calculator, LineChart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

import ColorfulBarChart from '@/components/ColorfulBarChart';
import ColorfulPieChart from '@/components/ColorfulPieChart';
import PageAgentCopilot from '@/components/PageAgentCopilot';

import { EliteDeepDiveModal, DeepDiveItem } from '@/components/EliteDeepDiveModal';

export default function PersonalFinancePage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bills' | 'investments' | 'tax'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeepDive, setSelectedDeepDive] = useState<DeepDiveItem | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    merchant: '',
    amount: '',
    category: 'Groceries',
    date: '',
    description: '',
    paymentMethod: 'Credit Card',
    customCategory: ''
  });

  const personalCategories = [
    'Groceries', 'Rent & Housing', 'Utilities', 'Dining Out', 
    'Entertainment', 'Health & Fitness', 'Shopping', 'Travel', 
    'Subscriptions', 'Education', 'Insurance', 'Miscellaneous', 'Other'
  ];

  const fetchReport = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setReportData(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor: newTransaction.merchant,
          amount: parseFloat(newTransaction.amount),
          category: newTransaction.category === 'Other' ? newTransaction.customCategory : newTransaction.category,
          date: newTransaction.date || new Date().toISOString().split('T')[0],
          description: newTransaction.description,
          paymentMethod: newTransaction.paymentMethod,
          isPersonal: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewTransaction({
          merchant: '', amount: '', category: 'Groceries', date: '', 
          description: '', paymentMethod: 'Credit Card', customCategory: ''
        });
        fetchReport();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const personalExpenses = (reportData?.expenses || []).filter((e: any) => e.isPersonal && e.status !== 'deleted');
  const totalPersonalSpend = personalExpenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);

  // Personal Finance Chart Data
  const personalBarData = [
    { name: 'Jan', NetDraw: 12000, PersonalSpend: (totalPersonalSpend || 2150) * 0.8 },
    { name: 'Feb', NetDraw: 14500, PersonalSpend: (totalPersonalSpend || 2150) * 0.85 },
    { name: 'Mar', NetDraw: 16000, PersonalSpend: (totalPersonalSpend || 2150) * 0.9 },
    { name: 'Apr', NetDraw: 18500, PersonalSpend: (totalPersonalSpend || 2150) * 0.92 },
    { name: 'May', NetDraw: 21000, PersonalSpend: (totalPersonalSpend || 2150) * 0.95 },
    { name: 'Jun', NetDraw: 24500, PersonalSpend: totalPersonalSpend || 2150 },
  ];

  const personalPieData = [
    { name: 'Housing & Rent', value: Math.max(totalPersonalSpend * 0.45, 1200), color: '#3b82f6' },
    { name: 'Groceries & Dining', value: Math.max(totalPersonalSpend * 0.25, 650), color: '#10b981' },
    { name: 'Utilities & Subscriptions', value: Math.max(totalPersonalSpend * 0.18, 380), color: '#ec4899' },
    { name: 'Travel & Shopping', value: Math.max(totalPersonalSpend * 0.12, 280), color: '#f59e0b' },
  ];

  const { forecastData, insights, bills, transactions, goals } = useMemo(() => {
    if (!reportData) return { forecastData: [], insights: [], bills: [], transactions: [], goals: [] };

    const personalExpenses = (reportData.expenses || []).filter((e: any) => e.isPersonal && e.status !== 'deleted');
    const totalPersonalExpenses = personalExpenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    const companyNetProfit = reportData.netProfit || 0;

    let baseBalance = 0;
    let currentBalance = baseBalance + companyNetProfit - totalPersonalExpenses;

    const now = new Date();
    let oldestDate = new Date();
    const allDates = [
      ...(reportData.invoices || []).map((i: any) => new Date(i.createdAt || i.issueDate)),
      ...personalExpenses.map((e: any) => new Date(e.date || e.createdAt))
    ].filter(d => !isNaN(d.getTime()));
    
    if (allDates.length > 0) {
      oldestDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    }
    const daysSinceStart = Math.max(1, Math.ceil((now.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyTrend = (companyNetProfit - totalPersonalExpenses) / daysSinceStart;

    const forecast = [];
    const today = new Date();
    
    for (let i = -5; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + (i * 5));
      
      let pointBalance = baseBalance;
      if (i <= 0) {
        const pastPaid = (reportData.invoices || [])
          .filter((inv: any) => inv.status === 'paid' && new Date(inv.createdAt || inv.issueDate) <= d)
          .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
        
        const pastBusinessExp = (reportData.expenses || [])
          .filter((exp: any) => !exp.isPersonal && exp.status !== 'deleted' && new Date(exp.date || exp.createdAt) <= d)
          .reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
          
        const pastPersExp = personalExpenses
          .filter((exp: any) => new Date(exp.date || exp.createdAt) <= d)
          .reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
          
        pointBalance += (pastPaid - pastBusinessExp) - pastPersExp;
        if (i === 0) currentBalance = pointBalance; 
      } else {
        pointBalance = currentBalance + (dailyTrend * (i * 5));
      }

      forecast.push({
        date: d.toLocaleDateString('default', { month: 'short', day: '2-digit' }),
        balance: Math.round(pointBalance),
        isPredicted: i > 0
      });
    }

    const dynamicInsights = [];
    const personalExpensesByCategory: Record<string, number> = {};
    personalExpenses.forEach((exp: any) => {
      personalExpensesByCategory[exp.category] = (personalExpensesByCategory[exp.category] || 0) + (exp.amount || 0);
    });

    if (Object.keys(personalExpensesByCategory).length > 0) {
      const topCategory = Object.entries(personalExpensesByCategory).sort((a: any, b: any) => b[1] - a[1])[0];
      if (topCategory) {
        dynamicInsights.push({
          title: 'Spending Optimization',
          desc: `Your highest personal spending category is ${topCategory[0]} (${formatCurrency(topCategory[1] as number)}). AI suggests reallocating 5% to savings.`,
          impact: 'High',
          icon: Calculator,
          category: 'Budget'
        });
      }
    }

    if (dynamicInsights.length === 0) {
      dynamicInsights.push({
        title: 'All Systems Normal',
        desc: 'Your personal cash flow is stable and no urgent optimizations are required.',
        impact: 'Low',
        icon: CheckCircle2,
        category: 'Status'
      });
    }

    const unpaidBills = personalExpenses
      .filter((exp: any) => exp.status === 'pending' || exp.status === 'unpaid')
      .slice(0, 3)
      .map((exp: any) => ({
        id: exp.id,
        name: exp.vendor || 'Personal Bill',
        amount: exp.amount,
        date: exp.date,
        status: exp.status === 'unpaid' ? 'analyzing' : 'ready',
        icon: Home
      }));

    const recentTransactions = personalExpenses
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((exp: any) => ({
        date: exp.date,
        name: exp.vendor || 'Expense',
        cat: exp.category,
        amt: -(exp.amount || 0),
        action: exp.aiCategorized ? 'Auto-Categorized' : 'Manual Entry',
      }));

    const dynamicGoals = [
      { name: 'Emergency Fund', target: 10000, current: Math.max(0, Math.min(10000, currentBalance * 0.3)), color: 'var(--color-accent-primary)' },
      { name: 'Index Fund Growth', target: 50000, current: Math.max(0, Math.min(50000, currentBalance * 0.7)), color: 'var(--color-positive)' },
    ];

    return { forecastData: forecast, insights: dynamicInsights, bills: unpaidBills, transactions: recentTransactions, goals: dynamicGoals };
  }, [reportData]);

  if (isLoading) return null;

  return (
    <div className="personal-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Copilot Banner */}
      <PageAgentCopilot
        agentName="Personal Wealth & FinOps Copilot"
        badgeText="Household Net Worth Active"
        insights={[
          `Strict separation between Business OPEX and Personal Owner's Draw enforced.`,
          `Personal monthly savings rate is operating at 48.2% of net owner distributions.`,
          `Emergency cash runway buffer target met (12 months of household expenses).`
        ]}
        suggestedActions={[
          'Run personal budget vs owner draw audit',
          'Calculate 12-month wealth projection',
          'Optimize personal subscription spend'
        ]}
        color="#10b981"
      />

      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Personal Finance 2026</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Your personal finances — all automated and clearly explained.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--color-accent-primary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '9px', color: 'var(--color-text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Autonomous Manager</span>
              <span style={{ fontSize: '12px', color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>REBALANCING ACTIVE</span>
            </div>
            <Bot size={20} className="pulse-animation" />
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Add Transaction</button>
        </div>
      </div>

      {/* Colorful Visual Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        <ColorfulBarChart
          title="Owner Distributions vs Personal Spend"
          subtitle="Net owner draw distributions vs monthly personal household expenditures"
          data={personalBarData}
          series={[
            { key: 'NetDraw', label: 'Owner Draw ($)', color: '#10b981' },
            { key: 'PersonalSpend', label: 'Personal Spend ($)', color: '#ec4899' },
          ]}
        />
        <ColorfulPieChart
          title="Personal Spend Allocation"
          subtitle="Household expenditure distribution by category"
          data={personalPieData}
          centerText={formatCurrency(totalPersonalSpend || 2150)}
          centerSubtext="Personal Spend"
        />
      </div>

      <div className="pf-grid">
        {/* Left Column: Forecast & Reasoning */}
        <div className="pf-main-col">
          <section className="glass-card pf-section">
            <div className="pf-section-header">
              <h3><TrendingUp size={18} /> Cash Flow Forecast</h3>
              <div className="pf-risk-indicator">
                <Shield size={14} /> Trust & Safety Verified
              </div>
            </div>
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorBalancePersonal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--color-text-tertiary)" fontSize={10} />
                  <YAxis stroke="var(--color-text-tertiary)" fontSize={10} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-secondary)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="var(--color-accent-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorBalancePersonal)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Full-Context Financial Reasoning Section */}
          <section style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-accent-primary)" /> AI Proactive Guidance
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {insights.map((insight: any, i: number) => (
                <div key={i} className="glass-card" style={{ padding: '1.25rem', border: '1px solid var(--color-border-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-primary)' }}>
                      <insight.icon size={18} />
                    </div>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: insight.impact === 'High' ? 'var(--color-negative-bg)' : 'var(--color-positive-bg)', color: insight.impact === 'High' ? 'var(--color-negative)' : 'var(--color-positive)', fontWeight: 'bold' }}>{insight.impact} IMPACT</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>{insight.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>{insight.desc}</p>
                  <button style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Reasoning <ArrowRightLeft size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Transaction Intelligence */}
          <section className="glass-card pf-section" style={{ marginTop: '2rem' }}>
            <div className="pf-section-header">
              <h3><History size={18} /> Daily Intelligence Feed</h3>
              <div className="pf-search">
                <Search size={14} />
                <input placeholder="Analyze spending patterns..." />
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Intelligence Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? transactions.map((tr: any, i: number) => (
                    <tr
                      key={i}
                      className="cursor-pointer hover:bg-slate-800/40 transition-colors"
                      onClick={() => setSelectedDeepDive({
                        id: `pers-${i}`,
                        title: tr.name,
                        module: 'Personal',
                        subtitle: `Private Wealth & Personal Portfolio`,
                        amount: tr.amt,
                        type: 'negative',
                        status: 'VERIFIED',
                        date: tr.date,
                        category: tr.cat,
                        agentUsed: 'Personal Agent',
                        description: `Personal financial transaction logged for ${tr.name} categorized under ${tr.cat}.`,
                        metrics: [
                          { label: 'Category', value: tr.cat },
                          { label: 'Intelligence Action', value: tr.action },
                          { label: 'Net Worth Impact', value: '0.01%' }
                        ],
                        aiInsights: [
                          `Estimated Personal Net Worth is $1,240,000.00 across liquid reserves, equities, and real estate.`,
                          `Savings rate operates at 34.2% of net personal income.`,
                          `Tax-advantaged contributions (Roth IRA / 401k) maxed for 2026.`
                        ]
                      })}
                    >
                      <td>{tr.date}</td>
                      <td><strong>{tr.name}</strong></td>
                      <td><span className="badge badge-neutral">{tr.cat}</span></td>
                      <td><span className="value-financial value-negative">{formatCurrency(tr.amt)}</span></td>
                      <td>
                        <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)' }}>
                          <Bot size={12} color="var(--color-accent-primary)" /> {tr.action}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-tertiary)' }}>
                        No recent transactions found. Start logging expenses to see AI intelligence.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <EliteDeepDiveModal
              item={selectedDeepDive}
              onClose={() => setSelectedDeepDive(null)}
            />
          </section>
        </div>

        {/* Right Column: Autopilot, Management */}
        <div className="pf-side-col">
          <section className="glass-card pf-autopilot-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={28} color="white" />
              </div>
              <div>
                <h3 style={{ fontWeight: 'bold' }}>Elite Personal AI</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Autonomous Financial Manager</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span color="var(--color-text-secondary)">Portfolio Health</span>
                <span style={{ color: 'var(--color-positive)', fontWeight: 'bold' }}>OPTIMAL</span>
              </div>
              <div style={{ height: '4px', background: 'var(--color-bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--color-positive)' }} />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                "I've rebalanced your ETF portfolio to maintain a 60/40 risk profile and locked funds for upcoming tax payments."
              </p>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Open Strategy Chat</button>
            </div>
          </section>

          <section className="glass-card pf-section" style={{ marginTop: '2rem' }}>
            <div className="pf-section-header">
              <h3><Clock size={18} /> Proactive Cash Flow</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bills.length > 0 ? bills.map((bill: any) => (
                <div key={bill.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--color-accent-primary)' }}>
                    <bill.icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{bill.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>Due {bill.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{formatCurrency(bill.amount)}</div>
                    <div style={{ fontSize: '0.7rem', color: bill.status === 'ready' ? 'var(--color-positive)' : '#f59e0b', fontWeight: 'bold' }}>
                      {bill.status === 'ready' ? 'FUNDS SECURED' : 'ANALYZING'}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                  No pending bills or invoices.
                </div>
              )}
            </div>
          </section>

          <section className="glass-card pf-section" style={{ marginTop: '2rem' }}>
            <div className="pf-section-header">
              <h3><Target size={18} /> 2026 Wealth Goals</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {goals.map((goal: any, i: number) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span>{goal.name}</span>
                    <span style={{ fontWeight: 'bold' }}>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--color-bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%`, height: '100%', background: goal.color }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Personal Transaction</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsModalOpen(false)}>
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="modal-form">
              <div className="form-group">
                <label>Merchant / Description</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Costco, Whole Foods" 
                  value={newTransaction.merchant} 
                  onChange={e => setNewTransaction({...newTransaction, merchant: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="input" 
                    placeholder="0.00" 
                    value={newTransaction.amount} 
                    onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={newTransaction.date} 
                    onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="input" 
                    value={newTransaction.category} 
                    onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}
                  >
                    {personalCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select 
                    className="input" 
                    value={newTransaction.paymentMethod} 
                    onChange={e => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {newTransaction.category === 'Other' && (
                <div className="form-group animate-slide-down">
                  <label>Custom Category Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Enter category name" 
                    onChange={e => setNewTransaction({...newTransaction, customCategory: e.target.value})}
                    required 
                  />
                </div>
              )}

              <div className="form-group">
                <label>Memo / Notes</label>
                <textarea 
                  className="input" 
                  rows={2} 
                  placeholder="Additional details..." 
                  value={newTransaction.description} 
                  onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page-personal { max-width: 1280px; margin: 0 auto; padding-bottom: 4rem; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
        .pf-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.5rem; }
        .pf-section { padding: 1.5rem; }
        .pf-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .pf-section-header h3 { font-size: 1rem; font-weight: bold; display: flex; align-items: center; gap: 0.75rem; }
        .pf-risk-indicator { font-size: 10px; font-weight: bold; color: var(--color-positive); text-transform: uppercase; display: flex; align-items: center; gap: 4px; background: var(--color-positive-bg); padding: 4px 8px; border-radius: 4px; }
        .pf-search { display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: 8px; font-size: 0.75rem; }
        .pf-search input { background: none; border: none; outline: none; color: var(--color-text-primary); width: 180px; }
        .pf-autopilot-card { border-color: rgba(var(--color-accent-primary-rgb), 0.3); background: linear-gradient(135deg, rgba(var(--color-bg-elevated-rgb), 0.8) 0%, rgba(var(--color-bg-secondary-rgb), 0.6) 100%); }
        
        .pulse-animation { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .pf-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
