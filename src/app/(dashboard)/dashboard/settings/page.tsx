'use client';

import { Settings, User, Building2, CreditCard, Bell, Shield, Bot, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="page-settings">
      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>Settings</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Manage your account, organization, and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        {[
          { icon: User, title: 'Profile', desc: 'Name, email, and personal preferences', color: '#3b82f6' },
          { icon: Building2, title: 'Organization', desc: 'Company details, address, and tax info', color: '#10b981' },
          { icon: CreditCard, title: 'Billing & Subscription', desc: 'Plan, payment methods, and invoicing', color: '#8b5cf6' },
          { icon: Bell, title: 'Notifications', desc: 'Email, push, and in-app notification preferences', color: '#f59e0b' },
          { icon: Shield, title: 'Security & Permissions', desc: 'Two-factor auth, team roles, and access control', color: '#f43f5e' },
          { icon: Bot, title: 'AI Agents', desc: 'Configure agent behavior, approval thresholds, and autonomy levels', color: '#06b6d4' },
          { icon: Globe, title: 'Integrations', desc: 'Bank connections, payment processors, and third-party apps', color: '#ec4899' },
          { icon: Settings, title: 'General', desc: 'Currency, date format, fiscal year, and localization', color: '#64748b' },
        ].map(item => (
          <button key={item.title} className="glass-card settings-card">
            <div className="settings-icon" style={{ background: `${item.color}15`, color: item.color }}>
              <item.icon size={22} />
            </div>
            <div className="settings-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .page-settings { max-width: 900px; }
        .settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
        .settings-card {
          display: flex; align-items: flex-start; gap: var(--space-4);
          padding: var(--space-6); text-align: left; cursor: pointer;
          border: 1px solid var(--color-glass-border); width: 100%;
          font-family: var(--font-sans);
        }
        .settings-icon {
          width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md); flex-shrink: 0;
        }
        .settings-info h3 { font-size: var(--text-base); margin-bottom: var(--space-1); }
        .settings-info p { font-size: var(--text-sm); color: var(--color-text-tertiary); line-height: var(--leading-relaxed); }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
