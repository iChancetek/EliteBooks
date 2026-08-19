import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Bot, ShieldCheck, 
  Layers, Cpu, Cloud, DollarSign, 
  Receipt, Users, Lock, Compass, Activity, FileText, CheckCircle2,
  FileCheck2, ShieldAlert, HardHat, Heart, Calculator, FileSpreadsheet, Camera
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
      tags: ['Autonomous AI', 'LangGraph', 'HITL Governance']
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
      name: 'Financial HR & Workforce Agent',
      role: 'People, PTO, Benefits & Timesheets',
      icon: Heart,
      color: '#ec4899',
      description: 'Synchronizes employee onboarding, PTO approvals with Payroll, project timesheets with Job Costing, benefits deductions, and 1099 vs W-2 worker classification.',
      tags: ['PTO Sync', 'Benefits Deductions', 'Worker Classification']
    },
    {
      name: 'Projects & Construction Agent',
      role: 'Job Costing, Retainage & Change Orders',
      icon: HardHat,
      color: '#3b82f6',
      description: 'Tracks project budgets, direct labor/materials/subcontractors, retainage withholdings (5-10%), change orders, and cost-to-complete (ETC) forecasting.',
      tags: ['Job Costing', 'Retainage Withheld', 'Change Orders']
    },
    {
      name: 'Compliance Agent',
      role: 'Audit Defense & Regulatory Verification',
      icon: ShieldCheck,
      color: '#14b8a6',
      description: 'Continuously audits ledger entries against SEC, FINRA, and multi-state tax regulations, compiling full audit defense dossiers.',
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
      <PageVoiceControl contentId="learning-main-content" pageTitle="AI Accounting & Intelligence Masterclass" />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className={styles.heroBadge}>
          <Sparkles size={14} />
          <span>Autonomous Financial Intelligence Architecture</span>
        </div>
        <h1 className={styles.title}>EliteBooks Masterclass</h1>
        <p className={styles.subtitle}>
          A comprehensive architectural guide to autonomous bookkeeping, multi-agent financial swarms, customizable KPI studio, and enterprise ERP capabilities.
        </p>
      </header>

      {/* Main Content */}
      <main className={styles.main} id="learning-main-content">
        {/* Agent Grid */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Multi-Agent Swarm Department</h2>
          <div className={styles.agentGrid}>
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.name} className={styles.agentCard}>
                  <div className={styles.agentHeader}>
                    <div className={styles.agentIcon} style={{ background: `${agent.color}20`, color: agent.color }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className={styles.agentName}>{agent.name}</h3>
                      <p className={styles.agentRole}>{agent.role}</p>
                    </div>
                  </div>
                  <p className={styles.agentDescription}>{agent.description}</p>
                  <div className={styles.agentTags}>
                    {agent.tags.map((tag) => (
                      <span key={tag} className={styles.agentTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Chapters */}
        <div className={styles.chapterList}>
          {/* Chapter 1 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 01</span>
              <h2>How Autonomous Double-Entry Works</h2>
            </div>
            <p>
              In traditional accounting, bookkeepers manually match invoices to bank debits, assign chart-of-accounts codes, and manually balance debits and credits. EliteBooks replaces this with deterministic AI agents grounded in GAAP and ASC-606 standards.
            </p>
            <p>
              When a transaction enters the system, the Expense Agent classifies the vendor, checks Section 162 tax deductibility, and routes the record to the Ledger Agent. The Ledger Agent writes mathematically balanced double-entry journals and locks the entry with a SHA-256 cryptographic hash.
            </p>
          </section>

          {/* Chapter 2 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 02</span>
              <h2>Agent-to-Agent (A2A) Structured Bus</h2>
            </div>
            <p>
              Unlike chat-only chatbots that operate in silos, EliteBooks agents collaborate over a shared A2A message bus. For example, when an employee logs hours on a project:
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              <li>The <strong>HR Agent</strong> validates the timesheet and approves billable hours.</li>
              <li>The <strong>Projects Agent</strong> updates direct labor job costs and recalculates the project gross margin.</li>
              <li>The <strong>Payroll Agent</strong> credits the hours into the upcoming pay cycle with zero human re-keying.</li>
            </ul>
          </section>

          {/* Chapter 3 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 03</span>
              <h2>Predictive Cash Flow & Monte Carlo Modeling</h2>
            </div>
            <p>
              Static spreadsheets only show past cash balances. The Cash Flow Agent continuously monitors accounts receivable collection speed, recurring vendor subscriptions, and quarterly payroll liabilities to model cash positions 30, 60, and 90 days into the future.
            </p>
          </section>

          {/* Chapter 4 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 04</span>
              <h2>EliteBooks Intelligence & Customizable KPI Studio</h2>
            </div>
            <p>
              EliteBooks Intelligence delivers a customized financial operating layer that adapts to your business model:
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              <li><strong>Custom KPI Builder:</strong> Evaluate custom formulas (e.g. <code>(NetProfit / Revenue) * 100</code>) with dynamic alert thresholds.</li>
              <li><strong>Books Quality AI:</strong> Continuous 0–100 Books Health score evaluating duplicate charges, missing receipts, and unallocated costs.</li>
              <li><strong>5-Pillar Explanations:</strong> Every insight explains What Happened, Why It Matters, Supporting Data, Recommended Action, and Confidence.</li>
              <li><strong>Unlimited Classes & Locations:</strong> Multidimensional general ledger segmentation across departments and job sites.</li>
              <li><strong>AI Receipts & Mileage Engine:</strong> Optical receipt OCR and IRS standard mileage rate ($0.67/mile) business travel tracking.</li>
            </ul>
          </section>

          {/* Chapter 5 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 05</span>
              <h2>Financial HR & Workforce Intelligence</h2>
            </div>
            <p>
              Combining HR, Payroll, and the General Ledger eliminates the two-system gap common with standalone tools:
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              <li><strong>PTO & Leave Management:</strong> Accrual tracking and 1-click approvals synchronized with the Payroll Agent.</li>
              <li><strong>Project Labor Timesheets:</strong> Instant job costing allocation to active projects in Project Management AI.</li>
              <li><strong>Pre-Tax Benefits:</strong> Health, dental, and 401(k) retirement contributions mapped to general ledger liabilities.</li>
              <li><strong>Worker Classification Sentinel:</strong> IRS 20-factor evaluation preventing 1099 vs W-2 misclassification penalties.</li>
            </ul>
          </section>

          {/* Chapter 6 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 06</span>
              <h2>Enterprise ERP Operations: Batch & Excel Sync</h2>
            </div>
            <p>
              Scale high-volume business operations effortlessly:
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              <li><strong>Batch Processing Studio:</strong> Bulk invoice and expense execution with pre-execution safety previews.</li>
              <li><strong>Controlled Excel Sync:</strong> Bi-directional CSV/XLSX imports and exports with automated field mapping.</li>
              <li><strong>1099 Vendor Compliance:</strong> IRS $600 threshold tracker and automated 1099-NEC draft generation.</li>
            </ul>
          </section>

          {/* Chapter 7 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 07</span>
              <h2>SOC 1 (ICFR) & SOC 2 Type II Compliance Architecture</h2>
            </div>
            <p>
              EliteBooks is engineered for enterprise compliance, Big 4 CPA audits, and continuous security reviews:
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
              Unlike closed AI black-boxes, EliteBooks provides a pure <strong>Dual-Mode Workflow</strong>. Every financial operation retains full, uncompromised manual control alongside instantaneous AI acceleration.
            </p>
            <p>
              Controllers can manually customize line items, adjust account mappings, or click "Create with AI" to let specialized agents draft GAAP-balanced records in seconds.
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
