'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, Home, FileText, Receipt, Users, BarChart3, Package,
  Settings, LogOut, Menu, X, ChevronLeft, Bell, Search, Bot, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AutonomousAgentWidget from '@/components/AutonomousAgentWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut, isSuperAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Command Center', icon: Home },
    { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
    { href: '/dashboard/expenses', label: 'Expenses', icon: Receipt },
    { href: '/dashboard/payroll', label: 'Payroll', icon: Users },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  if (isSuperAdmin) {
    navItems.push({ href: '/dashboard/admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <div className="dash-layout">
      <AutonomousAgentWidget />
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="dash-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="dash-sidebar-header">
          <Link href="/dashboard" className="dash-logo">
            <div className="dash-logo-icon"><Sparkles size={18} /></div>
            {!collapsed && <span className="dash-logo-text">EliteBooks</span>}
          </Link>
          <button
            className="dash-collapse-btn desktop-only"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          <button className="dash-close-btn mobile-only" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
                {isActive && <div className="dash-nav-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="dash-sidebar-footer">
          <div className={`dash-agent-status ${collapsed ? 'collapsed' : ''}`}>
            <Bot size={16} />
            {!collapsed && (
              <>
                <span>AI Agents Active</span>
                <span className="status-dot status-dot-active" />
              </>
            )}
          </div>
          <button 
            className="dash-nav-item dash-logout" 
            onClick={signOut}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`dash-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="dash-header">
          <button className="dash-menu-btn mobile-only" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search or ask anything..." className="dash-search-input" id="dash-search" />
            <kbd className="dash-search-kbd">⌘K</kbd>
          </div>
          <div className="dash-header-actions">
            <button className="btn btn-icon btn-ghost" id="notifications-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <div className="dash-avatar" id="user-avatar" title={user?.displayName || 'User'}>
              <span>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dash-content">
          {children}
        </main>
      </div>

      <style>{`
        .dash-layout {
          display: flex;
          min-height: 100dvh;
          background: var(--color-bg-primary);
        }

        /* Sidebar */
        .dash-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border-secondary);
          display: flex;
          flex-direction: column;
          z-index: var(--z-sticky);
          transition: width var(--duration-normal) var(--ease-smooth);
        }
        .dash-sidebar.collapsed { width: var(--sidebar-collapsed-width); }

        .dash-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-4);
          height: var(--header-height);
          border-bottom: 1px solid var(--color-border-secondary);
        }

        .dash-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
        }
        .dash-logo-icon {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: var(--gradient-brand);
          border-radius: var(--radius-sm);
          color: white;
          flex-shrink: 0;
        }
        .dash-logo-text {
          font-size: var(--text-lg);
          font-weight: var(--weight-bold);
          color: var(--color-text-primary);
          letter-spacing: var(--tracking-tight);
        }

        .dash-collapse-btn, .dash-close-btn {
          background: none;
          border: 1px solid var(--color-border-secondary);
          color: var(--color-text-tertiary);
          border-radius: var(--radius-sm);
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all var(--duration-fast);
        }
        .dash-collapse-btn:hover { color: var(--color-text-primary); border-color: var(--color-border-primary); }

        /* Nav */
        .dash-nav {
          flex: 1;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-3);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          transition: all var(--duration-fast) var(--ease-smooth);
          position: relative;
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }
        .dash-nav-item:hover {
          color: var(--color-text-primary);
          background: var(--color-accent-subtle);
        }
        .dash-nav-item.active {
          color: var(--color-accent-primary);
          background: rgba(59, 130, 246, 0.08);
        }
        .dash-nav-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--color-accent-primary);
          border-radius: 0 3px 3px 0;
        }

        .dash-sidebar-footer {
          padding: var(--space-4);
          border-top: 1px solid var(--color-border-secondary);
        }

        .dash-agent-status {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          font-size: var(--text-xs);
          color: var(--color-positive);
          font-weight: var(--weight-medium);
          margin-bottom: var(--space-2);
        }
        .dash-agent-status.collapsed { justify-content: center; }

        .dash-logout { color: var(--color-text-muted) !important; }
        .dash-logout:hover { color: var(--color-negative) !important; }

        /* Main */
        .dash-main {
          margin-left: var(--sidebar-width);
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left var(--duration-normal) var(--ease-smooth);
        }
        .dash-main.sidebar-collapsed { margin-left: var(--sidebar-collapsed-width); }

        /* Header */
        .dash-header {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          height: var(--header-height);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: 0 var(--space-6);
          background: rgba(6, 9, 15, 0.8);
          backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--color-border-secondary);
        }

        .dash-search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          max-width: 480px;
          padding: var(--space-2) var(--space-4);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
        }
        .dash-search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--color-text-primary);
          font-size: var(--text-sm);
        }
        .dash-search-input::placeholder { color: var(--color-text-muted); }
        .dash-search-kbd {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 2px 6px;
          background: var(--color-bg-surface);
          border: 1px solid var(--color-border-secondary);
          border-radius: 4px;
          color: var(--color-text-muted);
        }

        .dash-header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-left: auto;
        }

        .dash-avatar {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: var(--gradient-brand);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          color: white;
          cursor: pointer;
        }

        /* Content */
        .dash-content {
          flex: 1;
          padding: var(--space-8) var(--space-6);
        }

        /* Mobile Overlay */
        .dash-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: calc(var(--z-sticky) - 1);
        }

        .dash-menu-btn {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
        }

        .desktop-only { display: flex; }
        .mobile-only { display: none; }

        @media (max-width: 768px) {
          .dash-sidebar {
            transform: translateX(-100%);
            width: var(--sidebar-width);
          }
          .dash-sidebar.mobile-open { transform: translateX(0); }
          .dash-sidebar.collapsed { width: var(--sidebar-width); }
          .dash-main { margin-left: 0 !important; }
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
          .dash-search-kbd { display: none; }
        }
      `}</style>
    </div>
  );
}
