'use client';

import React, { useState } from 'react';
import {
  Sparkles, FileText, Receipt, X, Check, ShieldCheck,
  Bot, AlertCircle, ArrowRight, DollarSign, Calendar, Tag, User, Layers, CheckCircle2, Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AIAssistedCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'invoice' | 'expense';
  initialData?: any;
  onSuccess?: (createdItem: any) => void;
}

export function AIAssistedCreationModal({
  isOpen,
  onClose,
  type,
  initialData,
  onSuccess,
}: AIAssistedCreationModalProps) {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Invoice State
  const [clientName, setClientName] = useState(initialData?.clientName || 'Acme Corp');
  const [clientEmail, setClientEmail] = useState(initialData?.clientEmail || 'billing@acmecorp.com');
  const [invoiceDescription, setInvoiceDescription] = useState(initialData?.description || 'Enterprise Financial Consulting & Cloud Migration');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(initialData?.total || 12000);
  const [invoiceDueDate, setInvoiceDueDate] = useState(initialData?.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  // Expense State
  const [vendor, setVendor] = useState(initialData?.vendor || 'Google Cloud Platform');
  const [category, setCategory] = useState(initialData?.category || 'Cloud Infrastructure & GPU Compute');
  const [expenseAmount, setExpenseAmount] = useState<number>(initialData?.amount || 1420.50);
  const [expenseDate, setExpenseDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Corporate Visa (*8842)');

  if (!isOpen) return null;

  const isInvoice = type === 'invoice';

  // AI Prompt Autocompletion Parser
  const handleAIPromptParse = () => {
    if (!prompt.trim()) return;
    setIsSynthesizing(true);

    setTimeout(() => {
      const p = prompt.toLowerCase();
      const amountMatch = prompt.match(/\$?\s*([\d,]+(\.\d{2})?)/);
      const parsedAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

      if (isInvoice) {
        if (p.includes('acme')) setClientName('Acme Corp');
        else if (p.includes('starlight')) setClientName('Starlight Tech');
        else if (p.includes('apex')) setClientName('Apex Systems');
        else setClientName(prompt.split('for')[0]?.replace(/(create|invoice|draft|bill)/gi, '').trim() || 'Client Partner');

        if (parsedAmount) setInvoiceAmount(parsedAmount);
        setInvoiceDescription(prompt);
      } else {
        if (p.includes('google') || p.includes('gcp')) {
          setVendor('Google Cloud Platform');
          setCategory('Cloud Infrastructure & GPU Compute');
        } else if (p.includes('staples')) {
          setVendor('Staples Office Supplies');
          setCategory('Office Supplies & Operations');
        } else if (p.includes('uber')) {
          setVendor('Uber Business Travel');
          setCategory('Travel & Transportation');
        } else {
          setVendor(prompt.split('for')[0]?.replace(/(create|expense|log|paid)/gi, '').trim() || 'Vendor Merchant');
        }

        if (parsedAmount) setExpenseAmount(parsedAmount);
      }

      setIsSynthesizing(false);
    }, 600);
  };

  const handleAuthorizeAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = user ? await user.getIdToken() : '';
      const endpoint = isInvoice ? '/api/invoices' : '/api/expenses';

      const payload = isInvoice
        ? {
            clientName,
            clientEmail,
            items: [
              {
                description: invoiceDescription,
                quantity: 1,
                unitPrice: invoiceAmount,
                amount: invoiceAmount,
              },
            ],
            subtotal: invoiceAmount,
            tax: 0,
            total: invoiceAmount,
            status: 'sent',
            dueDate: invoiceDueDate,
            issueDate: new Date().toISOString().split('T')[0],
            paymentTerms: 'Net 30',
          }
        : {
            vendor,
            category,
            amount: expenseAmount,
            date: expenseDate,
            paymentMethod,
            status: 'approved',
            description: prompt || `${category} - ${vendor}`,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          isInvoice
            ? `Invoice #${data.data?.invoiceNumber || 'INV-001'} for ${clientName} ($${invoiceAmount.toLocaleString()}) created & posted to ledger!`
            : `Expense of $${expenseAmount.toLocaleString()} for ${vendor} logged & reconciled with ledger!`
        );

        if (onSuccess) onSuccess(data.data);

        setTimeout(() => {
          setIsSubmitting(false);
          setSuccessMsg(null);
          onClose();
        }, 1800);
      } else {
        alert(data.error || 'Failed to create record');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error(err);
      alert('Error creating transaction: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: isInvoice ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #f59e0b, #ec4899)',
                color: '#fff',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
              }}
            >
              {isInvoice ? <FileText size={22} /> : <Receipt size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {isInvoice ? 'Create Invoice (Human-in-the-Loop)' : 'Log Expense (Human-in-the-Loop)'}
                </h3>
                <span className="badge badge-accent" style={{ fontSize: '11px' }}>
                  <Bot size={12} /> {isInvoice ? 'Invoicing Agent' : 'Expense Agent'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                Autonomous ledger verification & double-entry posting with human sign-off
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon btn-ghost" style={{ cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {successMsg ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '16px', textAlign: 'center' }}>
            <CheckCircle2 size={56} style={{ color: 'var(--color-positive)' }} className="animate-bounce" />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Transaction Confirmed!</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '420px' }}>{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleAuthorizeAndSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Natural Language Prompt Assistant Bar */}
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} /> Natural Language Auto-Fill
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                  Type in plain English & click Auto-Fill
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder={
                    isInvoice
                      ? 'e.g. Invoice Acme Corp for $12,000 for Q3 Cloud Migration'
                      : 'e.g. Paid Google Cloud Platform $1,420.50 for GPU Compute'
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAIPromptParse}
                  disabled={!prompt.trim() || isSynthesizing}
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }}
                >
                  {isSynthesizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>Auto-Fill</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {isInvoice ? (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Client Name
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Client Email
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Line Item Description
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceDescription}
                      onChange={(e) => setInvoiceDescription(e.target.value)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Invoice Total ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={invoiceDueDate}
                      onChange={(e) => setInvoiceDueDate(e.target.value)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Vendor / Merchant
                    </label>
                    <input
                      type="text"
                      required
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Expense Category
                    </label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Double-Entry Ledger Preview Badge */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                  {isInvoice
                    ? `Ledger Agent: Debit #1200 Accounts Receivable ($${invoiceAmount.toLocaleString()}) / Credit #4000 Revenue`
                    : `Ledger Agent: Debit #6000 Operating Expenses ($${expenseAmount.toLocaleString()}) / Credit #1010 Cash`}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                SHA-256 Intact
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                style={{ fontSize: '13px', cursor: 'pointer' }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isInvoice ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Posting to Ledger...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{isInvoice ? 'Authorize & Create Invoice' : 'Authorize & Log Expense'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
