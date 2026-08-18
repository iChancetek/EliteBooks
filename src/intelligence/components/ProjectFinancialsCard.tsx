'use client';

import React, { useState } from 'react';
import { Briefcase, TrendingUp, CheckCircle, AlertTriangle, Plus, ChevronRight, HardHat, FileCheck, Layers } from 'lucide-react';
import { ProjectFinancials, ProjectAllocationRecommendation, NewProjectProposal } from '../types';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface ProjectFinancialsCardProps {
  projects: ProjectFinancials[];
  allocations: ProjectAllocationRecommendation[];
  proposals: NewProjectProposal[];
  onApplyAllocation?: (recommendationId: string) => void;
  onApproveProposal?: (proposal: NewProjectProposal) => void;
}

export default function ProjectFinancialsCard({
  projects,
  allocations,
  proposals,
  onApplyAllocation,
  onApproveProposal,
}: ProjectFinancialsCardProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'allocations' | 'proposals'>('projects');
  const [selectedProject, setSelectedProject] = useState<ProjectFinancials | null>(projects[0] || null);

  const totalContractValue = projects.reduce((s, p) => s + (p.contractAmount || 0), 0);
  const totalActualCost = projects.reduce((s, p) => s + (p.actualCost || 0), 0);
  const totalGrossProfit = projects.reduce((s, p) => s + (p.grossProfit || 0), 0);
  const overallMargin = totalContractValue > 0 ? ((totalGrossProfit / totalContractValue) * 100).toFixed(1) : '0.0';

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
      {/* Header & Sub-Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
          }}>
            <HardHat size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Project Management AI & Construction Financials</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Job costing, retainage tracking, change orders, and automatic cost allocations
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'projects' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            }}
          >
            Active Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('allocations')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'allocations' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            }}
          >
            Auto Allocations ({allocations.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'proposals' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            }}
          >
            AI Proposals ({proposals.length})
          </button>
        </div>
      </div>

      {/* Overview Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Active Contract Volume</span>
          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{formatCurrency(totalContractValue)}</div>
          <span style={{ fontSize: '10px', color: '#10b981' }}>Across {projects.length} managed engagements</span>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Direct Costs Incurred</span>
          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{formatCurrency(totalActualCost)}</div>
          <span style={{ fontSize: '10px', color: '#60a5fa' }}>Labor, materials & subcontractors</span>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Project Gross Margin</span>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{overallMargin}%</div>
          <span style={{ fontSize: '10px', color: '#10b981' }}>{formatCurrency(totalGrossProfit)} retained profit</span>
        </div>
      </div>

      {/* Tab 1: Active Projects List & Detailed Job Costing */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.5fr)', gap: '16px' }}>
          {/* Project List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {projects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 700 }}>{proj.code}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '100px',
                      background: proj.type === 'construction' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: proj.type === 'construction' ? '#f59e0b' : '#60a5fa',
                    }}>
                      {proj.type.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>{proj.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Client: {proj.customer}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
                    <span style={{ fontWeight: 800 }}>{formatCurrency(proj.contractAmount)}</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>{proj.grossMarginPercent}% Margin</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Project Deep Dive */}
          {selectedProject && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{selectedProject.name}</h4>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {selectedProject.customer} • Location: {selectedProject.location || 'HQ'} • Class: {selectedProject.class || 'Standard'}
                  </span>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  {Math.round(selectedProject.aiConfidenceScore * 100)}% AI Audit Score
                </div>
              </div>

              {/* Job Costing Metric Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Budget Cost</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>{formatCurrency(selectedProject.budgetCost)}</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Actual Incurred</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>{formatCurrency(selectedProject.actualCost)}</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Forecast ETC</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#60a5fa', marginTop: '2px' }}>{formatCurrency(selectedProject.forecastCostToComplete)}</div>
                </div>
              </div>

              {/* Construction Retainage & Change Orders */}
              {selectedProject.type === 'construction' && (
                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                    <span>Retainage Withheld ({selectedProject.retainagePercent}%):</span>
                    <span>{formatCurrency(selectedProject.retainageWithheld || 0)}</span>
                  </div>
                  {selectedProject.changeOrders.length > 0 && (
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#cbd5e1' }}>
                      Change Order: {selectedProject.changeOrders[0].orderNumber} — {selectedProject.changeOrders[0].description} (+{formatCurrency(selectedProject.changeOrders[0].amount)})
                    </div>
                  )}
                </div>
              )}

              {/* Cost Category Breakdown */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                  Direct Cost Category Breakdown
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>• Labor:</span>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(selectedProject.costBreakdown.labor)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>• Materials:</span>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(selectedProject.costBreakdown.materials)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>• Subcontractors:</span>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(selectedProject.costBreakdown.subcontractors)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Auto Allocations */}
      {activeTab === 'allocations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {allocations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
              Zero unallocated expenses detected. All transaction costs mapped to project job centers.
            </div>
          ) : (
            allocations.map((rec) => (
              <div
                key={rec.transactionId}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{rec.transactionDescription}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Target: <strong style={{ color: '#60a5fa' }}>{rec.recommendedProjectName}</strong> • Category: {rec.recommendedCategory}
                  </div>
                  <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>
                    {rec.rationale}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>{formatCurrency(rec.amount)}</span>
                  <button
                    type="button"
                    onClick={() => onApplyAllocation && onApplyAllocation(rec.transactionId)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Allocation
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: AI Project Proposals */}
      {activeTab === 'proposals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {proposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
              Project Management AI has evaluated current customer billing patterns. No new project creation proposals pending.
            </div>
          ) : (
            proposals.map((prop, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>AI RECOMMENDED PROJECT CREATION</span>
                  <h4 style={{ margin: '4px 0 2px 0', fontSize: '14px', fontWeight: 800 }}>{prop.proposedName}</h4>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Customer: {prop.suggestedCustomer} • Est. Revenue: {formatCurrency(prop.estimatedRevenue)}</div>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px', fontSize: '11px', color: '#94a3b8' }}>
                    {prop.signals.map((sig, sIdx) => (
                      <li key={sIdx}>{sig}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onApproveProposal && onApproveProposal(prop)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
                  }}
                >
                  Create Project
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
