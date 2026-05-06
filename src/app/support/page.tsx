'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, MessageSquare, LifeBuoy } from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

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
      
      <PageVoiceControl contentId="support-main-content" pageTitle="Support & Help" />

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

      <main className={styles.supportContent} id="support-main-content">
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
    </div>
  );
}
