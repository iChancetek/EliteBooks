import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Shield, Scale, Lock, 
  RefreshCw, Cpu, CheckCircle2, ArrowRight, 
  Layers, Users, ShieldCheck, FileCheck2, Globe
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function TermsPage() {
  const termsSections = [
    {
      id: 'acceptance',
      icon: Scale,
      title: '1. Acceptance & Corporate Authority',
      content: (
        <>
          <p>
            By accessing, integrating, or utilizing the EliteBooks autonomous accounting platform (&quot;Service&quot; or &quot;Platform&quot;), you agree on behalf of your corporate entity to be bound by these Terms of Service.
          </p>
          <p>
            You represent and warrant that you possess the full legal authority to bind your organization, its subsidiaries, and designated users to this Enterprise Master Services Agreement.
          </p>
        </>
      )
    },
    {
      id: 'agent-jurisdiction',
      icon: Cpu,
      title: '2. Autonomous Multi-Agent Swarm Jurisdictions',
      content: (
        <>
          <p>
            EliteBooks operates a coordinated multi-agent artificial intelligence swarm (including Orchestrator, Ledger, Expense, Invoicing, Cash Flow, Payroll, Financial HR, Projects, Compliance, and FinOps agents). You grant EliteBooks and its automated agents the operational authority to:
          </p>
          <ul className={styles.legalList}>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>Ingest and normalize banking transactions, credit card debits, and incoming merchant invoices.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>Post double-entry debit and credit journal entries to your designated Chart of Accounts.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>Generate commercial invoices, compute sales tax liabilities, and distribute Stripe dynamic payment links.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>Calculate employee compensation, FICA withholdings, and federal/state tax liability accruals.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>Continuously audit financial records for IRS Section 162 compliance and mathematical balance.</div>
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'hitl-governance',
      icon: Users,
      title: '3. Human-in-the-Loop (HITL) Authorization Protocols',
      content: (
        <>
          <p>
            While our agent swarm operates autonomously for standard bookkeeping tasks, EliteBooks enforces a mandatory Human-in-the-Loop (HITL) authorization protocol for all high-stakes transactions.
          </p>
          <p>
            High-value disbursements, unusual vendor charges, batch payroll runs, and tax filing submissions require explicit authorized human approval before execution. You are responsible for maintaining authorized controllers and promptly reviewing pending approvals in the Daily Intelligence Feed.
          </p>
        </>
      )
    },
    {
      id: 'ledger-integrity',
      icon: Layers,
      title: '4. Mathematical Rigor & Cryptographic Ledger Locks',
      content: (
        <>
          <p>
            All ledger entries committed by the Service conform to Generally Accepted Accounting Principles (GAAP). Reconciled transactions receive an immutable SHA-256 cryptographic audit lock.
          </p>
          <p>
            Once locked, historical general ledger records cannot be retroactively altered or deleted without generating an explicit, mathematically balanced reversing journal entry.
          </p>
        </>
      )
    },
    {
      id: 'banking-integrations',
      icon: RefreshCw,
      title: '5. Banking Feeds & Third-Party Integrations',
      content: (
        <>
          <p>
            The Service integrates with certified banking aggregators (Plaid) and payment networks (Stripe). You authorize EliteBooks to maintain read-only tokenized connections with your financial institutions. You acknowledge that third-party financial institutions may occasionally experience API latency or maintenance windows beyond our control.
          </p>
        </>
      )
    },
    {
      id: 'data-ownership',
      icon: Lock,
      title: '6. Data Ownership & Intellectual Property Sovereignty',
      content: (
        <>
          <p>
            You retain <strong>100% full, exclusive ownership</strong> of your corporate financial data, customer lists, invoice records, and proprietary ledger transactions. EliteBooks does NOT sell, monetize, or utilize your raw corporate financial data to train public foundation models without your explicit consent. You maintain the right to export your complete ledger history at any time.
          </p>
        </>
      )
    },
    {
      id: 'soc-compliance',
      icon: ShieldCheck,
      title: '7. SOC 1 (ICFR) & SOC 2 Compliance Warranties',
      content: (
        <>
          <p>
            EliteBooks warrants that its financial calculation engines maintain continuous internal controls over financial reporting (ICFR) and undergo periodic SOC 1 Type II and SOC 2 Type II independent security and accuracy audits.
          </p>
        </>
      )
    },
    {
      id: 'sla-disputes',
      icon: Globe,
      title: '8. Service Level Agreement (SLA) & Dispute Resolution',
      content: (
        <>
          <p>
            Enterprise subscription tiers receive a guaranteed 99.9% uptime SLA and sub-2-hour priority customer support. Any disputes arising under these Terms shall be resolved via binding commercial arbitration in accordance with standard corporate governance procedures.
          </p>
        </>
      )
    }
  ];

  return (
    <div className={styles.legalPage}>
      {/* Background Video & Glows */}
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
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />
      <div className={styles.bgOrb3} aria-hidden="true" />

      <PageVoiceControl contentId="terms-main-content" pageTitle="Terms of Service & Enterprise Master Agreement" />

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <img src="/NewIcon.png" alt="EliteBooks" />
            </div>
            <span className={styles.logoText}>EliteBooks</span>
          </Link>

          <div className={styles.navLinks}>
            <Link href="/features" className={styles.navLink}>Features</Link>
            <Link href="/learning" className={styles.navLink}>Masterclass</Link>
            <Link href="/support" className={styles.navLink}>Support</Link>
            <Link href="/privacy" className={styles.navLink}>Privacy</Link>
            <Link href="/terms" className={styles.navLink} style={{ color: '#60a5fa', fontWeight: 700 }}>Terms</Link>
          </div>

          <div className={styles.navActions}>
            <a 
              href="https://famio.us" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary btn-sm" 
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#f472b6', borderColor: 'rgba(236,72,153,0.3)' }}
            >
              <Sparkles size={14} style={{ color: '#ec4899' }} /> famio.us
            </a>
            <Link href="/login" className="btn btn-ghost btn-sm" style={{ fontSize: '13px' }}>
              Sign In
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.legalContent} id="terms-main-content">
        <div className={styles.legalHeader}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <Scale size={14} />
            <span>Enterprise Master Agreement · Autonomous Swarm Jurisdiction</span>
          </div>

          <h1 className={styles.heroTitle}>
            Terms of Service &<br />
            <span className="text-gradient">Enterprise Master Agreement</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Effective Date: August 17, 2026 • Governing corporate financial operations, autonomous multi-agent swarms, Human-in-the-Loop governance, and cryptographic audit locking.
          </p>

          {/* Key Governance Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100% GAAP</div>
              <div className={styles.statLabel}>Mathematical Invariant</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Mandatory HITL</div>
              <div className={styles.statLabel}>High-Value Human Signoff</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100% Client</div>
              <div className={styles.statLabel}>Full Data Ownership</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>99.9% SLA</div>
              <div className={styles.statLabel}>Enterprise Availability</div>
            </div>
          </div>
        </div>

        {/* Structured Legal Cards Grid */}
        <div className={styles.legalGrid}>
          {termsSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.id} className={styles.legalCard}>
                <div className={styles.legalCardHeader}>
                  <div className={styles.legalIconBox}>
                    <Icon size={22} />
                  </div>
                  <h2 className={styles.legalCardTitle}>{sec.title}</h2>
                </div>
                <div className={styles.legalCardBody}>
                  {sec.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* High Conversion CTA Banner */}
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Empower Your Finance Team with Elite Autonomy</h2>
          <p className={styles.ctaSubtitle}>
            Run enterprise accounting with total manual control, instant AI creation, and continuous cryptographic security.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/signup" className="btn btn-primary btn-lg" style={{ padding: '14px 32px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link href="/learning" className="btn btn-secondary btn-lg" style={{ padding: '14px 32px', fontSize: '15px' }}>
              Explore Masterclass
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/NewIcon.png" alt="EliteBooks" style={{ width: '22px', height: '22px' }} />
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px' }}>EliteBooks Terms</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>&copy; {new Date().getFullYear()} EliteBooks Financial OS. All rights reserved.</span>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/features" className={styles.footerLink}>Features</Link>
            <Link href="/learning" className={styles.footerLink}>Masterclass</Link>
            <Link href="/support" className={styles.footerLink}>Support</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
            <Link href="/terms" className={styles.footerLink} style={{ color: '#60a5fa', fontWeight: 700 }}>Terms</Link>
            <a href="https://famio.us" target="_blank" rel="noopener noreferrer" className={styles.footerLink} style={{ color: '#f472b6', fontWeight: 700 }}>famio.us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
