import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Bot, ShieldCheck, 
  Layers, Cpu, Cloud, DollarSign, 
  Receipt, Users, Lock, Compass, Activity, FileText, CheckCircle2,
  FileCheck2, ShieldAlert
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function LearningPage() {
  const agents = [
    {
      name: 'Orchestrator Agent',
      role: 'Master Intent Router & Handoff Coordinator',
      icon: Compass,
      color: '#3b82f6',
      description: 'Resolves natural language queries, routes tasks across specialized sub-agents, and enforces Human-in-the-Loop governance.',
      tags: ['GPT-5.6-Terra', 'LangGraph', 'HITL Governance']
    },
    {
      name: 'Ledger Agent',
      role: 'Double-Entry Bookkeeping & General Ledger',
      icon: Layers,
      color: '#10b981',
      description: 'Maintains GAAP-compliant mathematical balance, translates transactions into balanced debits and credits, and generates cryptographic audit locks.',
      tags: ['GAAP Balanced', 'SHA-256 Lock', 'Chart of Accounts']
    },
    {
      name: 'Expense Agent',
      role: 'OCR Ingestion, Categorization & IRS 162',
      icon: Receipt,
      color: '#f43f5e',
      description: 'Extracts line items from receipts, normalizes vendor names, checks Section 162 tax deductibility, and detects anomalies.',
      tags: ['Receipt OCR', 'IRS Sec 162', 'Cloud Services Tagging']
    },
    {
      name: 'Invoicing Agent',
      role: 'Accounts Receivable & Payment Collection',
      icon: FileText,
      color: '#8b5cf6',
      description: 'Generates itemized commercial invoices, creates Stripe dynamic payment links, and handles automated courteous payment reminders.',
      tags: ['Stripe Integration', 'Automated AR', 'Aging Reports']
    },
    {
      name: 'Cash Flow Agent',
      role: 'Predictive Runway & Scenario Simulator',
      icon: Activity,
      color: '#06b6d4',
      description: 'Projects 30, 60, and 90-day cash positions with Monte Carlo simulations, tracking burn rates and liquidity horizons.',
      tags: ['90-Day Runway', 'Monte Carlo', 'Burn Velocity']
    },
    {
      name: 'Payroll Agent',
      role: 'Compensation, Tax Withholdings & Form 941',
      icon: Users,
      color: '#f59e0b',
      description: 'Executes zero-touch payroll runs, calculates FICA and Circular E withholdings, and generates Form 941 liability accruals.',
      tags: ['IRS Circular E', 'FICA Match', 'Form 941']
    },
    {
      name: 'Compliance Agent',
      role: 'Audit Defense & Regulatory Verification',
      icon: ShieldCheck,
      color: '#14b8a6',
      description: 'Continuously audits ledger entries against SEC, FINRA, and multi-state sales tax regulations, compiling full audit defense dossiers.',
      tags: ['Audit Dossier', 'Sales Tax', '1099 Tracking']
    },
    {
      name: 'FinOps Agent',
      role: 'Cloud Cost Intelligence & Unit Economics',
      icon: Cloud,
      color: '#0ea5e9',
      description: 'Tracks compute, storage, and AI inference spend across AWS, Azure, GCP, OpenAI, and Anthropic, computing cost per customer and query.',
      tags: ['Multi-Cloud', 'GPU Tracking', 'Unit Economics']
    },
    {
      name: 'Personal Finance Agent',
      role: 'Executive Wealth & Founder Draw Strategy',
      icon: DollarSign,
      color: '#ec4899',
      description: 'Coordinates founder distributions, tracks estimated tax reserves, and preserves strict corporate-personal account segregation.',
      tags: ['Executive Draws', '1040-ES Reserves', 'Personal Ledger']
    },
    {
      name: 'Fraud Sentinel & PII Vault',
      role: 'Cryptographic Privacy & Anomaly Guard',
      icon: Lock,
      color: '#e11d48',
      description: 'Tokenizes sensitive financial PII with AES-256-GCM encryption and scans ledger activity for unauthorized wire patterns or tampering.',
      tags: ['AES-256-GCM', 'PII Redaction', 'Heuristic Defense']
    }
  ];

  return (
    <div className={styles.learningPage}>
      <div className={styles.bgMesh} aria-hidden="true" />

      {/* Multilingual Voice Engine Controller */}
      <PageVoiceControl contentId="learning-main-content" pageTitle="AI Accounting Masterclass" />

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Sparkles size={20} />
            </div>
            <span>EliteBooks</span>
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
              Enter Dashboard
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <ArrowLeft size={16} /> Home
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.learningContent} id="learning-main-content">
        <header className={styles.heroHeader}>
          <div className={styles.badge}>
            <Cpu size={14} /> Masterclass Architecture Hub
          </div>
          <h1>The Autonomous Accounting Engine</h1>
          <p>
            An in-depth technical masterclass on how multi-agent artificial intelligence, double-entry mathematical rigor, and real-time banking feeds combine to deliver self-running corporate accounting.
          </p>
        </header>

        <div className={styles.chapterGrid}>
          {/* Chapter 1 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 01</span>
              <h2>The Autonomous Accounting Paradigm</h2>
            </div>
            <p>
              Traditional financial accounting relies on human operators manually keying in receipts, matching bank statements weeks after transactions clear, and reconciling general ledgers in stressful month-end sprints.
            </p>
            <p>
              EliteBooks establishes an entirely autonomous paradigm: every business transaction is captured immediately upon occurrence, analyzed for tax deductibility under IRS Section 162, balanced into double-entry debit/credit ledger accounts, and locked with a cryptographic SHA-256 hash.
            </p>
          </section>

          {/* Chapter 2 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 02</span>
              <h2>The Multi-Agent Swarm Ecosystem</h2>
            </div>
            <p>
              EliteBooks replaces monolithic algorithms with a coordinated swarm of 10 specialized autonomous domain agents powered by GPT-5.6-Terra. Each agent operates with defined jurisdictional authority, communicating via LangGraph state graphs and Agent-to-Agent (A2A) consensus protocols:
            </p>

            <div className={styles.agentsGrid}>
              {agents.map(ag => (
                <div key={ag.name} className={styles.agentCard}>
                  <div className={styles.agentCardHeader}>
                    <div className={styles.agentIconBox} style={{ background: `${ag.color}20`, color: ag.color }}>
                      <ag.icon size={20} />
                    </div>
                    <div>
                      <h3>{ag.name}</h3>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{ag.role}</span>
                    </div>
                  </div>
                  <p>{ag.description}</p>
                  <div className={styles.agentMetrics}>
                    {ag.tags.map(t => (
                      <span key={t} className={styles.agentTag}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chapter 3 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 03</span>
              <h2>Double-Entry Mathematical Rigor</h2>
            </div>
            <p>
              AI intelligence is worthless in accounting without mathematical certainty. In EliteBooks, no transaction is committed without strict enforcement of Fra Luca Pacioli’s equation: <code>Assets = Liabilities + Equity</code>.
            </p>
            <p>
              When an invoice is issued, the Invoicing Agent debits Accounts Receivable and credits Revenue. When payment is received, the Ledger Agent debits Cash and credits Accounts Receivable. Every journal entry is verified by the Compliance Agent and sealed against historical modification.
            </p>
          </section>

          {/* Chapter 4 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 04</span>
              <h2>Cloud FinOps & Unit Economics</h2>
            </div>
            <p>
              Modern technology businesses incur their largest operating expenses across cloud infrastructure and AI compute. The FinOps Cloud Intelligence Agent tracks granular billing across Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), OpenAI, and Anthropic.
            </p>
            <p>
              Beyond raw expense tracking, FinOps calculates real-time unit economics: determining your exact compute cost per active user, storage cost per tenant, and inference cost per model generation.
            </p>
          </section>

          {/* Chapter 5 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 05</span>
              <h2>Human-in-the-Loop (HITL) Governance</h2>
            </div>
            <p>
              Autonomous execution does not mean unmonitored risk. EliteBooks enforces strict Human-in-the-Loop (HITL) checkpoints for all transactions that exceed preset risk or budget thresholds (such as high-value cloud anomalies or payroll runs).
            </p>
            <p>
              When an anomaly is flagged, the agent compiles a verified evidence dossier and presents an interactive authorization request in the Daily Intelligence Feed. Execution only proceeds once the authorized financial controller signs off.
            </p>
          </section>

          {/* Chapter 6 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 06</span>
              <h2>Multilingual Voice & Audio Intelligence</h2>
            </div>
            <p>
              EliteBooks features natural voice interaction powered by OpenAI Whisper (Speech-to-Text) and Nova HD (Text-to-Speech). Financial controllers, accountants, and executives can speak complex instructions — such as invoicing clients, logging travel receipts, or querying historical variances — in 7 global languages:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '12px 0' }}>
              {['English (en)', 'Español (es)', 'Mandarin Chinese (zh)', 'Français (fr)', 'Deutsch (de)', 'Japanese (ja)', 'Português (pt)'].map((lang) => (
                <span key={lang} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', fontWeight: 600 }}>
                  {lang}
                </span>
              ))}
            </div>
            <p>
              Every operational page is equipped with modular <code>VoiceAITrigger</code> components, allowing instant speech recording, transcript verification, multi-agent reasoning, and synthesized voice feedback.
            </p>
          </section>

          {/* Chapter 7 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 07</span>
              <h2>SOC 1 (ICFR) & SOC 2 Type II Compliance Architecture</h2>
            </div>
            <p>
              EliteBooks is engineered from the ground up for enterprise compliance, Big 4 CPA audits, and rigorous security reviews:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '16px' }}>
                <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800 }}>
                  <FileCheck2 size={18} />
                  SOC 1 Type II (Financial ICFR)
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  <li><strong>Double-Entry Invariant:</strong> Continuous verification that sum(Debits) == sum(Credits).</li>
                  <li><strong>ASC-606 Compliance:</strong> Automated 5-step contract milestone recognition checks.</li>
                  <li><strong>Maker-Checker SoD:</strong> AI restricted to advisory role; dual-signature human approval mandatory.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '14px', padding: '16px' }}>
                <h4 style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800 }}>
                  <ShieldCheck size={18} />
                  SOC 2 Type II (Trust Criteria)
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  <li><strong>AI Processing Integrity:</strong> 100% mathematical grounding in live database ledgers with zero ungrounded hallucinations.</li>
                  <li><strong>PII Tokenization Vault:</strong> Real-time in-memory redaction of SSNs, EINs, and bank accounts.</li>
                  <li><strong>Auditor Evidence Exporter:</strong> Instant JSON export for Vanta, Drata, and external CPA auditors.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Chapter 8 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 08</span>
              <h2>Dual-Mode Architecture: Manual Rigor & Autonomous Speed</h2>
            </div>
            <p>
              Unlike closed AI black-boxes, EliteBooks provides a pure <strong>Dual-Mode Workflow</strong>. Every single financial operation — from invoice creation to payroll runs and cloud expense categorization — retains full, uncompromised manual control alongside instantaneous AI acceleration.
            </p>
            <p>
              Controllers can manually customize line items, adjust account mappings, or click "Create with AI" to let specialized agents draft GAAP-balanced records in seconds. You are never locked into automated workflows; human oversight remains paramount.
            </p>
          </section>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            Experience EliteBooks Live
          </Link>
        </div>
      </main>
    </div>
  );
}
