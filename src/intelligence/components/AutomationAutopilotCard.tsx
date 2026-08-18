'use client';

import React, { useState } from 'react';
import { Cpu, Play, CheckCircle, Clock, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { WorkflowAutomationRule } from '../types';

interface AutomationAutopilotCardProps {
  rules: WorkflowAutomationRule[];
  onToggleRule?: (ruleId: string) => void;
  onExecuteRule?: (ruleId: string) => void;
}

export default function AutomationAutopilotCard({
  rules,
  onToggleRule,
  onExecuteRule,
}: AutomationAutopilotCardProps) {
  const [selectedRule, setSelectedRule] = useState<WorkflowAutomationRule | null>(rules[0] || null);

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
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.35)',
          }}>
            <Cpu size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Workflow Automation & AI Autopilot</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Controlled autonomous accounting pipelines with verifiable Human-in-the-Loop gates
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
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Zap size={13} />
          <span>Autopilot Active & Enforcing Guardrails</span>
        </div>
      </div>

      {/* Rules List & Audit Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)', gap: '16px' }}>
        {/* Rules Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rules.map((rule) => {
            const isSelected = selectedRule?.id === rule.id;
            return (
              <div
                key={rule.id}
                onClick={() => setSelectedRule(rule)}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: isSelected ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{rule.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleRule) onToggleRule(rule.id);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '10px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: rule.isEnabled ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                      color: rule.isEnabled ? '#0f172a' : '#ffffff',
                    }}
                  >
                    {rule.isEnabled ? 'ENABLED' : 'PAUSED'}
                  </button>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{rule.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11px' }}>
                  <span style={{ color: '#ec4899' }}>{rule.executionCount} autonomous runs</span>
                  {rule.requiresHITLApproval && (
                    <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ShieldCheck size={12} /> HITL Approval Gate
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rule Audit Details */}
        {selectedRule && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>{selectedRule.name}</h4>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Action: {selectedRule.action}</span>
              </div>
              {onExecuteRule && (
                <button
                  type="button"
                  onClick={() => onExecuteRule(selectedRule.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Play size={11} /> Trigger Rule Now
                </button>
              )}
            </div>

            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                Immutable Autopilot Execution Log
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedRule.auditTrail.length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>No recorded runs for this rule yet.</div>
                ) : (
                  selectedRule.auditTrail.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        fontSize: '11px',
                        borderLeft: log.status === 'success' ? '3px solid #10b981' : '3px solid #f59e0b',
                      }}
                    >
                      <div style={{ color: '#cbd5e1' }}>{log.details}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{new Date(log.executedAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
