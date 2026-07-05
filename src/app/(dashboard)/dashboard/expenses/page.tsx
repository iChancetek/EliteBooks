'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Receipt, Plus, Search, Tag, DollarSign, TrendingDown,
  CreditCard, Coffee, Home, Car, Wifi, ShoppingBag, ArrowDownRight,
  Users, Lock, Sparkles, X, Edit2, Trash2, Share2, Eye, Bot, Zap,
  TrendingUp, Calendar, AlertTriangle, CheckCircle2, Code, Plane, 
  Briefcase, Shield, BookOpen, Activity, MoreHorizontal
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import DateFilter from '@/components/DateFilter';
import { useAuth } from '@/hooks/useAuth';

const categories = [
  { name: 'Office & Supplies', icon: ShoppingBag, color: '#3b82f6', amount: 2840 },
  { name: 'Software & SaaS', icon: Code, color: '#8b5cf6', amount: 4200 },
  { name: 'Meals & Entertainment', icon: Coffee, color: '#ec4899', amount: 1560 },
  { name: 'Travel & Transport', icon: Plane, color: '#f59e0b', amount: 3100 },
  { name: 'Rent & Utilities', icon: Home, color: '#10b981', amount: 5800 },
  { name: 'Marketing', icon: Zap, color: '#f43f5e', amount: 2900 },
  { name: 'Professional Services', icon: Briefcase, color: '#06b6d4', amount: 3500 },
  { name: 'Insurance', icon: Shield, color: '#14b8a6', amount: 1200 },
  { name: 'Training & Education', icon: BookOpen, color: '#6366f1', amount: 850 },
  { name: 'Bank Fees & Interest', icon: CreditCard, color: '#84cc16', amount: 125 },
  { name: 'Subscriptions', icon: Activity, color: '#d946ef', amount: 450 },
  { name: 'Miscellaneous', icon: MoreHorizontal, color: '#64748b', amount: 210 },
];

export default function ExpensesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [newExpense, setNewExpense] = useState({ 
    vendor: '', 
    amount: '', 
    category: 'Office & Supplies', 
    date: '', 
    customCategory: '',
    description: '',
    paymentMethod: 'Credit Card',
    referenceNumber: '',
    isBillable: false,
    customerName: '',
    taxAmount: '0',
    receiptUrl: ''
  });
  
  // Interactive States
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'warning' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2026');

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedYear) params.set('year', selectedYear);
      if (selectedMonth) params.set('month', selectedMonth);
      const res = await fetch(`/api/expenses?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const activeExpenses = expenses;

  const activeCategories = categories.map(c => {
    const total = activeExpenses.filter(e => e.category === c.name).reduce((sum, e) => sum + e.amount, 0);
    return { ...c, amount: total };
  }).sort((a, b) => b.amount - a.amount);

  const showToast = (message: string, type: 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAction = (action: string) => {
    console.log('ACTION CLICKED:', action);
    showToast(`${action} action triggered for ${selectedExpense?.vendor}`, 'info');
    setSelectedExpense(null);
  };

  const handleSoftDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await fetch(`/api/expenses/${deleteConfirm}`, { method: 'DELETE' });
      setExpenses(prev => prev.filter(e => e.id !== deleteConfirm));
      setDeleteConfirm(null);
      setSelectedExpense(null);
      showToast('Expense soft deleted. You have 30 days to recover this item.', 'warning');
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  // Set date on client only to prevent hydration mismatch
  useEffect(() => {
    setNewExpense(prev => ({ 
      ...prev, 
      date: new Date().toISOString().split('T')[0] 
    }));
  }, []);

  const totalExpenses = activeExpenses.reduce((s, e) => s + (e.amount || 0), 0);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = newExpense.category === 'Other' ? newExpense.customCategory : newExpense.category;
    
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newExpense.date,
          vendor: newExpense.vendor,
          amount: parseFloat(newExpense.amount),
          category: finalCategory,
          description: newExpense.description || 'Manually added expense',
          paymentMethod: newExpense.paymentMethod,
          referenceNumber: newExpense.referenceNumber,
          isBillable: newExpense.isBillable,
          customerName: newExpense.isBillable ? newExpense.customerName : '',
          taxAmount: parseFloat(newExpense.taxAmount || '0'),
          receiptUrl: newExpense.receiptUrl
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExpenses(prev => [data.data, ...prev]);
        setIsModalOpen(false);
        setNewExpense({ 
          vendor: '', 
          amount: '', 
          category: 'Office & Supplies', 
          date: new Date().toISOString().split('T')[0], 
          customCategory: '',
          description: '',
          paymentMethod: 'Credit Card',
          referenceNumber: '',
          isBillable: false,
          customerName: '',
          taxAmount: '0',
          receiptUrl: ''
        });
        showToast('Expense added successfully');
      }
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  return (
    <div className="page-expenses">
      {/* Expense Detail Drawer */}
      {selectedExpense && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedExpense(null)} />
          <aside className="exp-drawer animate-slide-in-right" style={{ zIndex: 401 }}>
            <div className="exp-drawer-header">
              <div className="exp-drawer-title">
                <div className="exp-cat-icon" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent-primary)' }}>
                  <Receipt size={18} />
                </div>
                <div>
                  <h2>Expense Details</h2>
                  <span>ID: {selectedExpense.id}</span>
                </div>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setSelectedExpense(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="exp-drawer-content">
              <div className="exp-detail-hero">
                <span className="exp-detail-vendor">{selectedExpense.vendor}</span>
                <span className="exp-detail-amount value-financial value-negative">-{formatCurrency(selectedExpense.amount)}</span>
                <span className={`badge ${selectedExpense.status === 'approved' ? 'badge-positive' : 'badge-warning'}`}>
                  {selectedExpense.status === 'approved' ? 'Approved' : 'Pending Review'}
                </span>
              </div>

              <div className="exp-detail-grid">
                <div className="exp-detail-item">
                  <Calendar size={14} />
                  <div>
                    <label>Date</label>
                    <span>{formatDate(selectedExpense.date, 'long')}</span>
                  </div>
                </div>
                <div className="exp-detail-item">
                  <Tag size={14} />
                  <div>
                    <label>Category</label>
                    <span>{selectedExpense.category}</span>
                  </div>
                </div>
                <div className="exp-detail-item">
                  <CreditCard size={14} />
                  <div>
                    <label>Payment Method</label>
                    <span>Chase Visa (*4242)</span>
                  </div>
                </div>
                <div className="exp-detail-item">
                  <TrendingUp size={14} />
                  <div>
                    <label>Recurrence</label>
                    <span>{selectedExpense.recurrance}</span>
                  </div>
                </div>
              </div>

              <div className="exp-detail-desc">
                <label>Description</label>
                <p>{selectedExpense.description}</p>
              </div>

              {/* Agentic AI Forecasting Section */}
              <div className="exp-ai-forecast glass-card">
                <div className="exp-ai-header">
                  <Bot size={18} />
                  <span>Agentic AI Insights</span>
                  <div className="ai-badge">GPT-5.4 Mini</div>
                </div>
                <div className="exp-ai-body">
                  <div className="ai-insight">
                    <Zap size={14} />
                    <p>This is a <strong>{selectedExpense.recurrance.toLowerCase()}</strong> expense. I forecast a total spend of <strong>{formatCurrency(selectedExpense.amount * 12)}</strong> over the next 12 months.</p>
                  </div>
                  <div className="ai-insight">
                    <TrendingUp size={14} />
                    <p>This vendor (<strong>{selectedExpense.vendor}</strong>) costs <strong>12% more</strong> than the market average for similar services. Consider renegotiating.</p>
                  </div>
                  {selectedExpense.amount > 1000 && (
                    <div className="ai-insight warning">
                      <AlertTriangle size={14} />
                      <p>High-value transaction detected. I have flagged this for your quarterly tax deduction strategy.</p>
                    </div>
                  )}
                </div>
                <div className="exp-ai-footer">
                  <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    Generate Detailed Forecast
                  </button>
                </div>
              </div>

              <div className="exp-drawer-actions">
                <button className="btn btn-secondary" onClick={() => handleAction('Edit')}><Edit2 size={16} /> Edit</button>
                <button className="btn btn-secondary" onClick={() => handleAction('Share')}><Share2 size={16} /> Share</button>
                <button className="btn btn-secondary" onClick={() => handleAction('Review')}><Eye size={16} /> Review</button>
                <button className="btn btn-danger" onClick={() => setDeleteConfirm(selectedExpense.id)}><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)} style={{ zIndex: 500 }}>
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={48} style={{ color: 'var(--color-warning)', margin: '0 auto var(--space-4)' }} />
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Delete Expense?</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
              Are you sure you want to delete this expense? This will perform a soft delete. You will have <strong>30 days</strong> to recover it from the trash before it is permanently erased.
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleSoftDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div 
          className={`toast animate-fade-in-up`} 
          style={{ 
            zIndex: 9999, 
            background: toast.type === 'warning' ? '#f59e0b' : '#3b82f6', 
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {toast.type === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <strong>{toast.message}</strong>
        </div>
      )}

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Expense</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsModalOpen(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleAddExpense} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Vendor</label>
                  <input type="text" className="input" placeholder="e.g. AWS, Uber" value={newExpense.vendor} onChange={e => setNewExpense({...newExpense, vendor: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="input" 
                    value={newExpense.category} 
                    onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    <option value="Other">Other...</option>
                  </select>
                </div>
              </div>
              
              {newExpense.category === 'Other' && (
                <div className="form-group animate-slide-down">
                  <label>Custom Category Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Enter category name" 
                    onChange={e => setNewExpense({...newExpense, customCategory: e.target.value})}
                    required 
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tax Amount</label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" value={newExpense.taxAmount} onChange={e => setNewExpense({...newExpense, taxAmount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="input" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select 
                    className="input" 
                    value={newExpense.paymentMethod} 
                    onChange={e => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Reference / Check #</label>
                  <input type="text" className="input" placeholder="e.g. #1024" value={newExpense.referenceNumber} onChange={e => setNewExpense({...newExpense, referenceNumber: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '28px' }}>
                  <input 
                    type="checkbox" 
                    id="isBillable" 
                    checked={newExpense.isBillable} 
                    onChange={e => setNewExpense({...newExpense, isBillable: e.target.checked})} 
                  />
                  <label htmlFor="isBillable" style={{ margin: 0, cursor: 'pointer' }}>Billable to Customer</label>
                </div>
                {newExpense.isBillable && (
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input type="text" className="input" placeholder="e.g. Acme Corp" value={newExpense.customerName} onChange={e => setNewExpense({...newExpense, customerName: e.target.value})} required={newExpense.isBillable} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description / Notes</label>
                <textarea className="input" rows={2} placeholder="Add a memo..." value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Receipt URL or Reference</label>
                <input type="text" className="input" placeholder="https://example.com/receipt.pdf" value={newExpense.receiptUrl} onChange={e => setNewExpense({...newExpense, receiptUrl: e.target.value})} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>AI automatically tracks, categorizes, and reconciles your expenses</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <DateFilter 
            initialMonth={selectedMonth} 
            initialYear={selectedYear} 
            onDateChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }} 
          />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="exp-categories">
        <div className="glass-card exp-total-card">
          <DollarSign size={22} style={{ color: '#f43f5e' }} />
          <span className="exp-total-value value-financial">{formatCurrency(totalExpenses)}</span>
          <span className="exp-total-label">Total This Period</span>
          <span className="exp-total-change">
            <ArrowDownRight size={14} /> 3.8% vs last month
          </span>
        </div>
        <div className="exp-cat-grid">
          {activeCategories.map(cat => (
            <div 
              key={cat.name} 
              className={`glass-card exp-cat-card ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              style={{ cursor: 'pointer', borderColor: selectedCategory === cat.name ? cat.color : undefined }}
            >
              <div className="exp-cat-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                <cat.icon size={16} />
              </div>
              <div className="exp-cat-info">
                <span className="exp-cat-name">{cat.name}</span>
                <span className="exp-cat-amount value-financial">{formatCurrency(cat.amount)}</span>
              </div>
              <div className="exp-cat-bar">
                <div className="exp-cat-bar-fill" style={{ width: `${(cat.amount / totalExpenses) * 100}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="exp-filters">
        <div className="inv-search">
          <Search size={16} />
          <input type="text" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Transactions */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vendor</th>
              <th>Category</th>
              <th>Amount</th>
              <th>AI Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeExpenses
              .filter(e => e.vendor.toLowerCase().includes(search.toLowerCase()))
              .filter(e => !selectedCategory || e.category === selectedCategory)
              .map(exp => (
              <tr 
                key={exp.id} 
                onClick={() => {
                  console.log('Expense clicked:', exp.vendor);
                  setSelectedExpense(exp);
                }} 
                style={{ cursor: 'pointer' }}
              >
                <td>{formatDate(exp.date, 'short')}</td>
                <td><strong style={{ color: 'var(--color-text-primary)' }}>{exp.vendor}</strong></td>
                <td>
                  <span className="badge badge-neutral"><Tag size={10} /> {exp.category}</span>
                </td>
                <td><span className="value-financial value-negative">-{formatCurrency(exp.amount)}</span></td>
                <td>
                  <span className={`exp-confidence ${exp.confidence >= 0.95 ? 'high' : exp.confidence >= 0.9 ? 'medium' : 'low'}`}>
                    {(exp.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td>
                  <span className={`badge ${exp.status === 'approved' ? 'badge-positive' : 'badge-warning'}`}>
                    {exp.status === 'approved' ? 'Approved' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .page-expenses { max-width: 1100px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-8); }
        .page-header h1 { font-size: var(--text-3xl); margin-bottom: var(--space-1); }
        .page-header p { color: var(--color-text-secondary); font-size: var(--text-sm); }

        .exp-categories { display: grid; grid-template-columns: 220px 1fr; gap: var(--space-6); margin-bottom: var(--space-8); }
        .exp-total-card {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: var(--space-8); text-align: center; gap: var(--space-2);
        }
        .exp-total-value { font-size: var(--text-3xl); color: var(--color-text-primary); }
        .exp-total-label { font-size: var(--text-xs); color: var(--color-text-tertiary); }
        .exp-total-change { font-size: var(--text-xs); color: var(--color-positive); display: flex; align-items: center; gap: 2px; }

        .exp-cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
        .exp-cat-card { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
        .exp-cat-card > div:first-child { display: flex; align-items: center; gap: var(--space-3); }
        .exp-cat-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); flex-shrink: 0; }
        .exp-cat-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
        .exp-cat-name { font-size: var(--text-xs); color: var(--color-text-secondary); }
        .exp-cat-amount { font-size: var(--text-sm); }
        .exp-cat-bar { height: 3px; background: var(--color-bg-tertiary); border-radius: 2px; }
        .exp-cat-bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s var(--ease-out-expo); }

        .exp-filters { margin-bottom: var(--space-6); }
        .inv-search { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4); background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: var(--radius-md); color: var(--color-text-muted); max-width: 300px; }
        .inv-search input { background: none; border: none; outline: none; color: var(--color-text-primary); font-size: var(--text-sm); flex: 1; }
        .inv-search input::placeholder { color: var(--color-text-muted); }

        .exp-confidence { font-size: var(--text-xs); font-weight: var(--weight-semibold); font-family: var(--font-mono); }
        .exp-confidence.high { color: var(--color-positive); }
        .exp-confidence.medium { color: var(--color-warning); }
        .exp-confidence.low { color: var(--color-negative); }

        .exp-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 440px; background: var(--color-bg-secondary);
          z-index: var(--z-modal); box-shadow: var(--shadow-xl);
          display: flex; flex-direction: column;
          border-left: 1px solid var(--color-border-primary);
        }
        .exp-drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--space-6); border-bottom: 1px solid var(--color-border-secondary);
        }
        .exp-drawer-title { display: flex; align-items: center; gap: var(--space-4); }
        .exp-drawer-title h2 { font-size: var(--text-lg); margin-bottom: 2px; }
        .exp-drawer-title span { font-size: var(--text-xs); color: var(--color-text-tertiary); font-family: var(--font-mono); }

        .exp-drawer-content { flex: 1; overflow-y: auto; padding: var(--space-8); }
        
        .exp-detail-hero { text-align: center; margin-bottom: var(--space-10); display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
        .exp-detail-vendor { font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-text-primary); }
        .exp-detail-amount { font-size: var(--text-4xl); margin: var(--space-2) 0; }

        .exp-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); margin-bottom: var(--space-10); }
        .exp-detail-item { display: flex; align-items: flex-start; gap: var(--space-3); color: var(--color-text-tertiary); }
        .exp-detail-item label { font-size: var(--text-xs); font-weight: var(--weight-semibold); display: block; text-transform: uppercase; margin-bottom: 4px; color: var(--color-text-muted); }
        .exp-detail-item span { font-size: var(--text-sm); color: var(--color-text-secondary); font-weight: var(--weight-medium); }

        .exp-detail-desc { margin-bottom: var(--space-10); }
        .exp-detail-desc label { font-size: var(--text-xs); font-weight: var(--weight-semibold); text-transform: uppercase; color: var(--color-text-muted); display: block; margin-bottom: var(--space-3); }
        .exp-detail-desc p { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; }

        .exp-ai-forecast { padding: var(--space-6); margin-bottom: var(--space-10); border-color: rgba(99, 131, 196, 0.3); }
        .exp-ai-header { display: flex; align-items: center; gap: var(--space-2); color: var(--color-accent-primary); font-size: var(--text-xs); font-weight: var(--weight-bold); text-transform: uppercase; margin-bottom: var(--space-5); }
        .ai-badge { margin-left: auto; background: var(--color-accent-primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .exp-ai-body { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6); }
        .ai-insight { display: flex; gap: var(--space-3); font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }
        .ai-insight svg { flex-shrink: 0; color: var(--color-accent-primary); margin-top: 2px; }
        .ai-insight.warning svg { color: var(--color-warning); }

        .exp-drawer-actions { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); border-top: 1px solid var(--color-border-secondary); padding-top: var(--space-8); }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; gap: var(--space-4); }
          .exp-categories { grid-template-columns: 1fr; }
          .exp-cat-grid { grid-template-columns: 1fr; }
          .exp-drawer { width: 100%; }
        }
      `}</style>
    </div>
  );
}
