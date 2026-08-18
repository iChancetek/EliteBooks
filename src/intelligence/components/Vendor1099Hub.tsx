'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download, Plus } from 'lucide-react';
import { Vendor1099Status } from '../types';
import { formatCurrency } from '@/lib/utils';

interface Vendor1099HubProps {
  vendors: Vendor1099Status[];
  onGenerate1099Draft?: (vendorId: string) => void;
}

export default function Vendor1099Hub({
  vendors,
  onGenerate1099Draft,
}: Vendor1099HubProps) {
  const [selectedVendor, setSelectedVendor] = useState<Vendor1099Status | null>(vendors[0] || null);

  const reportableCount = vendors.filter((v) => v.is1099Reportable).length;
  const missingW9Count = vendors.filter((v) => v.is1099Reportable && !v.w9OnFile).length;

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
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
          }}>
            <FileText size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>1099 Vendor Compliance & E-Filing Hub</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Tracks non-employee compensation against IRS $600 threshold and manages W-9/TIN verification
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
          <span style={{ padding: '6px 12px', borderRadius: '100px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
            {reportableCount} 1099-NEC Reportable Vendors
          </span>
          <span style={{ padding: '6px 12px', borderRadius: '100px', background: missingW9Count > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: missingW9Count > 0 ? '#f87171' : '#10b981', fontWeight: 700 }}>
            {missingW9Count} Missing W-9s
          </span>
        </div>
      </div>

      {/* Vendors Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Vendor / Contractor</th>
              <th style={{ padding: '10px' }}>Total Compensation</th>
              <th style={{ padding: '10px' }}>IRS $600 Threshold</th>
              <th style={{ padding: '10px' }}>TIN / W-9 Status</th>
              <th style={{ padding: '10px' }}>Filing Readiness</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.vendorId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '10px', fontWeight: 700 }}>{v.vendorName}</td>
                <td style={{ padding: '10px', fontWeight: 800 }}>{formatCurrency(v.totalNonEmployeeCompensation)}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '100px',
                    fontSize: '10px',
                    fontWeight: 800,
                    background: v.is1099Reportable ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: v.is1099Reportable ? '#f59e0b' : '#94a3b8',
                  }}>
                    {v.is1099Reportable ? 'REPORTABLE' : 'BELOW $600'}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{ color: v.w9OnFile ? '#10b981' : '#f87171', fontWeight: 600 }}>
                    {v.w9OnFile ? '• W-9 Verified' : '• Missing W-9'}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: v.filingStatus === 'draft_prepared' ? '#10b981' : '#f59e0b',
                  }}>
                    {v.filingStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  {v.is1099Reportable && (
                    <button
                      type="button"
                      onClick={() => onGenerate1099Draft && onGenerate1099Draft(v.vendorId)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Draft 1099-NEC
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
