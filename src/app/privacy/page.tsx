import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
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
          <Link href="/" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      <main className={styles.legalContent} id="privacy-main-content">
        <div className={styles.legalHeader}>
          <h1>Privacy Policy</h1>
          <p>Last updated: May 3, 2026</p>
        </div>

        <div className={`glass-card ${styles.legalBody}`}>
          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, connect a bank feed, or interact with our AI agents. This includes personal information (such as your name and email) and financial data (such as transaction histories and invoices).</p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>Your data is primarily used to power the autonomous accounting features of EliteBooks. Specifically, our AI models analyze your financial data to categorize expenses, generate reports, and predict cash flow. We do NOT sell your financial data to third parties.</p>
          </section>

          <section>
            <h2>3. AI Processing</h2>
            <p>To provide our services, your data is processed by our proprietary AI agents (Orchestrator, Ledger, Expense, etc.). This data is processed securely and is not used to train global public models without your explicit, anonymized consent.</p>
          </section>

          <section>
            <h2>4. Third-Party Integrations</h2>
            <p>We use third-party providers, such as Plaid or Stripe, to securely connect to your banking institutions. These connections are governed by the privacy policies of the respective providers. We only store the data necessary to perform accounting tasks.</p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal and financial information at any time. You can export your data from the dashboard or contact support to request a full account deletion.</p>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>&copy; {new Date().getFullYear()} EliteBooks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
