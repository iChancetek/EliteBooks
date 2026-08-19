'use client';

import React from 'react';
import { X, Heart, Shield, CheckCircle2, DollarSign } from 'lucide-react';
import { BenefitPlan } from '../types';
import { formatCurrency } from '@/lib/utils';

interface BenefitsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefitPlans: BenefitPlan[];
}

export default function BenefitsManagerModal({
  isOpen,
  onClose,
  benefitPlans,
}: BenefitsManagerModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--color-bg-primary, #0c1220)',
        border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.15))',
        borderRadius: '20px',
        maxWidth: '620px',
        width: '100%',
        padding: '28px',
        color: 'var(--color-text-primary, #f1f5f9)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Heart size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Benefits & Pre-Tax Deductions Manager</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Configured pre-tax plans and payroll liability ledger alignments
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {benefitPlans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>{plan.name}</span>
                  <span style={{ fontSize: '11px', color: '#60a5fa', display: 'block' }}>Provider: {plan.provider}</span>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '100px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: 800,
                }}>
                  {plan.isPreTax ? 'PRE-TAX DEDUCTION' : 'POST-TAX'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>{plan.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px', fontSize: '11px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Employee Monthly Deduction:</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f1f5f9', marginTop: '2px' }}>
                    {formatCurrency(plan.employeeMonthlyCost)}
                  </div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Company Employer Match:</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                    {formatCurrency(plan.employerMonthlyMatch)}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                Ledger Accounts: {plan.ledgerLiabilityAccount} • {plan.ledgerExpenseAccount}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
