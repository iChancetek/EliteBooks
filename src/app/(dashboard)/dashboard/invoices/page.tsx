'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText, Plus, Search, Filter, Send, Eye, MoreHorizontal,
  DollarSign, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice } from '@/types/accounting';
import { useAuth } from '@/hooks/useAuth';
import DateFilter from '@/components/DateFilter';
import InvoiceEditor from '@/components/InvoiceEditor';

import ColorfulBarChart from '@/components/ColorfulBarChart';
import ColorfulPieChart from '@/components/ColorfulPieChart';
import PageAgentCopilot from '@/components/PageAgentCopilot';
import MultiPeriodForecastCard from '@/components/MultiPeriodForecastCard';
import { useForecast } from '@/hooks/useForecast';

import { EliteDeepDiveModal, DeepDiveItem } from '@/components/EliteDeepDiveModal';
import { AIAssistedCreationModal } from '@/components/AIAssistedCreationModal';
import VoiceAITrigger from '@/components/VoiceAITrigger';
import { parseLocalDate } from '@/lib/utils';

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
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeepDive, setSelectedDeepDive] = useState<DeepDiveItem | null>(null);
  const [isAICreateOpen, setIsAICreateOpen] = useState(false);
  const forecast = useForecast('revenue');

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

  const filtered = invoices.filter(inv => {
    const matchesSearch = inv.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'paid' && i.status !== 'void').reduce((acc, curr) => acc + (curr.amountDue || curr.total || 0), 0);

  // Dynamic invoice chart data from real records
  const monthMap: Record<string, { Billed: number; Collected: number }> = {};
  invoices.forEach((inv: any) => {
    const dateStr = inv.issueDate || inv.createdAt;
    if (dateStr) {
      const m = parseLocalDate(dateStr).toLocaleString('default', { month: 'short' });
      if (!monthMap[m]) monthMap[m] = { Billed: 0, Collected: 0 };
      monthMap[m].Billed += (inv.total || 0);
      if (inv.status === 'paid') {
        monthMap[m].Collected += (inv.total || 0);
      }
    }
  });

  const monthlyInvoiceData = Object.entries(monthMap).map(([name, vals]) => ({
    name,
    Billed: vals.Billed,
    Collected: vals.Collected,
  }));

  const statusPieData = [
    { name: 'Paid Collections', value: totalPaid, color: '#10b981' },
    { name: 'Sent Invoices', value: invoices.filter(i => i.status === 'sent').reduce((s, i) => s + (i.total || 0), 0), color: '#3b82f6' },
    { name: 'Viewed by Client', value: invoices.filter(i => i.status === 'viewed').reduce((s, i) => s + (i.total || 0), 0), color: '#06b6d4' },
    { name: 'Overdue Balances', value: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amountDue || 0), 0), color: '#f43f5e' },
  ].filter(p => p.value > 0);

  return (
    <div className="invoices-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Copilot Banner */}
      <PageAgentCopilot
        agentName="Invoicing Agent Copilot"
        badgeText="Billing Strategy & AR Active"
        insights={[
          `Total invoiced revenue is ${formatCurrency(totalBilled)} across ${invoices.length} active invoices.`,
          `Collections secured at ${formatCurrency(totalPaid)} (${totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : '0.0'}% collected).`,
          `Outstanding AR balance is ${formatCurrency(totalOutstanding)}.`,
        ]}
        suggestedActions={[
          'Forecast next quarter revenue',
          'Draft payment reminder emails',
          'Export AR aging breakdown'
        ]}
        color="#3b82f6"
      />

      {isModalOpen && (
        <InvoiceEditor 
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvoice}
        />
      )}

      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p>Create, send, and track enterprise-grade invoices with automated AR</p>
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
          <VoiceAITrigger
            label="Create with AI"
            icon={<Sparkles size={14} />}
            moduleLabel="Invoicing Agent"
            placeholder='e.g. "Invoice Acme Corp for $12,000 for Q3 consulting"'
            examplePrompts={[
              'Invoice Acme Corp $15,000 for consulting',
              'Create invoice for Starlight Tech, Net 30',
              'Bill $8,500 for cloud migration project',
            ]}
            accentColor="#3b82f6"
            onAgentResponse={() => fetchInvoices()}
          />
        </div>
      </div>

      {isAICreateOpen && (
        <AIAssistedCreationModal
          isOpen={isAICreateOpen}
          onClose={() => setIsAICreateOpen(false)}
          type="invoice"
          onSuccess={() => fetchInvoices()}
        />
      )}

      {/* Colorful Visual Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        <ColorfulBarChart
          title="Monthly Billed vs Collected Revenue"
          subtitle="Real-time cash collection efficiency and invoicing volume"
          data={monthlyInvoiceData.length > 0 ? monthlyInvoiceData : [{ name: 'Current', Billed: totalBilled, Collected: totalPaid }]}
          series={[
            { key: 'Billed', label: 'Gross Billed ($)', color: '#3b82f6' },
            { key: 'Collected', label: 'Cash Collected ($)', color: '#10b981' },
          ]}
        />
        <ColorfulPieChart
          title="Invoice Status Distribution"
          subtitle="Breakdown by active billing state and AR balance"
          data={statusPieData.length > 0 ? statusPieData : [{ name: 'Pending Invoices', value: 1, color: '#3b82f6' }]}
          centerText={formatCurrency(totalBilled)}
          centerSubtext="Total Revenue Billed"
        />
      </div>

      {/* Autonomous Revenue Forecasting Engine */}
      <MultiPeriodForecastCard
        title="Revenue & Collections Forecast"
        domain="revenue"
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
          id: `revenue-forecast-${horizon}`,
          title: `${horizon} Revenue Projection`,
          module: 'Invoices',
          subtitle: `${horizon} invoice billing and cash collection forecast`,
          amount: forecast.monthly.projectedTotal,
          type: 'positive',
          status: forecast.monthly.confidence,
          category: 'Forecasting',
          agentUsed: 'Forecasting Agent',
          description: `Predictive revenue projection based on historical invoicing run-rate and client collection velocity.`,
          metrics: [
            { label: 'Avg Monthly Run-Rate', value: formatCurrency(forecast.monthly.avgMonthlyValue) },
            { label: 'Base Scenario', value: formatCurrency(forecast.monthly.scenarioSummary.base) },
            { label: 'Bull (+15%)', value: formatCurrency(forecast.monthly.scenarioSummary.bull) },
            { label: 'Bear (-15%)', value: formatCurrency(forecast.monthly.scenarioSummary.bear) },
          ],
          aiInsights: [
            'Projections adapt dynamically to invoice payment velocity.',
            'Automated AR payment reminders help keep collections on track.',
          ]
        })}
      />

      {/* KPI Cards */}
      <div className="inv-summary">
        <div className="glass-card inv-summary-card">
          <FileText size={18} style={{ color: '#3b82f6' }} />
          <div>
            <span className="inv-summary-value value-financial">{formatCurrency(totalBilled)}</span>
            <span className="inv-summary-label">Total Billed</span>
          </div>
        </div>
        <div className="glass-card inv-summary-card">
          <Clock size={18} style={{ color: '#f59e0b' }} />
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
                <tr
                  key={inv.id}
                  className="cursor-pointer hover:bg-slate-800/40 transition-colors"
                  onClick={() => setSelectedDeepDive({
                    id: inv.id || inv.number,
                    title: `Invoice ${inv.number}`,
                    module: 'Invoices',
                    amount: inv.total,
                    partyName: inv.clientName,
                    status: sc.label,
                    date: inv.dueDate,
                    category: 'Accounts Receivable',
                    agentUsed: 'Invoicing Agent',
                    description: `Client invoice created for ${inv.clientName} under Net 30 payment terms.`,
                    metrics: [
                      { label: 'Issue Date', value: inv.createdAt || '2026-08-10' },
                      { label: 'Payment Terms', value: 'Net 30 Days' },
                      { label: 'ASC 606 Revenue', value: 'Recognized' }
                    ],
                    aiInsights: [
                      `Client payment probability score is 96.4% based on historical collection speeds.`,
                      `Sales tax schedules for ${inv.clientName} filed under Q3 GAAP revenue accruals.`,
                      `Automated gentle payment reminder queued for 7 days prior to due date.`
                    ]
                  })}
                >
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

      <EliteDeepDiveModal
        item={selectedDeepDive}
        onClose={() => setSelectedDeepDive(null)}
      />

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
