import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Shield, Lock, EyeOff, 
  Server, Key, FileCheck2, CheckCircle2, 
  ArrowRight, Database, ShieldCheck, Cpu, HardDrive
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function PrivacyPage() {
  const privacySections = [
    {
      id: 'zero-brokerage',
      icon: EyeOff,
      title: '1. Zero-Data-Brokerage Pledge',
      content: (
        <>
          <p>
            EliteBooks is built upon a fundamental invariant: <strong>Your financial data belongs exclusively to your business.</strong> We do not sell, rent, monetize, or broker corporate transaction logs, customer records, or financial metrics to third-party advertisers, data aggregators, or marketing networks under any circumstance.
          </p>
          <p>
            Our revenue model is strictly software subscription-based. We do not participate in cross-context behavioral tracking or corporate financial surveillance.
          </p>
        </>
      )
    },
    {
      id: 'data-ingestion',
      icon: Database,
      title: '2. Information We Ingest & Collect',
      content: (
        <>
          <p>
            To power our multi-agent autonomous accounting services, we collect and process the following categories of information:
          </p>
          <ul className={styles.legalList}>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Corporate Account Credentials:</strong> Administrator name, verified corporate email address, and multi-tenant organization identifiers.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Financial Ledger Data:</strong> Invoices, merchant receipts, bank transaction lines, category tags, and Chart of Accounts mappings.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Workforce & Payroll Metadata:</strong> Employee names, compensation tiers, department assignments, and tax withholding profiles.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Cloud Infrastructure Logs:</strong> Cloud cost metrics and resource billing lines (AWS, Azure, GCP, OpenAI) for FinOps optimization.</div>
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'pii-vault',
      icon: Lock,
      title: '3. Cryptographic PII Vault (AES-256-GCM)',
      content: (
        <>
          <p>
            All Personally Identifiable Information (PII), including bank routing numbers, employee Taxpayer Identification Numbers (TINs/SSNs), and credit card tokens, is processed through our dedicated PII Vault. Data is tokenized and encrypted at rest using industry-standard AES-256-GCM authenticated encryption. Decryption keys are managed through isolated Hardware Security Modules (HSM).
          </p>
          <p>
            In-memory tokenization intercepts sensitive parameters before AI agent processing, ensuring model prompts only operate on redacted, non-identifiable numerical arrays.
          </p>
        </>
      )
    },
    {
      id: 'private-llm',
      icon: Cpu,
      title: '4. Zero-Retention Private LLM Inference',
      content: (
        <>
          <p>
            When our AI agents synthesize financial summaries or categorize expenses, requests are transmitted via encrypted enterprise TLS 1.3 channels to isolated private model inference endpoints with strict zero-data-retention agreements.
          </p>
          <p>
            Your raw ledger entries, receipts, and employee records are <strong>never stored on external servers or used to train global foundation models</strong>. Model outputs are strictly transient and committed solely to your private database partition.
          </p>
        </>
      )
    },
    {
      id: 'banking-segregation',
      icon: Key,
      title: '5. Banking & OAuth Token Segregation',
      content: (
        <>
          <p>
            Direct bank connections are established through certified Open Banking protocols (Plaid) and payment gateways (Stripe Connect). EliteBooks maintains only tokenized, read-only permissions and never has access to or stores your primary banking passwords or direct login credentials.
          </p>
        </>
      )
    },
    {
      id: 'global-rights',
      icon: ShieldCheck,
      title: '6. Global Compliance (GDPR & CCPA)',
      content: (
        <>
          <p>
            Regardless of your geographical headquarters, EliteBooks extends global privacy standards to all organizations:
          </p>
          <ul className={styles.legalList}>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Right to Portability:</strong> Export your complete ledger history, journal entries, and customer rosters in standard JSON/CSV formats at any time.</div>
            </li>
            <li className={styles.legalListItem}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Right to Erasure:</strong> Request permanent cryptographic deletion of personal workforce records and archived transaction backups upon account termination.</div>
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'audit-lifecycle',
      icon: FileCheck2,
      title: '7. Automated Audit Defense & Data Retention Lifecycle',
      content: (
        <>
          <p>
            General ledger transactions reconciled with double-entry integrity receive SHA-256 cryptographic locks. Tax compliance documentation (Form 941, 1099-NEC dossiers) is retained pursuant to statutory IRS 7-year audit requirements in immutable, append-only cold storage vaults.
          </p>
        </>
      )
    },
    {
      id: 'subprocessors',
      icon: Server,
      title: '8. Infrastructure & Authorized Subprocessors',
      content: (
        <>
          <p>
            EliteBooks utilizes SOC 1/2 Type II certified cloud infrastructure providers including Google Cloud Platform (GCP), Amazon Web Services (AWS), and Stripe. All subprocessors are bound by enterprise Data Protection Agreements (DPAs) enforcing strict confidentiality and encryption invariants.
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

      <PageVoiceControl contentId="privacy-main-content" pageTitle="Privacy Policy & Cryptographic Data Protection" />

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
            <Link href="/privacy" className={styles.navLink} style={{ color: '#34d399', fontWeight: 700 }}>Privacy</Link>
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

      {/* Main Content */}
      <main className={styles.legalContent} id="privacy-main-content">
        <div className={styles.legalHeader}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <Shield size={14} />
            <span>Cryptographic Privacy Vault · Zero-Knowledge Standards</span>
          </div>

          <h1 className={styles.heroTitle}>
            Privacy Policy &<br />
            <span className="text-gradient">Data Protection Standards</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Effective Date: August 17, 2026 • Full client data sovereignty, zero-data-brokerage, in-memory PII tokenization, and strict private LLM inference architecture.
          </p>

          {/* Key Security Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>AES-256-GCM</div>
              <div className={styles.statLabel}>Cryptographic PII Vault</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>0% Brokerage</div>
              <div className={styles.statLabel}>Data Never Sold or Shared</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>0-Retention</div>
              <div className={styles.statLabel}>Private LLM Inference</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>GDPR & CCPA</div>
              <div className={styles.statLabel}>Global Portability Rights</div>
            </div>
          </div>
        </div>

        {/* Structured Legal Cards Grid */}
        <div className={styles.legalGrid}>
          {privacySections.map((sec) => {
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
          <h2 className={styles.ctaTitle}>Experience Enterprise-Grade Security</h2>
          <p className={styles.ctaSubtitle}>
            Protect your financial operations with mathematical double-entry invariants, AES-256-GCM encryption, and full data sovereignty.
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
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px' }}>EliteBooks Privacy</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>&copy; {new Date().getFullYear()} EliteBooks Financial OS. All rights reserved.</span>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/features" className={styles.footerLink}>Features</Link>
            <Link href="/learning" className={styles.footerLink}>Masterclass</Link>
            <Link href="/support" className={styles.footerLink}>Support</Link>
            <Link href="/privacy" className={styles.footerLink} style={{ color: '#34d399', fontWeight: 700 }}>Privacy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <a href="https://famio.us" target="_blank" rel="noopener noreferrer" className={styles.footerLink} style={{ color: '#f472b6', fontWeight: 700 }}>famio.us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
