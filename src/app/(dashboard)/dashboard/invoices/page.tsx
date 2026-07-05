'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText, Plus, Search, Filter, Send, Eye, MoreHorizontal,
  DollarSign, Clock, CheckCircle2, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice } from '@/types/accounting';
import { useAuth } from '@/hooks/useAuth';
import DateFilter from '@/components/DateFilter';
import InvoiceEditor from '@/components/InvoiceEditor';

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', class: 'badge-neutral', icon: FileText },
  sent: { label: 'Sent', class: 'badge-accent', icon: Send },
  viewed: { label: 'Viewed', class: 'badge-accent', icon: Eye },
  paid: { label: 'Paid', class: 'badge-positive', icon: CheckCircle2 },
  overdue: { label: 'Overdue', class: 'badge-negative', icon: AlertTriangle },
  void: { label: 'Void', class: 'badge-neutral', icon: FileText },
  partial: { label: 'Partial', class: 'badge-warning', icon: Clock },
};

export default function InvoicesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const token = await user.getIdToken();
      const params = new URLSearchParams();
      if (selectedYear) params.set('year', selectedYear);
      if (selectedMonth) params.set('month', selectedMonth);

      const res = await fetch(`/api/invoices?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(invoiceData),
      });
      const data = await res.json();
      if (data.success) {
        setInvoices(prev => [data.data, ...prev]);
        setIsModalOpen(false);
      } else {
        console.error('Invoice save failed:', data.error);
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch = (inv.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.number || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices.filter(i => i.status !== 'paid' && i.status !== 'void').reduce((s, i) => s + (i.amountDue || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);

  return (
    <div className="page-invoices">
      {/* New Invoice Editor */}
      {isModalOpen && (
        <InvoiceEditor 
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvoice}
        />
      )}

      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p>AI-powered smart invoicing, tracking, and automated reminders</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <DateFilter 
            initialMonth={selectedMonth} 
            initialYear={selectedYear} 
            onDateChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }} 
          />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Create Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="inv-summary">
        <div className="glass-card inv-summary-card">
          <DollarSign size={18} style={{ color: '#f59e0b' }} />
          <div>
            <span className="inv-summary-value value-financial">{formatCurrency(totalOutstanding)}</span>
            <span className="inv-summary-label">Outstanding</span>
          </div>
        </div>
        <div className="glass-card inv-summary-card">
          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          <div>
            <span className="inv-summary-value value-financial value-positive">{formatCurrency(totalPaid)}</span>
            <span className="inv-summary-label">Collected</span>
          </div>
        </div>
        <div className="glass-card inv-summary-card">
          <AlertTriangle size={18} style={{ color: '#f43f5e' }} />
          <div>
            <span className="inv-summary-value value-financial value-negative">{formatCurrency(invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amountDue || 0), 0))}</span>
            <span className="inv-summary-label">Overdue</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="inv-filters">
        <div className="inv-search">
          <Search size={16} />
          <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="inv-filter-pills">
          {['all', 'sent', 'viewed', 'paid', 'overdue'].map(s => (
            <button key={s} className={`inv-filter-pill ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
              {s === 'all' ? 'All' : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>Loading invoices...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>No invoices yet. Click &quot;Create Invoice&quot; to get started.</td></tr>
            ) : filtered.map((inv) => {
              const sc = statusConfig[inv.status] || statusConfig.draft;
              return (
                <tr key={inv.id}>
                  <td><strong style={{ color: 'var(--color-text-primary)' }}>{inv.number}</strong></td>
                  <td>{inv.clientName}</td>
                  <td><span className="value-financial">{formatCurrency(inv.total)}</span></td>
                  <td>
                    <span className={`badge ${sc.class}`}>
                      <sc.icon size={12} /> {sc.label}
                    </span>
                  </td>
                  <td>{formatDate(inv.dueDate, 'short')}</td>
                  <td>
                    <button className="btn btn-ghost btn-icon" aria-label="More actions">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .page-invoices { max-width: 1100px; }
        .page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: var(--space-8);
        }
        .page-header h1 { font-size: var(--text-3xl); margin-bottom: var(--space-1); }
        .page-header p { color: var(--color-text-secondary); font-size: var(--text-sm); }

        .inv-summary {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4); margin-bottom: var(--space-8);
        }
        .inv-summary-card {
          display: flex; align-items: center; gap: var(--space-4);
          padding: var(--space-5) var(--space-6);
        }
        .inv-summary-value { display: block; font-size: var(--text-xl); }
        .inv-summary-label { font-size: var(--text-xs); color: var(--color-text-tertiary); font-weight: var(--weight-medium); }

        .inv-filters {
          display: flex; align-items: center; gap: var(--space-4);
          margin-bottom: var(--space-6);
        }
        .inv-search {
          display: flex; align-items: center; gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          flex: 1; max-width: 300px;
        }
        .inv-search input {
          background: none; border: none; outline: none;
          color: var(--color-text-primary); font-size: var(--text-sm); flex: 1;
        }
        .inv-search input::placeholder { color: var(--color-text-muted); }
        .inv-filter-pills { display: flex; gap: var(--space-2); }
        .inv-filter-pill {
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-xs); font-weight: var(--weight-medium);
          border-radius: var(--radius-full); border: 1px solid var(--color-border-secondary);
          background: transparent; color: var(--color-text-secondary);
          cursor: pointer; transition: all var(--duration-fast);
          font-family: var(--font-sans);
        }
        .inv-filter-pill:hover { border-color: var(--color-border-accent); color: var(--color-text-primary); }
        .inv-filter-pill.active {
          background: var(--color-accent-subtle);
          border-color: var(--color-accent-primary);
          color: var(--color-accent-primary);
        }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; gap: var(--space-4); }
          .inv-summary { grid-template-columns: 1fr; }
          .inv-filters { flex-direction: column; align-items: stretch; }
          .inv-search { max-width: none; }
          .inv-filter-pills { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}
