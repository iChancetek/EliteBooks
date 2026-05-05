import Link from 'next/link';
import { 
  Brain, Zap, Shield, TrendingUp, FileText, DollarSign, 
  Users, BarChart3, ArrowRight, Sparkles, Bot, ChevronRight,
  CreditCard, Receipt, PieChart, Clock
} from 'lucide-react';
import styles from './page.module.css';

const features = [
  {
    icon: FileText,
    title: 'Smart Invoicing',
    description: 'AI generates and sends invoices automatically. Accept payments instantly via card, ACH, or bank transfer.',
    color: '#3b82f6',
  },
  {
    icon: Receipt,
    title: 'Expense Tracking',
    description: 'Bank syncing, OCR receipt capture, and AI categorization. Every dollar tracked without lifting a finger.',
    color: '#10b981',
  },
  {
    icon: BarChart3,
    title: 'Financial Reports',
    description: 'Real-time P&L, balance sheets, and cash flow statements. AI explains trends in plain language.',
    color: '#8b5cf6',
  },
  {
    icon: Users,
    title: 'Payroll Automation',
    description: 'Calculate, deduct, and distribute payroll automatically. Tax compliance built in.',
    color: '#f59e0b',
  },
  {
    icon: PieChart,
    title: 'Inventory Management',
    description: 'Track stock levels, COGS, and supplier performance. AI predicts reorder timing.',
    color: '#ec4899',
  },
  {
    icon: Shield,
    title: 'Compliance & Tax',
    description: 'Automated tax obligation tracking, filing preparation, and audit-ready reports.',
    color: '#06b6d4',
  },
];

const agents = [
  { name: 'Orchestrator', role: 'Master Controller', icon: Brain, color: '#3b82f6' },
  { name: 'Ledger', role: 'Bookkeeping', icon: FileText, color: '#10b981' },
  { name: 'Expense', role: 'Categorization', icon: Receipt, color: '#f59e0b' },
  { name: 'Invoice', role: 'Billing', icon: CreditCard, color: '#8b5cf6' },
  { name: 'Cash Flow', role: 'Forecasting', icon: TrendingUp, color: '#ec4899' },
  { name: 'Payroll', role: 'Compensation', icon: DollarSign, color: '#06b6d4' },
  { name: 'Compliance', role: 'Tax & Audit', icon: Shield, color: '#f43f5e' },
];

const stats = [
  { value: '99.9%', label: 'Accuracy Rate' },
  { value: '10x', label: 'Faster Than Manual' },
  { value: '24/7', label: 'Always Running' },
  { value: '$0', label: 'Accounting Errors' },
];

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* Background Effects */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />
      <div className={styles.bgOrb3} aria-hidden="true" />

      {/* Navigation */}
      <nav className={styles.nav} id="landing-nav">
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <img src="/NewIcon.png" alt="EliteBooks" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span className={styles.logoText}>EliteBooks</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#agents" className={styles.navLink}>AI Agents</a>
            <a href="#stats" className={styles.navLink}>Why EliteBooks</a>
          </div>
          <div className={styles.navActions}>
            <Link href="/login" className="btn btn-ghost" id="nav-login-btn">Sign In</Link>
            <Link href="/signup" className="btn btn-primary" id="nav-signup-btn">
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Bot size={14} />
            <span>Powered by 7 Autonomous AI Agents</span>
          </div>
          <h1 className={styles.heroTitle}>
            Accounting that<br />
            <span className="text-gradient">runs itself.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            EliteBooks replaces your entire accounting stack with autonomous AI agents.
            Invoicing, expenses, payroll, reporting — all automated, explained simply.
          </p>
          <div className={styles.heroActions}>
            <Link href="/signup" className={`btn btn-primary btn-lg ${styles.heroCta}`} id="hero-signup-btn">
              Start For Free
              <ArrowRight size={18} />
            </Link>
            <Link href="/features" className="btn btn-secondary btn-lg" id="hero-features-btn">
              See How It Works
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className={styles.heroTrust}>
            <Clock size={14} />
            <span>Setup in under 2 minutes · No accounting knowledge required</span>
          </div>
        </div>

        {/* Hero Visual — Command Interface Preview */}
        <div className={styles.heroVisual}>
          <div className={styles.commandPreview}>
            <div className={styles.commandHeader}>
              <div className={styles.commandDots}>
                <span /><span /><span />
              </div>
              <div className={styles.commandTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/NewIcon.png" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                <span>EliteBooks</span>
              </div>
            </div>
            <div className={styles.commandBody}>
              <div className={styles.commandPrompt}>
                <Sparkles size={18} className={styles.commandIcon} />
                <span className={styles.commandText}>What would you like to do?</span>
                <span className={styles.commandCursor} />
              </div>
              <div className={styles.commandActions}>
                {['Track my money', 'Send an invoice', 'Run payroll', 'See my profit'].map((action) => (
                  <div key={action} className={styles.commandAction}>
                    <Zap size={14} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
              <div className={styles.commandResponse}>
                <div className={styles.responseHeader}>
                  <Bot size={14} />
                  <span>EliteBooks AI</span>
                  <span className={styles.responseBadge}>Live</span>
                </div>
                <p className={styles.responseText}>
                  Your net profit this month is <strong>$24,850</strong> — up 12.3% from last month.
                  Revenue is trending well. I&apos;ve sent 3 invoices today totaling $8,200.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <h2>Everything your business needs.</h2>
          <p>Full QuickBooks-class accounting, supercharged with AI autonomy.</p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, i) => (
            <div key={feature.title} className={`${styles.featureCard} glass-card animate-fade-in-up stagger-${i + 1}`}>
              <div className={styles.featureIcon} style={{ background: `${feature.color}15`, color: feature.color }}>
                <feature.icon size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agents Section */}
      <section className={styles.agentsSection} id="agents">
        <div className={styles.sectionHeader}>
          <h2>7 AI Agents. Zero Effort.</h2>
          <p>Specialized agents work together autonomously to manage every aspect of your finances.</p>
        </div>
        <div className={styles.agentGrid}>
          {agents.map((agent) => (
            <div key={agent.name} className={styles.agentCard}>
              <div className={styles.agentIcon} style={{ background: `${agent.color}20`, color: agent.color }}>
                <agent.icon size={22} />
              </div>
              <div className={styles.agentInfo}>
                <h4>{agent.name}</h4>
                <span>{agent.role}</span>
              </div>
              <div className={styles.agentStatus}>
                <span className="status-dot status-dot-active" />
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection} id="stats">
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to automate your accounting?</h2>
          <p>Join thousands of businesses that trust EliteBooks to run their finances autonomously.</p>
          <Link href="/signup" className="btn btn-primary btn-lg" id="cta-signup-btn">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <img src="/NewIcon.png" alt="EliteBooks" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span className={styles.logoText}>EliteBooks</span>
            </div>
            <p>Accounting that runs itself, explained simply.</p>
          </div>
          <div className={styles.footerCopy}>
            <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-4)', justifyContent: 'center' }}>
              <Link href="/terms" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Terms</Link>
              <Link href="/privacy" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Privacy</Link>
              <Link href="/support" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Support</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} EliteBooks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
