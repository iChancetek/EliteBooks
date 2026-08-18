'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, Home, FileText, Receipt, Users, BarChart3, Package,
  Settings, LogOut, Menu, X, ChevronLeft, Bell, Search, Bot, ShieldCheck, Mail, Wallet, TrendingUp,
  Sun, Moon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import AutonomousAgentWidget from '@/components/AutonomousAgentWidget';
import { GlobalCommandPalette } from '@/components/GlobalCommandPalette';
import NotificationsPopover from '@/components/NotificationsPopover';
import { AIBusinessFeedService } from '@/lib/feed-service';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut, isSuperAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    try {
      const items = AIBusinessFeedService.getFeedItems();
      setNotificationCount(items.length);
    } catch (e) {
      setNotificationCount(0);
    }
  }, [isNotificationsOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResendVerification = async () => {
    if (!user) return;
    setResending(true);
    setResendStatus('');
    try {
      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(user);
      setResendStatus('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setResendStatus('Failed to resend. Try again later.');
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  return (
    <div className="dash-layout">
      {mobileOpen && <div className="dash-mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`dash-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="dash-sidebar-header">
          <Link href="/dashboard" className="dash-brand">
            <div className="dash-brand-icon">
              <Sparkles size={18} />
            </div>
            {!collapsed && <span className="dash-brand-text">EliteBooks</span>}
          </Link>
          <button 
            className="dash-collapse-btn desktop-only" 
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft size={16} className={collapsed ? 'rotate-180' : ''} />
          </button>
          <button className="dash-collapse-btn mobile-only" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav" id="main-navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon size={20} className="dash-nav-icon" />
                {!collapsed && <span className="dash-nav-label">{item.label}</span>}
              </Link>
            );
          })}
          {isSuperAdmin && (
            <Link
              href="/dashboard/admin"
              className={`dash-nav-item ${pathname.startsWith('/dashboard/admin') ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? 'Super Admin' : undefined}
              id="nav-super-admin"
              style={{
                color: '#f59e0b',
                background: pathname.startsWith('/dashboard/admin') ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                borderColor: pathname.startsWith('/dashboard/admin') ? 'rgba(245, 158, 11, 0.3)' : 'transparent',
              }}
            >
              <ShieldCheck size={20} className="dash-nav-icon" style={{ color: '#f59e0b' }} />
              {!collapsed && <span className="dash-nav-label">Super Admin</span>}
            </Link>
          )}
        </nav>

        <AutonomousAgentWidget />

        <div className="dash-user">
          <div className="dash-user-info">
            <div className="dash-avatar">
              <span>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</span>
            </div>
            {!collapsed && (
              <div className="dash-user-details">
                <span className="dash-user-name">{user?.displayName || 'User'}</span>
                <span className="dash-user-email">{user?.email}</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="dash-logout-btn" onClick={handleLogout} title="Log out" aria-label="Log out">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      <div className={`dash-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="dash-header">
          <button className="dash-menu-btn mobile-only" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="dash-search" onClick={() => setIsCommandPaletteOpen(true)} style={{ cursor: 'pointer' }}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search or ask anything..." 
              className="dash-search-input" 
              readOnly
              onClick={() => setIsCommandPaletteOpen(true)}
            />
            <kbd className="dash-search-kbd">⌘K</kbd>
          </div>
          <div className="dash-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
            <a 
              href="https://famio.us" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-xs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                color: '#f472b6',
                borderRadius: '100px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 800,
                textDecoration: 'none',
                letterSpacing: '0.03em',
                transition: 'all 0.2s',
              }}
              title="Visit famio.us"
            >
              <Sparkles size={12} style={{ color: '#ec4899' }} />
              famio.us
            </a>

            <button
              onClick={toggleTheme}
              className="btn btn-icon btn-ghost"
              id="theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {theme === 'dark' ? (
                <Sun size={18} style={{ color: '#f59e0b' }} />
              ) : (
                <Moon size={18} style={{ color: '#6366f1' }} />
              )}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                className={`btn btn-icon btn-ghost ${isNotificationsOpen ? 'active' : ''}`}
                id="notifications-btn"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                style={{
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isNotificationsOpen ? 'var(--color-accent-subtle)' : 'transparent',
                  color: isNotificationsOpen ? 'var(--color-accent-primary)' : 'var(--color-text-primary)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <Bell size={19} />
                {notificationCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                      boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)',
                    }}
                  />
                )}
              </button>

              <NotificationsPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            <div className="dash-avatar" id="user-avatar" title={user?.displayName || 'User'}>
              <span>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</span>
            </div>
          </div>
        </header>

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

      <GlobalCommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

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
          background: transparent;
          backdrop-filter: none;
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
