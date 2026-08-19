'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { WorkerClassificationAudit } from '../types';
import { formatCurrency } from '@/lib/utils';

interface WorkerClassificationCardProps {
  audits: WorkerClassificationAudit[];
}

export default function WorkerClassificationCard({ audits }: WorkerClassificationCardProps) {
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
      gap: '16px',
      color: 'var(--color-text-primary, #f1f5f9)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
          }}>
            <ShieldCheck size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>IRS Worker Classification & 1099/W-2 Sentinel</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Evaluates behavioral, financial, and operational relationship control factors
            </p>
          </div>
        </div>

        <div style={{
          padding: '6px 14px',
          borderRadius: '100px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          fontSize: '11px',
          fontWeight: 700,
        }}>
          FLSA & IRS Safe Harbor Active
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {audits.map((a) => (
          <div
            key={a.contractorId}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: a.classificationRisk === 'high_risk_misclassification'
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 800 }}>{a.contractorName}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>
                  Total Annual Disbursements: {formatCurrency(a.totalPaymentsAnnual)}
                </span>
              </div>

              <span style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                background: a.classificationRisk === 'low_risk_contractor'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : a.classificationRisk === 'moderate_review_recommended'
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
                color: a.classificationRisk === 'low_risk_contractor'
                  ? '#10b981'
                  : a.classificationRisk === 'moderate_review_recommended'
                  ? '#f59e0b'
                  : '#f87171',
              }}>
                {a.classificationRisk.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Behavioral Control:</span>
                <div style={{ fontWeight: 800, marginTop: '2px' }}>{a.behavioralControlScore}/100</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Financial Control:</span>
                <div style={{ fontWeight: 800, marginTop: '2px' }}>{a.financialControlScore}/100</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Independence Score:</span>
                <div style={{ fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{a.overallIndependenceScore}% Independent</div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
              <strong style={{ color: '#60a5fa' }}>Audit Finding:</strong> {a.reasons.join('; ')}
            </div>

            <div style={{ fontSize: '11px', color: '#10b981' }}>
              Recommendation: {a.recommendedRemediation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
