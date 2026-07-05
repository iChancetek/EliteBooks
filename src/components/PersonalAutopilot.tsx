'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, Shield, Zap, Eye, ChevronRight, 
  History, Info, AlertCircle, CheckCircle2,
  Settings, ArrowRightLeft, CreditCard
} from 'lucide-react';
import styles from './PersonalAutopilot.module.css';
import { formatCurrency } from '@/lib/utils';
import type { AutonomousAction } from '@/types/accounting';
import { useAuth } from '@/hooks/useAuth';

type AutonomyLevel = 1 | 2 | 3 | 4;

const levels = [
  { id: 1, name: 'Observer', desc: 'Tracks + reports only', icon: Eye, color: '#94a3b8' },
  { id: 2, name: 'Advisor', desc: 'Recommends actions', icon: Info, color: '#3b82f6' },
  { id: 3, name: 'Assisted', desc: 'Executes small actions', icon: Zap, color: '#f59e0b' },
  { id: 4, name: 'Autonomous', desc: 'Full rule-based execution', icon: Shield, color: '#10b981' },
];

export default function PersonalAutopilot() {
  const { user } = useAuth();
  const [level, setLevel] = useState<AutonomyLevel>(2);
  const [showHistory, setShowHistory] = useState(false);
  const [actions, setActions] = useState<AutonomousAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchActions = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          const reportData = json.data;
          const dynamicActions: AutonomousAction[] = [];
          
          // Derive actions from real data
          if (reportData.totalOutstanding > 0) {
            dynamicActions.push({
              id: 'unpaid-inv',
              timestamp: new Date().toISOString(),
              action: 'Flagged Outstanding Invoices',
              reason: `You have ${formatCurrency(reportData.totalOutstanding)} in unpaid invoices.`,
              amount: reportData.totalOutstanding,
              status: 'pending_approval',
              impact: 'Improve cash flow.'
            });
          }

          if (reportData.expenses && reportData.expenses.length > 0) {
            const lastExpense = reportData.expenses.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            if (lastExpense) {
              dynamicActions.push({
                id: 'recent-exp',
                timestamp: new Date(lastExpense.date).toISOString(),
                action: 'Categorized Expense',
                reason: `Auto-categorized ${lastExpense.vendor} as ${lastExpense.category}.`,
                amount: lastExpense.amount,
                status: 'executed',
                impact: 'Time saved on manual entry.'
              });
            }
          }

          setActions(dynamicActions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [user]);

  if (loading) return null;

  return (
    <div className={styles.autopilotContainer}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <Bot size={24} className={styles.botIcon} />
          <div>
            <h3>Financial Autopilot</h3>
            <p>AI-driven proactive money management</p>
          </div>
        </div>
        <div className={styles.levelBadge} style={{ background: levels.find(l => l.id === level)?.color + '20', color: levels.find(l => l.id === level)?.color }}>
          {levels.find(l => l.id === level)?.name}
        </div>
      </div>

      <div className={styles.levelSelector}>
        {levels.map((l) => (
          <button 
            key={l.id} 
            className={`${styles.levelCard} ${level === l.id ? styles.active : ''}`}
            onClick={() => setLevel(l.id as AutonomyLevel)}
            style={{ '--level-color': l.color } as any}
          >
            <l.icon size={18} />
            <div className={styles.levelInfo}>
              <span className={styles.levelName}>{l.name}</span>
              <span className={styles.levelDesc}>{l.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.transparencySection}>
        <div className={styles.sectionHeader}>
          <h4><History size={16} /> Recent Actions & Intelligence</h4>
          <button className={styles.historyBtn} onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Hide Log' : 'View Full Log'}
          </button>
        </div>

        <div className={styles.actionsList}>
          {actions.length > 0 ? actions.map((action) => (
            <div key={action.id} className={styles.actionItem}>
              <div className={styles.actionMain}>
                <div className={styles.actionIcon}>
                  {action.status === 'executed' ? <CheckCircle2 size={16} color="#10b981" /> : <AlertCircle size={16} color="#f59e0b" />}
                </div>
                <div className={styles.actionDetails}>
                  <div className={styles.actionTop}>
                    <strong>{action.action}</strong>
                    <span className={styles.actionTime}>{new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className={styles.actionReason}>{action.reason}</p>
                  <div className={styles.actionImpact}>
                    <Zap size={12} />
                    <span>Impact: {action.impact}</span>
                  </div>
                </div>
              </div>
              <div className={styles.actionOps}>
                {action.status === 'pending_approval' ? (
                  <button className="btn btn-sm btn-primary">Approve</button>
                ) : (
                  <button className="btn btn-sm btn-ghost">Undo</button>
                )}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
              No recent autonomous actions.
            </div>
          )}
        </div>
      </div>

      <div className={styles.guardrailsSection}>
        <h4><Settings size={16} /> Agent Guardrails</h4>
        <div className={styles.guardrailsGrid}>
          <div className={styles.guardrail}>
            <span>Max Auto-Move Amount</span>
            <strong>$200.00</strong>
          </div>
          <div className={styles.guardrail}>
            <span>Min Account Buffer</span>
            <strong>$500.00</strong>
          </div>
          <div className={styles.guardrail}>
            <span>Subscription Auto-Cancel</span>
            <span className={styles.statusOff}>OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
