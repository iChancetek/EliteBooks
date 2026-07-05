'use client';

import { Package, Plus, Search, AlertTriangle, Box, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import DateFilter from '@/components/DateFilter';
import { useAuth } from '@/hooks/useAuth';

export default function InventoryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'Widgets',
    quantity: '',
    reorderPoint: '',
    unitPrice: '',
    costPrice: '',
  });

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          sku: newProduct.sku,
          category: newProduct.category,
          quantity: parseInt(newProduct.quantity) || 0,
          reorderPoint: parseInt(newProduct.reorderPoint) || 0,
          unitPrice: parseFloat(newProduct.unitPrice) || 0,
          costPrice: parseFloat(newProduct.costPrice) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [...prev, data.data]);
        setIsModalOpen(false);
        setNewProduct({
          name: '',
          sku: '',
          category: 'Widgets',
          quantity: '',
          reorderPoint: '',
          unitPrice: '',
          costPrice: '',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalValue = products.reduce((s, p) => s + (p.quantity || 0) * (p.costPrice || 0), 0);
  const lowStock = products.filter(p => (p.quantity || 0) <= (p.reorderPoint || 0));

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
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Add Product</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsModalOpen(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleAddProduct} className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" className="input" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" className="input" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="input" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    <option value="Widgets">Widgets</option>
                    <option value="Modules">Modules</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Licenses">Licenses</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>In Stock Quantity</label>
                  <input type="number" className="input" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Reorder Point</label>
                  <input type="number" className="input" value={newProduct.reorderPoint} onChange={e => setNewProduct({...newProduct, reorderPoint: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit Price (Sales)</label>
                  <input type="number" step="0.01" className="input" value={newProduct.unitPrice} onChange={e => setNewProduct({...newProduct, unitPrice: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Cost Price</label>
                  <input type="number" step="0.01" className="input" value={newProduct.costPrice} onChange={e => setNewProduct({...newProduct, costPrice: e.target.value})} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="inv-summary" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-8)' }}>
        <div className="glass-card inv-summary-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)' }}>
          <Box size={18} style={{ color: '#3b82f6' }} />
          <div>
            <span className="inv-summary-value value-financial" style={{ display: 'block', fontSize: 'var(--text-xl)' }}>{products.length}</span>
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
            {isLoading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-tertiary)' }}>Loading inventory...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-tertiary)' }}>No products in stock yet.</td></tr>
            ) : products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
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
