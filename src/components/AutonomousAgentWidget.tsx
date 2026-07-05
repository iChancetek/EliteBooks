'use client';

import { useState, useEffect } from 'react';
import { Bot, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const agentWorkflows = [
  {
    id: 1,
    message: "I detected an unusually high AWS bill this month. Would you like me to run an anomaly report?",
    type: "warning"
  },
  {
    id: 2,
    message: "You have 3 invoices overdue by 15 days. Shall I draft and send polite reminder emails?",
    type: "info"
  },
  {
    id: 3,
    message: "Payroll is due in 3 days, but Contractor W-9s are missing. Shall I email them the forms?",
    type: "warning"
  }
];

const newAccountWorkflow = {
  id: 4,
  message: "Welcome to EliteBooks! I am your Autonomous Agent. Shall I guide you through setting up your first invoice?",
  type: "info"
};

export default function AutonomousAgentWidget() {
  const { user } = useAuth();
  const [activeWorkflow, setActiveWorkflow] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [autonomyMode, setAutonomyMode] = useState<'autonomous' | 'hitl'>('hitl');

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        
        let selectedWorkflow = null;
        if (json.success && json.data) {
          // Context-aware checking
          if (json.data.invoiceCount === 0 && json.data.expenseCount === 0) {
            selectedWorkflow = newAccountWorkflow;
          } else {
            selectedWorkflow = agentWorkflows[Math.floor(Math.random() * agentWorkflows.length)];
          }
        } else {
          selectedWorkflow = agentWorkflows[Math.floor(Math.random() * agentWorkflows.length)];
        }
        
        setActiveWorkflow(selectedWorkflow);
        setIsVisible(true);
      } catch (err) {
        console.error('Failed to fetch widget context:', err);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [user]);

  if (!isVisible || !activeWorkflow) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsVisible(false);
      alert('Workflow approved and executed by Agent.');
    }, 2000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div 
      className="glass-card animate-fade-in-up"
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        left: 'calc(var(--sidebar-width) + var(--space-6))', // Avoid overlapping sidebar
        zIndex: 9999,
        maxWidth: '380px',
        padding: 'var(--space-4)',
        border: `1px solid ${activeWorkflow.type === 'warning' ? '#f59e0b' : '#3b82f6'}`,
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
          <Bot size={20} style={{ color: activeWorkflow.type === 'warning' ? '#f59e0b' : '#3b82f6' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{autonomyMode === 'autonomous' ? 'Autonomous Action' : 'Human Review Required'}</span>
            <span className={`status-pill ${autonomyMode}`} style={{ 
              fontSize: '10px', 
              padding: '2px 6px', 
              borderRadius: '4px',
              background: autonomyMode === 'autonomous' ? 'var(--color-positive-bg)' : 'var(--color-warning-bg)',
              color: autonomyMode === 'autonomous' ? 'var(--color-positive)' : 'var(--color-warning)'
            }}>
              {autonomyMode.toUpperCase()}
            </span>
          </h4>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            {activeWorkflow.message}
          </p>
        </div>
        <button onClick={handleDismiss} className="btn-icon btn-ghost" style={{ padding: '2px' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
        <button 
          className="btn btn-sm" 
          style={{ flex: 1, background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
          onClick={handleDismiss}
          disabled={isProcessing}
        >
          Dismiss
        </button>
        <button 
          className="btn btn-sm btn-primary" 
          style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          onClick={handleApprove}
          disabled={isProcessing}
        >
          {isProcessing ? 'Executing...' : <><CheckCircle2 size={14} /> Approve</>}
        </button>
      </div>
    </div>
  );
}
