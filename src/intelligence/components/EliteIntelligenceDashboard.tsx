'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Plus, Calculator, TrendingUp, Layers, ShieldCheck,
  FileSpreadsheet, HardHat, Camera, Cpu, FileText, Check, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { CustomKPI, FinancialClass, FinancialLocation } from '../types';
import { CustomKPIEngine } from '../kpi-engine';
import { ProjectManagementAIEngine } from '../project-management-ai';
import { BooksQualityAIEngine } from '../books-quality-ai';
import { FinanceAIEngine } from '../finance-ai';
import { DimensionsService } from '../dimensions-service';
import { WorkflowAutomationEngine } from '../automation-engine';
import { Compliance1099Service } from '../compliance-1099-service';
import { formatCurrency, formatPercent } from '@/lib/utils';

import CustomKPIBuilderModal from './CustomKPIBuilderModal';
import ProjectFinancialsCard from './ProjectFinancialsCard';
import BooksQualityAuditCard from './BooksQualityAuditCard';
import AutomationAutopilotCard from './AutomationAutopilotCard';
import ReceiptMileageHub from './ReceiptMileageHub';
import BatchOperationsModal from './BatchOperationsModal';
import ExcelSyncModal from './ExcelSyncModal';
import Vendor1099Hub from './Vendor1099Hub';

interface EliteIntelligenceDashboardProps {
  financialData?: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalPaid: number;
    totalOutstanding: number;
    operatingCash: number;
    expensesByCategory: Record<string, number>;
    invoices: any[];
    expenses: any[];
  };
}

export default function EliteIntelligenceDashboard({
  financialData = {
    totalRevenue: 673400,
    totalExpenses: 5337.18,
    netProfit: 668062.82,
    totalPaid: 17000,
    totalOutstanding: 656400,
    operatingCash: 11662.82,
    expensesByCategory: { 'Cloud Infrastructure': 2100, 'Legal & Professional': 1800, 'Software Subscriptions': 1437.18 },
    invoices: [],
    expenses: [],
  },
}: EliteIntelligenceDashboardProps) {
  // 1. KPI State
  const [kpis, setKpis] = useState<CustomKPI[]>(() => {
    return CustomKPIEngine.calculateKPIs(CustomKPIEngine.getDefaults(), {
      totalRevenue: financialData.totalRevenue,
      totalExpenses: financialData.totalExpenses,
      netProfit: financialData.netProfit,
      clearedCash: financialData.totalPaid,
      outstandingAR: financialData.totalOutstanding,
      operatingCash: financialData.operatingCash,
    });
  });
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);

  // 2. Intelligence Engines State
  const projects = ProjectManagementAIEngine.getProjects();
  const projectAllocations = ProjectManagementAIEngine.evaluateAllocations(
    financialData.expenses.map((e, idx) => ({
      id: e.id || `exp_${idx}`,
      description: e.description || e.vendor || 'Disbursement',
      amount: e.amount || 0,
      date: e.date || '2026-01-01',
    })),
    projects
  );
  const projectProposals = ProjectManagementAIEngine.detectNewProjectProposals(financialData.invoices);

  const { healthScore, findings } = BooksQualityAIEngine.auditBooksQuality(
    financialData.expenses,
    financialData.invoices,
    projects
  );
  const quarterlyReport = BooksQualityAIEngine.generateQuarterlyReport(
    'Q1 2026',
    financialData.expenses,
    financialData.invoices,
    projects
  );

  const insights5Pillars = FinanceAIEngine.generateInsights({
    totalRevenue: financialData.totalRevenue,
    totalExpenses: financialData.totalExpenses,
    netProfit: financialData.netProfit,
    totalPaid: financialData.totalPaid,
    totalOutstanding: financialData.totalOutstanding,
    operatingCash: financialData.operatingCash,
    expensesByCategory: financialData.expensesByCategory,
    invoicesCount: financialData.invoices.length || 7,
    expensesCount: financialData.expenses.length || 16,
  });

  const [classesList] = useState<FinancialClass[]>(DimensionsService.getClasses());
  const [locationsList] = useState<FinancialLocation[]>(DimensionsService.getLocations());
  const [automationRules, setAutomationRules] = useState(WorkflowAutomationEngine.getRules());
  const vendor1099List = Compliance1099Service.evaluateVendors(financialData.expenses);

  // Modals State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const handleSaveCustomKpi = (newKpi: CustomKPI) => {
    setKpis(prev => [...prev, newKpi]);
  };

  const handleToggleRule = (ruleId: string) => {
    const updated = WorkflowAutomationEngine.toggleRule(ruleId);
    if (updated) {
      setAutomationRules(WorkflowAutomationEngine.getRules());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Top Banner & Quick Toolbars */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.8))',
        border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.15))',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#ffffff' }}>EliteBooks Intelligence</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Autonomous financial operating layer, customizable KPI studio, and multidimensional analytics
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsKpiModalOpen(true)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
            }}
          >
            <Plus size={14} /> Add Custom KPI
          </button>
          <button
            type="button"
            onClick={() => setIsBatchModalOpen(true)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={14} /> Batch Studio
          </button>
          <button
            type="button"
            onClick={() => setIsExcelModalOpen(true)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileSpreadsheet size={14} /> Excel Sync
          </button>
        </div>
      </div>

      {/* 1. CUSTOMIZABLE KPI STUDIO CARDS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="#60a5fa" />
            <span>Personalized KPI Studio & Live Metrics</span>
          </h3>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Dynamic Formula Evaluator Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6))',
                border: kpi.isAlertActive ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{kpi.name}</span>
                {kpi.targetValue && (
                  <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 700 }}>
                    Target: {kpi.targetValue}{kpi.visualization === 'percent' ? '%' : ''}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: kpi.isAlertActive ? '#f87171' : '#ffffff' }}>
                {kpi.currentValue}{kpi.visualization === 'percent' ? '%' : ''}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Formula: <code>{kpi.formula}</code></div>
              {kpi.alertMessage && (
                <div style={{ fontSize: '10px', color: '#f87171', fontWeight: 700, marginTop: '2px' }}>
                  {kpi.alertMessage}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. 5-PILLAR PERSONALIZED FINANCIAL INSIGHTS */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
        border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.15))',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrendingUp size={18} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>Finance AI — 5-Pillar Executive Explanations</h3>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
              Deterministic financial context analysis answering What Happened, Why It Matters, Supporting Data, Action, and Confidence
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {insights5Pillars.map((ins) => (
            <div
              key={ins.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#f1f5f9' }}>{ins.title}</h4>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '100px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: 800,
                }}>
                  {Math.round(ins.confidenceScore * 100)}% CONFIDENCE
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                <strong style={{ color: '#60a5fa' }}>What happened:</strong> {ins.whatHappened}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                <strong style={{ color: '#f59e0b' }}>Why it matters:</strong> {ins.whyItMatters}
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: '10px', fontSize: '11px' }}>
                <span style={{ fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Supporting Data:</span>
                {ins.supportingData.map((d, dIdx) => (
                  <div key={dIdx} style={{ color: '#cbd5e1' }}>• {d}</div>
                ))}
              </div>

              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                Recommended Action: {ins.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PROJECT MANAGEMENT AI & CONSTRUCTION FINANCIALS */}
      <ProjectFinancialsCard
        projects={projects}
        allocations={projectAllocations}
        proposals={projectProposals}
      />

      {/* 4. CONTINUOUS BOOKS QUALITY AI */}
      <BooksQualityAuditCard
        healthScore={healthScore}
        findings={findings}
        quarterlyReport={quarterlyReport}
      />

      {/* 5. UNLIMITED CLASSES & LOCATIONS SEGMENTATION */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
        border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.15))',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>Multidimensional Profitability (Unlimited Classes & Locations)</h3>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
              Segmented general ledger P&L across departments, programs, service lines, and job sites
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Classes Breakdown */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#60a5fa', display: 'block', marginBottom: '10px' }}>
              Classes (Departments & Service Lines)
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {classesList.map((cls) => (
                <div key={cls.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{cls.name}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>{cls.code}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: cls.netProfit >= 0 ? '#10b981' : '#f87171' }}>
                      {formatCurrency(cls.netProfit)}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>
                      Rev: {formatCurrency(cls.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations Breakdown */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', display: 'block', marginBottom: '10px' }}>
              Locations (Offices & Job Sites)
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {locationsList.map((loc) => (
                <div key={loc.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{loc.name}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>{loc.city}, {loc.country || 'USA'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: '#10b981' }}>{formatCurrency(loc.netProfit)}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>
                      Rev: {formatCurrency(loc.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. WORKFLOW AUTOMATION & AI AUTOPILOT */}
      <AutomationAutopilotCard
        rules={automationRules}
        onToggleRule={handleToggleRule}
      />

      {/* 7. AI RECEIPTS & MILEAGE HUB */}
      <ReceiptMileageHub />

      {/* 8. 1099 VENDOR COMPLIANCE */}
      <Vendor1099Hub vendors={vendor1099List} />

      {/* MODALS */}
      <CustomKPIBuilderModal
        isOpen={isKpiModalOpen}
        onClose={() => setIsKpiModalOpen(false)}
        onSave={handleSaveCustomKpi}
      />

      <BatchOperationsModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
      />

      <ExcelSyncModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        invoicesData={financialData.invoices}
        expensesData={financialData.expenses}
      />
    </div>
  );
}
