import Link from 'next/link';
import { Sparkles, ArrowLeft, Shield, CheckCircle, Scale, Lock, RefreshCw, Cpu } from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function TermsPage() {
  return (
    <div className={styles.legalPage}>
      {/* Background Effects */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      
      <PageVoiceControl contentId="terms-main-content" pageTitle="Terms of Service" />

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Sparkles size={20} />
            </div>
            <span className={styles.logoText}>EliteBooks</span>
          </Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a 
              href="https://famio.us" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#f472b6', borderColor: 'rgba(236,72,153,0.3)' }}
            >
              <Sparkles size={14} style={{ color: '#ec4899' }} /> famio.us
            </a>
            <Link href="/dashboard" className="btn btn-secondary" style={{ fontSize: '13px' }}>
              Dashboard
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <ArrowLeft size={16} /> Home
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.legalContent} id="terms-main-content">
        <div className={styles.legalHeader}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
            <Scale size={12} /> Enterprise Master Agreement
          </div>
          <h1>Terms of Service</h1>
          <p>Effective Date: August 17, 2026 • Governing Corporate Operations & Autonomous Agent Systems</p>
        </div>

        <div className={`glass-card ${styles.legalBody}`}>
          <section>
            <h2>1. Acceptance & Corporate Authority</h2>
            <p>
              By accessing, integrating, or utilizing the EliteBooks autonomous accounting platform (&quot;Service&quot; or &quot;Platform&quot;), you agree on behalf of your corporate entity to be bound by these Terms of Service. You represent and warrant that you possess the full legal authority to bind your organization to these terms.
            </p>
          </section>

          <section>
            <h2>2. Autonomous Multi-Agent Jurisdictions</h2>
            <p>
              EliteBooks operates a coordinated multi-agent artificial intelligence network (including Orchestrator, Ledger, Expense, Invoicing, Cash Flow, Payroll, Compliance, and FinOps agents). You grant EliteBooks and its automated agents the operational authority to:
            </p>
            <ul>
              <li>Ingest and normalize banking transactions, credit card debits, and incoming merchant invoices.</li>
              <li>Post double-entry debit and credit journal entries to your designated Chart of Accounts.</li>
              <li>Generate commercial invoices, compute sales tax liabilities, and distribute payment links.</li>
              <li>Calculate employee compensation, FICA withholdings, and federal/state tax accruals.</li>
              <li>Continuously audit financial records for IRS Section 162 compliance and variance anomalies.</li>
            </ul>
          </section>

          <section>
            <h2>3. Human-in-the-Loop (HITL) Authorization Protocols</h2>
            <p>
              While our agent swarm operates autonomously for standard bookkeeping tasks, EliteBooks enforces a mandatory Human-in-the-Loop (HITL) authorization protocol for all high-stakes transactions. High-value disbursements, unusual vendor charges, batch payroll runs, and tax filing submissions require explicit authorized human approval before execution. You are responsible for maintaining authorized controllers and promptly reviewing pending approvals in the Daily Intelligence Feed.
            </p>
          </section>

          <section>
            <h2>4. Mathematical Rigor & Ledger Integrity</h2>
            <p>
              All ledger entries committed by the Service conform to Generally Accepted Accounting Principles (GAAP). Once reconciled and locked with our SHA-256 cryptographic audit seal, historical ledger records cannot be retroactively altered without generating an explicit, balanced reversing entry.
            </p>
          </section>

          <section>
            <h2>5. Banking Feeds & Third-Party Integrations</h2>
            <p>
              The Service integrates with certified banking aggregators (Plaid) and payment networks (Stripe). You authorize EliteBooks to maintain read-only tokenized connections with your financial institutions. You acknowledge that third-party financial institutions may occasionally experience API latency or maintenance windows beyond our control.
            </p>
          </section>

          <section>
            <h2>6. Data Ownership & Intellectual Property</h2>
            <p>
              You retain 100% full, exclusive ownership of your corporate financial data, customer lists, invoice records, and proprietary ledger transactions. EliteBooks does NOT sell, monetize, or utilize your raw corporate financial data to train public foundation models without your explicit consent. You maintain the right to export your complete ledger history at any time.
            </p>
          </section>

          <section>
            <h2>7. Service Level Agreement (SLA) & Uptime</h2>
            <p>
              EliteBooks guarantees a 99.9% uptime commitment for our enterprise API and agent runtime, excluding scheduled maintenance windows notified at least 24 hours in advance.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              EliteBooks provides autonomous accounting tools designed to assist financial management. While our agents operate with state-of-the-art accuracy, the platform does not serve as a certified public accounting (CPA) firm or legal tax counsel. Ultimate fiduciary responsibility for regulatory filings remains with your corporate officers. To the maximum extent permitted by applicable law, EliteBooks shall not be liable for indirect, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2>9. Dispute Resolution & Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any dispute arising out of or relating to these Terms shall be resolved through binding commercial arbitration.
            </p>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>&copy; {new Date().getFullYear()} EliteBooks. All rights reserved. Autonomous Financial Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
