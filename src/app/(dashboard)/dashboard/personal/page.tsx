'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Wallet, Plus, Search, TrendingUp, TrendingDown, DollarSign,
  Coffee, Home, Car, Wifi, Smartphone, ShoppingBag, GraduationCap,
  Dumbbell, Tv, Fuel, Zap, UtensilsCrossed, PartyPopper,
  Bus, CreditCard, BookOpen, X, Trash2, Calendar, ArrowUpRight,
  ArrowDownRight, Bot, Sparkles, AlertTriangle, CheckCircle2, PiggyBank,
  Music, Film, Package, Trophy
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

/* ─── Category Definitions ─── */
const personalCategories = [
  { name: 'Rent / Mortgage', icon: Home, color: '#3b82f6', group: 'essentials' },
  { name: 'Gas & Electric', icon: Zap, color: '#f59e0b', group: 'essentials' },
  { name: 'Mobile', icon: Smartphone, color: '#06b6d4', group: 'essentials' },
  { name: 'Groceries', icon: ShoppingBag, color: '#10b981', group: 'essentials' },
  { name: 'Tuition', icon: GraduationCap, color: '#8b5cf6', group: 'education' },
  { name: 'Textbooks', icon: BookOpen, color: '#6366f1', group: 'education' },
  { name: 'Student Loans', icon: CreditCard, color: '#a855f7', group: 'education' },
  { name: 'Netflix', icon: Tv, color: '#e50914', group: 'subscriptions' },
  { name: 'Hulu', icon: Tv, color: '#1ce783', group: 'subscriptions' },
  { name: 'Spotify', icon: Wifi, color: '#1db954', group: 'subscriptions' },
  { name: 'Apple Music', icon: Music, color: '#fc3c44', group: 'subscriptions' },
  { name: 'Apple One', icon: Smartphone, color: '#333333', group: 'subscriptions' },
  { name: 'Amazon Prime', icon: Package, color: '#00a8e1', group: 'subscriptions' },
  { name: 'Disney+', icon: Film, color: '#113ccf', group: 'subscriptions' },
  { name: 'HBO Max', icon: Film, color: '#5900b3', group: 'subscriptions' },
  { name: 'Sports Subscription', icon: Trophy, color: '#f59e0b', group: 'subscriptions' },
  { name: 'NBA', icon: Trophy, color: '#1d428a', group: 'subscriptions' },
  { name: 'MLB', icon: Trophy, color: '#002d72', group: 'subscriptions' },
  { name: 'NFL', icon: Trophy, color: '#013369', group: 'subscriptions' },
  { name: 'Hockey', icon: Trophy, color: '#000000', group: 'subscriptions' },
  { name: 'Gym', icon: Dumbbell, color: '#f43f5e', group: 'subscriptions' },
  { name: 'Starbucks', icon: Coffee, color: '#00704a', group: 'lifestyle' },
  { name: 'Dunkin\'', icon: Coffee, color: '#ff671f', group: 'lifestyle' },
  { name: 'Dining Out', icon: UtensilsCrossed, color: '#ec4899', group: 'lifestyle' },
  { name: 'Going Out', icon: PartyPopper, color: '#d946ef', group: 'lifestyle' },
  { name: 'Transportation', icon: Bus, color: '#14b8a6', group: 'transportation' },
  { name: 'Car Note', icon: Car, color: '#64748b', group: 'transportation' },
  { name: 'Car Insurance', icon: Car, color: '#475569', group: 'transportation' },
  { name: 'Fuel / Charging', icon: Fuel, color: '#84cc16', group: 'transportation' },
];

const groupLabels: Record<string, string> = {
  essentials: '🏠 Essentials',
  education: '🎓 Education',
  subscriptions: '📺 Subscriptions',
  lifestyle: '☕ Lifestyle',
  transportation: '🚗 Transportation',
};

type ViewPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface PersonalExpense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  group: string;
}

export default function PersonalFinancePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<PersonalExpense[]>([]);
  const [view, setView] = useState<ViewPeriod>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ category: personalCategories[0].name, amount: '', note: '', date: '' });

  // Set default date on client only
  useEffect(() => {
    setNewExpense(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  }, []);

  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ─── Date Filtering ─── */
  const filteredByDate = useMemo(() => {
    const now = new Date();
    return expenses.filter(exp => {
      const d = new Date(exp.date);
      switch (view) {
        case 'daily':
          return d.toDateString() === now.toDateString();
        case 'weekly': {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return d >= weekAgo && d <= now;
        }
        case 'monthly':
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        case 'yearly':
          return d.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [expenses, view]);

  const activeExpenses = selectedGroup
    ? filteredByDate.filter(e => e.group === selectedGroup)
    : filteredByDate;

  const searchedExpenses = activeExpenses.filter(e =>
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.note.toLowerCase().includes(search.toLowerCase())
  );

  /* ─── Stats ─── */
  const totalSpent = filteredByDate.reduce((s, e) => s + e.amount, 0);

  const groupTotals = useMemo(() => {
    const map: Record<string, number> = {};
    filteredByDate.forEach(e => {
      map[e.group] = (map[e.group] || 0) + e.amount;
    });
    return map;
  }, [filteredByDate]);

  const subscriptionTotal = groupTotals['subscriptions'] || 0;

  /* ─── Handlers ─── */
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = personalCategories.find(c => c.name === newExpense.category);
    const entry: PersonalExpense = {
      id: crypto.randomUUID(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      note: newExpense.note,
      group: cat?.group || 'lifestyle',
    };
    setExpenses(prev => [entry, ...prev]);
    setIsModalOpen(false);
    setNewExpense({ category: personalCategories[0].name, amount: '', note: '', date: new Date().toISOString().split('T')[0] });
    showToast('Expense added!');
  };

  const handleDelete = () => {
    setExpenses(prev => prev.filter(e => e.id !== deleteConfirm));
    setDeleteConfirm(null);
    showToast('Expense removed', 'warning');
  };

  /* ─── Render ─── */
  return (
    <div className="page-personal">
      {/* Toast */}
      {toast && (
        <div className="pf-toast animate-fade-in-up" style={{ background: toast.type === 'warning' ? '#f59e0b' : '#10b981' }}>
          {toast.type === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <strong>{toast.message}</strong>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)} style={{ zIndex: 500 }}>
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={48} style={{ color: 'var(--color-warning)', margin: '0 auto var(--space-4)' }} />
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Delete Expense?</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>This action cannot be undone.</p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Personal Expense</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="modal-form">
              <div className="form-group">
                <label>Category</label>
                <select
                  className="input"
                  value={newExpense.category}
                  onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  {Object.entries(groupLabels).map(([key, label]) => (
                    <optgroup key={key} label={label}>
                      {personalCategories.filter(c => c.group === key).map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="input" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Note (optional)</label>
                <input type="text" className="input" placeholder="e.g. Iced latte before class" value={newExpense.note} onChange={e => setNewExpense({ ...newExpense, note: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1><Wallet size={28} style={{ verticalAlign: '-4px', marginRight: '10px', color: 'var(--color-accent-primary)' }} />Personal Finance</h1>
          <p>Track your lifestyle, subscriptions, and everyday spending</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div className="pf-period-toggle">
            {(['daily', 'weekly', 'monthly', 'yearly'] as ViewPeriod[]).map(p => (
              <button key={p} className={`btn btn-sm ${view === p ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView(p)}>
                {p[0].toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="pf-summary">
        <div className="glass-card pf-summary-card">
          <DollarSign size={22} style={{ color: '#f43f5e' }} />
          <span className="pf-val value-financial">{formatCurrency(totalSpent)}</span>
          <span className="pf-lbl">Total {view === 'daily' ? 'Today' : view === 'weekly' ? 'This Week' : view === 'monthly' ? 'This Month' : 'This Year'}</span>
        </div>
        <div className="glass-card pf-summary-card">
          <Tv size={22} style={{ color: '#8b5cf6' }} />
          <span className="pf-val value-financial">{formatCurrency(subscriptionTotal)}</span>
          <span className="pf-lbl">Subscriptions</span>
        </div>
        <div className="glass-card pf-summary-card">
          <Coffee size={22} style={{ color: '#00704a' }} />
          <span className="pf-val value-financial">{formatCurrency(groupTotals['lifestyle'] || 0)}</span>
          <span className="pf-lbl">Lifestyle</span>
        </div>
        <div className="glass-card pf-summary-card">
          <Home size={22} style={{ color: '#3b82f6' }} />
          <span className="pf-val value-financial">{formatCurrency(groupTotals['essentials'] || 0)}</span>
          <span className="pf-lbl">Essentials</span>
        </div>
      </div>

      {/* Group Filter Pills */}
      <div className="pf-groups">
        <button className={`pf-pill ${!selectedGroup ? 'active' : ''}`} onClick={() => setSelectedGroup(null)}>All</button>
        {Object.entries(groupLabels).map(([key, label]) => (
          <button
            key={key}
            className={`pf-pill ${selectedGroup === key ? 'active' : ''}`}
            onClick={() => setSelectedGroup(selectedGroup === key ? null : key)}
          >
            {label}
            {groupTotals[key] ? <span className="pf-pill-amt">{formatCurrency(groupTotals[key])}</span> : null}
          </button>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="pf-cat-grid">
        {personalCategories
          .filter(c => !selectedGroup || c.group === selectedGroup)
          .map(cat => {
            const total = filteredByDate.filter(e => e.category === cat.name).reduce((s, e) => s + e.amount, 0);
            return (
              <div key={cat.name} className="glass-card pf-cat-card">
                <div className="pf-cat-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                  <cat.icon size={16} />
                </div>
                <div className="pf-cat-info">
                  <span className="pf-cat-name">{cat.name}</span>
                  <span className="pf-cat-amt value-financial">{total > 0 ? formatCurrency(total) : '—'}</span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Search */}
      <div className="pf-search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Transactions Table */}
      {searchedExpenses.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {searchedExpenses.map(exp => {
                const cat = personalCategories.find(c => c.name === exp.category);
                return (
                  <tr key={exp.id}>
                    <td>{new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td>
                      <span className="pf-table-cat" style={{ color: cat?.color }}>
                        {cat && <cat.icon size={14} />} {exp.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-tertiary)' }}>{exp.note || '—'}</td>
                    <td><span className="value-financial value-negative">-{formatCurrency(exp.amount)}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setDeleteConfirm(exp.id)} aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pf-empty">
          <PiggyBank size={64} />
          <h3>No expenses yet</h3>
          <p>Add your first expense to start tracking your personal spending.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Your First Expense
          </button>
        </div>
      )}

      {/* AI Insight Banner */}
      {totalSpent > 0 && (
        <div className="pf-ai-banner glass-card">
          <div className="pf-ai-head">
            <Bot size={18} />
            <span>AI Insights</span>
            <div className="ai-badge">GPT-5.5</div>
          </div>
          <div className="pf-ai-body">
            {subscriptionTotal > 0 && (
              <div className="pf-ai-row">
                <Tv size={14} />
                <p>You&apos;re spending <strong>{formatCurrency(subscriptionTotal)}</strong> on subscriptions this period. That&apos;s <strong>{formatCurrency(subscriptionTotal * 12)}/year</strong> — consider auditing for unused services.</p>
              </div>
            )}
            {(groupTotals['lifestyle'] || 0) > 0 && (
              <div className="pf-ai-row">
                <Coffee size={14} />
                <p>Your lifestyle spending is <strong>{formatCurrency(groupTotals['lifestyle'] || 0)}</strong>. {(groupTotals['lifestyle'] || 0) > totalSpent * 0.3 ? 'This is over 30% of your total — consider budgeting.' : 'Looking healthy relative to essentials!'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .page-personal { max-width: 1100px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-8); }
        .page-header h1 { font-size: var(--text-3xl); margin-bottom: var(--space-1); display: flex; align-items: center; }
        .page-header p { color: var(--color-text-secondary); font-size: var(--text-sm); }

        .pf-period-toggle {
          display: flex; gap: var(--space-1); background: var(--color-bg-tertiary);
          padding: 4px; border-radius: var(--radius-md);
        }

        /* Summary */
        .pf-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); margin-bottom: var(--space-8); }
        .pf-summary-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-6); text-align: center; gap: var(--space-2); }
        .pf-val { font-size: var(--text-2xl); color: var(--color-text-primary); font-weight: var(--weight-bold); }
        .pf-lbl { font-size: var(--text-xs); color: var(--color-text-tertiary); font-weight: var(--weight-medium); }

        /* Group Pills */
        .pf-groups { display: flex; gap: var(--space-2); margin-bottom: var(--space-6); flex-wrap: wrap; }
        .pf-pill {
          padding: var(--space-2) var(--space-4); font-size: var(--text-xs); font-weight: var(--weight-medium);
          border-radius: var(--radius-full); border: 1px solid var(--color-border-secondary);
          background: transparent; color: var(--color-text-secondary); cursor: pointer;
          transition: all var(--duration-fast); display: flex; align-items: center; gap: var(--space-2);
          font-family: var(--font-sans);
        }
        .pf-pill:hover { border-color: var(--color-border-accent); color: var(--color-text-primary); }
        .pf-pill.active { background: var(--color-accent-subtle); border-color: var(--color-accent-primary); color: var(--color-accent-primary); }
        .pf-pill-amt { font-family: var(--font-mono); font-size: 10px; opacity: 0.7; }

        /* Category Grid */
        .pf-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-6); }
        .pf-cat-card { padding: var(--space-4); display: flex; align-items: center; gap: var(--space-3); }
        .pf-cat-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); flex-shrink: 0; }
        .pf-cat-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .pf-cat-name { font-size: var(--text-xs); color: var(--color-text-secondary); }
        .pf-cat-amt { font-size: var(--text-sm); font-weight: var(--weight-semibold); }

        /* Search */
        .pf-search-bar {
          display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4);
          background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-md); color: var(--color-text-muted); max-width: 320px; margin-bottom: var(--space-6);
        }
        .pf-search-bar input { background: none; border: none; outline: none; color: var(--color-text-primary); font-size: var(--text-sm); flex: 1; }
        .pf-search-bar input::placeholder { color: var(--color-text-muted); }

        /* Table */
        .pf-table-cat { display: flex; align-items: center; gap: var(--space-2); font-weight: var(--weight-medium); font-size: var(--text-sm); }

        /* Empty State */
        .pf-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 300px; text-align: center; color: var(--color-text-muted); gap: var(--space-4);
        }
        .pf-empty h3 { color: var(--color-text-primary); font-size: var(--text-xl); }
        .pf-empty p { color: var(--color-text-tertiary); max-width: 340px; }

        /* AI Banner */
        .pf-ai-banner { padding: var(--space-6); margin-top: var(--space-8); border-color: rgba(99, 131, 196, 0.3); }
        .pf-ai-head { display: flex; align-items: center; gap: var(--space-2); color: var(--color-accent-primary); font-size: var(--text-xs); font-weight: var(--weight-bold); text-transform: uppercase; margin-bottom: var(--space-5); }
        .ai-badge { margin-left: auto; background: var(--color-accent-primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .pf-ai-body { display: flex; flex-direction: column; gap: var(--space-4); }
        .pf-ai-row { display: flex; gap: var(--space-3); font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }
        .pf-ai-row svg { flex-shrink: 0; color: var(--color-accent-primary); margin-top: 2px; }

        /* Toast */
        .pf-toast {
          position: fixed; bottom: var(--space-6); right: var(--space-6); z-index: 9999;
          color: #fff; padding: var(--space-3) var(--space-5); border-radius: var(--radius-md);
          display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; gap: var(--space-4); }
          .pf-summary { grid-template-columns: repeat(2, 1fr); }
          .pf-cat-grid { grid-template-columns: repeat(2, 1fr); }
          .pf-groups { overflow-x: auto; flex-wrap: nowrap; }
          .pf-period-toggle { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
