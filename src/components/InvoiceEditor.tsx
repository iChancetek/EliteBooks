'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Send, Save, Download, Eye, 
  Settings, Image, CreditCard, Banknote, Mail, 
  Calendar, Hash, User, DollarSign, Percent, 
  Truck, Check, ChevronRight, X
} from 'lucide-react';
import styles from './InvoiceEditor.module.css';
import { formatCurrency } from '@/lib/utils';
import type { Invoice, InvoiceItem } from '@/types/accounting';

interface InvoiceEditorProps {
  onClose: () => void;
  onSave: (invoice: Partial<Invoice>) => void;
  initialData?: Partial<Invoice>;
}

export default function InvoiceEditor({ onClose, onSave, initialData }: InvoiceEditorProps) {
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [clientEmail, setClientEmail] = useState(initialData?.clientEmail || '');
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.number || `INV-${Date.now().toString().slice(-6)}`);
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [items, setItems] = useState<Partial<InvoiceItem>[]>(initialData?.items || [
    { id: '1', description: '', type: 'qty', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Customization State
  const [themeColor, setThemeColor] = useState('#3b82f6');
  const [showLogo, setShowLogo] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [paymentOptions, setPaymentOptions] = useState({
    creditCard: true,
    bankTransfer: true,
    wallets: false
  });

  // Real-time Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0);
  }, [items]);

  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount + shipping - discount;

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', type: 'qty', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.amount = Number(updatedItem.quantity || 0) * Number(updatedItem.unitPrice || 0);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleSave = (status: Invoice['status']) => {
    const invoiceData: Partial<Invoice> = {
      clientName,
      clientEmail,
      number: invoiceNumber,
      issueDate,
      dueDate,
      items: items as InvoiceItem[],
      subtotal,
      taxAmount,
      total: grandTotal,
      status,
      notes,
    };
    onSave(invoiceData);
  };

  const handlePrint = () => {
    setIsPreviewMode(true);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className={styles.editorOverlay} onClick={onClose}>
      <div className={styles.editorContainer} onClick={e => e.stopPropagation()}>
        <main className={styles.mainForm}>
          <div className={styles.editorHeader}>
            <h2>{isPreviewMode ? 'Preview Invoice' : (initialData ? 'Edit Invoice' : 'New Invoice')}</h2>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-ghost" onClick={onClose}><X size={20} /></button>
            </div>
          </div>

          <div className={styles.formContent}>
            {/* Editor View */}
            <div style={{ display: isPreviewMode ? 'none' : 'block' }}>
              <div className={styles.topSection}>
              <div className={styles.clientSection}>
                <div className="form-group">
                  <label>Client</label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input 
                        className="input" 
                        style={{ paddingLeft: '36px' }}
                        placeholder="Search or enter client name" 
                        value={clientName} 
                        onChange={e => setClientName(e.target.value)}
                      />
                    </div>
                    <input 
                      className="input" 
                      style={{ flex: 1 }}
                      placeholder="Email address" 
                      value={clientEmail} 
                      onChange={e => setClientEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label>Invoice #</label>
                    <div style={{ position: 'relative' }}>
                      <Hash size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input className="input" style={{ paddingLeft: '30px' }} value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" className="input" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input type="date" className="input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={styles.infoSection}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Company Branding</label>
                <div className={styles.logoUpload} onClick={() => document.getElementById('logo-input')?.click()}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className={styles.logoPreview} />
                  ) : (
                    <>
                      <Image size={24} />
                      <span style={{ fontSize: '10px' }}>Upload Logo</span>
                    </>
                  )}
                  <input id="logo-input" type="file" hidden onChange={handleLogoUpload} accept="image/*" />
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className={styles.itemsSection}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Description</th>
                    <th style={{ width: '15%' }}>Type</th>
                    <th>Qty/Hrs</th>
                    <th>Rate</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input 
                          className={styles.itemInput} 
                          placeholder="What was this for?" 
                          value={item.description}
                          onChange={e => updateItem(item.id!, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className={styles.itemInput}
                          value={item.type || 'qty'}
                          onChange={e => updateItem(item.id!, 'type', e.target.value)}
                        >
                          <option value="qty">Qty</option>
                          <option value="hours">Hours</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className={styles.itemInput} 
                          value={item.quantity}
                          onChange={e => updateItem(item.id!, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className={styles.itemInput} 
                          value={item.unitPrice}
                          onChange={e => updateItem(item.id!, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td className={styles.amountCol}>
                        {formatCurrency(item.amount || 0)}
                      </td>
                      <td>
                        <button className={`${styles.removeBtn} btn btn-icon btn-ghost`} onClick={() => removeItem(item.id!)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={`${styles.addRowBtn} btn btn-secondary btn-sm`} onClick={addItem}>
                <Plus size={14} /> Add Row
              </button>
            </div>

            {/* Bottom: Notes & Totals */}
            <div className={styles.bottomSection}>
              <div className={styles.notesSection}>
                <div className="form-group">
                  <label>Notes & Terms</label>
                  <textarea 
                    className="input" 
                    rows={4} 
                    placeholder="e.g. Net 30, Payment instructions, Thank you message"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className="value-financial">{formatCurrency(subtotal)}</span>
                </div>
                <div className={styles.totalRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Percent size={14} />
                    <span>Tax (%)</span>
                  </div>
                  <input 
                    type="number" 
                    className={styles.itemInput} 
                    style={{ width: '60px', textAlign: 'right' }}
                    value={taxRate}
                    onChange={e => setTaxRate(Number(e.target.value))}
                  />
                </div>
                <div className={styles.totalRow}>
                  <span>Tax Amount</span>
                  <span className="value-financial">{formatCurrency(taxAmount)}</span>
                </div>
                <div className={styles.totalRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={14} />
                    <span>Discount</span>
                  </div>
                  <input 
                    type="number" 
                    className={styles.itemInput} 
                    style={{ width: '80px', textAlign: 'right' }}
                    value={discount}
                    onChange={e => setDiscount(Number(e.target.value))}
                  />
                </div>
                <div className={styles.totalRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={14} />
                    <span>Shipping</span>
                  </div>
                  <input 
                    type="number" 
                    className={styles.itemInput} 
                    style={{ width: '80px', textAlign: 'right' }}
                    value={shipping}
                    onChange={e => setShipping(Number(e.target.value))}
                  />
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Grand Total</span>
                  <span style={{ color: themeColor }}>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Preview View */}
            <div style={{ display: isPreviewMode ? 'block' : 'none' }}>
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  {showLogo && logoUrl ? (
                    <img src={logoUrl} alt="Logo" className={styles.previewLogo} />
                  ) : (
                    <div className={styles.previewLogoPlaceholder}><h2>{clientName ? 'ELITEBOOKS' : 'YOUR LOGO'}</h2></div>
                  )}
                  <div className={styles.previewTitle}>
                    <h1 style={{ color: themeColor }}>INVOICE</h1>
                    <p>#{invoiceNumber}</p>
                  </div>
                </div>
                
                <div className={styles.previewDetails}>
                  <div className={styles.previewClient}>
                    <h4>Billed To:</h4>
                    <p className={styles.previewStrong}>{clientName || 'Client Name'}</p>
                    <p>{clientEmail}</p>
                  </div>
                  <div className={styles.previewDates}>
                    <div>
                      <h4>Date Issued:</h4>
                      <p>{issueDate}</p>
                    </div>
                    <div>
                      <h4>Due Date:</h4>
                      <p>{dueDate}</p>
                    </div>
                  </div>
                </div>

                <table className={styles.previewTable}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${themeColor}` }}>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Qty/Hrs</th>
                      <th>Rate</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.description || 'Item Description'}</td>
                        <td>{item.type === 'hours' ? 'Hours' : 'Qty'}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(Number(item.unitPrice || 0))}</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(item.amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.previewSummaryRow}>
                  <div className={styles.previewNotes}>
                    <h4>Notes & Terms</h4>
                    <p>{notes || 'Thank you for your business.'}</p>
                  </div>
                  <div className={styles.previewTotals}>
                    <div className={styles.previewTotalRow}>
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {taxRate > 0 && (
                      <div className={styles.previewTotalRow}>
                        <span>Tax ({taxRate}%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className={styles.previewTotalRow}>
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    {shipping > 0 && (
                      <div className={styles.previewTotalRow}>
                        <span>Shipping</span>
                        <span>{formatCurrency(shipping)}</span>
                      </div>
                    )}
                    <div className={`${styles.previewTotalRow} ${styles.previewGrandTotal}`} style={{ backgroundColor: themeColor }}>
                      <span>Total Due</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className={styles.sidePanel}>
          <div className={styles.panelSection}>
            <h3>Branding</h3>
            <div className={styles.brandingOptions}>
              <div className="form-group">
                <label>Theme Color</label>
                <div className={styles.themeGrid}>
                  {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4', '#6366f1', '#111827'].map(c => (
                    <div 
                      key={c} 
                      className={`${styles.themeOption} ${themeColor === c ? styles.active : ''}`}
                      style={{ background: c }}
                      onClick={() => setThemeColor(c)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.toggleOption}>
                <span>Show Company Logo</span>
                <input type="checkbox" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} />
              </div>
            </div>
          </div>

          <div className={styles.panelSection}>
            <h3>Payment Methods</h3>
            <div className={styles.brandingOptions}>
              <div className={styles.toggleOption}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={14} />
                  <span>Credit Card</span>
                </div>
                <input type="checkbox" checked={paymentOptions.creditCard} onChange={e => setPaymentOptions({...paymentOptions, creditCard: e.target.checked})} />
              </div>
              <div className={styles.toggleOption}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Banknote size={14} />
                  <span>Bank Transfer</span>
                </div>
                <input type="checkbox" checked={paymentOptions.bankTransfer} onChange={e => setPaymentOptions({...paymentOptions, bankTransfer: e.target.checked})} />
              </div>
            </div>
          </div>

          <div className={styles.actionsSection}>
            <button className="btn btn-primary" style={{ background: themeColor, width: '100%' }} onClick={() => handleSave('sent')}>
              <Send size={16} /> Save & Send
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              <button className="btn btn-secondary" onClick={handlePrint}>
                <Download size={14} /> PDF
              </button>
              <button className="btn btn-secondary" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                <Eye size={14} /> {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
            <button className="btn btn-ghost" onClick={() => handleSave('draft')}>
              <Save size={16} /> Save as Draft
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
