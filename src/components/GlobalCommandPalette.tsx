'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, FileText, Receipt, Package, Users, LayoutDashboard,
  BarChart3, Cloud, Wallet, Settings, Bot, Sparkles, ArrowRight, CornerDownLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Page' | 'Invoice' | 'Expense' | 'Product' | 'Action' | 'AI';
  icon: React.ElementType;
  url?: string;
  action?: () => void;
}

const NAVIGATION_PAGES = [
  { title: 'Command Center', subtitle: 'Executive dashboard, metrics & agent feeds', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Invoices', subtitle: 'Manage billing, payments, and accounts receivable', url: '/dashboard/invoices', icon: FileText },
  { title: 'Expenses', subtitle: 'Track and categorize business expenditures', url: '/dashboard/expenses', icon: Receipt },
  { title: 'Reports & Analytics', subtitle: 'Financial statements, P&L, and cash flow', url: '/dashboard/reports', icon: BarChart3 },
  { title: 'Cloud FinOps', subtitle: 'FOCUS 1.3 spec & AI token unit economics', url: '/dashboard/finops', icon: Cloud },
  { title: 'Inventory & Products', subtitle: 'SKU tracking, valuation, and reorder alerts', url: '/dashboard/inventory', icon: Package },
  { title: 'Personal Finance', subtitle: 'Household wealth & owner draw tracking', url: '/dashboard/personal', icon: Wallet },
  { title: 'Settings', subtitle: 'Account preferences, security, and integrations', url: '/dashboard/settings', icon: Settings },
];

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      // Default: show quick pages and AI prompt
      setResults(
        NAVIGATION_PAGES.map(p => ({
          id: `page-${p.url}`,
          title: p.title,
          subtitle: p.subtitle,
          category: 'Page' as const,
          icon: p.icon,
          url: p.url
        }))
      );
      return;
    }

    setIsLoading(true);
    const matched: SearchResultItem[] = [];

    // 1. AI Copilot Option
    matched.push({
      id: 'ai-prompt',
      title: `Ask AI Copilot: "${searchQuery}"`,
      subtitle: 'Query financial knowledge base, ledger history, or execute actions',
      category: 'AI',
      icon: Bot,
      action: () => {
        window.dispatchEvent(new CustomEvent('elitebooks:ask-agent', { detail: { query: searchQuery } }));
        onClose();
      }
    });

    // 2. Filter Navigation Pages
    NAVIGATION_PAGES.forEach(page => {
      if (page.title.toLowerCase().includes(q) || page.subtitle.toLowerCase().includes(q)) {
        matched.push({
          id: `page-${page.url}`,
          title: page.title,
          subtitle: page.subtitle,
          category: 'Page',
          icon: page.icon,
          url: page.url
        });
      }
    });

    // 3. Search Live Firestore Invoices, Expenses, Inventory
    if (user) {
      try {
        const token = await user.getIdToken();
        const [invRes, expRes, prodRes, custRes] = await Promise.all([
          fetch('/api/invoices', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
          fetch('/api/expenses', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
          fetch('/api/inventory', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
          fetch('/api/customers', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        ]);

        if (invRes && invRes.ok) {
          const invData = await invRes.json();
          if (invData.success && Array.isArray(invData.data)) {
            invData.data
              .filter((inv: any) => 
                (inv.number || '').toLowerCase().includes(q) || 
                (inv.clientName || '').toLowerCase().includes(q) ||
                (inv.description || '').toLowerCase().includes(q)
              )
              .slice(0, 4)
              .forEach((inv: any) => {
                matched.push({
                  id: `inv-${inv.id}`,
                  title: `${inv.number || 'Invoice'} • ${inv.clientName || 'Client'}`,
                  subtitle: `${formatCurrency(inv.total || 0)} • Due ${formatDate(inv.dueDate, 'short')} • Status: ${inv.status}`,
                  category: 'Invoice',
                  icon: FileText,
                  url: '/dashboard/invoices'
                });
              });
          }
        }

        if (custRes && custRes.ok) {
          const custData = await custRes.json();
          if (custData.success && Array.isArray(custData.data)) {
            custData.data
              .filter((c: any) => 
                (c.name || '').toLowerCase().includes(q) || 
                (c.email || '').toLowerCase().includes(q) ||
                (c.company || '').toLowerCase().includes(q)
              )
              .slice(0, 4)
              .forEach((c: any) => {
                matched.push({
                  id: `cust-${c.id}`,
                  title: `${c.name}${c.company ? ` (${c.company})` : ''}`,
                  subtitle: `Customer • Balance: ${formatCurrency(c.outstandingBalance || 0)} • Status: ${c.status || 'Active'}`,
                  category: 'Page',
                  icon: Users,
                  url: '/dashboard/invoices'
                });
              });
          }
        }

        if (expRes && expRes.ok) {
          const expData = await expRes.json();
          if (expData.success && Array.isArray(expData.data)) {
            expData.data
              .filter((exp: any) => 
                (exp.vendor || '').toLowerCase().includes(q) || 
                (exp.category || '').toLowerCase().includes(q) ||
                (exp.description || '').toLowerCase().includes(q)
              )
              .slice(0, 4)
              .forEach((exp: any) => {
                matched.push({
                  id: `exp-${exp.id}`,
                  title: `${exp.vendor || 'Expense'} • ${exp.category || 'General'}`,
                  subtitle: `${formatCurrency(exp.amount || 0)} • ${formatDate(exp.date, 'short')} • Status: ${exp.status}`,
                  category: 'Expense',
                  icon: Receipt,
                  url: '/dashboard/expenses'
                });
              });
          }
        }

        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.data)) {
            prodData.data
              .filter((p: any) => 
                (p.name || '').toLowerCase().includes(q) || 
                (p.sku || '').toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q)
              )
              .slice(0, 4)
              .forEach((p: any) => {
                matched.push({
                  id: `prod-${p.id}`,
                  title: `${p.name} • SKU: ${p.sku || 'N/A'}`,
                  subtitle: `Price: ${formatCurrency(p.unitPrice || 0)} • Qty: ${p.quantity || 0} in stock`,
                  category: 'Product',
                  icon: Package,
                  url: '/dashboard/inventory'
                });
              });
          }
        }
      } catch (err) {
        console.error('Command palette search error:', err);
      }
    }

    setResults(matched);
    setSelectedIndex(0);
    setIsLoading(false);
  }, [user, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      performSearch('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, performSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        performSearch(query);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, isOpen, performSearch]);

  const handleSelect = (item: SearchResultItem) => {
    if (item.action) {
      item.action();
    } else if (item.url) {
      router.push(item.url);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, backdropFilter: 'blur(8px)' }}>
      <div 
        className="glass-card animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '80vh',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          margin: '10vh auto 0'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Search size={20} style={{ color: 'var(--color-accent-primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search invoices, expenses, products, pages, or ask AI..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          />
          {query && (
            <button 
              className="btn btn-ghost btn-icon" 
              onClick={() => setQuery('')}
              style={{ padding: '4px', color: 'var(--color-text-tertiary)' }}
            >
              <X size={16} />
            </button>
          )}
          <kbd style={{ fontSize: '11px', padding: '2px 6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', color: 'var(--color-text-tertiary)' }}>ESC</kbd>
        </div>

        {/* Results List */}
        <div style={{ overflowY: 'auto', padding: '8px', flex: 1, maxHeight: '420px' }}>
          {isLoading && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
              Searching live ledger...
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No matching records found for &quot;{query}&quot;</p>
              <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Try searching by invoice number, vendor, category, or product SKU.</p>
            </div>
          )}

          {!isLoading && results.length > 0 && results.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  marginBottom: '2px'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: item.category === 'AI' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: item.category === 'AI' ? '#c084fc' : 'var(--color-accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {item.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.subtitle}
                  </div>
                </div>
                {isSelected && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent-primary)', fontSize: '11px' }}>
                    <span>Select</span>
                    <CornerDownLeft size={12} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--color-text-muted)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>EliteBooks Live Search</span>
        </div>
      </div>
    </div>
  );
};
