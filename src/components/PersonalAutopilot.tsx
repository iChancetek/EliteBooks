'use client';

import React, { useState } from 'react';
import { 
  Bot, Shield, Zap, Eye, ChevronRight, 
  History, Info, AlertCircle, CheckCircle2,
  Settings, ArrowRightLeft, CreditCard
} from 'lucide-react';
import styles from './PersonalAutopilot.module.css';
import { formatCurrency } from '@/lib/utils';
import type { AutonomousAction } from '@/types/accounting';

type AutonomyLevel = 1 | 2 | 3 | 4;

const levels = [
  { id: 1, name: 'Observer', desc: 'Tracks + reports only', icon: Eye, color: '#94a3b8' },
  { id: 2, name: 'Advisor', desc: 'Recommends actions', icon: Info, color: '#3b82f6' },
  { id: 3, name: 'Assisted', desc: 'Executes small actions', icon: Zap, color: '#f59e0b' },
  { id: 4, name: 'Autonomous', desc: 'Full rule-based execution', icon: Shield, color: '#10b981' },
];

const mockActions: AutonomousAction[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    action: 'Moved $150 to Checking',
    reason: 'Preventing potential overdraft due to upcoming Rent payment on the 1st.',
    amount: 150,
    fromAccount: 'Savings',
    toAccount: 'Main Checking',
    status: 'executed',
    impact: 'Avoided $35 overdraft fee.'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    action: 'Flagged Unused Subscription',
    reason: 'Netflix has not been used for 60 days.',
    amount: 19.99,
    status: 'pending_approval',
    impact: 'Potential $240/year savings.'
  }
];

export default function PersonalAutopilot() {
  const [level, setLevel] = useState<AutonomyLevel>(2);
  const [showHistory, setShowHistory] = useState(false);

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
          {mockActions.map((action) => (
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
          ))}
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
