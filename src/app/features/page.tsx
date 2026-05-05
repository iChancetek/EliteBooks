import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Brain, Receipt, FileText, 
  CreditCard, TrendingUp, DollarSign, Shield, ArrowRight,
  BarChart3, Users, PieChart, CheckCircle2, ArrowUpRight,
  Network, Library, Link2, Mic, Headphones, Cloud
} from 'lucide-react';
import styles from './page.module.css';

const fullFeatures = [
  {
    id: 'invoicing',
    icon: FileText,
    title: 'Smart Invoicing & Billing',
    subtitle: 'Get paid faster with AI-generated invoices.',
    description: 'EliteBooks automatically drafts invoices based on your contracts and past billing history. It sends smart reminders to clients before due dates and handles payment processing instantly via credit card, ACH, or wire transfer.',
    color: '#3b82f6',
    bullets: ['Automated recurring billing', 'Customizable invoice templates', 'Smart follow-up sequences', 'Multi-currency support'],
    agent: { name: 'Invoice Agent', icon: CreditCard }
  },
  {
    id: 'expenses',
    icon: Receipt,
    title: 'Automated Expense Tracking',
    subtitle: 'Zero-touch receipt capture and categorization.',
    description: 'Connect your bank accounts and let EliteBooks do the rest. Our AI scans receipts via OCR, matches them to bank transactions, and automatically categorizes them according to IRS tax codes to maximize your deductions.',
    color: '#10b981',
    bullets: ['Plaid bank synchronization', 'Receipt OCR & email parsing', 'Automatic tax categorization', 'Duplicate charge detection'],
    agent: { name: 'Expense Agent', icon: Receipt }
  },
  {
    id: 'reports',
    icon: BarChart3,
    title: 'Real-Time Financial Reports',
    subtitle: 'Know exactly where your business stands.',
    description: 'Generate accurate Profit & Loss statements, Balance Sheets, and Cash Flow statements instantly. EliteBooks uses Natural Language Processing—just ask "What was my margin on software last month?" to get an instant answer.',
    color: '#8b5cf6',
    bullets: ['Interactive P&L & Balance Sheets', 'NLP report generation', 'Visual charting & forecasting', 'One-click export for CPAs'],
    agent: { name: 'Cash Flow Agent', icon: TrendingUp }
  },
  {
    id: 'payroll',
    icon: Users,
    title: 'Autonomous Payroll',
    subtitle: 'Pay your team on time, every time.',
    description: 'Manage W-2 employees and 1099 contractors in one place. The system calculates federal and state tax deductions, handles direct deposits, and files compliance forms automatically at the end of the year.',
    color: '#f59e0b',
    bullets: ['Automated tax withholdings', 'Contractor & Employee support', 'Direct deposit integration', 'Automated W-2/1099 generation'],
    agent: { name: 'Payroll Agent', icon: DollarSign }
  },
  {
    id: 'inventory',
    icon: PieChart,
    title: 'Intelligent Inventory',
    subtitle: 'Never run out of your best sellers.',
    description: 'Track stock levels across multiple locations in real time. The system calculates Cost of Goods Sold (COGS) dynamically and uses predictive AI to alert you before you run out of fast-moving items.',
    color: '#ec4899',
    bullets: ['Multi-location tracking', 'Predictive reorder alerts', 'Dynamic COGS calculation', 'Supplier performance tracking'],
    agent: { name: 'Ledger Agent', icon: FileText }
  },
  {
    id: 'compliance',
    icon: Shield,
    title: 'Tax & Compliance',
    subtitle: 'Audit-proof your business effortlessly.',
    description: 'EliteBooks continuously monitors your transactions against the latest tax laws. It flags missing compliance documents, prepares quarterly estimated tax filings, and keeps an immutable audit log of every change.',
    color: '#06b6d4',
    bullets: ['Quarterly tax estimations', 'Compliance document monitoring', 'Immutable audit trails', 'Instant CPA access'],
    agent: { name: 'Compliance Agent', icon: Shield }
  },
  {
    id: 'orchestrator',
    icon: Network,
    title: 'Autonomous Orchestrator',
    subtitle: 'The master brain coordinating your team.',
    description: 'The Orchestrator agent manages the communication between all specialized agents. It plans workflows, delegates tasks (like matching a receipt to a journal entry), and ensures that every part of your financial system is in sync without manual intervention.',
    color: '#6366f1',
    bullets: ['Cross-agent coordination', 'Automated task delegation', 'Conflict resolution', 'Continuous system monitoring'],
    agent: { name: 'Orchestrator Agent', icon: Brain }
  },
  {
    id: 'bookkeeping',
    icon: Library,
    title: 'Professional Bookkeeping',
    subtitle: 'Enterprise-grade accounting logic.',
    description: 'Go beyond simple tracking. EliteBooks handles full double-entry bookkeeping, allowing you to generate professional trial balances and journal entries. Perfect for growing businesses that need high-precision financial control.',
    color: '#0ea5e9',
    bullets: ['Double-entry ledger system', 'Automated journal entries', 'Precise trial balances', 'GAAP/IFRS compliance support'],
    agent: { name: 'Ledger Agent', icon: FileText }
  },
  {
    id: 'reconciliation',
    icon: Link2,
    title: 'Bank Reconciliation',
    subtitle: 'Never lose track of a single cent.',
    description: 'EliteBooks automatically compares your bank statements with your internal ledger. It flags discrepancies, identifies missing transactions, and helps you reconcile accounts in minutes rather than hours.',
    color: '#14b8a6',
    bullets: ['Automated bank matching', 'Discrepancy detection', 'Balance verification', 'Multi-account support'],
    agent: { name: 'Ledger Agent', icon: FileText }
  },
  {
    id: 'voice',
    icon: Mic,
    title: 'Voice Intelligence',
    subtitle: 'Talk to your books, in any language.',
    description: 'Use natural language to interact with your financial data. Record voice notes to log expenses, ask questions about your profit, or dictate invoice details. Powered by advanced STT and TTS technology.',
    color: '#f43f5e',
    bullets: ['Multi-lingual support', 'Natural language queries', 'Voice-to-action commands', 'Premium AI voices'],
    agent: { name: 'Orchestrator Agent', icon: Headphones }
  },
  {
    id: 'finops',
    icon: TrendingUp,
    title: 'Cloud FinOps',
    subtitle: 'Master your cloud economics.',
    description: 'Optimize your infrastructure spending with dedicated FinOps intelligence. Track unit economics, identify waste, and automate commitment-based discounts across your entire cloud stack.',
    color: '#8b5cf6',
    bullets: ['Cloud spend forecasting', 'Resource efficiency tracking', 'Automated cost optimization', 'Departmental cost allocation'],
    agent: { name: 'FinOps Agent', icon: Cloud }
  }
];

export default function FeaturesPage() {
  return (
    <div className={styles.featuresPage}>
      {/* Background Effects */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />
      
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Sparkles size={20} />
            </div>
            <span className={styles.logoText}>EliteBooks</span>
          </Link>
          <div className={styles.navActions}>
            <Link href="/" className="btn btn-ghost">Home</Link>
            <Link href="/signup" className="btn btn-primary">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      <main className={styles.featuresContent}>
        <div className={styles.heroSection}>
          <div className={styles.heroBadge}>
            <Brain size={14} />
            <span>Deep Dive</span>
          </div>
          <h1 className={styles.heroTitle}>
            Everything you need to run <br/>
            <span className="text-gradient">autonomous finance.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            EliteBooks isn&apos;t just software—it&apos;s a team of 7 specialized AI agents working together to handle your accounting, from invoices to tax season.
          </p>
        </div>

        <div className={styles.featureList}>
          {fullFeatures.map((feature, idx) => (
            <div key={feature.id} id={feature.id} className={`${styles.featureRow} ${idx % 2 !== 0 ? styles.rowReversed : ''}`}>
              <div className={styles.featureText}>
                <div className={styles.featureIconLarge} style={{ color: feature.color, background: `${feature.color}15` }}>
                  <feature.icon size={32} />
                </div>
                <h2>{feature.title}</h2>
                <p className={styles.featureSub}>{feature.subtitle}</p>
                <p className={styles.featureDesc}>{feature.description}</p>
                
                <ul className={styles.featureBullets}>
                  {feature.bullets.map(b => (
                    <li key={b}><CheckCircle2 size={16} style={{ color: 'var(--color-positive)' }} /> {b}</li>
                  ))}
                </ul>

                <div className={styles.agentTag}>
                  <span>Powered by:</span>
                  <div className={styles.agentTagBadge}>
                    <feature.agent.icon size={14} />
                    {feature.agent.name}
                  </div>
                </div>
              </div>
              
              <div className={styles.featureVisual}>
                {feature.id === 'invoicing' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-secondary)', paddingBottom: '1rem' }}>
                      <div style={{ fontWeight: 'bold' }}>Invoice #INV-2026</div>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Paid</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Acme Corporation</span>
                      <span style={{ fontWeight: 'bold' }}>$4,500.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Software Development</span>
                    </div>
                    <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.85rem' }}>
                        <CheckCircle2 size={16} /> AI Auto-Reminded on Apr 12
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'expenses' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--color-bg-tertiary)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: '#00704a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>☕</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>Starbucks</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>Apr 15, 2026</div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: 'var(--color-negative)' }}>-$8.45</div>
                    </div>
                    <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem' }}>
                        <CheckCircle2 size={16} /> Categorized as: Meals & Entertainment
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'reports' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '150px', borderBottom: '1px solid var(--color-border-secondary)' }}>
                      {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: i === 6 ? '#8b5cf6' : 'var(--color-bg-tertiary)', height: `${h}%`, borderRadius: '4px 4px 0 0', transition: 'all 0.3s' }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Net Profit</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$24,500</div>
                      </div>
                      <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ArrowUpRight size={16} /> +12%
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'payroll' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    {[
                      { name: 'Sarah Johnson', role: 'Engineering', amt: '$8,500' },
                      { name: 'Michael Chen', role: 'Design', amt: '$6,200' },
                      { name: 'Emma Davis', role: 'Marketing', amt: '$5,800' }
                    ].map((emp, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--color-bg-tertiary)', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{emp.role}</div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{emp.amt}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 'auto', padding: '0.75rem', background: '#f59e0b', color: 'white', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Run Payroll
                    </div>
                  </div>
                )}
                {feature.id === 'inventory' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-secondary)' }}>
                      <span style={{ fontWeight: 'bold' }}>MacBook Pro 16"</span>
                      <span style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Low Stock</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, background: 'var(--color-bg-tertiary)', height: '8px', borderRadius: '4px' }}>
                        <div style={{ width: '15%', background: '#f43f5e', height: '100%', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>3 Left</span>
                    </div>
                    <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', fontSize: '0.85rem' }}>
                        <Sparkles size={16} /> AI reordered 10 units
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'compliance' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <Shield size={48} style={{ color: '#06b6d4', margin: '0 auto', opacity: 0.8 }} />
                      <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Audit Log Intact</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Q2 Estimated Taxes Filed
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={14} style={{ color: '#10b981' }} /> W-9s Collected (12/12)
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Anomalies Detected: 0
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'orchestrator' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: `radial-gradient(circle at center, ${feature.color}, transparent)` }} />
                    <Brain size={80} style={{ color: feature.color, zIndex: 1 }} />
                  </div>
                )}
                {feature.id === 'bookkeeping' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>TRIAL BALANCE — APR 2026</div>
                    {[
                      { acc: 'Cash & Equivalents', d: '$124,500', c: '-' },
                      { acc: 'Accounts Receivable', d: '$42,300', c: '-' },
                      { acc: 'Retained Earnings', d: '-', c: '$166,800' }
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '0.5rem', background: i % 2 === 0 ? 'var(--color-bg-tertiary)' : 'transparent', fontSize: '0.85rem' }}>
                        <span>{row.acc}</span>
                        <span style={{ textAlign: 'right' }}>{row.d}</span>
                        <span style={{ textAlign: 'right' }}>{row.c}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border-secondary)', paddingTop: '0.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      <span>Total</span>
                      <span style={{ textAlign: 'right' }}>$166,800</span>
                      <span style={{ textAlign: 'right' }}>$166,800</span>
                    </div>
                  </div>
                )}
                {feature.id === 'reconciliation' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                      <div style={{ flex: 1, background: 'var(--color-bg-tertiary)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>BANK STATEMENT</div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>$12,450.00</div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--color-bg-tertiary)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>INTERNAL LEDGER</div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>$12,450.00</div>
                      </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '8px', border: '1px solid rgba(20, 184, 166, 0.2)', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#14b8a6', fontWeight: 'bold' }}>
                        <CheckCircle2 size={18} /> Perfectly Reconciled
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'voice' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '4px', height: '60px', alignItems: 'center' }}>
                      {[30, 50, 80, 40, 90, 60, 40, 70, 40, 30].map((h, i) => (
                        <div key={i} style={{ width: '4px', height: `${h}%`, background: feature.color, borderRadius: '2px' }} />
                      ))}
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--color-bg-tertiary)', borderRadius: '12px', border: '1px solid var(--color-border-primary)', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                      "EliteBooks, what was my total revenue last week?"
                    </div>
                  </div>
                )}
                {feature.id === 'finops' && (
                  <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Cloud Efficiency Score</div>
                      <div style={{ color: 'var(--color-positive)', fontWeight: 'bold' }}>84%</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                      {[30, 45, 60, 40, 75, 50, 90].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: i === 6 ? feature.color : 'var(--color-bg-tertiary)', height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
                      ))}
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)', fontSize: '0.8rem' }}>
                      <div style={{ color: feature.color, fontWeight: 'bold', marginBottom: '2px' }}>AI Optimization</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>Saved $420/mo via RI conversion</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to automate your accounting?</h2>
          <p>Join thousands of businesses that trust EliteBooks to run their finances autonomously.</p>
          <Link href="/signup" className="btn btn-primary btn-lg">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Sparkles size={18} />
              </div>
              <span className={styles.logoText}>EliteBooks</span>
            </div>
            <p>Accounting that runs itself.</p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/support">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
