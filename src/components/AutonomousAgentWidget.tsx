'use client';

import { useState, useEffect } from 'react';
import { Bot, CheckCircle2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

import styles from './AutonomousAgentWidget.module.css';

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
      className={`${styles.widgetContainer} ${activeWorkflow.type === 'warning' ? styles.warningBorder : styles.infoBorder} animate-fade-in-up`}
    >
      {toastMessage ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', color: '#10b981' }}>
          <CheckCircle2 size={20} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      ) : (
        <>
          <div className={styles.headerRow}>
            <div className={styles.iconWrapper} style={{ background: activeWorkflow.type === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)' }}>
              <Bot size={20} style={{ color: activeWorkflow.type === 'warning' ? '#f59e0b' : '#3b82f6' }} />
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.titleRow}>
                <h4 className={styles.title}>Human Review Required</h4>
                <span className={styles.hitlBadge}>HITL</span>
              </div>
              <p className={styles.messageText}>
                {activeWorkflow.message}
              </p>
            </div>
            <button 
              type="button" 
              onClick={handleDismiss} 
              className={styles.closeBtn}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.actionsRow}>
            <button 
              type="button"
              className={styles.dismissBtn}
              onClick={handleDismiss}
              disabled={isProcessing}
            >
              Dismiss
            </button>
            <button 
              type="button"
              className={styles.approveBtn}
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
