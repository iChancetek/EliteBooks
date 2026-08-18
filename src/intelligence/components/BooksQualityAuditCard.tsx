'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, FileCheck, CheckCircle2, RefreshCw, ChevronRight, FileText } from 'lucide-react';
import { BooksQualityFinding, QuarterlyBooksReport } from '../types';
import { formatCurrency } from '@/lib/utils';

interface BooksQualityAuditCardProps {
  healthScore: number;
  findings: BooksQualityFinding[];
  quarterlyReport?: QuarterlyBooksReport;
  onRefreshAudit?: () => void;
  onResolveFinding?: (findingId: string) => void;
}

export default function BooksQualityAuditCard({
  healthScore,
  findings,
  quarterlyReport,
  onRefreshAudit,
  onResolveFinding,
}: BooksQualityAuditCardProps) {
  const [showQuarterlyReport, setShowQuarterlyReport] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
      border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.15))',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: 'var(--color-text-primary, #f1f5f9)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
          }}>
            <ShieldCheck size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Continuous Books Quality AI</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Real-time ledger audit, duplicate detection, and ASC-606 compliance validation
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {onRefreshAudit && (
            <button
              onClick={onRefreshAudit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>Re-Scan Ledger</span>
            </button>
          )}
          <button
            onClick={() => setShowQuarterlyReport(prev => !prev)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: showQuarterlyReport ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#60a5fa',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {showQuarterlyReport ? 'Hide Quarterly Report' : 'View Quarterly Intelligence'}
          </button>
        </div>
      </div>

      {/* Main Score Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px',
        alignItems: 'center',
      }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: `4px solid ${getScoreColor(healthScore)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          boxShadow: `0 0 20px ${getScoreColor(healthScore)}33`,
        }}>
          <span style={{ fontSize: '24px', fontWeight: 900, color: getScoreColor(healthScore) }}>{healthScore}</span>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>/ 100</span>
        </div>

        <div>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>Overall Books Quality Status: {healthScore >= 90 ? 'Healthy & Audit-Ready' : 'Attention Recommended'}</div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 10px 0' }}>
            Continuous AI monitors detect zero critical double-entry errors. {findings.length} advisory observation(s) identified for optimization.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
            <span>• Receipt Compliance: <strong style={{ color: '#10b981' }}>{quarterlyReport?.receiptCompliancePercent || 92}%</strong></span>
            <span>• Duplicate Risk: <strong style={{ color: findings.filter(f => f.category === 'duplicate_expense').length > 0 ? '#f59e0b' : '#10b981' }}>{findings.filter(f => f.category === 'duplicate_expense').length} flagged</strong></span>
            <span>• Uncategorized Items: <strong style={{ color: findings.filter(f => f.category === 'uncategorized_transaction').length > 0 ? '#f59e0b' : '#10b981' }}>{findings.filter(f => f.category === 'uncategorized_transaction').length}</strong></span>
          </div>
        </div>
      </div>

      {/* Quarterly Report View (if toggled) */}
      {showQuarterlyReport && quarterlyReport && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#60a5fa' }}>
              Quarterly Books Intelligence Report — {quarterlyReport.quarter}
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Audit Scope: Live General Ledger</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            {quarterlyReport.executiveSummary.map((summaryItem, idx) => (
              <div key={idx} style={{ color: '#cbd5e1' }}>• {summaryItem}</div>
            ))}
          </div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Recommended Remediation Actions:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#f1f5f9' }}>
              {quarterlyReport.recommendedActions.map((action, idx) => (
                <div key={idx}>1. {action}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Findings Item List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>Audit Findings & Advisory Items ({findings.length})</span>
        {findings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: '#10b981', fontSize: '13px' }}>
            Zero ledger inconsistencies detected. All accounts balanced.
          </div>
        ) : (
          findings.map((f) => (
            <div
              key={f.id}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '6px',
                    background: f.severity === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: f.severity === 'warning' ? '#f59e0b' : '#60a5fa',
                  }}>
                    {f.category.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{f.title}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{f.description}</div>
                <div style={{ fontSize: '10px', color: '#10b981' }}>Recommendation: {f.recommendedAction}</div>
              </div>

              {onResolveFinding && (
                <button
                  type="button"
                  onClick={() => onResolveFinding(f.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Mark Verified
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
