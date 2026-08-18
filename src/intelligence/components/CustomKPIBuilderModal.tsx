'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, Calculator, AlertTriangle, Plus } from 'lucide-react';
import { CustomKPI, KPIVisualization } from '../types';
import { CustomKPIEngine } from '../kpi-engine';

interface CustomKPIBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpi: CustomKPI) => void;
  availableVariables?: Record<string, number>;
}

export default function CustomKPIBuilderModal({
  isOpen,
  onClose,
  onSave,
  availableVariables = {
    TotalRevenue: 673400,
    TotalExpenses: 5337.18,
    NetOperatingProfit: 668062.82,
    ClearedCash: 17000,
    OutstandingAR: 656400,
    OperatingCash: 11662.82,
    ProjectRevenue: 471380,
    ProjectCosts: 3202.31,
  },
}: CustomKPIBuilderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formula, setFormula] = useState('');
  const [targetValue, setTargetValue] = useState<number>(30);
  const [warningThreshold, setWarningThreshold] = useState<number>(20);
  const [alertThreshold, setAlertThreshold] = useState<number>(10);
  const [visualization, setVisualization] = useState<KPIVisualization>('percent');
  const [dataSource, setDataSource] = useState<CustomKPI['dataSource']>('general_ledger');
  const [testResult, setTestResult] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleTestFormula = () => {
    const res = CustomKPIEngine.evaluateFormula(formula, availableVariables);
    setTestResult(res);
  };

  const handleSave = () => {
    if (!name.trim() || !formula.trim()) return;
    const computedVal = CustomKPIEngine.evaluateFormula(formula, availableVariables);

    const newKpi: CustomKPI = {
      id: `kpi_${Date.now()}`,
      name,
      description,
      formula,
      dataSource,
      period: 'all_time',
      currentValue: computedVal,
      targetValue,
      warningThreshold,
      alertThreshold,
      frequency: 'real_time',
      visualization,
      isAlertActive: alertThreshold !== undefined && computedVal <= alertThreshold,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newKpi);
    onClose();
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
        gap: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Calculator size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Custom KPI Builder</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
                Define mathematical formulas and set automated threshold monitors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
              KPI Name
            </label>
            <input
              type="text"
              placeholder="e.g. Project Gross Margin, Net Operating Efficiency"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Evaluates operational cash retention per dollar of invoiced sales"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
              Arithmetic Formula
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="e.g. (NetOperatingProfit / TotalRevenue) * 100"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}
              />
              <button
                type="button"
                onClick={handleTestFormula}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Test Formula
              </button>
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
              Available Variables: <code style={{ color: '#60a5fa' }}>TotalRevenue</code>, <code style={{ color: '#60a5fa' }}>TotalExpenses</code>, <code style={{ color: '#60a5fa' }}>NetOperatingProfit</code>, <code style={{ color: '#60a5fa' }}>ClearedCash</code>, <code style={{ color: '#60a5fa' }}>OutstandingAR</code>, <code style={{ color: '#60a5fa' }}>OperatingCash</code>
            </div>
            {testResult !== null && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                fontSize: '12px',
                fontWeight: 700,
              }}>
                Calculated Test Output: {testResult}{visualization === 'percent' ? '%' : ''}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', display: 'block' }}>
                Target Value
              </label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', display: 'block' }}>
                Warning Threshold
              </label>
              <input
                type="number"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', display: 'block' }}>
                Alert Threshold
              </label>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || !formula.trim()}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              opacity: !name.trim() || !formula.trim() ? 0.5 : 1,
            }}
          >
            Save & Activate KPI
          </button>
        </div>
      </div>
    </div>
  );
}
