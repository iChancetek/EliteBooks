'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, Home, FileText, Receipt, Users, BarChart3, Package,
  Settings, LogOut, Menu, X, ChevronLeft, Bell, Search, Bot, ShieldCheck, Mail, Wallet, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AutonomousAgentWidget from '@/components/AutonomousAgentWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut, isSuperAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleResendVerification = async () => {
    if (!user) return;
    setResending(true);
    setResendStatus('');
    try {
      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(user);
      setResendStatus('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setResendStatus('Failed to send email. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (user) {
      try {
        await user.reload();
        window.location.reload();
      } catch (err) {
        console.error('Error reloading user:', err);
      }
    }
  };

  // Enforcement: If user exists but email is NOT verified, block access
  const isVerified = user?.emailVerified || user?.providerData?.[0]?.providerId === 'google.com';

  const navItems = [
    { href: '/dashboard', label: 'Command Center', icon: Home },
    { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
    { href: '/dashboard/expenses', label: 'Expenses', icon: Receipt },
    { href: '/dashboard/payroll', label: 'Payroll', icon: Users },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/finops', label: 'FinOps', icon: TrendingUp },
    { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/personal', label: 'Personal', icon: Wallet },
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
            <div className="dash-logo-icon">
              <img src="/NewIcon.png" alt="EliteBooks" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} />
            </div>
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
          {!isVerified && (
            <div className="verification-banner">
              <Mail size={16} />
              <span>Please verify your email address to secure your account.</span>
              <button onClick={handleResendVerification} disabled={resending}>
                {resending ? 'Sending...' : 'Resend Email'}
              </button>
              {resendStatus && <span className="resend-status">{resendStatus}</span>}
            </div>
          )}
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
          background: transparent;
          position: relative;
          flex-shrink: 0;
        }
        .dash-logo-icon::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: var(--color-accent-glow);
          filter: blur(8px);
          border-radius: 50%;
          opacity: 0.3;
          z-index: -1;
        }
        .dash-logo-icon img {
          width: 100%; height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
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
          border-bottom: none;
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
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .verification-banner {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-3) var(--space-4);
          background: var(--color-warning-bg);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-md);
          color: var(--color-warning);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
        }

        .verification-banner button {
          background: var(--color-warning);
          color: white;
          border: none;
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          cursor: pointer;
          margin-left: auto;
        }

        .verification-banner .resend-status {
          font-size: var(--text-xs);
          color: var(--color-positive);
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
          .dash-header { 
            padding: 0 var(--space-4);
            gap: var(--space-2);
          }
          .dash-menu-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg-tertiary);
            border: 1px solid var(--color-border-secondary);
            border-radius: var(--radius-md);
            color: var(--color-text-primary);
          }
        }

        @media (max-width: 480px) {
          .dash-search { 
            background: none; 
            border: none;
            padding: 0;
            width: auto;
            flex: 0;
          }
          .dash-search-input { display: none; }
          .dash-search svg { color: var(--color-text-secondary); }
        }
      `}</style>
    </div>
  );
}
