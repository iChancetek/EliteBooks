'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Mail, MessageSquare, 
  LifeBuoy, Bot, ShieldCheck, CheckCircle2, 
  Activity, BookOpen, Search, Send, Clock,
  ChevronDown, ChevronUp, Layers, Receipt, CreditCard,
  Users, BarChart3, Package, Car, FileCheck2, HardHat,
  Heart, Cloud, DollarSign, Lock, Compass, ArrowRight,
  Headphones, Check
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [ticket, setTicket] = useState({ email: '', subject: '', category: 'General', message: '' });

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const knowledgeArticles = [
    // ─── Masterclass Chapters ───
    {
      id: 'ch-01',
      category: 'chapters',
      title: 'Chapter 01: Income, Expenses & Invoicing Architecture',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'Bi-directional bank connectivity and automated accounts receivable billing workflows.',
      content: `EliteBooks establishes continuous bi-directional connectivity with bank and credit card accounts to automatically log and sort daily spending without human intervention.\n\nFor accounts receivable, the Invoicing Agent creates custom professional invoices with itemized tax calculations and lets clients pay directly online via integrated card, ACH, or bank transfer links.`,
      tags: ['Banking Sync', 'Stripe AR', 'Itemized Invoices']
    },
    {
      id: 'ch-02',
      category: 'chapters',
      title: 'Chapter 02: Autonomous Payroll & Tax Filings',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'IRS Circular E gross-to-net calculations, FICA employer matching, and Form 941 liabilities.',
      content: `Payroll Services automatically pay employees, calculate gross-to-net withholdings pursuant to IRS Circular E, accrue FICA employer matching liabilities, and prepare quarterly Form 941 filings.\n\nDirect deposit batches are cryptographically verified and synchronized in real time with the General Ledger.`,
      tags: ['IRS Circular E', 'Form 941', 'FICA Match', 'Payroll']
    },
    {
      id: 'ch-03',
      category: 'chapters',
      title: 'Chapter 03: Financial Reporting & Real-Time Statements',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'Real-time GAAP statements locked with SHA-256 cryptographic hashes.',
      content: `The platform generates real-time profit and loss statements, balance sheets, and cash flow summaries. Every statement is mathematically tied to verified double-entry ledger entries locked with SHA-256 cryptographic hashes.`,
      tags: ['GAAP Statements', 'SHA-256 Lock', 'Real-Time Close']
    },
    {
      id: 'ch-04',
      category: 'chapters',
      title: 'Chapter 04: Inventory Tracking & Stock Management',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'Real-time stock sentry, dynamic COGS valuation, and reorder point automation.',
      content: `For product and commerce enterprises, Inventory Tracking monitors stock levels in real time as sales and purchases happen. Available on higher tiers, this module ensures COGS calculations and inventory valuation remain perfectly balanced.`,
      tags: ['Inventory', 'COGS Calculation', 'Stock Sentry']
    },
    {
      id: 'ch-05',
      category: 'chapters',
      title: 'Chapter 05: Receipt and Mile Tracking',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'OpenAI Vision OCR receipt parsing and IRS $0.67/mile travel deductions.',
      content: `The Receipt and Mile Tracking engine snaps photos of receipts using OpenAI Computer Vision to extract line items and logs business travel using standard IRS mileage deduction rates ($0.67/mile) for automated tax write-offs.`,
      tags: ['Vision OCR', 'IRS Sec 162', 'Mileage Deduction']
    },
    {
      id: 'ch-06',
      category: 'chapters',
      title: 'Chapter 06: EliteBooks Intelligence & Customizable KPI Studio',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'Custom formula evaluator, Books Health AI score, and 5-pillar financial reasoning.',
      content: `EliteBooks Intelligence delivers a customized financial operating layer that adapts to your business model:\n\n• Custom KPI Builder: Evaluate custom formulas (e.g. (NetProfit / Revenue) * 100) with dynamic alert thresholds.\n• Books Quality AI: Continuous 0–100 Books Health score evaluating duplicate charges, missing receipts, and unallocated costs.\n• 5-Pillar Explanations: Every insight explains What Happened, Why It Matters, Supporting Data, Recommended Action, and Confidence.\n• Unlimited Classes & Locations: Multidimensional general ledger segmentation across departments and job sites.`,
      tags: ['KPI Studio', 'Books Health AI', '5-Pillar Insights']
    },
    {
      id: 'ch-07',
      category: 'chapters',
      title: 'Chapter 07: SOC 1 (ICFR) & SOC 2 Type II Compliance Architecture',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'Continuous ICFR invariant verification, ASC-606 checks, and AES-256 PII Vault.',
      content: `EliteBooks is engineered for enterprise compliance, Big 4 CPA audits, and continuous security reviews:\n\nSOC 1 Type II (Financial ICFR):\n• Double-Entry Invariant: Continuous verification that sum(Debits) == sum(Credits).\n• ASC-606 Compliance: Automated 5-step contract milestone recognition checks.\n• Maker-Checker SoD: AI restricted to advisory role; dual-signature human approval mandatory.\n\nSOC 2 Type II (Trust Criteria):\n• AI Processing Integrity: 100% mathematical grounding in live database ledgers with zero ungrounded hallucinations.\n• PII Tokenization Vault: Real-time in-memory redaction of SSNs, EINs, and bank accounts.\n• Auditor Evidence Exporter: Instant JSON export for Vanta, Drata, and external CPA auditors.`,
      tags: ['SOC 1 Type II', 'SOC 2 Type II', 'ASC-606', 'PII Vault']
    },
    {
      id: 'ch-08',
      category: 'chapters',
      title: 'Chapter 08: Dual-Mode Architecture: Manual Rigor & Autonomous Speed',
      badge: 'Architecture Chapter',
      badgeColor: '#f59e0b',
      summary: 'Seamless balance between human manual controls and instant AI acceleration.',
      content: `Unlike closed AI black-boxes, EliteBooks provides a pure Dual-Mode Workflow. Every financial operation retains full, uncompromised manual control alongside instantaneous AI acceleration.\n\nControllers can manually customize line items, adjust account mappings, or click "Create with AI" to let specialized agents draft GAAP-balanced records in seconds.`,
      tags: ['Dual-Mode', 'Human-in-the-Loop', 'AI Accelerator']
    },

    // ─── Swarm Department Nodes ───
    {
      id: 'agent-orchestrator',
      category: 'swarm',
      title: 'Orchestrator Agent — Master Intent Router & Handoff Coordinator',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#3b82f6',
      summary: 'Resolves natural language queries, routes tasks across specialized sub-agents, and enforces Human-in-the-Loop governance.',
      content: `Resolves natural language queries, routes tasks across specialized sub-agents via LangGraph, and enforces Human-in-the-Loop governance. It coordinates complex multi-step workflows like end-of-month reconciliations and budget revisions.`,
      tags: ['Autonomous AI', 'LangGraph', 'HITL Governance']
    },
    {
      id: 'agent-ledger',
      category: 'swarm',
      title: 'Ledger Agent — Double-Entry Bookkeeping & General Ledger',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#10b981',
      summary: 'Maintains GAAP-compliant mathematical balance, translates transactions into balanced debits and credits, and generates cryptographic audit locks.',
      content: `Maintains GAAP-compliant mathematical balance, translates transactions into balanced debits and credits, and generates cryptographic audit locks with SHA-256 hashing.`,
      tags: ['GAAP Balanced', 'SHA-256 Lock', 'Chart of Accounts']
    },
    {
      id: 'agent-expense',
      category: 'swarm',
      title: 'Expense Agent — OCR Ingestion, Categorization & IRS 162',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#f43f5e',
      summary: 'Extracts line items from receipts, normalizes vendor names, checks Section 162 tax deductibility, and detects anomalies.',
      content: `Extracts line items from receipts using OpenAI Vision, normalizes vendor names, checks Section 162 tax deductibility, and detects duplicate/unusual expenses in real time.`,
      tags: ['Receipt OCR', 'IRS Sec 162', 'Cloud Services Tagging']
    },
    {
      id: 'agent-invoicing',
      category: 'swarm',
      title: 'Invoicing Agent — Accounts Receivable & Payment Collection',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#8b5cf6',
      summary: 'Generates itemized commercial invoices, creates Stripe dynamic payment links, and handles automated courteous payment reminders.',
      content: `Generates itemized commercial invoices, creates Stripe dynamic payment links, monitors aging schedules, and handles automated courteous payment reminders.`,
      tags: ['Stripe Integration', 'Automated AR', 'Aging Reports']
    },
    {
      id: 'agent-cashflow',
      category: 'swarm',
      title: 'Cash Flow Agent — Predictive Runway & Scenario Simulator',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#06b6d4',
      summary: 'Projects 30, 60, and 90-day cash positions with Monte Carlo simulations, tracking burn rates and liquidity horizons.',
      content: `Projects 30, 60, and 90-day cash positions with Monte Carlo simulations, tracking burn rates and liquidity horizons under various revenue scenarios.`,
      tags: ['90-Day Runway', 'Monte Carlo', 'Burn Velocity']
    },
    {
      id: 'agent-payroll',
      category: 'swarm',
      title: 'Payroll Agent — Compensation, Tax Withholdings & Form 941',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#f59e0b',
      summary: 'Executes zero-touch payroll runs, calculates FICA and Circular E withholdings, and generates Form 941 liability accruals.',
      content: `Executes zero-touch payroll runs, calculates FICA and Circular E withholdings, and generates Form 941 liability accruals automatically synced to general ledger.`,
      tags: ['IRS Circular E', 'FICA Match', 'Form 941']
    },
    {
      id: 'agent-hr',
      category: 'swarm',
      title: 'Financial HR & Workforce Agent — People, PTO, Benefits & Timesheets',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#ec4899',
      summary: 'Synchronizes employee onboarding, PTO approvals with Payroll, project timesheets with Job Costing, benefits deductions, and 1099 vs W-2 worker classification.',
      content: `Synchronizes employee onboarding, PTO approvals with Payroll, project timesheets with Job Costing, benefits deductions, and 1099 vs W-2 worker classification.`,
      tags: ['PTO Sync', 'Benefits Deductions', 'Worker Classification']
    },
    {
      id: 'agent-projects',
      category: 'swarm',
      title: 'Projects & Construction Agent — Job Costing, Retainage & Change Orders',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#3b82f6',
      summary: 'Tracks project budgets, direct labor/materials/subcontractors, retainage withholdings (5-10%), change orders, and cost-to-complete (ETC) forecasting.',
      content: `Tracks project budgets, direct labor/materials/subcontractors, retainage withholdings (5-10%), change orders, and cost-to-complete (ETC) forecasting.`,
      tags: ['Job Costing', 'Retainage Withheld', 'Change Orders']
    },
    {
      id: 'agent-compliance',
      category: 'swarm',
      title: 'Compliance Agent — Audit Defense & Regulatory Verification',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#14b8a6',
      summary: 'Continuously audits ledger entries against SEC, FINRA, and multi-state tax regulations, compiling full audit defense dossiers.',
      content: `Continuously audits ledger entries against SEC, FINRA, and multi-state tax regulations, compiling full audit defense dossiers for Big 4 CPAs.`,
      tags: ['Audit Dossier', 'Sales Tax', '1099 Tracking']
    },
    {
      id: 'agent-finops',
      category: 'swarm',
      title: 'FinOps Agent — Cloud Cost Intelligence & Unit Economics',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#0ea5e9',
      summary: 'Tracks compute, storage, and AI inference spend across AWS, Azure, GCP, OpenAI, and Anthropic, computing cost per customer and query.',
      content: `Tracks compute, storage, and AI inference spend across AWS, Azure, GCP, OpenAI, and Anthropic, computing unit cost per customer and query.`,
      tags: ['Multi-Cloud', 'GPU Tracking', 'Unit Economics']
    },
    {
      id: 'agent-personal',
      category: 'swarm',
      title: 'Personal Finance Agent — Executive Wealth & Founder Draw Strategy',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#ec4899',
      summary: 'Coordinates founder distributions, tracks estimated tax reserves, and preserves strict corporate-personal account segregation.',
      content: `Coordinates founder distributions, tracks estimated tax reserves, and preserves strict corporate-personal account segregation.`,
      tags: ['Executive Draws', '1040-ES Reserves', 'Personal Ledger']
    },
    {
      id: 'agent-fraud',
      category: 'swarm',
      title: 'Fraud Sentinel & PII Vault — Cryptographic Privacy & Anomaly Guard',
      badge: 'Multi-Agent Swarm',
      badgeColor: '#e11d48',
      summary: 'Tokenizes sensitive financial PII with AES-256-GCM encryption and scans ledger activity for unauthorized wire patterns or tampering.',
      content: `Tokenizes sensitive financial PII with AES-256-GCM encryption and scans ledger activity for unauthorized wire patterns or tampering.`,
      tags: ['AES-256-GCM', 'PII Redaction', 'Heuristic Defense']
    },

    // ─── Core Financial Pillars ───
    {
      id: 'pillar-income',
      category: 'pillars',
      title: 'Core Financial Pillar: Income and Expense Tracking',
      badge: 'Core Banking Sync',
      badgeColor: '#10b981',
      summary: 'Automatically syncs with bank and credit card accounts to log and sort daily spending.',
      content: `EliteBooks provides real-time bank feeds with automated merchant categorization and anomaly detection. Every transaction is matched with bank statements with 99.9% accuracy.`,
      tags: ['Banking', 'Plaid', 'Daily Spending']
    },
    {
      id: 'pillar-invoicing',
      category: 'pillars',
      title: 'Core Financial Pillar: Invoicing and Payments',
      badge: 'Instant Card & ACH',
      badgeColor: '#3b82f6',
      summary: 'Creates custom professional invoices and lets clients pay directly online.',
      content: `Fast enterprise invoice generation with dynamic branding, real-time math, tax rules, and instant online credit card/ACH payment collection.`,
      tags: ['Invoicing', 'Online Payments', 'Stripe']
    },
    {
      id: 'pillar-payroll',
      category: 'pillars',
      title: 'Core Financial Pillar: Payroll Services',
      badge: 'IRS Circular E & Form 941',
      badgeColor: '#f59e0b',
      summary: 'Pays employees and handles payroll tax calculations and filings.',
      content: `Zero-touch automated payroll for W-2 employees and 1099 contractors with IRS Circular E compliance and quarterly Form 941 filings.`,
      tags: ['Payroll', 'Form 941', 'Withholdings']
    },
    {
      id: 'pillar-reports',
      category: 'pillars',
      title: 'Core Financial Pillar: Financial Reporting',
      badge: 'Real-Time GAAP Reports',
      badgeColor: '#8b5cf6',
      summary: 'Generates profit and loss statements, balance sheets, and cash flow summaries.',
      content: `Instant real-time profit and loss statements, balance sheets, and cash flow summaries mathematically anchored in double-entry general ledger books.`,
      tags: ['P&L', 'Balance Sheet', 'Cash Flow']
    },
    {
      id: 'pillar-inventory',
      category: 'pillars',
      title: 'Core Financial Pillar: Inventory Tracking',
      badge: 'Real-Time Stock Sentry',
      badgeColor: '#06b6d4',
      summary: 'Monitors stock levels in real time as sales and purchases happen (available on higher tiers).',
      content: `Multi-location inventory tracking with predictive reorder triggers, real-time FIFO/average costing, and automated COGS journal sync.`,
      tags: ['Inventory', 'Stock Sentry', 'COGS']
    },
    {
      id: 'pillar-receipts',
      category: 'pillars',
      title: 'Core Financial Pillar: Receipt and Mile Tracking',
      badge: 'OpenAI Vision OCR & IRS $0.67/mi',
      badgeColor: '#ec4899',
      summary: 'Snaps photos of receipts and logs business travel for tax.',
      content: `Instant mobile receipt OCR parsing with IRS Section 162 tax classification and automated business travel mileage tracking ($0.67/mile).`,
      tags: ['Receipt OCR', 'Mileage Log', 'Tax Writeoffs']
    }
  ];

  const filteredArticles = knowledgeArticles.filter(art => {
    const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
    const matchesQuery = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className={styles.supportPage}>
      {/* Background Video & Ambient Glows */}
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
      
      <PageVoiceControl contentId="support-main-content" pageTitle="Enterprise Support Center & Architecture Knowledge Base" />

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
            <Link href="/support" className={styles.navLink} style={{ color: '#60a5fa', fontWeight: 700 }}>Support</Link>
            <Link href="/privacy" className={styles.navLink}>Privacy</Link>
            <Link href="/terms" className={styles.navLink}>Terms</Link>
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

      {/* Main Content Area */}
      <main className={styles.supportContent} id="support-main-content">
        <div className={styles.supportHeader}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <LifeBuoy size={14} />
            <span>24/7 Enterprise Assistance · AI Swarm Diagnostics</span>
          </div>

          <h1 className={styles.heroTitle}>
            Enterprise Support &<br />
            <span className="text-gradient">Architecture Knowledge Base</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Direct assistance from our autonomous AI diagnostics system and certified accounting support team. Explore comprehensive architectural guides, swarm nodes, and masterclass deep dives.
          </p>

          {/* Hero Key Metric Cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>Autonomous AI Sentry</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>99.9%</div>
              <div className={styles.statLabel}>Swarm Pipeline Uptime</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>&lt; 2 Hours</div>
              <div className={styles.statLabel}>Human CPA SLA Response</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>ICFR Audit Defense</div>
            </div>
          </div>
        </div>

        {/* Live Multi-Agent Status Banner */}
        <div className={styles.statusBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
            <strong style={{ color: '#ffffff', fontSize: '14px' }}>All AI Swarm Pipelines Operational (Orchestrator, Ledger, FinOps, Compliance)</strong>
          </div>
          <Link href="/learning" style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            View Full Interactive Masterclass <ArrowRight size={14} />
          </Link>
        </div>

        {/* Support Grid: Ticket Submission Form & Knowledge Base */}
        <div className={styles.supportGrid}>
          
          {/* Support Ticket Submission Card */}
          <div className={styles.contactCard}>
            <h2>Submit Support Inquiry</h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <CheckCircle2 size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', color: '#ffffff', marginBottom: '8px' }}>Inquiry Dispatched!</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>
                  Your inquiry has been routed to the Support Copilot and our senior accounting advisory team. Expected response time: under 2 hours.
                </p>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '20px' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Corporate Email</label>
                  <input 
                    type="email" 
                    className={styles.formInput} 
                    placeholder="controller@company.com" 
                    value={ticket.email}
                    onChange={e => setTicket({...ticket, email: e.target.value})}
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Module / Domain</label>
                  <select 
                    className={styles.formInput}
                    value={ticket.category}
                    onChange={e => setTicket({...ticket, category: e.target.value})}
                  >
                    <option value="General">General Inquiries</option>
                    <option value="Ledger">Double-Entry Ledger & Reconciliation</option>
                    <option value="FinOps">Cloud FinOps & Ingestion</option>
                    <option value="Payroll">Payroll & Form 941 Withholdings</option>
                    <option value="Invoicing">Invoicing & Payment Collection</option>
                    <option value="Security">SOC 1/2 Compliance & PII Vault</option>
                    <option value="Masterclass">Architecture & Masterclass Guide</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subject</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="e.g. Question on ASC-606 revenue milestone recognition" 
                    value={ticket.subject}
                    onChange={e => setTicket({...ticket, subject: e.target.value})}
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Detailed Message</label>
                  <textarea 
                    className={styles.formInput} 
                    rows={4} 
                    placeholder="Describe your inquiry, architecture scenario, or diagnostic questions..." 
                    value={ticket.message}
                    onChange={e => setTicket({...ticket, message: e.target.value})}
                    required 
                    style={{ resize: 'vertical' }} 
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                  <Send size={16} /> Dispatch Support Ticket
                </button>
              </form>
            )}
          </div>

          {/* Knowledge Base Hub */}
          <div className={styles.kbHub}>
            <div className={styles.kbHeader}>
              <h2>
                <BookOpen size={20} color="#3b82f6" /> Architecture Knowledge Base
              </h2>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)' }}>
                {filteredArticles.length} articles available
              </span>
            </div>

            {/* Search Input */}
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Search architecture, 10 agents, chapters, or compliance..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter Pills */}
            <div className={styles.kbTabs}>
              <button 
                className={`${styles.kbTab} ${activeCategory === 'all' ? styles.kbTabActive : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Articles ({knowledgeArticles.length})
              </button>
              <button 
                className={`${styles.kbTab} ${activeCategory === 'chapters' ? styles.kbTabActive : ''}`}
                onClick={() => setActiveCategory('chapters')}
              >
                Chapters (8)
              </button>
              <button 
                className={`${styles.kbTab} ${activeCategory === 'swarm' ? styles.kbTabActive : ''}`}
                onClick={() => setActiveCategory('swarm')}
              >
                Swarm Agents (12)
              </button>
              <button 
                className={`${styles.kbTab} ${activeCategory === 'pillars' ? styles.kbTabActive : ''}`}
                onClick={() => setActiveCategory('pillars')}
              >
                Core Pillars (6)
              </button>
            </div>

            {/* Knowledge Articles List */}
            <div className={styles.kbList}>
              {filteredArticles.map((art) => {
                const isExpanded = !!expandedItems[art.id];
                return (
                  <div 
                    key={art.id} 
                    className={styles.kbItem}
                    onClick={() => toggleExpand(art.id)}
                  >
                    <div className={styles.kbItemHeader}>
                      <h3 className={styles.kbItemTitle}>{art.title}</h3>
                      <span 
                        className={styles.kbItemBadge} 
                        style={{ 
                          background: `${art.badgeColor}20`, 
                          color: art.badgeColor,
                          border: `1px solid ${art.badgeColor}40`
                        }}
                      >
                        {art.badge}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 8px' }}>
                      {art.summary}
                    </div>

                    {isExpanded && (
                      <div className={styles.kbItemBody} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                        <p style={{ whiteSpace: 'pre-line' }}>{art.content}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <div className={styles.kbItemTags}>
                        {art.tags.map(t => (
                          <span key={t} className={styles.kbTag}>{t}</span>
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                        {isExpanded ? 'Show Less' : 'Read Full Guide'} {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredArticles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.6)' }}>
                  <Search size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p>No knowledge articles matched your search query "{searchQuery}".</p>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    style={{ marginTop: '12px' }}
                  >
                    Clear Search Filter
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* High Conversion CTA Banner */}
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Experience the Autonomous Financial Operating System</h2>
          <p className={styles.ctaSubtitle}>
            Transform your enterprise accounting with continuous books quality AI, 10 specialized agents, and SOC 1/2 verified math.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/signup" className="btn btn-primary btn-lg" style={{ padding: '14px 32px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Start Free Trial <ArrowRight size={18} />
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
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px' }}>EliteBooks Support</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>&copy; {new Date().getFullYear()} EliteBooks Financial OS. All rights reserved.</span>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/features" className={styles.footerLink}>Features</Link>
            <Link href="/learning" className={styles.footerLink}>Masterclass</Link>
            <Link href="/support" className={styles.footerLink} style={{ color: '#60a5fa', fontWeight: 700 }}>Support</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <a href="https://famio.us" target="_blank" rel="noopener noreferrer" className={styles.footerLink} style={{ color: '#f472b6', fontWeight: 700 }}>famio.us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
