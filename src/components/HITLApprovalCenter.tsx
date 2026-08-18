'use client';

import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  Cpu,
  X,
} from 'lucide-react';
import { HITLApprovalRequest } from '@/types/agent-system';

interface HITLApprovalCenterProps {
  request: HITLApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const HITLApprovalCenter: React.FC<HITLApprovalCenterProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !request) return null;

  const isNegative = request.financialImpact < 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10006,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.9))',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.2)',
          position: 'relative',
          overflowY: 'auto',
          maxHeight: 'calc(100dvh - 32px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Human-in-the-Loop (HITL) Authorization
              </h3>
              <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', margin: '2px 0 0 0' }}>
                Executive approval required before MCP autonomous ledger execution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {request.title}
            </h2>
            <span
              style={{
                fontSize: '18px',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 800,
                color: isNegative ? '#f87171' : '#34d399',
              }}
            >
              {isNegative ? '-' : '+'}$
              {Math.abs(request.financialImpact).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, margin: 0 }}>
            {request.description}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '14px',
          }}
        >
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
              Responsible Agent
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Cpu size={14} color="#f59e0b" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                {request.responsibleAgent}
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
              MCP Tool Name
            </span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', color: '#fde68a', fontWeight: 600, display: 'block', marginTop: '4px' }}>
              {request.toolName}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
              Confidence Score
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${request.confidenceScore * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 800, color: '#ffffff' }}>
                {Math.round(request.confidenceScore * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} />
            AI Governance Rationale
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5, margin: 0 }}>
            {request.reasoning}
          </p>
        </div>

        {/* Evidence List */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Verified Source Evidence & Proof
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {request.evidence.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <Lock size={13} color="#10b981" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={() => {
              onReject(request.id);
              onClose();
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <XCircle size={15} />
            Reject Action
          </button>

          <button
            onClick={() => {
              onApprove(request.id);
              onClose();
            }}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            <CheckCircle2 size={16} />
            Authorize & Execute via MCP
          </button>
        </div>
      </div>
    </div>
  );
};
