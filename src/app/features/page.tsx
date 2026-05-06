'use client';

import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Brain, Receipt, FileText, 
  CreditCard, TrendingUp, DollarSign, Shield, ArrowRight,
  BarChart3, Users, PieChart, CheckCircle2, ArrowUpRight,
  Network, Library, Link2, Mic, Headphones, Cloud,
  Wallet, Bot, Target, Clock, Zap, ShieldCheck,
  MousePointer2, Settings, History, AlertTriangle
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

const fullFeatures = [
  {
    id: 'invoicing',
    icon: FileText,
    title: 'Advanced Invoice Creator',
    subtitle: 'Professional billing, automated.',
    description: 'The all-new Invoice Creator transforms billing into a high-speed, automated workflow. Draft enterprise-grade invoices in seconds with real-time math, dynamic line items, and custom branding presets.',
    color: '#3b82f6',
    bullets: ['Live calculation of taxes & discounts', 'Custom logo & branding themes', 'One-click PDF & smart sending', 'Multi-payment method support'],
    agent: { name: 'Invoice Agent', icon: CreditCard }
  },
  {
    id: 'personal-finance',
    icon: Wallet,
    title: 'Personal AI Autopilot',
    subtitle: 'Your personal financial autopilot.',
    description: 'Go beyond business. Manage your personal wealth with an autonomous agent that predicts cash flow, protects you from overdrafts, and identifies "hidden money leaks" in your subscriptions.',
    color: '#10b981',
    bullets: ['60-day cash flow forecasting', 'Autonomous bill protection', 'Subscription leak detection', 'Goal-driven auto-savings'],
    agent: { name: 'Autopilot Agent', icon: Bot }
  },
  {
    id: 'finops',
    icon: Cloud,
    title: 'Cloud & AI FinOps',
    subtitle: 'Optimize AI & Cloud spend autonomously.',
    description: 'Manage Total Technology Value (TTV) across public cloud, SaaS, and AI infrastructure. Our agent monitors GPU/token costs, identifies waste, and executes real-time architectural optimizations.',
    color: '#0ea5e9',
    bullets: ['FinOps for AI (GPU/Token tracking)', 'Automated FOCUS 1.3 spec reporting', 'Shift-left architectural cost control', 'SaaS license & ITAM integration'],
    agent: { name: 'FinOps Agent', icon: Cloud }
  },
  {
    id: 'governance',
    icon: ShieldCheck,
    title: 'Wealth Governance',
    subtitle: 'Full-context financial reasoning.',
    description: 'Beyond simple tracking, EliteBooks provides proactive intelligence on tax optimization, ETF structures, and multi-account debt management with high-level security and trust.',
    color: '#6366f1',
    bullets: ['Real-time tax optimization', 'Automated portfolio rebalancing', 'Strategic credit score guidance', 'Secure full-context reasoning'],
    agent: { name: 'Personal Agent', icon: Bot }
  },
  {
    id: 'reports',
    icon: BarChart3,
    title: 'Predictive Intelligence',
    subtitle: 'Know the future, not just the past.',
    description: 'While others show you history, EliteBooks shows you what\'s coming. Our predictive engine analyzes trends to forecast revenue and expenses months in advance with 98% accuracy.',
    color: '#8b5cf6',
    bullets: ['ML-driven revenue forecasting', 'Anomaly & fraud detection', 'Natural language reporting', 'Dynamic scenario modeling'],
    agent: { name: 'Cash Flow Agent', icon: TrendingUp }
  },
  {
    id: 'payroll',
    icon: Users,
    title: 'Autonomous Payroll',
    subtitle: 'Pay your team on autopilot.',
    description: 'Zero-touch payroll for W-2s and 1099s. The system automatically calculates withholdings, files compliance documents, and executes direct deposits based on your defined pay schedule.',
    color: '#f59e0b',
    bullets: ['Auto-withholding & tax filing', 'Instant direct deposits', 'Contractor compliance check', 'Year-end W-2 automation'],
    agent: { name: 'Payroll Agent', icon: DollarSign }
  },
  {
    id: 'inventory',
    icon: PieChart,
    title: 'Intelligent Inventory',
    subtitle: 'Predictive supply chain management.',
    description: 'Track stock across any number of locations. The system uses predictive AI to manage reorder points and calculate COGS dynamically, ensuring you never miss a sale.',
    color: '#ec4899',
    bullets: ['Multi-location sync', 'AI reorder triggers', 'Real-time COGS analysis', 'Supplier integration'],
    agent: { name: 'Ledger Agent', icon: FileText }
  }
];

export default function FeaturesPage() {
  return (
    <div className={styles.featuresPage}>
      {/* Background Effects */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />
      
      <PageVoiceControl contentId="features-main-content" pageTitle="How it Works" />

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
            <Link href="/signin" className="btn btn-ghost">Sign In</Link>
            <Link href="/signup" className="btn btn-primary">Try it Free</Link>
          </div>
        </div>
      </nav>

      <main className={styles.featuresContent} id="features-main-content">
        <div className={styles.heroSection}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>Platform Deep Dive</span>
          </div>
          <h1 className={styles.heroTitle}>
            Accounting that runs <br/>
            <span className="text-gradient">on pure intelligence.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            EliteBooks is an AI-powered financial operating system with autonomous agents handling invoicing, expenses, payroll, reporting, FinOps, and personal finances — all automated and clearly explained.
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
                    <li key={b}><CheckCircle2 size={16} style={{ color: feature.color }} /> {b}</li>
                  ))}
                </ul>

                <div className={styles.agentTag}>
                  <span>Managed by:</span>
                  <div className={styles.agentTagBadge}>
                    <feature.agent.icon size={14} />
                    {feature.agent.name}
                  </div>
                </div>
              </div>
              
              <div className={styles.featureVisual}>
                {feature.id === 'invoicing' && (
                  <div className={styles.visualContainer}>
                    <div className={styles.mockEditor}>
                      <div className={styles.mockHeader}>
                        <div className={styles.mockCircle} />
                        <div className={styles.mockCircle} />
                        <div className={styles.mockCircle} />
                      </div>
                      <div className={styles.mockContent}>
                        <div className={styles.invoiceHead}>
                          <div className={styles.logoPlaceholder} />
                          <div className={styles.invoiceDetails}>
                            <div className={styles.lineSmall} style={{ width: '80px' }} />
                            <div className={styles.lineLarge} style={{ width: '120px' }} />
                          </div>
                        </div>
                        <div className={styles.invoiceTable}>
                          <div className={styles.tableRow}>
                            <div className={styles.lineSmall} style={{ width: '140px' }} />
                            <div className={styles.lineSmall} style={{ width: '40px' }} />
                          </div>
                          <div className={styles.tableRow}>
                            <div className={styles.lineSmall} style={{ width: '110px' }} />
                            <div className={styles.lineSmall} style={{ width: '40px' }} />
                          </div>
                        </div>
                        <div className={styles.invoiceTotal}>
                          <div className={styles.lineLarge} style={{ width: '100px', background: feature.color }} />
                        </div>
                      </div>
                      <div className={styles.mockControls}>
                        <div className={styles.controlPill} style={{ background: feature.color }}>Save & Send</div>
                        <div className={styles.controlPill}>PDF Preview</div>
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'personal-finance' && (
                  <div className={styles.visualContainer}>
                    <div className={styles.mockAutopilot}>
                      <div className={styles.autopilotHeader}>
                        <Bot size={24} style={{ color: feature.color }} />
                        <span>Autopilot: Active</span>
                      </div>
                      <div className={styles.forecastChart}>
                        <div className={styles.bar} style={{ height: '40%' }} />
                        <div className={styles.bar} style={{ height: '60%' }} />
                        <div className={styles.bar} style={{ height: '55%' }} />
                        <div className={styles.bar} style={{ height: '85%', background: feature.color }} />
                        <div className={styles.bar} style={{ height: '70%', background: feature.color, opacity: 0.6 }} />
                        <div className={styles.bar} style={{ height: '90%', background: feature.color, opacity: 0.4 }} />
                      </div>
                      <div className={styles.actionLog}>
                        <div className={styles.logItem}>
                          <History size={12} />
                          <span>Moved $150 to Savings</span>
                        </div>
                        <div className={styles.logItem}>
                          <History size={12} />
                          <span>Flagged unused Hulu sub</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'reports' && (
                  <div className={styles.visualContainer}>
                    <div className={styles.mockDashboard}>
                      <div className={styles.dashStats}>
                        <div className={styles.statBox}>
                          <TrendingUp size={20} color={feature.color} />
                          <div className={styles.lineLarge} style={{ width: '60px' }} />
                        </div>
                        <div className={styles.statBox}>
                          <DollarSign size={20} color={feature.color} />
                          <div className={styles.lineLarge} style={{ width: '60px' }} />
                        </div>
                      </div>
                      <div className={styles.largeChart}>
                        <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
                          <path d="M0,80 Q50,20 100,50 T200,10" fill="none" stroke={feature.color} strokeWidth="3" />
                          <circle cx="100" cy="50" r="4" fill={feature.color} />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                {feature.id === 'payroll' && (
                  <div className={styles.visualContainer}>
                    <div className={styles.mockList}>
                      {[1, 2, 3].map(i => (
                        <div key={i} className={styles.listItem}>
                          <div className={styles.avatar} />
                          <div style={{ flex: 1 }}>
                            <div className={styles.lineSmall} style={{ width: '100px' }} />
                            <div className={styles.lineSmall} style={{ width: '60px', opacity: 0.5 }} />
                          </div>
                          <div className={styles.lineSmall} style={{ width: '40px' }} />
                        </div>
                      ))}
                      <div className={styles.actionBtn} style={{ background: feature.color }}>Process Payroll</div>
                    </div>
                  </div>
                )}
                {feature.id === 'inventory' && (
                  <div className={styles.visualContainer}>
                    <div className={styles.mockInventory}>
                      <div className={styles.inventoryStats}>
                        <div className={styles.pie} style={{ border: `8px solid ${feature.color}` }} />
                        <div className={styles.inventoryInfo}>
                          <div className={styles.lineSmall} style={{ width: '80px' }} />
                          <div className={styles.lineLarge} style={{ width: '120px' }} />
                        </div>
                      </div>
                      <div className={styles.stockAlert} style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}40` }}>
                        <AlertTriangle size={14} color={feature.color} />
                        <span>AI Reordered 50 units of "Elite Pro"</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to automate your financial future?</h2>
          <p>Join businesses and individuals managing over $500M in autonomous transactions.</p>
          <div className={styles.ctaActions}>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link href="/support" className="btn btn-secondary btn-lg">
              Contact Sales
            </Link>
          </div>
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
            <p>Accounting and wealth management that runs itself.</p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/support">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
