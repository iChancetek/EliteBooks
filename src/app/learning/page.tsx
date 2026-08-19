'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, ShieldCheck, 
  Layers, Cloud, DollarSign, ArrowRight,
  Receipt, Users, Lock, Compass, Activity, FileText, CheckCircle2,
  FileCheck2, HardHat, Heart, Package, Car, CreditCard, BarChart3,
  ChevronDown, ChevronUp, Sliders, Check, X, Bot, Zap, Cpu, Search
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [inspectedAgent, setInspectedAgent] = useState<string | null>(null);

  // Simulator State
  const [revenue, setRevenue] = useState(85000);
  const [cogs, setCogs] = useState(24000);
  const [opex, setOpex] = useState(38000);
  const [cloudSpend, setCloudSpend] = useState(6500);

  // Simulator Calculations
  const grossProfit = revenue - cogs;
  const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : '0';
  const netIncome = grossProfit - opex - cloudSpend;
  const netMargin = revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : '0';
  const monthlyBurn = opex + cloudSpend;
  const estimatedCash = 280000;
  const runwayMonths = monthlyBurn > 0 ? (estimatedCash / monthlyBurn).toFixed(1) : '∞';
  const healthScore = Math.min(100, Math.max(40, Math.round(75 + (parseFloat(netMargin) * 0.8))));

  const coreFeatures = [
    {
      title: 'Income and Expense Tracking',
      description: 'Automatically syncs with bank and credit card accounts to log and sort daily spending.',
      icon: Receipt,
      color: '#10b981',
      badge: 'Core Banking Sync',
      bullets: ['Bi-directional Plaid & Stripe sync', 'Autonomous merchant categorization', 'Zero manual spreadsheet logging']
    },
    {
      title: 'Invoicing and Payments',
      description: 'Creates custom professional invoices and lets clients pay directly online.',
      icon: CreditCard,
      color: '#3b82f6',
      badge: 'Instant Card & ACH',
      bullets: ['Dynamic Stripe payment links', 'Itemized tax & discount engine', 'Automated courteous AR reminders']
    },
    {
      title: 'Payroll Services',
      description: 'Pays employees and handles payroll tax calculations and filings.',
      icon: Users,
      color: '#f59e0b',
      badge: 'IRS Circular E & Form 941',
      bullets: ['FICA employer matching calculations', 'Gross-to-net automated withholdings', 'Form 941 quarterly liability accruals']
    },
    {
      title: 'Financial Reporting',
      description: 'Generates profit and loss statements, balance sheets, and cash flow summaries.',
      icon: BarChart3,
      color: '#8b5cf6',
      badge: 'Real-Time GAAP Reports',
      bullets: ['Instant P&L, Balance Sheet, Cash Flow', 'Cryptographic SHA-256 ledger locks', 'Multidimensional segmentation by class']
    },
    {
      title: 'Inventory Tracking',
      description: 'Monitors stock levels in real time as sales and purchases happen (available on higher tiers).',
      icon: Package,
      color: '#06b6d4',
      badge: 'Real-Time Stock Sentry',
      bullets: ['Dynamic FIFO / Average Costing', 'Automated reorder point alerts', 'Multi-warehouse stock balance']
    },
    {
      title: 'Receipt and Mile Tracking',
      description: 'Snaps photos of receipts and logs business travel for tax.',
      icon: Car,
      color: '#ec4899',
      badge: 'OpenAI Vision OCR & IRS $0.67/mi',
      bullets: ['OpenAI Vision receipt parsing', 'IRS Section 162 deductibility checks', 'GPS / automated mileage log ($0.67/mi)']
    },
  ];

  const agents = [
    {
      name: 'Orchestrator Agent',
      role: 'Master Intent Router & Handoff Coordinator',
      category: 'core',
      icon: Compass,
      color: '#3b82f6',
      description: 'Resolves natural language queries, routes tasks across specialized sub-agents, and enforces Human-in-the-Loop governance.',
      tags: ['Autonomous AI', 'LangGraph', 'HITL Governance'],
      simulation: {
        prompt: 'User: "Generate Q3 financial statements and check for unbilled retainage on Project Atlas."',
        action: 'Orchestrator splits intent into 2 sub-tasks: (1) Dispatches task to Ledger Agent for Q3 P&L generation; (2) Dispatches task to Projects Agent for retainage verification.',
        result: 'Returned balanced Q3 statement ($342k Net) and flagged $18,400 in unbilled 10% retainage awaiting milestone signoff.'
      }
    },
    {
      name: 'Ledger Agent',
      role: 'Double-Entry Bookkeeping & General Ledger',
      category: 'core',
      icon: Layers,
      color: '#10b981',
      description: 'Maintains GAAP-compliant mathematical balance, translates transactions into balanced debits and credits, and generates cryptographic audit locks.',
      tags: ['GAAP Balanced', 'SHA-256 Lock', 'Chart of Accounts'],
      simulation: {
        prompt: 'Trigger: $12,500 bank deposit received from Acme Corp.',
        action: 'Evaluated Debit: Bank Checking ($12,500) | Credit: Accounts Receivable ($12,500). Computed checksum sum(Debits) == sum(Credits).',
        result: 'Journal Entry #4092 committed with SHA-256 hash `9f8e7a...3d`.'
      }
    },
    {
      name: 'Expense Agent',
      role: 'OCR Ingestion, Categorization & IRS 162',
      category: 'core',
      icon: Receipt,
      color: '#f43f5e',
      description: 'Extracts line items from receipts, normalizes vendor names, checks Section 162 tax deductibility, and detects anomalies.',
      tags: ['Receipt OCR', 'IRS Sec 162', 'Cloud Services Tagging'],
      simulation: {
        prompt: 'Uploaded receipt: $4,200 from Amazon Web Services.',
        action: 'OCR extracted line items. Classified 100% as deductible under IRS Sec 162. Tagged to Cloud Computing infrastructure.',
        result: 'Transaction booked. Confidence: 99.4%. No duplicate found.'
      }
    },
    {
      name: 'Invoicing Agent',
      role: 'Accounts Receivable & Payment Collection',
      category: 'growth',
      icon: FileText,
      color: '#8b5cf6',
      description: 'Generates itemized commercial invoices, creates Stripe dynamic payment links, and handles automated courteous payment reminders.',
      tags: ['Stripe Integration', 'Automated AR', 'Aging Reports'],
      simulation: {
        prompt: 'Trigger: Invoice #1084 is 7 days past due ($6,800).',
        action: 'Composed courteous automated reminder email with integrated 1-click ACH/Card Stripe payment link.',
        result: 'Dispatched notification via SendGrid. Customer opened invoice within 22 minutes.'
      }
    },
    {
      name: 'Cash Flow Agent',
      role: 'Predictive Runway & Scenario Simulator',
      category: 'growth',
      icon: Activity,
      color: '#06b6d4',
      description: 'Projects 30, 60, and 90-day cash positions with Monte Carlo simulations, tracking burn rates and liquidity horizons.',
      tags: ['90-Day Runway', 'Monte Carlo', 'Burn Velocity'],
      simulation: {
        prompt: 'Query: "What is our runway if we hire 2 senior engineers at $160k each?"',
        action: 'Ran 1,000 Monte Carlo simulations projecting monthly burn escalation from $44k to $71k.',
        result: 'Projected runway reduced from 18.2 months to 11.4 months without new ARR injection.'
      }
    },
    {
      name: 'Payroll Agent',
      role: 'Compensation, Tax Withholdings & Form 941',
      category: 'workforce',
      icon: Users,
      color: '#f59e0b',
      description: 'Executes zero-touch payroll runs, calculates FICA and Circular E withholdings, and generates Form 941 liability accruals.',
      tags: ['IRS Circular E', 'FICA Match', 'Form 941'],
      simulation: {
        prompt: 'Semi-monthly payroll execution for 14 active employees ($58,200 gross).',
        action: 'Calculated Federal Income Tax, Social Security (6.2%), Medicare (1.45%), state withholdings, and employer match.',
        result: 'Direct deposits queued for ACH release. Total employer tax liability: $4,452.30.'
      }
    },
    {
      name: 'Financial HR & Workforce Agent',
      role: 'People, PTO, Benefits & Timesheets',
      category: 'workforce',
      icon: Heart,
      color: '#ec4899',
      description: 'Synchronizes employee onboarding, PTO approvals with Payroll, project timesheets with Job Costing, benefits deductions, and 1099 vs W-2 worker classification.',
      tags: ['PTO Sync', 'Benefits Deductions', 'Worker Classification'],
      simulation: {
        prompt: 'Timesheet submitted: 40 hrs on Project Horizon (Engineering).',
        action: 'Synchronized timesheet with Project Costing module at $85/hr billable rate ($3,400 job cost).',
        result: 'Updated Project Horizon labor budget; queued 40 hrs for bi-weekly payroll approval.'
      }
    },
    {
      name: 'Projects & Construction Agent',
      role: 'Job Costing, Retainage & Change Orders',
      category: 'projects',
      icon: HardHat,
      color: '#3b82f6',
      description: 'Tracks project budgets, direct labor/materials/subcontractors, retainage withholdings (5-10%), change orders, and cost-to-complete (ETC) forecasting.',
      tags: ['Job Costing', 'Retainage Withheld', 'Change Orders'],
      simulation: {
        prompt: 'Contractor Invoice #203 received: $50,000 progress billing on Substation Alpha.',
        action: 'Applied 10% retainage rule ($5,000 held in Retainage Payable). Approved $45,000 net payable.',
        result: 'Updated Project ETC. Budget variance: +1.4% (Healthy).'
      }
    },
    {
      name: 'Compliance Agent',
      role: 'Audit Defense & Regulatory Verification',
      category: 'compliance',
      icon: ShieldCheck,
      color: '#14b8a6',
      description: 'Continuously audits ledger entries against SEC, FINRA, and multi-state tax regulations, compiling full audit defense dossiers.',
      tags: ['Audit Dossier', 'Sales Tax', '1099 Tracking'],
      simulation: {
        prompt: 'Quarterly compliance scan across 1,840 journal entries.',
        action: 'Verified 100% ASC-606 revenue milestone alignment. Checked 1099-NEC vendor thresholds ($600 limit).',
        result: 'Zero non-compliance violations. Audit defense dossier generated for external CPAs.'
      }
    },
    {
      name: 'FinOps Agent',
      role: 'Cloud Cost Intelligence & Unit Economics',
      category: 'growth',
      icon: Cloud,
      color: '#0ea5e9',
      description: 'Tracks compute, storage, and AI inference spend across AWS, Azure, GCP, OpenAI, and Anthropic, computing cost per customer and query.',
      tags: ['Multi-Cloud', 'GPU Tracking', 'Unit Economics'],
      simulation: {
        prompt: 'Analysis of last 30 days AWS & OpenAI API spending.',
        action: 'Parsed token consumption across 42,000 queries. Calculated unit cost: $0.0034 per customer financial query.',
        result: 'Identified $1,200/mo unattached EBS volume waste. Optimization recommendation submitted.'
      }
    },
    {
      name: 'Personal Finance Agent',
      role: 'Executive Wealth & Founder Draw Strategy',
      category: 'growth',
      icon: DollarSign,
      color: '#ec4899',
      description: 'Coordinates founder distributions, tracks estimated tax reserves, and preserves strict corporate-personal account segregation.',
      tags: ['Executive Draws', '1040-ES Reserves', 'Personal Ledger'],
      simulation: {
        prompt: 'Founder requested $25,000 quarterly distribution.',
        action: 'Verified corporate cash buffer post-distribution ($180k remaining). Calculated 1040-ES tax reserve requirement ($8,750).',
        result: 'Approved draw; generated transfer voucher and updated Member Equity draw ledger.'
      }
    },
    {
      name: 'Fraud Sentinel & PII Vault',
      role: 'Cryptographic Privacy & Anomaly Guard',
      category: 'compliance',
      icon: Lock,
      color: '#e11d48',
      description: 'Tokenizes sensitive financial PII with AES-256-GCM encryption and scans ledger activity for unauthorized wire patterns or tampering.',
      tags: ['AES-256-GCM', 'PII Redaction', 'Heuristic Defense'],
      simulation: {
        prompt: 'Incoming wire instructions containing routing number and corporate EIN.',
        action: 'In-memory tokenization executed in 1.2ms. AES-256-GCM encrypted payload saved in cryptographic vault.',
        result: 'Zero plain-text PII stored. Passed SOC 2 Type II privacy criteria.'
      }
    }
  ];

  const filteredAgents = activeCategory === 'all' 
    ? agents 
    : agents.filter(a => a.category === activeCategory);

  return (
    <div className={styles.learningPage}>
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

      {/* Multilingual Voice Engine Controller */}
      <PageVoiceControl contentId="learning-main-content" pageTitle="Autonomous Financial Intelligence Architecture & Masterclass" />

      {/* Top Header Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <img src="/NewIcon.png" alt="EliteBooks" />
            </div>
            <span className={styles.logoText}>EliteBooks</span>
          </Link>

          <div className={styles.navLinks}>
            <a href="#pillars" className={styles.navLink}>Core Pillars</a>
            <a href="#swarm" className={styles.navLink}>Agent Swarm</a>
            <a href="#simulator" className={styles.navLink}>Live Simulator</a>
            <a href="#compliance" className={styles.navLink}>SOC 1 & SOC 2</a>
            <a href="#comparison" className={styles.navLink}>Comparison</a>
            <a href="#chapters" className={styles.navLink}>Architecture Chapters</a>
          </div>

          <div className={styles.navActions}>
            <Link href="/support" className="btn btn-secondary btn-sm" style={{ fontSize: '13px' }}>
              Support Center
            </Link>
            <Link href="/login" className="btn btn-ghost btn-sm" style={{ fontSize: '13px' }}>
              Sign In
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className={styles.mainContainer} id="learning-main-content">
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <Sparkles size={14} />
            <span>Autonomous Financial Intelligence Architecture · Masterclass</span>
          </div>

          <h1 className={styles.heroTitle}>
            Accounting that runs itself,<br />
            <span className="text-gradient">proven at enterprise scale.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            A comprehensive architectural guide to autonomous double-entry bookkeeping, multi-agent financial swarms, customizable KPI studio, and enterprise ERP capabilities.
          </p>

          <div className={styles.heroActions}>
            <a href="#simulator" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} /> Test Live KPI Simulator
            </a>
            <a href="#swarm" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} /> Inspect 10 AI Agents
            </a>
          </div>

          {/* Key Metric Stats Cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>ICFR Mathematical Balance</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>10 Swarm</div>
              <div className={styles.statLabel}>Autonomous AI Agents</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>0-Hallucination</div>
              <div className={styles.statLabel}>Database Grounded Math</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>AES-256-GCM</div>
              <div className={styles.statLabel}>Cryptographic PII Vault</div>
            </div>
          </div>
        </section>

        {/* Quick Jump Subnav Pills */}
        <div className={styles.subnavPills}>
          <a href="#pillars" className={styles.subnavPill}>🏛️ Core Pillars</a>
          <a href="#swarm" className={styles.subnavPill}>🤖 Agent Swarm</a>
          <a href="#simulator" className={styles.subnavPill}>🧪 Live Simulator</a>
          <a href="#compliance" className={styles.subnavPill}>🛡️ SOC 1 & 2 Security</a>
          <a href="#comparison" className={styles.subnavPill}>⚖️ Platform Comparison</a>
          <a href="#chapters" className={styles.subnavPill}>📚 8 In-Depth Chapters</a>
        </div>

        {/* ─── SECTION 1: Core Financial Pillars & Operations ─── */}
        <section id="pillars" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              Enterprise Operations
            </div>
            <h2 className={styles.sectionTitle}>Core Financial Pillars & Operations</h2>
            <p className={styles.sectionSubtitle}>
              Built from first principles for high-growth startups, mid-market enterprises, and complex multi-entity businesses.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {coreFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title} 
                  className={styles.pillarCard}
                  style={{
                    ['--card-accent' as string]: feat.color,
                    ['--card-accent-border' as string]: `${feat.color}60`,
                    ['--card-accent-glow' as string]: `${feat.color}25`
                  }}
                >
                  <div className={styles.pillarHeader}>
                    <div className={styles.pillarIconBox} style={{ background: `${feat.color}20`, color: feat.color }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className={styles.pillarTitle}>{feat.title}</h3>
                      <span className={styles.pillarBadge} style={{ color: feat.color }}>{feat.badge}</span>
                    </div>
                  </div>
                  <p className={styles.pillarDescription}>{feat.description}</p>
                  <ul className={styles.pillarBullets}>
                    {feat.bullets.map((b, i) => (
                      <li key={i} className={styles.pillarBulletItem}>
                        <CheckCircle2 size={14} style={{ color: feat.color, flexShrink: 0 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── SECTION 2: Multi-Agent Swarm Department ─── */}
        <section id="swarm" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              LangGraph Multi-Agent Swarm
            </div>
            <h2 className={styles.sectionTitle}>The Multi-Agent Swarm Department</h2>
            <p className={styles.sectionSubtitle}>
              Ten autonomous domain agents coordinated by an executive orchestrator, communicating via structured agent-to-agent (A2A) handoffs.
            </p>
          </div>

          {/* Swarm Category Filter Tabs */}
          <div className={styles.swarmTabs}>
            <button 
              className={`${styles.swarmTab} ${activeCategory === 'all' ? styles.swarmTabActive : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Agents (12)
            </button>
            <button 
              className={`${styles.swarmTab} ${activeCategory === 'core' ? styles.swarmTabActive : ''}`}
              onClick={() => setActiveCategory('core')}
            >
              Core Ledger & Ingestion
            </button>
            <button 
              className={`${styles.swarmTab} ${activeCategory === 'growth' ? styles.swarmTabActive : ''}`}
              onClick={() => setActiveCategory('growth')}
            >
              Cash Flow & Growth
            </button>
            <button 
              className={`${styles.swarmTab} ${activeCategory === 'workforce' ? styles.swarmTabActive : ''}`}
              onClick={() => setActiveCategory('workforce')}
            >
              HR & Workforce
            </button>
            <button 
              className={`${styles.swarmTab} ${activeCategory === 'projects' ? styles.swarmTabActive : ''}`}
              onClick={() => setActiveCategory('projects')}
            >
              Projects & Job Cost
            </button>
            <button 
              className={`${styles.swarmTab} ${activeCategory === 'compliance' ? styles.swarmTabActive : ''}`}
              onClick={() => setActiveCategory('compliance')}
            >
              Security & Compliance
            </button>
          </div>

          {/* Agents Grid */}
          <div className={styles.agentsGrid}>
            {filteredAgents.map((agent) => {
              const Icon = agent.icon;
              const isInspected = inspectedAgent === agent.name;
              return (
                <div key={agent.name} className={styles.agentCard}>
                  <div className={styles.agentCardHeader}>
                    <div className={styles.agentIconBox} style={{ background: `${agent.color}20`, color: agent.color }}>
                      <Icon size={24} />
                    </div>
                    <div className={styles.agentMeta}>
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

                  <button 
                    className={styles.agentInspectBtn}
                    onClick={() => setInspectedAgent(isInspected ? null : agent.name)}
                  >
                    <span>{isInspected ? 'Hide Intelligence Log' : 'Inspect AI Reasoning Log'}</span>
                    {isInspected ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isInspected && (
                    <div className={styles.agentInspectDrawer}>
                      <div style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '6px' }}>
                        📥 Trigger / Input:
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
                        {agent.simulation.prompt}
                      </div>

                      <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '4px' }}>
                        ⚙️ Autonomous Action:
                      </div>
                      <div style={{ fontSize: '11.5px', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>
                        {agent.simulation.action}
                      </div>

                      <div style={{ color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>
                        ✅ Verified Result:
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#a7f3d0' }}>
                        {agent.simulation.result}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── SECTION 3: Live Interactive Financial Simulator & KPI Sandbox ─── */}
        <section id="simulator" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              Interactive Financial Sandbox
            </div>
            <h2 className={styles.sectionTitle}>Live Financial Simulator & KPI Studio</h2>
            <p className={styles.sectionSubtitle}>
              Experience the mathematical precision of the EliteBooks Intelligence Engine. Adjust the financial levers below to see real-time 5-pillar reasoning.
            </p>
          </div>

          <div className={styles.simulatorCard}>
            <div className={styles.simGrid}>
              {/* Sliders Control Panel */}
              <div className={styles.simControls}>
                <div>
                  <div className={styles.simControlHeader}>
                    <span className={styles.simControlLabel}>
                      <DollarSign size={16} color="#10b981" /> Monthly Gross Revenue
                    </span>
                    <span className={styles.simControlValue}>${revenue.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="500000" 
                    step="5000" 
                    value={revenue} 
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className={styles.simSlider}
                  />
                </div>

                <div>
                  <div className={styles.simControlHeader}>
                    <span className={styles.simControlLabel}>
                      <Package size={16} color="#06b6d4" /> Cost of Goods Sold (COGS)
                    </span>
                    <span className={styles.simControlValue}>${cogs.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="2000" 
                    max="200000" 
                    step="2000" 
                    value={cogs} 
                    onChange={(e) => setCogs(Number(e.target.value))}
                    className={styles.simSlider}
                  />
                </div>

                <div>
                  <div className={styles.simControlHeader}>
                    <span className={styles.simControlLabel}>
                      <Users size={16} color="#f59e0b" /> Payroll & Operating Expenses
                    </span>
                    <span className={styles.simControlValue}>${opex.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="250000" 
                    step="2500" 
                    value={opex} 
                    onChange={(e) => setOpex(Number(e.target.value))}
                    className={styles.simSlider}
                  />
                </div>

                <div>
                  <div className={styles.simControlHeader}>
                    <span className={styles.simControlLabel}>
                      <Cloud size={16} color="#8b5cf6" /> Cloud, GPU & AI Spend (FinOps)
                    </span>
                    <span className={styles.simControlValue}>${cloudSpend.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="50000" 
                    step="500" 
                    value={cloudSpend} 
                    onChange={(e) => setCloudSpend(Number(e.target.value))}
                    className={styles.simSlider}
                  />
                </div>
              </div>

              {/* Calculated Outputs & 5-Pillar Card */}
              <div>
                <div className={styles.simResultsGrid}>
                  <div className={styles.simResultCard}>
                    <div className={styles.simResultLabel}>Gross Margin</div>
                    <div className={styles.simResultVal} style={{ color: Number(grossMargin) >= 50 ? '#10b981' : '#f59e0b' }}>
                      {grossMargin}%
                    </div>
                  </div>

                  <div className={styles.simResultCard}>
                    <div className={styles.simResultLabel}>Net Income</div>
                    <div className={styles.simResultVal} style={{ color: netIncome >= 0 ? '#10b981' : '#f43f5e' }}>
                      ${netIncome.toLocaleString()}
                    </div>
                  </div>

                  <div className={styles.simResultCard}>
                    <div className={styles.simResultLabel}>90-Day Runway</div>
                    <div className={styles.simResultVal} style={{ color: Number(runwayMonths) >= 12 ? '#10b981' : '#f59e0b' }}>
                      {runwayMonths} mos
                    </div>
                  </div>

                  <div className={styles.simResultCard}>
                    <div className={styles.simResultLabel}>Books Health AI Score</div>
                    <div className={styles.simResultVal} style={{ color: healthScore >= 80 ? '#10b981' : '#06b6d4' }}>
                      {healthScore} / 100
                    </div>
                  </div>
                </div>

                {/* 5-Pillar Explanation */}
                <div className={styles.pillarExplanationCard}>
                  <div className={styles.pillarExplanationTitle}>
                    <Sparkles size={16} /> EliteBooks 5-Pillar Reasoning
                  </div>
                  <div className={styles.pillarRow}>
                    <strong>1. What Happened:</strong> Net monthly cash flow is {netIncome >= 0 ? 'positive' : 'negative'} at ${netIncome.toLocaleString()} with {grossMargin}% Gross Margin.
                  </div>
                  <div className={styles.pillarRow}>
                    <strong>2. Why It Matters:</strong> Operating cash burn is ${monthlyBurn.toLocaleString()}/mo against $280,000 in liquid reserves ({runwayMonths} months of runway).
                  </div>
                  <div className={styles.pillarRow}>
                    <strong>3. Supporting Data:</strong> Cloud FinOps comprises {((cloudSpend / monthlyBurn) * 100).toFixed(1)}% of total operational expenditure.
                  </div>
                  <div className={styles.pillarRow}>
                    <strong>4. Recommended Action:</strong> {netIncome >= 0 ? 'Maintain current spend trajectory; consider reinvesting $10k/mo into growth.' : 'Implement FinOps token optimizations to reduce cloud burn by 15%.'}
                  </div>
                  <div className={styles.pillarRow}>
                    <strong>5. Mathematical Confidence:</strong> 99.8% Grounded in Double-Entry GAAP Rules.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: SOC 1 (ICFR) & SOC 2 Type II Compliance Architecture ─── */}
        <section id="compliance" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              Enterprise Compliance Vault
            </div>
            <h2 className={styles.sectionTitle}>SOC 1 (ICFR) & SOC 2 Type II Architecture</h2>
            <p className={styles.sectionSubtitle}>
              Engineered for Big 4 CPA audits, SEC scrutiny, and continuous automated governance.
            </p>
          </div>

          <div className={styles.socGrid}>
            {/* SOC 1 Card */}
            <div className={styles.socCard}>
              <div className={styles.socCardHeader}>
                <div className={styles.socIcon} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                  <FileCheck2 size={24} />
                </div>
                <h3>SOC 1 Type II (Financial ICFR)</h3>
              </div>
              <ul className={styles.socList}>
                <li className={styles.socItem}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Double-Entry Invariant:</strong> Continuous real-time verification ensuring sum(Debits) == sum(Credits) across every journal entry with zero mathematical drift.
                  </div>
                </li>
                <li className={styles.socItem}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>ASC-606 Revenue Recognition:</strong> Automated 5-step contract milestone recognition engine ensuring performance obligations are fulfilled prior to revenue recognition.
                  </div>
                </li>
                <li className={styles.socItem}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Maker-Checker Segregation of Duties (SoD):</strong> AI agents are strictly advisory; high-value disbursements and journal modifications mandate authorized dual-signature human approval.
                  </div>
                </li>
              </ul>
            </div>

            {/* SOC 2 Card */}
            <div className={styles.socCard}>
              <div className={styles.socCardHeader}>
                <div className={styles.socIcon} style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3>SOC 2 Type II (Trust Criteria)</h3>
              </div>
              <ul className={styles.socList}>
                <li className={styles.socItem}>
                  <CheckCircle2 size={18} style={{ color: '#06b6d4', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>AI Processing Integrity:</strong> 100% mathematical grounding in live general ledgers with zero ungrounded generative hallucinations or simulated fake numbers.
                  </div>
                </li>
                <li className={styles.socItem}>
                  <CheckCircle2 size={18} style={{ color: '#06b6d4', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>PII Tokenization Vault:</strong> Real-time in-memory redaction of SSNs, EINs, routing numbers, and bank credentials protected by AES-256-GCM encryption.
                  </div>
                </li>
                <li className={styles.socItem}>
                  <CheckCircle2 size={18} style={{ color: '#06b6d4', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Auditor Evidence Exporter:</strong> Instant 1-click JSON/PDF compliance artifact export for Drata, Vanta, and external CPA audit teams.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: Platform Comparison ─── */}
        <section id="comparison" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
              Generational Leap
            </div>
            <h2 className={styles.sectionTitle}>EliteBooks vs. Legacy Financial Software</h2>
            <p className={styles.sectionSubtitle}>
              See how our autonomous multi-agent architecture outperforms traditional manual entry tools.
            </p>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th>Architectural Capability</th>
                    <th>EliteBooks Autonomous</th>
                    <th>QuickBooks Online</th>
                    <th>NetSuite ERP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Multi-Agent Autonomous Swarm</td>
                    <td><Check size={18} color="#10b981" /> 10 Specialized Agents (LangGraph)</td>
                    <td><X size={18} color="#f43f5e" /> None (Manual Entry)</td>
                    <td><X size={18} color="#f43f5e" /> None (Manual Scripts)</td>
                  </tr>
                  <tr>
                    <td>Double-Entry Invariant Guard</td>
                    <td><Check size={18} color="#10b981" /> Continuous Math Verification</td>
                    <td><Check size={18} color="#10b981" /> Standard Ledger</td>
                    <td><Check size={18} color="#10b981" /> Standard Ledger</td>
                  </tr>
                  <tr>
                    <td>Voice AI Operations (7 Languages)</td>
                    <td><Check size={18} color="#10b981" /> Built-in OpenAI Nova/Whisper</td>
                    <td><X size={18} color="#f43f5e" /> Not Supported</td>
                    <td><X size={18} color="#f43f5e" /> Not Supported</td>
                  </tr>
                  <tr>
                    <td>Continuous Books Quality AI</td>
                    <td><Check size={18} color="#10b981" /> Real-Time 0–100 Health Score</td>
                    <td><X size={18} color="#f43f5e" /> Manual Month-End Close</td>
                    <td><X size={18} color="#f43f5e" /> Manual Reconciliation</td>
                  </tr>
                  <tr>
                    <td>Cloud & GPU FinOps Tracking</td>
                    <td><Check size={18} color="#10b981" /> Multi-Cloud & AI Token Costing</td>
                    <td><X size={18} color="#f43f5e" /> Basic Expense Tag</td>
                    <td><X size={18} color="#f43f5e" /> Requires Custom Module</td>
                  </tr>
                  <tr>
                    <td>Construction Retainage & ETC</td>
                    <td><Check size={18} color="#10b981" /> 5-10% Retainage & Change Orders</td>
                    <td><X size={18} color="#f43f5e" /> Basic Job Costing Only</td>
                    <td><Check size={18} color="#10b981" /> Available (High Tier)</td>
                  </tr>
                  <tr>
                    <td>SOC 1 (ICFR) & SOC 2 Evidence Export</td>
                    <td><Check size={18} color="#10b981" /> 1-Click Drata/Vanta Integration</td>
                    <td><X size={18} color="#f43f5e" /> Manual CSV Export</td>
                    <td><Check size={18} color="#10b981" /> Manual Audit Trail</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── SECTION 6: 8 In-Depth Architecture Chapters ─── */}
        <section id="chapters" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
              Deep Dive Curriculum
            </div>
            <h2 className={styles.sectionTitle}>EliteBooks Masterclass Chapters</h2>
            <p className={styles.sectionSubtitle}>
              Eight comprehensive chapters breaking down the underlying technology and financial algorithms.
            </p>
          </div>

          <div className={styles.chapterGrid}>
            {/* Chapter 1 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 01</span>
                <h3 className={styles.chapterTitle}>Income, Expenses & Invoicing Architecture</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  EliteBooks establishes continuous bi-directional connectivity with bank and credit card accounts to automatically log and sort daily spending without human intervention.
                </p>
                <p>
                  For accounts receivable, the Invoicing Agent creates custom professional invoices with itemized tax calculations and lets clients pay directly online via integrated card, ACH, or bank transfer links.
                </p>
              </div>
            </div>

            {/* Chapter 2 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 02</span>
                <h3 className={styles.chapterTitle}>Autonomous Payroll & Tax Filings</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  Payroll Services automatically pay employees, calculate gross-to-net withholdings pursuant to IRS Circular E, accrue FICA employer matching liabilities, and prepare quarterly Form 941 filings.
                </p>
                <p>
                  Direct deposit batches are cryptographically verified and synchronized in real time with the General Ledger to ensure zero manual journal adjustments at payroll close.
                </p>
              </div>
            </div>

            {/* Chapter 3 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 03</span>
                <h3 className={styles.chapterTitle}>Financial Reporting & Real-Time Statements</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  The platform generates real-time profit and loss statements, balance sheets, and cash flow summaries. Every statement is mathematically tied to verified double-entry ledger entries locked with SHA-256 cryptographic hashes.
                </p>
                <p>
                  Stakeholders can drill down from high-level EBITDA summaries into individual source transactions and OCR receipt scans with sub-second latency.
                </p>
              </div>
            </div>

            {/* Chapter 4 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 04</span>
                <h3 className={styles.chapterTitle}>Inventory Tracking & Stock Management</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  For product and commerce enterprises, Inventory Tracking monitors stock levels in real time as sales and purchases happen. Available on higher tiers, this module ensures COGS calculations and inventory valuation remain perfectly balanced.
                </p>
                <p>
                  Predictive stock sentry algorithms forecast seasonal demand surges and compute optimum economic order quantities (EOQ).
                </p>
              </div>
            </div>

            {/* Chapter 5 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 05</span>
                <h3 className={styles.chapterTitle}>Receipt and Mile Tracking</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  The Receipt and Mile Tracking engine snaps photos of receipts using OpenAI Computer Vision to extract line items and logs business travel using standard IRS mileage deduction rates ($0.67/mile) for automated tax write-offs.
                </p>
                <p>
                  Extracted receipts are cross-referenced with bank feeds to prevent double-counting and automatically screen for personal non-deductible expenditures.
                </p>
              </div>
            </div>

            {/* Chapter 6 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 06</span>
                <h3 className={styles.chapterTitle}>EliteBooks Intelligence & Customizable KPI Studio</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  EliteBooks Intelligence delivers a customized financial operating layer that adapts to your business model:
                </p>
                <ul className={styles.chapterList}>
                  <li><strong>Custom KPI Builder:</strong> Evaluate custom mathematical formulas (e.g. <code>(NetProfit / Revenue) * 100</code>) with dynamic alert thresholds.</li>
                  <li><strong>Books Quality AI:</strong> Continuous 0–100 Books Health score evaluating duplicate charges, missing receipts, and unallocated costs.</li>
                  <li><strong>5-Pillar Explanations:</strong> Every insight explains What Happened, Why It Matters, Supporting Data, Recommended Action, and Confidence.</li>
                  <li><strong>Unlimited Classes & Locations:</strong> Multidimensional general ledger segmentation across departments, entities, and job sites.</li>
                </ul>
              </div>
            </div>

            {/* Chapter 7 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 07</span>
                <h3 className={styles.chapterTitle}>SOC 1 (ICFR) & SOC 2 Type II Compliance Architecture</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  EliteBooks is engineered for enterprise compliance, Big 4 CPA audits, and continuous security reviews:
                </p>
                <ul className={styles.chapterList}>
                  <li><strong>SOC 1 Type II (Financial ICFR):</strong> Double-Entry Invariant (sum Debits == sum Credits), ASC-606 5-step milestone checks, and Maker-Checker segregation of duties.</li>
                  <li><strong>SOC 2 Type II (Trust Criteria):</strong> 100% mathematical database grounding with zero hallucination risk, in-memory PII tokenization vault, and instant auditor evidence export.</li>
                </ul>
              </div>
            </div>

            {/* Chapter 8 */}
            <div className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <span className={styles.chapterNumber}>Chapter 08</span>
                <h3 className={styles.chapterTitle}>Dual-Mode Architecture: Manual Rigor & Autonomous Speed</h3>
              </div>
              <div className={styles.chapterContent}>
                <p>
                  Unlike closed AI black-boxes, EliteBooks provides a pure <strong>Dual-Mode Workflow</strong>. Every financial operation retains full, uncompromised manual control alongside instantaneous AI acceleration.
                </p>
                <p>
                  Controllers can manually customize line items, adjust account mappings, or click "Create with AI" to let specialized agents draft GAAP-balanced records in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── High Conversion CTA Banner ─── */}
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Ready to Experience the Future of Enterprise Finance?</h2>
          <p className={styles.ctaSubtitle}>
            Join innovative founders, CFOs, and controllers who run mathematically balanced, autonomous accounting on EliteBooks.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/signup" className="btn btn-primary btn-lg" style={{ padding: '16px 36px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-lg" style={{ padding: '16px 36px', fontSize: '16px' }}>
              Explore Live Dashboard
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/NewIcon.png" alt="EliteBooks" style={{ width: '24px', height: '24px' }} />
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px' }}>EliteBooks</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>&copy; {new Date().getFullYear()} EliteBooks Financial OS. All rights reserved.</span>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/features" className={styles.footerLink}>Features</Link>
            <Link href="/learning" className={styles.footerLink} style={{ color: '#60a5fa', fontWeight: 700 }}>Masterclass</Link>
            <Link href="/support" className={styles.footerLink}>Support</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <a href="https://famio.us" target="_blank" rel="noopener noreferrer" className={styles.footerLink} style={{ color: '#f472b6', fontWeight: 700 }}>famio.us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
