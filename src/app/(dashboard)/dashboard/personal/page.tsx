'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Wallet, Plus, Search, TrendingUp, TrendingDown, DollarSign,
  Coffee, Home, Car, Wifi, Smartphone, ShoppingBag, GraduationCap,
  BookOpen, X, Trash2, Calendar, ArrowUpRight,
  ArrowDownRight, Bot, Sparkles, AlertTriangle, CheckCircle2, PiggyBank,
  Music, Film, Package, Trophy, CreditCard, Zap, Shield, History,
  Info, BarChart3, Target, Clock, ArrowRightLeft, Eye, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import PersonalAutopilot from '@/components/PersonalAutopilot';

/* ─── Mock Data for AI Features ─── */
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

const mockBills = [
  { id: '1', name: 'Apartment Rent', amount: 1850, date: '2026-05-25', status: 'ready', icon: Home },
  { id: '2', name: 'Car Payment', amount: 420, date: '2026-06-02', status: 'monitoring', icon: Car },
  { id: '3', name: 'Netflix Premium', amount: 19.99, date: '2026-05-20', status: 'unused_risk', icon: Tv },
];

const mockGoals = [
  { id: '1', name: 'Emergency Fund', target: 10000, current: 4250, color: '#3b82f6' },
  { id: '2', name: 'Europe Trip', target: 5000, current: 1200, color: '#8b5cf6' },
];

const personalCategories = [
  { name: 'Rent / Mortgage', icon: Home, color: '#3b82f6', group: 'essentials' },
  { name: 'Gas & Electric', icon: Zap, color: '#f59e0b', group: 'essentials' },
  { name: 'Mobile', icon: Smartphone, color: '#06b6d4', group: 'essentials' },
  { name: 'Groceries', icon: ShoppingBag, color: '#10b981', group: 'essentials' },
  { name: 'Tuition', icon: GraduationCap, color: '#8b5cf6', group: 'education' },
  { name: 'Netflix', icon: Tv, color: '#e50914', group: 'subscriptions' },
  { name: 'Starbucks', icon: Coffee, color: '#00704a', group: 'lifestyle' },
  { name: 'Dining Out', icon: UtensilsCrossed, color: '#ec4899', group: 'lifestyle' },
];

// ... (existing category definitions if needed, truncated for brevity)

export default function PersonalFinancePage() {
  const { user } = useAuth();
  const [view, setView] = useState('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="page-personal">
      <div className="page-header">
        <div>
          <h1>Personal FinOps</h1>
          <p>AI Financial Autopilot • Predicting & protecting your money</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary"><Download size={16} /> Export Reports</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Add Transaction</button>
        </div>
      </div>

      <div className="pf-grid">
        {/* Left Column: Forecast & Transactions */}
        <div className="pf-main-col">
          <section className="glass-card pf-section">
            <div className="pf-section-header">
              <h3><TrendingUp size={18} /> Cash Flow Forecast (60 Days)</h3>
              <div className="pf-risk-indicator">
                <CheckCircle2 size={14} /> Healthy Forecast
              </div>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={mockForecastData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--color-text-tertiary)" fontSize={10} />
                  <YAxis stroke="var(--color-text-tertiary)" fontSize={10} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-secondary)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="var(--color-accent-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                    strokeWidth={2}
                  />
                  <ReferenceLine x="May 15" stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#f59e0b', fontSize: 10 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.forecastInsights}>
              <div className={styles.insight}>
                <span className={styles.insightLabel}>Predicted Balance (30d)</span>
                <span className={styles.insightValue}>$3,500.00</span>
              </div>
              <div className={styles.insight}>
                <span className={styles.insightLabel}>Upcoming Large Bill</span>
                <span className={styles.insightValue} style={{ color: '#f59e0b' }}>Rent ($1,850)</span>
              </div>
              <div className={styles.insight}>
                <span className={styles.insightLabel}>Savings Potential</span>
                <span className={styles.insightValue} style={{ color: '#10b981' }}>+$450.00</span>
              </div>
            </div>
          </section>

          <section className="glass-card pf-section" style={{ marginTop: 'var(--space-6)' }}>
            <div className="pf-section-header">
              <h3><History size={18} /> Daily Transaction Intelligence</h3>
              <div className="pf-search">
                <Search size={14} />
                <input placeholder="Search transactions..." />
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
                    <th>Agent Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Today', name: 'Starbucks', cat: 'Lifestyle', amt: -6.50, action: 'Budget Check', status: 'safe' },
                    { date: 'Yesterday', name: 'Main Rent', cat: 'Essentials', amt: -1850.00, action: 'Auto-Paid', status: 'done' },
                    { date: 'Yesterday', name: 'Amazon Prime', cat: 'Subscriptions', amt: -14.99, action: 'Monitored', status: 'safe' },
                  ].map((tr, i) => (
                    <tr key={i}>
                      <td>{tr.date}</td>
                      <td><strong>{tr.name}</strong></td>
                      <td><span className="badge badge-neutral">{tr.cat}</span></td>
                      <td><span className="value-financial value-negative">{formatCurrency(tr.amt)}</span></td>
                      <td>
                        <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)' }}>
                          <Bot size={12} /> {tr.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Autopilot, Bills, Goals */}
        <div className="pf-side-col">
          <section className="glass-card pf-autopilot-card">
            <PersonalAutopilot />
          </section>

          <section className="glass-card pf-section" style={{ marginTop: 'var(--space-6)' }}>
            <div className="pf-section-header">
              <h3><Clock size={18} /> Smart Bill Manager</h3>
            </div>
            <div className={styles.billList}>
              {mockBills.map(bill => (
                <div key={bill.id} className={styles.billItem}>
                  <div className={styles.billIcon}>
                    <bill.icon size={16} />
                  </div>
                  <div className={styles.billInfo}>
                    <span className={styles.billName}>{bill.name}</span>
                    <span className={styles.billDate}>Due {new Date(bill.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className={styles.billStatus}>
                    <span className="value-financial">{formatCurrency(bill.amount)}</span>
                    <span className={styles.statusLabel} style={{ color: bill.status === 'ready' ? '#10b981' : '#f59e0b' }}>
                      {bill.status === 'ready' ? 'Funds Secured' : bill.status === 'unused_risk' ? 'Flagged Leak' : 'Monitoring'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card pf-section" style={{ marginTop: 'var(--space-6)' }}>
            <div className="pf-section-header">
              <h3><Target size={18} /> Financial Goals</h3>
            </div>
            <div className={styles.goalList}>
              {mockGoals.map(goal => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className={styles.goalItem}>
                    <div className={styles.goalHeader}>
                      <span>{goal.name}</span>
                      <span className="value-financial">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${progress}%`, background: goal.color }} 
                      />
                    </div>
                    <div className={styles.goalFooter}>
                      <Bot size={12} />
                      <span>Agent saving {formatCurrency(150)}/mo automatically</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .page-personal { max-width: 1280px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-8); }
        .page-header h1 { font-size: var(--text-3xl); margin-bottom: var(--space-1); }
        .page-header p { color: var(--color-text-secondary); font-size: var(--text-sm); }

        .pf-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-6); }
        .pf-section { padding: var(--space-6); }
        .pf-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-6); }
        .pf-section-header h3 { font-size: var(--text-base); font-weight: var(--weight-bold); display: flex; align-items: center; gap: var(--space-3); }
        
        .pf-risk-indicator { font-size: 10px; font-weight: var(--weight-bold); color: #10b981; text-transform: uppercase; display: flex; align-items: center; gap: 4px; background: rgba(16, 185, 129, 0.1); padding: 4px 8px; border-radius: 4px; }
        
        .pf-search { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-1) var(--space-3); background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: var(--radius-md); font-size: var(--text-xs); color: var(--color-text-muted); }
        .pf-search input { background: none; border: none; outline: none; color: var(--color-text-primary); width: 140px; }

        .pf-autopilot-card { padding: var(--space-6); border-color: rgba(59, 130, 246, 0.3); background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%); }

        /* Chart Insights */
        .${styles.forecastInsights} { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-top: var(--space-6); padding-top: var(--space-6); border-top: 1px solid var(--color-border-secondary); }
        .${styles.insight} { display: flex; flex-direction: column; gap: 4px; }
        .${styles.insightLabel} { font-size: 10px; color: var(--color-text-tertiary); text-transform: uppercase; font-weight: var(--weight-bold); }
        .${styles.insightValue} { font-size: var(--text-sm); font-weight: var(--weight-bold); font-family: var(--font-mono); }

        /* Bill List */
        .${styles.billList} { display: flex; flex-direction: column; gap: var(--space-4); }
        .${styles.billItem} { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3); background: rgba(255,255,255,0.02); border-radius: var(--radius-lg); }
        .${styles.billIcon} { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: var(--radius-md); color: var(--color-accent-primary); }
        .${styles.billInfo} { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .${styles.billName} { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
        .${styles.billDate} { font-size: 10px; color: var(--color-text-tertiary); }
        .${styles.billStatus} { text-align: right; display: flex; flex-direction: column; gap: 2px; }
        .${styles.statusLabel} { font-size: 9px; font-weight: var(--weight-bold); text-transform: uppercase; }

        /* Goal List */
        .${styles.goalList} { display: flex; flex-direction: column; gap: var(--space-5); }
        .${styles.goalHeader} { display: flex; justify-content: space-between; font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-secondary); margin-bottom: var(--space-2); }
        .${styles.progressBar} { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
        .${styles.progressFill} { height: 100%; transition: width 1s ease-out; }
        .${styles.goalFooter} { display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--color-text-tertiary); margin-top: var(--space-2); }

        @media (max-width: 1024px) {
          .pf-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
