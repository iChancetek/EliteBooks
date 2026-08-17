'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Mail, MessageSquare, 
  LifeBuoy, Bot, ShieldCheck, CheckCircle2, 
  Activity, BookOpen, Search, Send, Clock
} from 'lucide-react';
import styles from './page.module.css';
import PageVoiceControl from '@/components/PageVoiceControl';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ticket, setTicket] = useState({ email: '', subject: '', category: 'General', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does the multi-agent swarm coordinate accounting tasks?',
      a: 'The Orchestrator Agent routes user intent to specialized sub-agents (Ledger, Expense, Invoicing, Cash Flow, Payroll, Compliance, and FinOps) via a LangGraph state graph. Each agent operates with specialized domain logic and communicates via structured A2A handoffs.'
    },
    {
      q: 'Are my general ledger journal entries mathematically balanced?',
      a: 'Yes. Every committed transaction strictly adheres to the GAAP fundamental equation (Assets = Liabilities + Equity). Reconciled transactions receive a SHA-256 cryptographic audit lock.'
    },
    {
      q: 'How does Cloud FinOps track AWS, Azure, and Google Cloud costs?',
      a: 'The FinOps Agent parses merchant billing line items and expenses tagged under Cloud Services, categorizing compute, storage, and AI inference spend while computing real-time unit costs per active customer.'
    },
    {
      q: 'What happens when a high-value financial anomaly is detected?',
      a: 'EliteBooks initiates a Human-in-the-Loop (HITL) authorization checkpoint in your Daily Intelligence Feed. Execution is held until an authorized financial controller reviews and approves the transaction.'
    },
    {
      q: 'How do I use voice commands and audio narration?',
      a: 'Click the Listen button in the top right on any page to hear an interactive audio summary narrated by OpenAI Nova. To ask questions using your voice, select your preferred language from the 7 supported languages and hold the Ask AI microphone button.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.supportPage}>
      {/* Background Effects */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      
      <PageVoiceControl contentId="support-main-content" pageTitle="Enterprise Support Center" />

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
            <Link href="/learning" className="btn btn-secondary" style={{ fontSize: '13px' }}>
              <BookOpen size={14} /> Masterclass
            </Link>
            <Link href="/dashboard" className="btn btn-secondary" style={{ fontSize: '13px' }}>
              Dashboard
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <ArrowLeft size={16} /> Home
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.supportContent} id="support-main-content">
        <div className={styles.supportHeader}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
            <LifeBuoy size={12} /> 24/7 Enterprise Assistance
          </div>
          <h1>Enterprise Support Center</h1>
          <p>Direct assistance from our autonomous AI diagnostics system and certified accounting support team.</p>
        </div>

        {/* Live Multi-Agent Status Banner */}
        <div className={`glass-card ${styles.statusBanner}`} style={{ padding: '16px 24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
            <strong style={{ color: '#ffffff', fontSize: '14px' }}>All AI Agent Pipelines Operational</strong>
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>
            Orchestrator • Ledger • FinOps • Compliance (99.9% Uptime)
          </span>
        </div>

        <div className={styles.supportGrid}>
          {/* Ticket Submission / Diagnostic Form */}
          <div className={`glass-card ${styles.contactCard}`}>
            <h2>Submit Support Inquiry</h2>
            {submitted ? (
              <div className={styles.successMessage} style={{ textAlign: 'center', padding: '32px 16px' }}>
                <CheckCircle2 size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
                <h3>Inquiry Dispatched!</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '8px' }}>
                  Your request has been routed to the Support Copilot and our senior accounting team. Expected response within 2 business hours.
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
                <div className="form-group">
                  <label>Corporate Email</label>
                  <input 
                    type="email" 
                    className="input" 
                    placeholder="controller@company.com" 
                    value={ticket.email}
                    onChange={e => setTicket({...ticket, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Module / Topic</label>
                  <select 
                    className="input"
                    value={ticket.category}
                    onChange={e => setTicket({...ticket, category: e.target.value})}
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Ledger">Ledger & Reconciliation</option>
                    <option value="FinOps">Cloud FinOps & Ingestion</option>
                    <option value="Payroll">Payroll & Tax Withholdings</option>
                    <option value="Invoicing">Invoices & Stripe Connect</option>
                    <option value="Security">Security & PII Vault</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. Question on Cloud Services ledger categorization" 
                    value={ticket.subject}
                    onChange={e => setTicket({...ticket, subject: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Detailed Message</label>
                  <textarea 
                    className="input" 
                    rows={5} 
                    placeholder="Describe your question or diagnostic scenario in detail..." 
                    value={ticket.message}
                    onChange={e => setTicket({...ticket, message: e.target.value})}
                    required 
                    style={{ resize: 'vertical' }} 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send size={16} /> Dispatch Inquiry
                </button>
              </form>
            )}
          </div>

          {/* FAQ & Knowledge Base Search */}
          <div className={styles.faqSidebar}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2>Knowledge Base</h2>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255,255,255,0.4)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search knowledge articles..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredFaqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  No matching knowledge articles found. Please submit a direct inquiry above.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>&copy; {new Date().getFullYear()} EliteBooks. Enterprise Accounting Support.</p>
        </div>
      </footer>
    </div>
  );
}
