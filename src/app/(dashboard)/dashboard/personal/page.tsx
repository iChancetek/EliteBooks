'use client';

import { useState, useMemo } from 'react';
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
import PersonalAutopilot from '@/components/PersonalAutopilot';

/* ─── Mock Data for 2026 Intelligence ─── */
const mockForecastData = [
  { date: 'May 01', balance: 4250, isPredicted: false },
  { date: 'May 05', balance: 3950, isPredicted: false },
  { date: 'May 10', balance: 4800, isPredicted: false },
  { date: 'May 15', balance: 4400, isPredicted: false },
  { date: 'May 20', balance: 4100, isPredicted: true },
  { date: 'May 25', balance: 3200, isPredicted: true, bills: ['Rent'] },
  { date: 'May 30', balance: 3500, isPredicted: true, income: ['Salary'] },
  { date: 'Jun 05', balance: 3100, isPredicted: true },
  { date: 'Jun 10', balance: 2800, isPredicted: true, risk: 'Overdraft Warning' },
  { date: 'Jun 15', balance: 3400, isPredicted: true },
];

const mockInsights = [
  { 
    title: 'Tax Optimization', 
    desc: 'Potential to save $450 by reallocating to Roth IRA before June deadline.', 
    impact: 'High', 
    icon: Calculator,
    category: 'Tax'
  },
  { 
    title: 'Credit Score Boost', 
    desc: 'Pay down Chase card by $240 to reach 780+ score range.', 
    impact: 'Medium', 
    icon: Trophy,
    category: 'Credit'
  },
  { 
    title: 'ETF Rebalancing', 
    desc: 'VTI/VXUS ratio drifted 4%. Agent recommends 2% adjustment.', 
    impact: 'Medium', 
    icon: LineChart,
    category: 'Investment'
  },
];

const mockBills = [
  { id: '1', name: 'Apartment Rent', amount: 1850, date: '2026-05-25', status: 'ready', icon: Home },
  { id: '2', name: 'Vanguard ETF', amount: 500, date: '2026-06-01', status: 'monitoring', icon: LineChart },
  { id: '3', name: 'Netflix Premium', amount: 19.99, date: '2026-05-20', status: 'unused_risk', icon: Tv },
];

export default function PersonalFinancePage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="page-personal">
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

      <div className="pf-grid">
        {/* Left Column: Forecast & Reasoning */}
        <div className="pf-main-col">
          <section className="glass-card pf-section">
            <div className="pf-section-header">
              <h3><TrendingUp size={18} /> Cash Flow Forecast (2026 Model)</h3>
              <div className="pf-risk-indicator">
                <Shield size={14} /> Trust & Safety Verified
              </div>
            </div>
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockForecastData}>
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
                  <ReferenceLine x="May 15" stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#f59e0b', fontSize: 10 }} />
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
              {mockInsights.map((insight, i) => (
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
                  {[
                    { date: 'Today', name: 'Starbucks', cat: 'Lifestyle', amt: -6.50, action: 'Habit Analysis', status: 'safe' },
                    { date: 'Yesterday', name: 'Vanguard', cat: 'Investment', amt: -500.00, action: 'Auto-Rebalance', status: 'done' },
                    { date: 'Yesterday', name: 'Apartment Rent', cat: 'Essentials', amt: -1850.00, action: 'Cashflow Lock', status: 'done' },
                  ].map((tr, i) => (
                    <tr key={i}>
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
                  ))}
                </tbody>
              </table>
            </div>
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
              {mockBills.map(bill => (
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
              ))}
            </div>
          </section>

          <section className="glass-card pf-section" style={{ marginTop: '2rem' }}>
            <div className="pf-section-header">
              <h3><Target size={18} /> 2026 Wealth Goals</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { name: 'Emergency Fund', target: 10000, current: 4250, color: 'var(--color-accent-primary)' },
                { name: 'Index Fund Growth', target: 50000, current: 12400, color: 'var(--color-positive)' },
              ].map((goal, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span>{goal.name}</span>
                    <span style={{ fontWeight: 'bold' }}>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--color-bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(goal.current / goal.target) * 100}%`, height: '100%', background: goal.color }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

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
