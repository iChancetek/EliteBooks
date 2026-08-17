import Link from 'next/link';
import { Sparkles, ArrowLeft, Shield, Lock, EyeOff, Server, Key, FileCheck } from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function PrivacyPage() {
  return (
    <div className={styles.legalPage}>
      {/* Background Effects */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      
      <PageVoiceControl contentId="privacy-main-content" pageTitle="Privacy Policy" />

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

      <main className={styles.legalContent} id="privacy-main-content">
        <div className={styles.legalHeader}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
            <Shield size={12} /> Enterprise Data Protection
          </div>
          <h1>Privacy Policy</h1>
          <p>Effective Date: August 17, 2026 • Cryptographic Zero-Knowledge Standards</p>
        </div>

        <div className={`glass-card ${styles.legalBody}`}>
          <section>
            <h2>1. Zero-Data-Brokerage Pledge</h2>
            <p>
              EliteBooks is built upon a fundamental principle: <strong>Your financial data belongs exclusively to your business.</strong> We do not sell, rent, monetize, or broker corporate transaction logs, customer records, or financial metrics to third-party advertisers, data aggregators, or marketing networks under any circumstance.
            </p>
          </section>

          <section>
            <h2>2. Information We Ingest & Collect</h2>
            <p>
              To power our multi-agent autonomous accounting services, we collect and process the following categories of information:
            </p>
            <ul>
              <li><strong>Corporate Account Credentials:</strong> Administrator name, verified corporate email address, and multi-tenant organization identifiers.</li>
              <li><strong>Financial Ledger Data:</strong> Invoices, merchant receipts, bank transaction lines, category tags, and Chart of Accounts mappings.</li>
              <li><strong>Workforce & Payroll Metadata:</strong> Employee names, compensation tiers, department assignments, and tax withholding profiles.</li>
              <li><strong>Cloud Infrastructure Logs:</strong> Cloud cost metrics and resource billing lines (AWS, Azure, GCP, OpenAI) for FinOps optimization.</li>
            </ul>
          </section>

          <section>
            <h2>3. Cryptographic PII Vault (AES-256-GCM)</h2>
            <p>
              All Personally Identifiable Information (PII), including bank routing numbers, employee Taxpayer Identification Numbers (TINs/SSNs), and credit card tokens, is processed through our dedicated PII Vault. Data is tokenized and encrypted at rest using industry-standard AES-256-GCM authenticated encryption. Decryption keys are managed through isolated Hardware Security Modules (HSM).
            </p>
          </section>

          <section>
            <h2>4. Zero-Retention Private LLM Inference</h2>
            <p>
              When our AI agents synthesize financial summaries or categorize expenses, requests are transmitted via encrypted enterprise TLS 1.3 channels to isolated private model inference endpoints with strict zero-data-retention agreements. Your raw ledger entries and receipts are never stored on external servers to train global foundation models.
            </p>
          </section>

          <section>
            <h2>5. Banking & OAuth Token Segregation</h2>
            <p>
              Direct bank connections are established through certified Open Banking protocols (Plaid) and payment gateways (Stripe Connect). EliteBooks maintains only tokenized, read-only permissions and never has access to or stores your primary banking passwords or direct login credentials.
            </p>
          </section>

          <section>
            <h2>6. Global Compliance (GDPR & CCPA)</h2>
            <p>
              Regardless of your geographical headquarters, EliteBooks extends global privacy standards to all organizations:
            </p>
            <ul>
              <li><strong>Right to Portability:</strong> Export your complete ledger history, journal entries, and customer rosters in standard JSON/CSV formats at any time.</li>
              <li><strong>Right to Erasure:</strong> Request permanent cryptographic deletion of all stored receipts, logs, and organization records.</li>
              <li><strong>Right to Rectification:</strong> Directly modify or generate reversing journal entries for any historical transaction.</li>
            </ul>
          </section>

          <section>
            <h2>7. Security Governance & Incident Response</h2>
            <p>
              Our infrastructure is continuously monitored for anomalous access patterns by the Fraud Sentinel agent. In the unlikely event of a security incident, verified administrative contacts will be notified within 24 hours pursuant to enterprise compliance mandates.
            </p>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>&copy; {new Date().getFullYear()} EliteBooks. Zero-Knowledge Financial Privacy.</p>
        </div>
      </footer>
    </div>
  );
}
