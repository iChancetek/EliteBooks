import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.legalPage}>
      {/* Background Effects */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      
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

      <main className={styles.legalContent}>
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

      <style>{`
        .${styles.legalPage} { min-height: 100vh; position: relative; overflow-x: hidden; background: var(--color-bg-primary); }
        .${styles.bgMesh} { position: fixed; inset: 0; background: radial-gradient(circle at center, rgba(147, 51, 234, 0.03) 0%, transparent 100%); pointer-events: none; z-index: 0; }
        .${styles.bgOrb1} { position: absolute; top: -20%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        
        .${styles.nav} { position: relative; z-index: 10; border-bottom: 1px solid var(--color-border-primary); background: rgba(10, 10, 10, 0.5); backdrop-filter: blur(12px); }
        .${styles.navInner} { max-width: 1200px; margin: 0 auto; padding: var(--space-4) var(--space-6); display: flex; align-items: center; justify-content: space-between; }
        .${styles.logo} { display: flex; align-items: center; gap: var(--space-2); text-decoration: none; }
        .${styles.logoIcon} { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary)); border-radius: var(--radius-md); color: white; }
        .${styles.logoText} { font-weight: var(--weight-bold); font-size: var(--text-lg); color: var(--color-text-primary); letter-spacing: -0.02em; }
        
        .${styles.legalContent} { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; padding: var(--space-16) var(--space-6); }
        .${styles.legalHeader} { text-align: center; margin-bottom: var(--space-12); }
        .${styles.legalHeader} h1 { font-size: var(--text-4xl); margin-bottom: var(--space-2); background: linear-gradient(to right, #fff, #a1a1aa); -webkit-background-clip: text; color: transparent; }
        .${styles.legalHeader} p { color: var(--color-text-tertiary); }
        
        .${styles.legalBody} { padding: var(--space-10); display: flex; flex-direction: column; gap: var(--space-8); }
        .${styles.legalBody} section h2 { font-size: var(--text-xl); color: var(--color-text-primary); margin-bottom: var(--space-4); }
        .${styles.legalBody} section p { color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-4); }
        
        .${styles.footer} { border-top: 1px solid var(--color-border-primary); padding: var(--space-8) 0; position: relative; z-index: 10; margin-top: auto; }
        .${styles.footerInner} { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); text-align: center; color: var(--color-text-tertiary); }
      `}</style>
    </div>
  );
}
