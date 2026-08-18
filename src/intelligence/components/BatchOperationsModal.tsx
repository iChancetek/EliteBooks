'use client';

import React, { useState } from 'react';
import { X, Layers, Check, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { BatchOperationPreview } from '../types';
import { BatchOperationsService } from '../batch-operations-service';
import { formatCurrency } from '@/lib/utils';

interface BatchOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'invoice' | 'expense';
  onExecuteBatch?: (preview: BatchOperationPreview) => void;
}

export default function BatchOperationsModal({
  isOpen,
  onClose,
  type = 'expense',
  onExecuteBatch,
}: BatchOperationsModalProps) {
  const sampleItems = [
    { vendor: 'Google Cloud Platform', amount: 320.00, date: '2026-03-01', category: 'Cloud Infrastructure' },
    { vendor: 'GitHub Enterprise', amount: 84.00, date: '2026-03-02', category: 'Dev Tools' },
    { vendor: 'Figma Design Team', amount: 45.00, date: '2026-03-02', category: 'Software Subscriptions' },
    { vendor: 'The Home Depot', amount: 485.20, date: '2026-03-03', category: 'Project Materials' },
    { vendor: 'Delta Air Lines', amount: 642.80, date: '2026-03-04', category: 'Travel & Lodging' },
    { vendor: 'Google Cloud Platform', amount: 320.00, date: '2026-03-01', category: 'Cloud Infrastructure' }, // duplicate sample
  ];

  const [preview, setPreview] = useState<BatchOperationPreview>(
    BatchOperationsService.previewBatch(type, sampleItems)
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedSuccess, setExecutedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmBatch = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutedSuccess(true);
      if (onExecuteBatch) onExecuteBatch(preview);
    }, 800);
  };

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
        maxWidth: '650px',
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
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Layers size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Batch Financial Processing Studio</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Pre-execution verification, duplicate screening, and atomic ledger posting
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Verification Stat Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Total Items</span>
            <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>{preview.totalItems}</div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#10b981' }}>High Confidence</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{preview.validCount}</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#f59e0b' }}>Requires Review</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>{preview.reviewCount}</div>
          </div>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#f87171' }}>Duplicates</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>{preview.duplicateCount}</div>
          </div>
        </div>

        {/* Item Preview List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
          {preview.items.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '11px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontWeight: 700 }}>{item.summary}</span>
                {item.status === 'duplicate_warning' && (
                  <span style={{ marginLeft: '8px', color: '#f87171', fontWeight: 700 }}>• Duplicate Flagged</span>
                )}
              </div>
              <span style={{ fontWeight: 800 }}>{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        {executedSuccess ? (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
          }}>
            Batch operations successfully executed and posted to General Ledger!
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBatch}
              disabled={isExecuting}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
              }}
            >
              {isExecuting ? 'Processing...' : `Execute Batch (${formatCurrency(preview.totalDollarVolume)})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
