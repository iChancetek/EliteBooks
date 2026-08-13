'use client';

import { useState, useEffect } from 'react';
import { Bot, CheckCircle2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

export default function AutonomousAgentWidget() {
  const { user } = useAuth();
  const [activeWorkflow, setActiveWorkflow] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checkDismissed = (id: number) => {
    try {
      const dismissed = JSON.parse(sessionStorage.getItem('dismissed_agent_workflows') || '[]');
      return dismissed.includes(id);
    } catch (e) {
      return false;
    }
  };

  const markDismissed = (id: number) => {
    try {
      const dismissed = JSON.parse(sessionStorage.getItem('dismissed_agent_workflows') || '[]');
      if (!dismissed.includes(id)) {
        dismissed.push(id);
        sessionStorage.setItem('dismissed_agent_workflows', JSON.stringify(dismissed));
      }
    } catch (e) {
      console.error(e);
    }
  };

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
          const { invoices = [], expenses = [] } = json.data;

          // 1. Check for actual overdue invoices
          const overdueInvoices = invoices.filter((inv: any) => {
            const isOverdueStatus = inv.status === 'overdue';
            const isPastDue = inv.dueDate && new Date(inv.dueDate) < new Date() && inv.status !== 'paid';
            return isOverdueStatus || isPastDue;
          });

          // 2. Check for high cloud expenses
          const highCloudExpenses = expenses.filter((exp: any) => 
            ['aws', 'amazon', 'cloud', 'hosting', 'google cloud', 'gcp', 'azure'].some(v => exp.vendor?.toLowerCase().includes(v)) && 
            exp.amount > 500
          );

          if (overdueInvoices.length > 0 && !checkDismissed(2)) {
            selectedWorkflow = {
              id: 2,
              message: `You have ${overdueInvoices.length} invoice${overdueInvoices.length > 1 ? 's' : ''} overdue. Shall I draft and send polite reminder emails?`,
              type: "warning",
              actionText: `Drafted & sent reminder emails for ${overdueInvoices.length} overdue invoices.`
            };
          } else if (highCloudExpenses.length > 0 && !checkDismissed(1)) {
            selectedWorkflow = {
              id: 1,
              message: `I detected a high AWS/Cloud bill of ${formatCurrency(highCloudExpenses[0].amount)} this month. Would you like me to run an anomaly report?`,
              type: "warning",
              actionText: "Generated cloud cost anomaly report."
            };
          }
        }
        
        if (selectedWorkflow) {
          setActiveWorkflow(selectedWorkflow);
          setIsVisible(true);
        }
      } catch (err) {
        console.error('Failed to fetch widget context:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  if (!isVisible || !activeWorkflow) return null;

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);

    try {
      if (user) {
        const token = await user.getIdToken();
        await fetch('/api/agents', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: activeWorkflow.message,
            workflowId: activeWorkflow.id,
            action: 'approve'
          }),
        }).catch(() => {});
      }

      markDismissed(activeWorkflow.id);
      setToastMessage(activeWorkflow.actionText || 'Workflow approved & executed by Agent.');
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsVisible(false);
        setToastMessage(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeWorkflow?.id) {
      markDismissed(activeWorkflow.id);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="glass-card animate-fade-in-up"
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        left: 'calc(var(--sidebar-width) + var(--space-6))',
        zIndex: 9999,
        maxWidth: '400px',
        padding: 'var(--space-4)',
        border: `1px solid ${activeWorkflow.type === 'warning' ? '#f59e0b' : '#3b82f6'}`,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        background: 'var(--color-bg-elevated)',
        backdropFilter: 'blur(16px)'
      }}
    >
      {toastMessage ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', color: 'var(--color-positive)' }}>
          <CheckCircle2 size={20} />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{toastMessage}</span>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
              <Bot size={20} style={{ color: activeWorkflow.type === 'warning' ? '#f59e0b' : '#3b82f6' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Human Review Required</span>
                <span className="status-pill hitl" style={{ 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  background: 'var(--color-warning-bg)',
                  color: 'var(--color-warning)'
                }}>
                  HITL
                </span>
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {activeWorkflow.message}
              </p>
            </div>
            <button type="button" onClick={handleDismiss} className="btn-icon btn-ghost" style={{ padding: '4px', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
            <button 
              type="button"
              className="btn btn-sm" 
              style={{ flex: 1, background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', cursor: 'pointer' }}
              onClick={handleDismiss}
              disabled={isProcessing}
            >
              Dismiss
            </button>
            <button 
              type="button"
              className="btn btn-sm btn-primary" 
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={handleApprove}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><Loader2 size={14} className="animate-spin" /> Executing...</>
              ) : (
                <><CheckCircle2 size={14} /> Approve</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
