import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Bot, ShieldCheck, 
  Layers, Cpu, Cloud, DollarSign, 
  Receipt, Users, Lock, Compass, Activity, FileText, CheckCircle2,
  FileCheck2, ShieldAlert, HardHat, Heart, Calculator, FileSpreadsheet,
  Package, Car, CreditCard, BarChart3, Camera
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function LearningPage() {
  const coreFeatures = [
    {
      title: 'Income and Expense Tracking',
      description: 'Automatically syncs with bank and credit card accounts to log and sort daily spending.',
      icon: Receipt,
      color: '#10b981',
      badge: 'Core Banking Sync',
    },
    {
      title: 'Invoicing and Payments',
      description: 'Creates custom professional invoices and lets clients pay directly online.',
      icon: CreditCard,
      color: '#3b82f6',
      badge: 'Instant Card & ACH',
    },
    {
      title: 'Payroll Services',
      description: 'Pays employees and handles payroll tax calculations and filings.',
      icon: Users,
      color: '#f59e0b',
      badge: 'IRS Circular E & Form 941',
    },
    {
      title: 'Financial Reporting',
      description: 'Generates profit and loss statements, balance sheets, and cash flow summaries.',
      icon: BarChart3,
      color: '#8b5cf6',
      badge: 'Real-Time GAAP Reports',
    },
    {
      title: 'Inventory Tracking',
      description: 'Monitors stock levels in real time as sales and purchases happen (available on higher tiers).',
      icon: Package,
      color: '#06b6d4',
      badge: 'Real-Time Stock Sentry',
    },
    {
      title: 'Receipt and Mile Tracking',
      description: 'Snaps photos of receipts and logs business travel for tax.',
      icon: Car,
      color: '#ec4899',
      badge: 'OpenAI Vision OCR & IRS $0.67/mi',
    },
  ];

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
      <PageVoiceControl contentId="learning-main-content" pageTitle="AI Accounting & Financial Intelligence Masterclass" />

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
        {/* Core Financial Pillars Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Core Financial Pillars & Operations</h2>
          <div className={styles.agentGrid}>
            {coreFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className={styles.agentCard} style={{ borderColor: `${feat.color}30` }}>
                  <div className={styles.agentHeader}>
                    <div className={styles.agentIcon} style={{ background: `${feat.color}20`, color: feat.color }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className={styles.agentName}>{feat.title}</h3>
                      <span style={{ fontSize: '10px', color: feat.color, fontWeight: 700, textTransform: 'uppercase' }}>{feat.badge}</span>
                    </div>
                  </div>
                  <p className={styles.agentDescription}>{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

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
              <h2>Income, Expenses & Invoicing Architecture</h2>
            </div>
            <p>
              EliteBooks establishes continuous bi-directional connectivity with bank and credit card accounts to automatically log and sort daily spending without human intervention.
            </p>
            <p>
              For accounts receivable, the Invoicing Agent creates custom professional invoices with itemized tax calculations and lets clients pay directly online via integrated card, ACH, or bank transfer links.
            </p>
          </section>

          {/* Chapter 2 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 02</span>
              <h2>Autonomous Payroll & Tax Filings</h2>
            </div>
            <p>
              Payroll Services automatically pay employees, calculate gross-to-net withholdings pursuant to IRS Circular E, accrue FICA employer matching liabilities, and prepare quarterly Form 941 filings.
            </p>
          </section>

          {/* Chapter 3 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 03</span>
              <h2>Financial Reporting & Real-Time Statements</h2>
            </div>
            <p>
              The platform generates real-time profit and loss statements, balance sheets, and cash flow summaries. Every statement is mathematically tied to verified double-entry ledger entries locked with SHA-256 cryptographic hashes.
            </p>
          </section>

          {/* Chapter 4 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 04</span>
              <h2>Inventory Tracking & Stock Management</h2>
            </div>
            <p>
              For product and commerce enterprises, Inventory Tracking monitors stock levels in real time as sales and purchases happen. Available on higher tiers, this module ensures COGS calculations and inventory valuation remain perfectly balanced.
            </p>
          </section>

          {/* Chapter 5 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 05</span>
              <h2>Receipt and Mile Tracking</h2>
            </div>
            <p>
              The Receipt and Mile Tracking engine snaps photos of receipts using OpenAI Computer Vision to extract line items and logs business travel using standard IRS mileage deduction rates ($0.67/mile) for automated tax write-offs.
            </p>
          </section>

          {/* Chapter 6 */}
          <section className={styles.chapterCard}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>Chapter 06</span>
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
