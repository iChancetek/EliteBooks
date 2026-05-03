'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, MessageSquare, LifeBuoy } from 'lucide-react';
import styles from './page.module.css';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.supportPage}>
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

      <main className={styles.supportContent}>
        <div className={styles.supportHeader}>
          <h1>How can we help?</h1>
          <p>Get in touch with our elite support team or browse our FAQs.</p>
        </div>

        <div className={styles.supportGrid}>
          <div className={`glass-card ${styles.contactCard}`}>
            <h2>Contact Support</h2>
            {submitted ? (
              <div className={styles.successMessage}>
                <LifeBuoy size={48} style={{ color: 'var(--color-accent-primary)', marginBottom: 'var(--space-4)' }} />
                <h3>Message Sent!</h3>
                <p>An EliteBooks agent will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="input" placeholder="you@company.com" required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" className="input" placeholder="How can we help?" required />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="input" rows={5} placeholder="Describe your issue..." required style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            )}
          </div>

          <div className={styles.faqSidebar}>
            <h2>Frequently Asked Questions</h2>
            
            <div className={styles.faqItem}>
              <h3>How do the AI Agents work?</h3>
              <p>Our 7 agents run autonomously in the background, continuously analyzing your bank feeds, matching receipts, and categorizing transactions without manual input.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Is my financial data secure?</h3>
              <p>Yes. We use bank-level 256-bit AES encryption. Our AI models do not share your raw data with external public LLMs.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I export my data to my CPA?</h3>
              <p>Absolutely! You can invite your CPA directly via the dashboard or export standard CSV and PDF financial reports.</p>
            </div>

            <div className={styles.contactLinks}>
              <a href="mailto:support@elitebooks.com" className="btn btn-secondary">
                <Mail size={16} /> Email Us
              </a>
              <button className="btn btn-secondary" onClick={() => alert('Live chat is currently offline.')}>
                <MessageSquare size={16} /> Live Chat
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>&copy; {new Date().getFullYear()} EliteBooks. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .${styles.supportPage} { min-height: 100vh; position: relative; overflow-x: hidden; background: var(--color-bg-primary); display: flex; flex-direction: column; }
        .${styles.bgMesh} { position: fixed; inset: 0; background: radial-gradient(circle at center, rgba(147, 51, 234, 0.03) 0%, transparent 100%); pointer-events: none; z-index: 0; }
        .${styles.bgOrb1} { position: absolute; top: 10%; right: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        
        .${styles.nav} { position: relative; z-index: 10; border-bottom: 1px solid var(--color-border-primary); background: rgba(10, 10, 10, 0.5); backdrop-filter: blur(12px); }
        .${styles.navInner} { max-width: 1200px; margin: 0 auto; padding: var(--space-4) var(--space-6); display: flex; align-items: center; justify-content: space-between; }
        .${styles.logo} { display: flex; align-items: center; gap: var(--space-2); text-decoration: none; }
        .${styles.logoIcon} { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary)); border-radius: var(--radius-md); color: white; }
        .${styles.logoText} { font-weight: var(--weight-bold); font-size: var(--text-lg); color: var(--color-text-primary); letter-spacing: -0.02em; }
        
        .${styles.supportContent} { position: relative; z-index: 10; max-width: 1000px; margin: 0 auto; padding: var(--space-16) var(--space-6); flex: 1; }
        .${styles.supportHeader} { text-align: center; margin-bottom: var(--space-12); }
        .${styles.supportHeader} h1 { font-size: var(--text-4xl); margin-bottom: var(--space-2); background: linear-gradient(to right, #fff, #a1a1aa); -webkit-background-clip: text; color: transparent; }
        .${styles.supportHeader} p { color: var(--color-text-tertiary); font-size: var(--text-lg); }
        
        .${styles.supportGrid} { display: grid; grid-template-columns: 3fr 2fr; gap: var(--space-8); }
        @media (max-width: 768px) { .${styles.supportGrid} { grid-template-columns: 1fr; } }
        
        .${styles.contactCard} { padding: var(--space-8); }
        .${styles.contactCard} h2 { font-size: var(--text-2xl); margin-bottom: var(--space-6); }
        
        .${styles.contactForm} { display: flex; flex-direction: column; gap: var(--space-4); }
        .${styles.successMessage} { text-align: center; padding: var(--space-12) 0; }
        .${styles.successMessage} h3 { font-size: var(--text-2xl); color: var(--color-positive); margin-bottom: var(--space-2); }
        .${styles.successMessage} p { color: var(--color-text-secondary); }
        
        .${styles.faqSidebar} { display: flex; flex-direction: column; gap: var(--space-6); padding-top: var(--space-2); }
        .${styles.faqSidebar} h2 { font-size: var(--text-xl); color: var(--color-text-primary); margin-bottom: var(--space-2); }
        .${styles.faqItem} h3 { font-size: var(--text-md); color: var(--color-text-secondary); margin-bottom: var(--space-2); }
        .${styles.faqItem} p { font-size: var(--text-sm); color: var(--color-text-tertiary); line-height: 1.6; }
        
        .${styles.contactLinks} { display: flex; gap: var(--space-4); margin-top: var(--space-4); }
        
        .${styles.footer} { border-top: 1px solid var(--color-border-primary); padding: var(--space-8) 0; position: relative; z-index: 10; margin-top: auto; }
        .${styles.footerInner} { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); text-align: center; color: var(--color-text-tertiary); }
      `}</style>
    </div>
  );
}
