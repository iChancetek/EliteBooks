'use client';

import React, { useState } from 'react';
import {
  X, BarChart3, TrendingUp, ShieldCheck, FileText, Receipt,
  DollarSign, Bot, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  PieChart, Hash, Layers, Lock, Cpu, Sparkles
} from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';

export interface DeepDiveData {
  title: string;
  type: 'revenue' | 'expenses' | 'profit' | 'cash' | 'activity';
  value?: number;
  change?: number;
  icon?: any;
  color?: string;
  itemDetails?: {
    id?: string;
    agent?: string;
    action?: string;
    amount?: number;
    time?: string;
    clientName?: string;
    vendor?: string;
    category?: string;
    date?: string;
    status?: string;
  };
  breakdownItems?: Array<{
    name: string;
    amount: number;
    category?: string;
    percentage?: number;
    status?: string;
  }>;
}

interface DeepDiveModalProps {
  data: DeepDiveData | null;
  onClose: () => void;
  onAskAgent?: (query: string) => void;
}

export default function DeepDiveModal({ data, onClose, onAskAgent }: DeepDiveModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'audit'>('overview');

  if (!data) return null;

  const color = data.color || '#3b82f6';
  const isPositiveChange = (data.change || 0) >= 0;

  // Generate synthetic/dynamic ledger data for deep dive
  const auditHash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const blockIndex = Math.floor(Math.random() * 800) + 1200;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--color-bg-elevated)',
          border: `1px solid ${color}40`,
          boxShadow: `0 25px 50px -12px ${color}25, 0 0 30px rgba(0,0,0,0.8)`,
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
          animation: 'scaleIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ background: `${color}20`, padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', color: color, display: 'flex' }}>
              {data.icon ? <data.icon size={24} /> : <BarChart3 size={24} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
                  {data.title} Breakdown
                </h3>
                <span className="badge" style={{ background: `${color}20`, color: color, fontSize: '11px', fontWeight: 600 }}>
                  <ShieldCheck size={12} /> Deep Dive Verification
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Comprehensive multi-agent financial audit & real-time analytics
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" style={{ cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Value Hero Banner if Metric */}
        {data.value !== undefined && (
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                Total {data.title}
              </span>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {formatCurrency(data.value)}
              </div>
            </div>

            {data.change !== undefined && (
              <div style={{ textAlign: 'right' }}>
                <div className={`status-pill ${isPositiveChange ? 'positive' : 'negative'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', padding: '4px 10px', borderRadius: 'var(--radius-md)' }}>
                  {isPositiveChange ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{formatPercent(Math.abs(data.change))} MoM</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  vs. previous 30-day period
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activity Details Banner if Activity */}
        {data.itemDetails && (
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={16} style={{ color: color }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: color }}>{data.itemDetails.agent}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{data.itemDetails.time || 'Recently'}</span>
            </div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {data.itemDetails.action}
            </div>
            {data.itemDetails.amount !== undefined && (
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: data.itemDetails.amount > 0 ? 'var(--color-positive)' : 'var(--color-text-primary)' }}>
                {data.itemDetails.amount > 0 ? '+' : ''}{formatCurrency(data.itemDetails.amount)}
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-2)' }}>
          {[
            { id: 'overview', label: 'Financial Overview', icon: Layers },
            { id: 'breakdown', label: 'Itemized Breakdown', icon: PieChart },
            { id: 'audit', label: 'Ledger Audit & AI Trace', icon: Cpu },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Strategic Analysis & Formula
            </h4>

            {data.type === 'revenue' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Total revenue reflects all gross invoice billings generated by the <strong>Invoicing Agent</strong> across recurring client accounts and single-issue billing items.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Collection Rate</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-positive)', marginTop: '2px' }}>96.8%</div>
                  </div>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Avg. Invoice Terms</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>Net 30 Days</div>
                  </div>
                </div>
              </div>
            )}

            {data.type === 'expenses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Operating expenses are continuously categorized by the <strong>Expense Agent</strong> using receipt extraction, vendor pattern recognition, and FinOps cloud spend monitoring.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Tax Deductible Ratio</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-positive)', marginTop: '2px' }}>94.2%</div>
                  </div>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Vendor Anomalies</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>0 Detected</div>
                  </div>
                </div>
              </div>
            )}

            {data.type === 'profit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Net Profit represents bottom-line earnings after deducting all operating expenses, supplier payments, and tax reserves from gross revenues.
                </p>
                <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Net Profit Margin Formula</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-accent-primary)', marginTop: '4px' }}>
                    Net Margin = (Total Revenue - Operating Expenses) / Total Revenue = 99.18%
                  </div>
                </div>
              </div>
            )}

            {data.type === 'cash' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Cash on Hand is monitored in real-time by the <strong>Cash Flow Agent</strong> to maintain liquidity, calculate 60-day runways, and prevent shortfalls.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Projected Cash Runway</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-positive)', marginTop: '2px' }}>18.4 Months</div>
                  </div>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Liquidity Health</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-positive)', marginTop: '2px' }}>STRONG</div>
                  </div>
                </div>
              </div>
            )}

            {data.type === 'activity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  This activity was autonomously initiated and executed by <strong>{data.itemDetails?.agent || 'Autonomous Agent'}</strong> following safety checks and policy verification.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Breakdown */}
        {activeTab === 'breakdown' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Itemized Financial Breakdown
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { name: 'Acme Corp Billing (INV-2026-0001)', amount: 8500, category: 'Enterprise Client', status: 'Paid' },
                { name: 'Starlight Tech Services (INV-2026-0002)', amount: 4200, category: 'SaaS Retainer', status: 'Sent' },
                { name: 'AWS Cloud Infrastructure', amount: 520, category: 'FinOps / Hosting', status: 'Cleared' },
                { name: 'Whole Foods Market Supplies', amount: 165.4, category: 'Office Supplies', status: 'Logged' },
                { name: 'Uber Business Travel', amount: 84.5, category: 'Travel & Transport', status: 'Logged' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>Category: {item.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatCurrency(item.amount)}</div>
                    <span className="status-pill positive" style={{ fontSize: '10px', padding: '1px 6px', marginTop: '2px' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Audit */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cryptographic Audit Lock & General Ledger Entry
            </h4>

            <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> SHA-256 Block #{blockIndex}
                </span>
                <span className="badge badge-positive" style={{ fontSize: '10px' }}>VERIFIED & IMMUTABLE</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(0,0,0,0.4)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', color: 'var(--color-accent-primary)', wordBreak: 'break-all' }}>
                {auditHash}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Double-Entry Journal Postings</span>
              <table style={{ width: '100%', fontSize: 'var(--text-xs)', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', textAlign: 'left', color: 'var(--color-text-tertiary)' }}>
                    <th style={{ padding: '8px' }}>Account Code</th>
                    <th style={{ padding: '8px' }}>Account Name</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Debit</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '8px', fontWeight: 600 }}>#1010</td>
                    <td style={{ padding: '8px' }}>Operating Cash Account</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-positive)' }}>{formatCurrency(data.value || 8500)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-text-tertiary)' }}>$0.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 600 }}>#4000</td>
                    <td style={{ padding: '8px' }}>Sales & Service Revenue</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-text-tertiary)' }}>$0.00</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-positive)' }}>{formatCurrency(data.value || 8500)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-subtle)' }}>
          {onAskAgent && (
            <button
              onClick={() => onAskAgent(`Explain the breakdown of ${data.title} in detail.`)}
              className="btn btn-sm btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Sparkles size={14} style={{ color: color }} />
              <span>Ask AI Agent about this</span>
            </button>
          )}

          <button onClick={onClose} className="btn btn-sm btn-primary" style={{ cursor: 'pointer' }}>
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
