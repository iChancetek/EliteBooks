'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Calendar, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, Brush } from 'recharts';
import { formatCurrency, formatPercent } from '@/lib/utils';
import DateFilter from '@/components/DateFilter';
import { useAuth } from '@/hooks/useAuth';
const plData = [
  { category: 'Service Revenue', amount: 64200, type: 'revenue' },
  { category: 'Product Sales', amount: 18400, type: 'revenue' },
  { category: 'Other Income', amount: 1650, type: 'revenue' },
  { category: 'Payroll', amount: -36916.67, type: 'expense' },
  { category: 'Rent & Utilities', amount: -5800, type: 'expense' },
  { category: 'Software & SaaS', amount: -4200, type: 'expense' },
  { category: 'Professional Services', amount: -3500, type: 'expense' },
  { category: 'Travel & Transport', amount: -3100, type: 'expense' },
  { category: 'Marketing', amount: -2900, type: 'expense' },
  { category: 'Office & Supplies', amount: -2840, type: 'expense' },
  { category: 'Meals & Entertainment', amount: -1560, type: 'expense' },
  { category: 'Insurance', amount: -1200, type: 'expense' },
  { category: 'Training & Education', amount: -850, type: 'expense' },
  { category: 'Subscriptions', amount: -450, type: 'expense' },
  { category: 'Miscellaneous', amount: -210, type: 'expense' },
  { category: 'Bank Fees & Interest', amount: -125, type: 'expense' },
];

const balanceSheet = {
  assets: [
    { name: 'Cash & Bank', amount: 127400 },
    { name: 'Accounts Receivable', amount: 20946 },
    { name: 'Inventory', amount: 15200 },
    { name: 'Equipment', amount: 42000 },
  ],
  liabilities: [
    { name: 'Accounts Payable', amount: 8400 },
    { name: 'Credit Card', amount: 3200 },
    { name: 'Loan Payable', amount: 45000 },
  ],
};

const generateHistoricalData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthly = [];
  const yearlyMap: Record<string, { year: string, revenue: number, expenses: number }> = {};

  let baseRev = 25000;
  let baseExp = 18000;

  for (let year = 2016; year <= 2026; year++) {
    const isCurrentYear = year === 2026;
    const maxMonth = isCurrentYear ? 4 : 12; // Stop at April 2026

    yearlyMap[year] = { year: year.toString(), revenue: 0, expenses: 0 };

    for (let m = 0; m < maxMonth; m++) {
      // Create some seasonality and growth
      const growthMultiplier = 1 + ((year - 2016) * 0.15) + (m * 0.01);
      const seasonality = 1 + (Math.sin(m) * 0.1);
      
      let rev = Math.round(baseRev * growthMultiplier * seasonality);
      let exp = Math.round(baseExp * growthMultiplier * seasonality * 0.9);

      // Force the final month (Apr 2026) to match the exact P&L data
      if (year === 2026 && m === 3) {
        rev = 84250;
        exp = 63651.67;
      }

      monthly.push({
        label: `${months[m]} ${year}`,
        month: months[m],
        year: year.toString(),
        revenue: rev,
        expenses: exp
      });

      yearlyMap[year].revenue += rev;
      yearlyMap[year].expenses += exp;
    }
  }

  return {
    monthly,
    yearly: Object.values(yearlyMap)
  };
};

const { monthly: historicalMonthlyData, yearly: historicalYearlyData } = generateHistoricalData();

const expenseData = plData.filter(d => d.type === 'expense').map(d => ({ name: d.category, value: Math.abs(d.amount) }));
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#14b8a6', '#6366f1', '#84cc16'];

export default function ReportsPage() {
  const { user } = useAuth();
  const [chartView, setChartView] = useState<'monthly' | 'yearly'>('yearly');
  const [nlpQuery, setNlpQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/reports');
        const data = await res.json();
        if (data.success) {
          setReportData(data.data);
        }
      } catch (e) {
        console.error('Failed to fetch reports:', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, []);

  const allExpenses = reportData?.expenses || [];
  const allInvoices = reportData?.invoices || [];

  // Filter based on selected date
  const activeExpenses = allExpenses.filter((e: any) => {
    // Expense date format: "YYYY-MM-DD"
    const dateObj = new Date(e.date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const expenseMonth = months[dateObj.getMonth()];
    const expenseYear = dateObj.getFullYear().toString();

    const matchYear = selectedYear === 'All Years' || expenseYear === selectedYear;
    const matchMonth = selectedMonth === 'All Months' || expenseMonth === selectedMonth;
    return matchYear && matchMonth;
  });

  const activeInvoices = allInvoices.filter((i: any) => {
    const dateObj = new Date(i.dueDate || i.createdAt);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const invMonth = months[dateObj.getMonth()];
    const invYear = dateObj.getFullYear().toString();

    const matchYear = selectedYear === 'All Years' || invYear === selectedYear;
    const matchMonth = selectedMonth === 'All Months' || invMonth === selectedMonth;
    return matchYear && matchMonth;
  });

  // Calculate historical monthly & yearly data dynamically
  const getHistoricalData = () => {
    const monthlyMap: Record<string, { label: string, month: string, year: string, revenue: number, expenses: number }> = {};
    const yearlyMap: Record<string, { year: string, revenue: number, expenses: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    allInvoices.forEach((inv: any) => {
      const dateObj = new Date(inv.dueDate || inv.createdAt);
      const m = months[dateObj.getMonth()];
      const y = dateObj.getFullYear().toString();
      const label = `${m} ${y}`;

      if (!monthlyMap[label]) {
        monthlyMap[label] = { label, month: m, year: y, revenue: 0, expenses: 0 };
      }
      monthlyMap[label].revenue += inv.total || 0;

      if (!yearlyMap[y]) {
        yearlyMap[y] = { year: y, revenue: 0, expenses: 0 };
      }
      yearlyMap[y].revenue += inv.total || 0;
    });

    allExpenses.forEach((exp: any) => {
      if (exp.status === 'deleted') return;
      const dateObj = new Date(exp.date);
      const m = months[dateObj.getMonth()];
      const y = dateObj.getFullYear().toString();
      const label = `${m} ${y}`;

      if (!monthlyMap[label]) {
        monthlyMap[label] = { label, month: m, year: y, revenue: 0, expenses: 0 };
      }
      monthlyMap[label].expenses += exp.amount || 0;

      if (!yearlyMap[y]) {
        yearlyMap[y] = { year: y, revenue: 0, expenses: 0 };
      }
      yearlyMap[y].expenses += exp.amount || 0;
    });

    return {
      monthly: Object.values(monthlyMap).sort((a, b) => {
        const ad = new Date(`${a.month} 1, ${a.year}`);
        const bd = new Date(`${b.month} 1, ${b.year}`);
        return ad.getTime() - bd.getTime();
      }),
      yearly: Object.values(yearlyMap).sort((a, b) => parseInt(a.year) - parseInt(b.year))
    };
  };

  const { monthly: displayHistoricalMonthly, yearly: displayHistoricalYearly } = getHistoricalData();

  const totalRevenue = activeInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  const totalExpenses = activeExpenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  
  // Create active PlData for rendering from the categories
  const expenseCategories = activeExpenses.reduce((acc: Record<string, number>, exp: any) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const activePlData = [
    { category: 'Service Revenue', amount: totalRevenue * 0.75, type: 'revenue' },
    { category: 'Product Sales', amount: totalRevenue * 0.25, type: 'revenue' },
    ...Object.entries(expenseCategories).map(([cat, amt]) => ({
      category: cat,
      amount: -(amt as number),
      type: 'expense'
    }))
  ];

  // Derive balance sheet relative to revenue growth
  const assetMultiplier = selectedYear === 'All Years' ? 1 : Math.max(0.1, Math.pow(1.1, parseInt(selectedYear) - 2025));
  const activeBalanceSheet = {
    assets: balanceSheet.assets.map(a => ({ ...a, amount: a.amount * assetMultiplier })),
    liabilities: balanceSheet.liabilities.map(l => ({ ...l, amount: l.amount * assetMultiplier }))
  };

  const totalAssets = activeBalanceSheet.assets.reduce((s, a) => s + a.amount, 0);
  const totalLiabilities = activeBalanceSheet.liabilities.reduce((s, l) => s + l.amount, 0);

  const handleNlpGenerate = () => {
    if (!nlpQuery.trim()) return;
    setIsGenerating(true);
    // Simulate agentic delay
    setTimeout(() => {
      setIsGenerating(false);
      setNlpQuery('');
      alert('AI Report Generated: Check your downloads or reports queue.');
    }, 2000);
  };

  return (
    <div className="page-reports">
      <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1>Financial Reports</h1>
          <p>AI-generated financial statements and insights</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <DateFilter 
            initialMonth={selectedMonth} 
            initialYear={selectedYear} 
            onDateChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }} 
          />
          <button className="btn btn-primary"><BarChart3 size={16} /> Export</button>
        </div>
      </div>

      {/* NLP Report Generation Bar */}
      <div className="glass-card" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <Sparkles size={18} style={{ color: 'var(--color-accent-primary)' }} />
        <input 
          type="text" 
          placeholder="Ask AI to generate a custom report (e.g. 'Compare marketing vs payroll for last year')..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)' }}
          value={nlpQuery}
          onChange={(e) => setNlpQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNlpGenerate()}
          disabled={isGenerating}
        />
        <button className="btn btn-primary btn-sm" onClick={handleNlpGenerate} disabled={isGenerating || !nlpQuery.trim()}>
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* Summary */}
      <div className="rpt-summary">
        <div className="glass-card rpt-summary-card">
          <div className="rpt-card-head">
            <TrendingUp size={18} style={{ color: '#10b981' }} />
            <span className="rpt-change positive"><ArrowUpRight size={14} /> +12.3%</span>
          </div>
          <span className="rpt-value value-financial value-positive">{formatCurrency(totalRevenue)}</span>
          <span className="rpt-label">Total Revenue</span>
        </div>
        <div className="glass-card rpt-summary-card">
          <div className="rpt-card-head">
            <TrendingDown size={18} style={{ color: '#f43f5e' }} />
            <span className="rpt-change negative"><ArrowDownRight size={14} /> -3.8%</span>
          </div>
          <span className="rpt-value value-financial">{formatCurrency(totalExpenses)}</span>
          <span className="rpt-label">Total Expenses</span>
        </div>
        <div className="glass-card rpt-summary-card">
          <div className="rpt-card-head">
            <DollarSign size={18} style={{ color: '#3b82f6' }} />
            <span className="rpt-change positive"><ArrowUpRight size={14} /> +28.1%</span>
          </div>
          <span className="rpt-value value-financial value-positive">{formatCurrency(netProfit)}</span>
          <span className="rpt-label">Net Profit</span>
        </div>
        <div className="glass-card rpt-summary-card">
          <div className="rpt-card-head">
            <PieChartIcon size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <span className="rpt-value value-financial">{formatPercent((netProfit / totalRevenue) * 100)}</span>
          <span className="rpt-label">Profit Margin</span>
        </div>
      </div>

      {/* Visualizations */}
      <div className="rpt-charts-grid">
        <div className="rpt-section glass-card-static" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ margin: 0 }}>Revenue vs Expenses</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', background: 'var(--color-bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              <button 
                className={`btn btn-sm ${chartView === 'monthly' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setChartView('monthly')}
              >Monthly</button>
              <button 
                className={`btn btn-sm ${chartView === 'yearly' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setChartView('yearly')}
              >Yearly</button>
            </div>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartView === 'monthly' ? displayHistoricalMonthly : displayHistoricalYearly} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey={chartView === 'monthly' ? 'label' : 'year'} stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="var(--color-text-tertiary)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-primary)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                {chartView === 'monthly' && (
                  <Brush dataKey="label" height={30} stroke="#3b82f6" fill="var(--color-bg-secondary)" startIndex={Math.max(0, historicalMonthlyData.length - 24)} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rpt-section glass-card-static">
          <h3>Expense Distribution</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-primary)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Statements Grid */}
      <div className="rpt-statements-grid">
        {/* P&L */}
        <div className="rpt-section glass-card-static">
          <h3>Profit &amp; Loss Statement</h3>
          <div className="rpt-pl">
            <div className="rpt-pl-group">
              <h4 className="rpt-pl-header">Revenue</h4>
              {activePlData.filter(d => d.type === 'revenue').map(d => (
                <div key={d.category} className="rpt-pl-row">
                  <span>{d.category}</span>
                  <span className="value-financial value-positive">{formatCurrency(d.amount)}</span>
                </div>
              ))}
              <div className="rpt-pl-row rpt-pl-total">
                <span>Total Revenue</span>
                <span className="value-financial value-positive">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
            <div className="rpt-pl-group">
              <h4 className="rpt-pl-header">Expenses</h4>
              {activePlData.filter(d => d.type === 'expense').map(d => (
                <div key={d.category} className="rpt-pl-row">
                  <span>{d.category}</span>
                  <span className="value-financial value-negative">{formatCurrency(Math.abs(d.amount))}</span>
                </div>
              ))}
              <div className="rpt-pl-row rpt-pl-total">
                <span>Total Expenses</span>
                <span className="value-financial value-negative">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
            <div className="rpt-pl-row rpt-pl-net">
              <span>Net Profit</span>
              <span className="value-financial value-positive" style={{ fontSize: 'var(--text-xl)' }}>{formatCurrency(netProfit)}</span>
            </div>
          </div>
        </div>

        {/* Balance Sheet */}
        <div className="rpt-section glass-card-static">
          <h3>Balance Sheet</h3>
          <div className="rpt-bs">
            <div className="rpt-bs-col" style={{ width: '100%' }}>
              <h4 className="rpt-pl-header">Assets</h4>
              {activeBalanceSheet.assets.map(a => (
                <div key={a.name} className="rpt-pl-row">
                  <span>{a.name}</span>
                  <span className="value-financial">{formatCurrency(a.amount)}</span>
                </div>
              ))}
              <div className="rpt-pl-row rpt-pl-total">
                <span>Total Assets</span>
                <span className="value-financial">{formatCurrency(totalAssets)}</span>
              </div>
            </div>
            <div className="rpt-bs-col" style={{ width: '100%', marginTop: 'var(--space-6)' }}>
              <h4 className="rpt-pl-header">Liabilities</h4>
              {activeBalanceSheet.liabilities.map(l => (
                <div key={l.name} className="rpt-pl-row">
                  <span>{l.name}</span>
                  <span className="value-financial">{formatCurrency(l.amount)}</span>
                </div>
              ))}
              <div className="rpt-pl-row rpt-pl-total">
                <span>Total Liabilities</span>
                <span className="value-financial">{formatCurrency(totalLiabilities)}</span>
              </div>
              <div className="rpt-pl-row rpt-pl-net">
                <span>Owner&apos;s Equity</span>
                <span className="value-financial value-positive">{formatCurrency(totalAssets - totalLiabilities)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .page-reports { max-width: 1100px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-8); }
        .page-header h1 { font-size: var(--text-3xl); margin-bottom: var(--space-1); }
        .page-header p { color: var(--color-text-secondary); font-size: var(--text-sm); }

        .rpt-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); margin-bottom: var(--space-8); }
        .rpt-summary-card { padding: var(--space-5); display: flex; flex-direction: column; }
        .rpt-card-head { display: flex; justify-content: space-between; margin-bottom: var(--space-4); }
        .rpt-change { font-size: var(--text-xs); font-weight: var(--weight-semibold); display: flex; align-items: center; gap: 2px; }
        .rpt-change.positive { color: var(--color-positive); }
        .rpt-change.negative { color: var(--color-negative); }
        .rpt-value { font-size: var(--text-2xl); color: var(--color-text-primary); margin-bottom: var(--space-1); }
        .rpt-label { font-size: var(--text-xs); color: var(--color-text-tertiary); font-weight: var(--weight-medium); }

        .rpt-section { padding: var(--space-8); margin-bottom: var(--space-6); }
        .rpt-section h3 { font-size: var(--text-lg); margin-bottom: var(--space-6); }

        .rpt-pl-group { margin-bottom: var(--space-6); }
        .rpt-pl-header { font-size: var(--text-sm); color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: var(--space-3); font-weight: var(--weight-semibold); }
        .rpt-pl-row { display: flex; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-secondary); font-size: var(--text-sm); color: var(--color-text-secondary); }
        .rpt-pl-total { font-weight: var(--weight-semibold); color: var(--color-text-primary); border-bottom: 2px solid var(--color-border-primary); }
        .rpt-pl-net { font-weight: var(--weight-bold); color: var(--color-text-primary); border-top: 3px double var(--color-border-primary); border-bottom: none; padding-top: var(--space-4); margin-top: var(--space-2); }

        .rpt-bs { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); }

        .rpt-charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); margin-bottom: var(--space-6); }
        .rpt-statements-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); }

        @media (max-width: 1024px) {
          .rpt-charts-grid { grid-template-columns: 1fr; }
          .rpt-statements-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; gap: var(--space-4); }
          .rpt-summary { grid-template-columns: repeat(2, 1fr); }
          .rpt-bs { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
