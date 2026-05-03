import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Brain, Receipt, FileText, 
  CreditCard, TrendingUp, DollarSign, Shield, ArrowRight,
  BarChart3, Users, PieChart, CheckCircle2
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
                <div className="glass-card" style={{ width: '100%', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', border: `1px solid ${feature.color}30`, background: 'var(--color-bg-elevated)' }}>
                  <feature.icon size={64} style={{ color: feature.color, opacity: 0.5 }} />
                  <span style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>Interactive UI Component</span>
                </div>
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

      <style>{`
        .${styles.featuresPage} { min-height: 100vh; position: relative; overflow-x: hidden; background: var(--color-bg-primary); }
        .${styles.bgMesh} { position: fixed; inset: 0; background: radial-gradient(circle at center, rgba(147, 51, 234, 0.03) 0%, transparent 100%); pointer-events: none; z-index: 0; }
        .${styles.bgOrb1} { position: absolute; top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        .${styles.bgOrb2} { position: absolute; bottom: 20%; right: -10%; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        
        .${styles.nav} { position: relative; z-index: 10; border-bottom: 1px solid var(--color-border-primary); background: rgba(10, 10, 10, 0.5); backdrop-filter: blur(12px); position: sticky; top: 0; }
        .${styles.navInner} { max-width: 1200px; margin: 0 auto; padding: var(--space-4) var(--space-6); display: flex; align-items: center; justify-content: space-between; }
        .${styles.logo} { display: flex; align-items: center; gap: var(--space-2); text-decoration: none; }
        .${styles.logoIcon} { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary)); border-radius: var(--radius-md); color: white; }
        .${styles.logoText} { font-weight: var(--weight-bold); font-size: var(--text-lg); color: var(--color-text-primary); letter-spacing: -0.02em; }
        .${styles.navActions} { display: flex; gap: var(--space-4); }

        .${styles.featuresContent} { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: var(--space-16) var(--space-6); }
        
        .${styles.heroSection} { text-align: center; max-width: 800px; margin: 0 auto var(--space-24); display: flex; flex-direction: column; align-items: center; }
        .${styles.heroBadge} { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: 100px; font-size: var(--text-xs); color: var(--color-text-secondary); margin-bottom: var(--space-6); }
        .${styles.heroTitle} { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: var(--weight-extrabold); line-height: 1.1; margin-bottom: var(--space-6); letter-spacing: -0.03em; color: var(--color-text-primary); }
        .${styles.heroSubtitle} { font-size: var(--text-xl); color: var(--color-text-secondary); line-height: 1.5; }

        .${styles.featureList} { display: flex; flex-direction: column; gap: var(--space-32); }
        .${styles.featureRow} { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); align-items: center; }
        .${styles.rowReversed} { direction: rtl; }
        .${styles.rowReversed} > * { direction: ltr; }
        
        @media (max-width: 900px) {
          .${styles.featureRow} { grid-template-columns: 1fr; gap: var(--space-8); }
          .${styles.rowReversed} { direction: ltr; }
        }

        .${styles.featureText} { display: flex; flex-direction: column; gap: var(--space-4); }
        .${styles.featureIconLarge} { width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-lg); margin-bottom: var(--space-2); }
        .${styles.featureText} h2 { font-size: var(--text-3xl); font-weight: var(--weight-bold); color: var(--color-text-primary); }
        .${styles.featureSub} { font-size: var(--text-lg); color: var(--color-text-primary); font-weight: var(--weight-medium); }
        .${styles.featureDesc} { font-size: var(--text-md); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-4); }
        
        .${styles.featureBullets} { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); list-style: none; padding: 0; margin-bottom: var(--space-6); }
        @media (max-width: 600px) { .${styles.featureBullets} { grid-template-columns: 1fr; } }
        .${styles.featureBullets} li { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-text-secondary); }
        
        .${styles.agentTag} { display: inline-flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--color-bg-elevated); border: 1px solid var(--color-border-secondary); border-radius: var(--radius-md); width: fit-content; }
        .${styles.agentTag} span { font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
        .${styles.agentTagBadge} { display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-primary); font-size: var(--text-sm); font-weight: var(--weight-medium); }

        .${styles.featureVisual} { width: 100%; position: relative; perspective: 1000px; }

        .${styles.ctaSection} { padding: var(--space-24) var(--space-6); position: relative; z-index: 10; margin-top: var(--space-20); border-top: 1px solid var(--color-border-primary); }
        .${styles.ctaContent} { max-width: 800px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-6); }
        .${styles.ctaContent} h2 { font-size: var(--text-4xl); font-weight: var(--weight-bold); color: var(--color-text-primary); letter-spacing: -0.02em; }
        .${styles.ctaContent} p { font-size: var(--text-xl); color: var(--color-text-secondary); }

        .${styles.footer} { border-top: 1px solid var(--color-border-primary); padding: var(--space-8) 0; position: relative; z-index: 10; background: var(--color-bg-primary); }
        .${styles.footerInner} { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); display: flex; justify-content: space-between; align-items: center; }
        @media (max-width: 600px) { .${styles.footerInner} { flex-direction: column; gap: var(--space-6); text-align: center; } }
        .${styles.footerBrand} p { color: var(--color-text-tertiary); font-size: var(--text-sm); margin-top: var(--space-2); }
        .${styles.footerLinks} { display: flex; gap: var(--space-6); }
        .${styles.footerLinks} a { color: var(--color-text-secondary); text-decoration: none; font-size: var(--text-sm); transition: color 0.2s; }
        .${styles.footerLinks} a:hover { color: var(--color-text-primary); }
      `}</style>
    </div>
  );
}
