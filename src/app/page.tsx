import Link from 'next/link';
import { 
  Brain, Zap, Shield, TrendingUp, FileText, DollarSign, 
  Users, BarChart3, ArrowRight, Sparkles, Bot, ChevronRight,
  CreditCard, Receipt, PieChart, Clock, Wallet, ShieldCheck,
  FileCheck2, Lock, Cloud, Compass, Activity, Layers, Mic, Volume2,
  HardHat, Heart, FileSpreadsheet
} from 'lucide-react';
import styles from './page.module.css';

const features = [
  {
    icon: Sparkles,
    title: 'EliteBooks Intelligence & KPI Studio',
    description: 'Custom mathematical formula evaluator, real-time alert thresholds, and personalized 5-pillar financial explanations.',
    color: '#f59e0b',
  },
  {
    icon: HardHat,
    title: 'Project Management & Construction Financials',
    description: 'Advanced job costing, retainage tracking (5-10%), change orders, and forecast cost-to-complete (ETC) modeling.',
    color: '#3b82f6',
  },
  {
    icon: Heart,
    title: 'Financial HR & Workforce Studio',
    description: 'Integrated employee onboarding, PTO management with payroll sync, project labor timesheets, and benefits deductions.',
    color: '#ec4899',
  },
  {
    icon: ShieldCheck,
    title: 'Continuous Books Quality AI',
    description: 'Real-time 0-100 Books Health score, duplicate transaction detection, unallocated cost screening, and quarterly intelligence reports.',
    color: '#10b981',
  },
  {
    icon: FileSpreadsheet,
    title: 'Batch Studio & Excel Sync',
    description: 'High-volume batch invoicing and expense categorization with pre-execution safety previews and bi-directional Excel sync.',
    color: '#06b6d4',
  },
  {
    icon: Mic,
    title: 'Voice AI & Speech Operations',
    description: 'Speak naturally in 7 global languages to invoice clients, log expenses, and query reports with zero manual typing.',
    color: '#8b5cf6',
  },
  {
    icon: Zap,
    title: 'Dual-Mode Hybrid Workflows',
    description: 'Total manual control meets autonomous AI speed. Switch between traditional manual data entry and one-click AI creation on any page.',
    color: '#ec4899',
  },
  {
    icon: FileText,
    title: 'Smart Invoicing & Accounts Receivable',
    description: 'AI generates and sends invoices automatically. Accept payments instantly via card, ACH, or bank transfer.',
    color: '#3b82f6',
  },
  {
    icon: Receipt,
    title: 'Expense Tracking & Receipt OCR',
    description: 'Bank syncing, optical receipt capture, and IRS Section 162 categorization. Every dollar tracked with over 95% AI confidence.',
    color: '#10b981',
  },
  {
    icon: Users,
    title: 'Payroll Automation',
    description: 'Calculate, deduct, and distribute payroll automatically with Form 941 liability accruals and FICA tax compliance.',
    color: '#f59e0b',
  },
  {
    icon: FileCheck2,
    title: 'SOC 1 & SOC 2 Governance',
    description: 'Automated ICFR financial reporting controls, ASC-606 revenue verification, and zero-hallucination AI processing integrity.',
    color: '#06b6d4',
  },
  {
    icon: Lock,
    title: 'Cryptographic PII Security Vault',
    description: 'AES-256-GCM encryption for bank credentials and tax IDs with real-time heuristic fraud detection.',
    color: '#e11d48',
  },
];

const agents = [
  { name: 'Orchestrator', role: 'Master Controller', icon: Brain, color: '#3b82f6' },
  { name: 'Ledger', role: 'Bookkeeping', icon: Layers, color: '#10b981' },
  { name: 'Expense', role: 'Categorization', icon: Receipt, color: '#f43f5e' },
  { name: 'Invoice', role: 'Billing', icon: FileText, color: '#8b5cf6' },
  { name: 'Cash Flow', role: 'Forecasting', icon: Activity, color: '#06b6d4' },
  { name: 'Payroll', role: 'Compensation', icon: Users, color: '#f59e0b' },
  { name: 'HR & Workforce', role: 'People & Benefits', icon: Heart, color: '#ec4899' },
  { name: 'Projects & Job Cost', role: 'Construction & ETC', icon: HardHat, color: '#3b82f6' },
  { name: 'Compliance', role: 'Tax & Audit', icon: ShieldCheck, color: '#14b8a6' },
  { name: 'FinOps', role: 'Cloud & GPU Economics', icon: Cloud, color: '#0ea5e9' },
  { name: 'Personal Finance', role: 'Wealth & Draws', icon: DollarSign, color: '#ec4899' },
  { name: 'Fraud Sentinel', role: 'PII Vault & Security', icon: Lock, color: '#e11d48' },
];

const stats = [
  { value: '100%', label: 'SOC 1 & SOC 2 Ready' },
  { value: '99.9%', label: 'Accuracy Rate' },
  { value: '10x', label: 'Faster Than Manual' },
  { value: '24/7', label: 'Always Running' },
];

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.bgVideo}
        aria-hidden="true"
      >
        <source src="/elitebooks1.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoOverlay} aria-hidden="true" />

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
            <Link href="/learning" className={styles.navLink} style={{ color: '#06b6d4', fontWeight: 700 }}>
              Learn More
            </Link>
            <a 
              href="https://famio.us" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.navLink}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f472b6', fontWeight: 700 }}
            >
              <Sparkles size={14} style={{ color: '#ec4899' }} />
              famio.us
            </a>
          </div>
          <div className={styles.navActions}>
            <a 
              href="https://famio.us" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(139, 92, 246, 0.25))',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                color: '#f472b6',
                borderRadius: '100px',
                fontWeight: 800,
                fontSize: '12px',
                padding: '6px 14px',
                textDecoration: 'none',
              }}
            >
              <Sparkles size={13} style={{ color: '#ec4899' }} />
              famio.us
            </a>
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
          <div className={styles.heroBadge} style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.35)', color: '#22d3ee' }}>
            <ShieldCheck size={14} />
            <span>SOC 1 & SOC 2 Type II Ready · 10 Autonomous AI Agents</span>
          </div>
          <h1 className={styles.heroTitle}>
            Accounting that<br />
            <span className="text-gradient">runs itself.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            EliteBooks is an enterprise-grade AI financial operating system powered by autonomous agents and interactive voice triggers that handle invoicing, expenses, payroll, reporting, FinOps, and personal wealth — backed by total manual control and continuous SOC 1 & SOC 2 Type II trust controls.
          </p>
          <div className={styles.heroActions}>
            <Link href="/signup" className={`btn btn-primary btn-lg ${styles.heroCta}`} id="hero-signup-btn">
              Start For Free
              <ArrowRight size={18} />
            </Link>
            <Link href="/learning" className="btn btn-secondary btn-lg" id="hero-learning-btn">
              Learn More
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className={styles.heroTrust}>
            <ShieldCheck size={15} color="#10b981" />
            <span>SOC 1 (SSAE 18) ICFR · SOC 2 Type II · Whisper STT Voice Triggers · SHA-256 Audit Trail</span>
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
                <span className={styles.commandText}>Speak or type your financial request...</span>
                <span className={styles.commandCursor} />
              </div>
              <div className={styles.commandActions}>
                {['"Invoice Acme Corp $15k"', '"Log $120 office lunch"', '"Run current payroll"', 'SOC Compliance Check'].map((action) => (
                  <div key={action} className={styles.commandAction}>
                    <Zap size={14} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
              <div className={styles.commandResponse}>
                <div className={styles.responseHeader}>
                  <Bot size={14} />
                  <span>EliteBooks AI (Voice & Multi-Agent Swarm)</span>
                  <span className={styles.responseBadge}>Verified</span>
                </div>
                <p className={styles.responseText}>
                  Voice intent transcribed via Whisper. All 6 continuous SOC 1 & SOC 2 controls verified. Double-entry trial balance is in equilibrium ($0 variance). Prepared invoice draft for Acme Corp ($15,000, Net 30).
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
          <p>Full QuickBooks-class accounting, supercharged with AI autonomy and continuous SOC compliance.</p>
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
          <h2>10 AI Agents. Zero Effort.</h2>
          <p>Specialized domain agents collaborate autonomously to manage every aspect of your enterprise finances.</p>
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
          <p>Join businesses that trust EliteBooks for autonomous, SOC 1 & SOC 2 certified financial operations.</p>
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
            <p>Accounting and wealth management that runs itself, backed by continuous SOC 1 & SOC 2 Type II governance.</p>
          </div>
          <div className={styles.footerCopy}>
            <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-4)', justifyContent: 'center' }}>
              <Link href="/learning" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Learn More</Link>
              <Link href="/terms" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Terms</Link>
              <Link href="/privacy" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Privacy</Link>
              <Link href="/support" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Support</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} EliteBooks. All rights reserved. | ChanceTEK LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
