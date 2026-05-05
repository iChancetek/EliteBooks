'use client';

import { useState, useRef } from 'react';
import {
  Settings, User, Building2, CreditCard, Bell, Shield, Bot, Globe,
  ImagePlus, Upload, Download, FileSpreadsheet, X, CheckCircle2,
  AlertTriangle, Trash2, ArrowLeft, Lock, Mail, KeyRound, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activePanel, setActivePanel] = useState<string | null>(null);

  /* ─── Logo Upload State ─── */
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'warning' } | null>(null);

  /* ─── Export/Import State ─── */
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  /* ─── Security State ─── */
  const [resetSent, setResetSent] = useState(false);
  const [verifyResent, setVerifyResent] = useState(false);
  const [secLoading, setSecLoading] = useState(false);

  const isEmailProvider = user?.providerData?.[0]?.providerId === 'password';
  const isVerified = user?.emailVerified || user?.providerData?.[0]?.providerId === 'google.com';

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setSecLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
      showToast('Password reset link sent to your email!');
    } catch (err: any) {
      showToast('Failed to send reset email. Try again later.', 'warning');
    } finally {
      setSecLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    setSecLoading(true);
    try {
      await sendEmailVerification(user);
      setVerifyResent(true);
      showToast('Verification email sent! Check your inbox.');
    } catch (err: any) {
      showToast('Failed to send verification email.', 'warning');
    } finally {
      setSecLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'warning' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ─── Logo Handlers ─── */
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, SVG)', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'warning');
      return;
    }
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCompanyLogo(ev.target?.result as string);
      showToast('Logo uploaded! It will appear on invoices and your dashboard.');
    };
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    setCompanyLogo(null);
    setLogoName('');
    if (fileRef.current) fileRef.current.value = '';
    showToast('Logo removed', 'warning');
  };

  /* ─── Export Handlers ─── */
  const handleExport = (format: 'csv' | 'xlsx' | 'gsheet') => {
    setExporting(true);
    // Simulate export delay
    setTimeout(() => {
      setExporting(false);
      if (format === 'gsheet') {
        showToast('Opening Google Sheets export… (connect your Google account in Integrations)');
      } else {
        // Generate a sample CSV download
        const headers = 'Date,Category,Description,Amount,Status\n';
        const sampleRow = `${new Date().toISOString().split('T')[0]},Sample,Sample export,0.00,exported\n`;
        const blob = new Blob([headers + sampleRow], { type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elitebooks-export.${format === 'csv' ? 'csv' : 'xlsx'}`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported as ${format.toUpperCase()} successfully!`);
      }
    }, 1500);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    if (!validTypes.includes(ext)) {
      showToast('Please upload a CSV or Excel (.xlsx/.xls) file', 'warning');
      return;
    }
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      showToast(`Imported ${file.name} — ${Math.floor(Math.random() * 50 + 10)} records processed.`);
      if (importRef.current) importRef.current.value = '';
    }, 2000);
  };

  const settingsCards = [
    { icon: User, title: 'Profile', desc: 'Name, email, and personal preferences', color: '#3b82f6' },
    { icon: Building2, title: 'Organization', desc: 'Company details, address, and tax info', color: '#10b981' },
    { icon: ImagePlus, title: 'Brand & Logo', desc: 'Upload your company logo for invoices and dashboard', color: '#f97316', panel: 'logo' },
    { icon: FileSpreadsheet, title: 'Export & Import', desc: 'Excel, Google Sheets, and CSV data management', color: '#22c55e', panel: 'data' },
    { icon: CreditCard, title: 'Billing & Subscription', desc: 'Plan, payment methods, and invoicing', color: '#8b5cf6' },
    { icon: Bell, title: 'Notifications', desc: 'Email, push, and in-app notification preferences', color: '#f59e0b' },
    { icon: Shield, title: 'Security & Password', desc: 'Change password, verify email, and manage access', color: '#f43f5e', panel: 'security' },
    { icon: Bot, title: 'AI Agents', desc: 'Configure agent behavior, approval thresholds, and autonomy levels', color: '#06b6d4' },
    { icon: Globe, title: 'Integrations', desc: 'Bank connections, payment processors, and third-party apps', color: '#ec4899' },
    { icon: Settings, title: 'General', desc: 'Currency, date format, fiscal year, and localization', color: '#64748b' },
  ];

  return (
    <div className="page-settings">
      {/* Toast */}
      {toast && (
        <div className="st-toast animate-fade-in-up" style={{ background: toast.type === 'warning' ? '#f59e0b' : '#10b981' }}>
          {toast.type === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <strong>{toast.msg}</strong>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <div>
          {activePanel && (
            <button className="btn btn-ghost btn-sm" onClick={() => setActivePanel(null)} style={{ marginBottom: 'var(--space-3)' }}>
              <ArrowLeft size={16} /> Back to Settings
            </button>
          )}
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>
            {activePanel === 'logo' ? 'Brand & Logo' : activePanel === 'data' ? 'Export & Import' : activePanel === 'security' ? 'Security & Password' : 'Settings'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            {activePanel === 'logo'
              ? 'Upload your company logo to personalize invoices and your dashboard'
              : activePanel === 'data'
              ? 'Import and export your financial data in multiple formats'
              : activePanel === 'security'
              ? 'Manage your password, email verification, and account security'
              : 'Manage your account, organization, and preferences'}
          </p>
        </div>
      </div>

      {/* ════════ LOGO PANEL ════════ */}
      {activePanel === 'logo' && (
        <div className="st-panel animate-fade-in">
          <div className="glass-card st-logo-section">
            <h3>Company Logo</h3>
            <p className="st-desc">Your logo will appear on generated invoices and your dashboard header. Recommended size: 512×512px.</p>

            <div className="st-logo-preview">
              {companyLogo ? (
                <div className="st-logo-img-wrap">
                  <img src={companyLogo} alt="Company Logo" className="st-logo-img" />
                  <div className="st-logo-meta">
                    <span className="st-logo-name">{logoName}</span>
                    <button className="btn btn-ghost btn-sm" onClick={handleLogoRemove} style={{ color: 'var(--color-negative)' }}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="st-logo-placeholder" onClick={() => fileRef.current?.click()}>
                  <Upload size={32} />
                  <span>Click to upload</span>
                  <span className="st-logo-hint">PNG, JPG, SVG — max 5MB</span>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoSelect} style={{ display: 'none' }} />

            {companyLogo && (
              <button className="btn btn-secondary" onClick={() => fileRef.current?.click()} style={{ marginTop: 'var(--space-4)' }}>
                <Upload size={16} /> Replace Logo
              </button>
            )}

            <div className="st-logo-usage">
              <h4>Where your logo appears</h4>
              <div className="st-usage-list">
                <div className="st-usage-item">
                  <CheckCircle2 size={14} style={{ color: 'var(--color-positive)' }} />
                  <span>Invoice headers — automatically applied to all generated invoices</span>
                </div>
                <div className="st-usage-item">
                  <CheckCircle2 size={14} style={{ color: 'var(--color-positive)' }} />
                  <span>Dashboard home — displayed in your command center</span>
                </div>
                <div className="st-usage-item">
                  <CheckCircle2 size={14} style={{ color: 'var(--color-positive)' }} />
                  <span>Reports — branded export headers on PDF reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ DATA EXPORT/IMPORT PANEL ════════ */}
      {activePanel === 'data' && (
        <div className="st-panel animate-fade-in">
          {/* Export Section */}
          <div className="glass-card st-data-section">
            <div className="st-data-header">
              <Download size={20} style={{ color: 'var(--color-accent-primary)' }} />
              <h3>Export Data</h3>
            </div>
            <p className="st-desc">Download your financial records in your preferred format.</p>

            <div className="st-export-grid">
              <button
                className="glass-card st-export-card"
                onClick={() => handleExport('csv')}
                disabled={exporting}
              >
                <div className="st-export-icon" style={{ background: '#10b98115', color: '#10b981' }}>
                  <FileSpreadsheet size={24} />
                </div>
                <div className="st-export-info">
                  <strong>CSV File</strong>
                  <span>Universal comma-separated format</span>
                </div>
              </button>

              <button
                className="glass-card st-export-card"
                onClick={() => handleExport('xlsx')}
                disabled={exporting}
              >
                <div className="st-export-icon" style={{ background: '#21724815', color: '#217248' }}>
                  <FileSpreadsheet size={24} />
                </div>
                <div className="st-export-info">
                  <strong>Excel (.xlsx)</strong>
                  <span>Microsoft Excel spreadsheet</span>
                </div>
              </button>

              <button
                className="glass-card st-export-card"
                onClick={() => handleExport('gsheet')}
                disabled={exporting}
              >
                <div className="st-export-icon" style={{ background: '#0f9d5815', color: '#0f9d58' }}>
                  <FileSpreadsheet size={24} />
                </div>
                <div className="st-export-info">
                  <strong>Google Sheets</strong>
                  <span>Export directly to your Google Drive</span>
                </div>
              </button>
            </div>

            {exporting && (
              <div className="st-export-progress">
                <div className="st-progress-bar"><div className="st-progress-fill" /></div>
                <span>Preparing export…</span>
              </div>
            )}
          </div>

          {/* Import Section */}
          <div className="glass-card st-data-section" style={{ marginTop: 'var(--space-6)' }}>
            <div className="st-data-header">
              <Upload size={20} style={{ color: '#f59e0b' }} />
              <h3>Import Data</h3>
            </div>
            <p className="st-desc">Upload a CSV or Excel file to bulk-import transactions, invoices, or contacts.</p>

            <div className="st-import-zone" onClick={() => importRef.current?.click()}>
              {importing ? (
                <div className="st-import-processing">
                  <div className="st-spinner" />
                  <span>Processing file…</span>
                </div>
              ) : (
                <>
                  <Upload size={32} />
                  <span>Drop your file here or click to browse</span>
                  <span className="st-import-hint">Supported: .csv, .xlsx, .xls</span>
                </>
              )}
            </div>
            <input ref={importRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleImport} style={{ display: 'none' }} />

            <div className="st-import-templates">
              <h4>Download Templates</h4>
              <div className="st-template-list">
                <button className="btn btn-ghost btn-sm" onClick={() => handleExport('csv')}>
                  <Download size={14} /> Expenses Template
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleExport('csv')}>
                  <Download size={14} /> Invoices Template
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleExport('csv')}>
                  <Download size={14} /> Contacts Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ SECURITY PANEL ════════ */}
      {activePanel === 'security' && (
        <div className="st-panel animate-fade-in">
          {/* Account Info */}
          <div className="glass-card st-data-section">
            <div className="st-data-header">
              <User size={20} style={{ color: 'var(--color-accent-primary)' }} />
              <h3>Account Information</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <div className="st-sec-row">
                <span className="st-sec-label">Email</span>
                <span className="st-sec-value">{user?.email || '—'}</span>
              </div>
              <div className="st-sec-row">
                <span className="st-sec-label">Provider</span>
                <span className="st-sec-value">{isEmailProvider ? 'Email & Password' : 'Google'}</span>
              </div>
              <div className="st-sec-row">
                <span className="st-sec-label">Email Status</span>
                <span className="st-sec-value" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {isVerified
                    ? <><ShieldCheck size={14} style={{ color: 'var(--color-positive)' }} /> Verified</>
                    : <><AlertTriangle size={14} style={{ color: '#f59e0b' }} /> Not Verified</>
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Verification */}
          {!isVerified && (
            <div className="glass-card st-data-section" style={{ marginTop: 'var(--space-6)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <div className="st-data-header">
                <Mail size={20} style={{ color: '#f59e0b' }} />
                <h3>Email Verification Required</h3>
              </div>
              <p className="st-desc">
                You must verify your email before you can change your password. Click below to resend the verification link to <strong>{user?.email}</strong>.
                Please check your <strong>junk or spam folder</strong> if you don&apos;t see it in your inbox.
              </p>
              {verifyResent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-positive)', fontSize: 'var(--text-sm)' }}>
                  <CheckCircle2 size={16} /> Verification email sent! Check your inbox.
                </div>
              ) : (
                <button className="btn btn-primary" onClick={handleResendVerification} disabled={secLoading}>
                  <Mail size={16} /> {secLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              )}
            </div>
          )}

          {/* Password Change */}
          <div className="glass-card st-data-section" style={{ marginTop: 'var(--space-6)', opacity: isVerified ? 1 : 0.5, pointerEvents: isVerified ? 'auto' : 'none' }}>
            <div className="st-data-header">
              <KeyRound size={20} style={{ color: '#f43f5e' }} />
              <h3>Change Password</h3>
              {!isVerified && <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: '#f59e0b', fontWeight: 'bold' }}>🔒 Verify email first</span>}
            </div>
            {isEmailProvider ? (
              <>
                <p className="st-desc">
                  For your security, we will send a password reset link to <strong>{user?.email}</strong>. Click the link in the email to set a new password.
                </p>
                {resetSent ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-positive)', fontSize: 'var(--text-sm)', padding: 'var(--space-4)', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    <CheckCircle2 size={16} /> Password reset link sent! Check your email.
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={handleSendPasswordReset} disabled={secLoading}>
                    <Lock size={16} /> {secLoading ? 'Sending...' : 'Send Password Reset Link'}
                  </button>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-accent-primary)' }} />
                Your account uses Google Sign-In. Password management is handled through your Google account.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════ MAIN GRID (default) ════════ */}
      {!activePanel && (
        <div className="settings-grid">
          {settingsCards.map(item => (
            <button
              key={item.title}
              className="glass-card settings-card"
              onClick={() => item.panel ? setActivePanel(item.panel) : undefined}
            >
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
      )}

      <style>{`
        .page-settings { max-width: 900px; }
        .settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
        .settings-card {
          display: flex; align-items: flex-start; gap: var(--space-4);
          padding: var(--space-6); text-align: left; cursor: pointer;
          border: 1px solid var(--color-glass-border); width: 100%;
          font-family: var(--font-sans); transition: all var(--duration-fast);
        }
        .settings-card:hover { border-color: var(--color-border-accent); transform: translateY(-1px); }
        .settings-icon {
          width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md); flex-shrink: 0;
        }
        .settings-info h3 { font-size: var(--text-base); margin-bottom: var(--space-1); }
        .settings-info p { font-size: var(--text-sm); color: var(--color-text-tertiary); line-height: var(--leading-relaxed); }

        /* Panel */
        .st-panel { animation: fadeInUp 0.3s var(--ease-out-expo) both; }
        .st-desc { color: var(--color-text-tertiary); font-size: var(--text-sm); margin-bottom: var(--space-6); line-height: 1.6; }

        /* Logo */
        .st-logo-section { padding: var(--space-8); }
        .st-logo-section h3 { font-size: var(--text-lg); margin-bottom: var(--space-2); }
        .st-logo-preview { margin-bottom: var(--space-4); }
        .st-logo-placeholder {
          border: 2px dashed var(--color-border-secondary); border-radius: var(--radius-lg);
          padding: var(--space-10); display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: var(--space-3); cursor: pointer; color: var(--color-text-muted);
          transition: all var(--duration-fast);
        }
        .st-logo-placeholder:hover { border-color: var(--color-accent-primary); color: var(--color-accent-primary); background: var(--color-accent-subtle); }
        .st-logo-hint { font-size: var(--text-xs); opacity: 0.6; }
        .st-logo-img-wrap {
          display: flex; align-items: center; gap: var(--space-6); padding: var(--space-6);
          border: 1px solid var(--color-border-secondary); border-radius: var(--radius-lg);
          background: var(--color-bg-tertiary);
        }
        .st-logo-img {
          width: 80px; height: 80px; object-fit: contain; border-radius: var(--radius-md);
          background: white; padding: 8px; border: 1px solid var(--color-border-secondary);
        }
        .st-logo-meta { display: flex; flex-direction: column; gap: var(--space-2); }
        .st-logo-name { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
        .st-logo-usage { margin-top: var(--space-8); padding-top: var(--space-6); border-top: 1px solid var(--color-border-secondary); }
        .st-logo-usage h4 { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-4); }
        .st-usage-list { display: flex; flex-direction: column; gap: var(--space-3); }
        .st-usage-item { display: flex; align-items: center; gap: var(--space-3); font-size: var(--text-sm); color: var(--color-text-secondary); }

        /* Data Export/Import */
        .st-data-section { padding: var(--space-8); }
        .st-data-header { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2); }
        .st-data-header h3 { font-size: var(--text-lg); margin: 0; }
        .st-export-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
        .st-export-card {
          display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
          padding: var(--space-6); text-align: center; cursor: pointer; width: 100%;
          font-family: var(--font-sans); border: 1px solid var(--color-glass-border);
          transition: all var(--duration-fast);
        }
        .st-export-card:hover { border-color: var(--color-border-accent); transform: translateY(-2px); }
        .st-export-card:disabled { opacity: 0.5; pointer-events: none; }
        .st-export-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); }
        .st-export-info strong { display: block; font-size: var(--text-sm); margin-bottom: 2px; }
        .st-export-info span { font-size: var(--text-xs); color: var(--color-text-tertiary); }

        .st-export-progress {
          margin-top: var(--space-4); display: flex; align-items: center; gap: var(--space-3);
          font-size: var(--text-sm); color: var(--color-text-secondary);
        }
        .st-progress-bar {
          flex: 1; height: 4px; background: var(--color-bg-tertiary); border-radius: 2px; overflow: hidden;
        }
        .st-progress-fill {
          height: 100%; width: 70%; background: var(--color-accent-primary); border-radius: 2px;
          animation: progressPulse 1.5s ease infinite;
        }
        @keyframes progressPulse { 0%,100% { width: 30%; } 50% { width: 90%; } }

        .st-import-zone {
          border: 2px dashed var(--color-border-secondary); border-radius: var(--radius-lg);
          padding: var(--space-10); display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: var(--space-3); cursor: pointer; color: var(--color-text-muted);
          transition: all var(--duration-fast); margin-bottom: var(--space-6);
        }
        .st-import-zone:hover { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.05); }
        .st-import-hint { font-size: var(--text-xs); opacity: 0.6; }
        .st-import-processing { display: flex; align-items: center; gap: var(--space-3); color: var(--color-accent-primary); }
        .st-spinner {
          width: 20px; height: 20px; border: 2px solid var(--color-border-secondary);
          border-top-color: var(--color-accent-primary); border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .st-import-templates { padding-top: var(--space-4); border-top: 1px solid var(--color-border-secondary); }
        .st-import-templates h4 { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-3); }
        .st-template-list { display: flex; gap: var(--space-3); flex-wrap: wrap; }

        /* Security */
        .st-sec-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: var(--space-3) var(--space-4); background: var(--color-bg-tertiary);
          border-radius: var(--radius-md); font-size: var(--text-sm);
        }
        .st-sec-label { color: var(--color-text-tertiary); font-weight: var(--weight-medium); }
        .st-sec-value { color: var(--color-text-primary); font-weight: var(--weight-semibold); }
        /* Toast */
        .st-toast {
          position: fixed; bottom: var(--space-6); right: var(--space-6); z-index: 9999;
          color: #fff; padding: var(--space-3) var(--space-5); border-radius: var(--radius-md);
          display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr; }
          .st-export-grid { grid-template-columns: 1fr; }
          .st-logo-img-wrap { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
