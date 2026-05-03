'use client';

import { Package, Plus, Search, AlertTriangle, TrendingUp, Box, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import DateFilter from '@/components/DateFilter';

const products = [
  { id: '1', name: 'Premium Widget A', sku: 'WDG-001', quantity: 145, reorderPoint: 50, unitPrice: 49.99, costPrice: 22.50, category: 'Widgets' },
  { id: '2', name: 'Standard Widget B', sku: 'WDG-002', quantity: 23, reorderPoint: 30, unitPrice: 29.99, costPrice: 12.00, category: 'Widgets' },
  { id: '3', name: 'Enterprise Module X', sku: 'MOD-001', quantity: 67, reorderPoint: 20, unitPrice: 199.99, costPrice: 85.00, category: 'Modules' },
  { id: '4', name: 'Connector Pack', sku: 'CON-010', quantity: 8, reorderPoint: 25, unitPrice: 15.99, costPrice: 6.50, category: 'Accessories' },
  { id: '5', name: 'Service License', sku: 'LIC-100', quantity: 500, reorderPoint: 100, unitPrice: 299.00, costPrice: 0, category: 'Licenses' },
];

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Apr');
  const [selectedYear, setSelectedYear] = useState('2026');

  const getDataMultiplier = () => {
    let m = 1;
    if (selectedYear !== 'All Years') {
      m *= Math.pow(0.85, (2026 - parseInt(selectedYear)));
    }
    if (selectedMonth !== 'All Months') {
      const idx = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(selectedMonth);
      if (selectedMonth.startsWith('Wk')) {
        m *= 0.25;
      } else {
        m *= (1 + (Math.sin(idx) * 0.15));
      }
    }
    return Math.max(0.1, m);
  };

  const multiplier = getDataMultiplier();
  const activeProducts = products.map(p => ({ 
    ...p, 
    quantity: Math.max(0, Math.floor(p.quantity * multiplier)) 
  }));

  const totalValue = activeProducts.reduce((s, p) => s + p.quantity * p.costPrice, 0);
  const lowStock = activeProducts.filter(p => p.quantity <= p.reorderPoint);

  return (
    <div className="page-inventory">
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>AI-powered stock tracking, COGS, and reorder predictions</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <DateFilter 
            initialMonth={selectedMonth} 
            initialYear={selectedYear} 
            onDateChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }} 
          />
          <button className="btn btn-primary"><Plus size={16} /> Add Product</button>
        </div>
      </div>

      <div className="inv-summary" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-8)' }}>
        <div className="glass-card inv-summary-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)' }}>
          <Box size={18} style={{ color: '#3b82f6' }} />
          <div>
            <span className="inv-summary-value value-financial" style={{ display: 'block', fontSize: 'var(--text-xl)' }}>{activeProducts.length}</span>
            <span className="inv-summary-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Products</span>
          </div>
        </div>
        <div className="glass-card inv-summary-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)' }}>
          <DollarSign size={18} style={{ color: '#10b981' }} />
          <div>
            <span className="inv-summary-value value-financial" style={{ display: 'block', fontSize: 'var(--text-xl)' }}>{formatCurrency(totalValue)}</span>
            <span className="inv-summary-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Inventory Value</span>
          </div>
        </div>
        <div className="glass-card inv-summary-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)' }}>
          <AlertTriangle size={18} style={{ color: '#f43f5e' }} />
          <div>
            <span className="inv-summary-value value-financial value-negative" style={{ display: 'block', fontSize: 'var(--text-xl)' }}>{lowStock.length}</span>
            <span className="inv-summary-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Low Stock Alerts</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div className="inv-search" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-secondary)', borderRadius: 'var(--radius-md)', maxWidth: '300px', color: 'var(--color-text-muted)' }}>
          <Search size={16} />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', flex: 1 }} />
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>In Stock</th><th>Reorder Point</th><th>Unit Price</th><th>Cost</th><th>Status</th></tr></thead>
          <tbody>
            {activeProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
              <tr key={p.id}>
                <td><strong style={{ color: 'var(--color-text-primary)' }}>{p.name}</strong></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{p.sku}</td>
                <td><span className="badge badge-neutral">{p.category}</span></td>
                <td className="value-financial">{p.quantity}</td>
                <td className="value-financial" style={{ color: 'var(--color-text-tertiary)' }}>{p.reorderPoint}</td>
                <td className="value-financial">{formatCurrency(p.unitPrice)}</td>
                <td className="value-financial">{formatCurrency(p.costPrice)}</td>
                <td>
                  {p.quantity <= p.reorderPoint ? (
                    <span className="badge badge-negative"><AlertTriangle size={10} /> Low Stock</span>
                  ) : (
                    <span className="badge badge-positive">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
