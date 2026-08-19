'use client';

import React, { useState } from 'react';
import {
  Users, Calendar, Clock, Heart, ShieldCheck, Plus, CheckCircle,
  FileText, Sparkles, Check, AlertCircle, ArrowUpRight, DollarSign
} from 'lucide-react';
import {
  HREmployeeProfile,
  PTORequest,
  TimesheetEntry,
  BenefitPlan,
  WorkforceSummaryMetrics,
  WorkerClassificationAudit,
} from '../types';
import { HRAgentService } from '../hr-agent-service';
import { formatCurrency } from '@/lib/utils';

import PTORequestModal from './PTORequestModal';
import TimesheetLogModal from './TimesheetLogModal';
import BenefitsManagerModal from './BenefitsManagerModal';
import WorkerClassificationCard from './WorkerClassificationCard';

export default function HRWorkforceDashboard() {
  const [employees] = useState<HREmployeeProfile[]>(HRAgentService.getEmployees());
  const [ptoRequests, setPtoRequests] = useState<PTORequest[]>(HRAgentService.getPTORequests());
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(HRAgentService.getTimesheets());
  const [benefitPlans] = useState<BenefitPlan[]>(HRAgentService.getBenefitPlans());
  const [metrics] = useState<WorkforceSummaryMetrics>(HRAgentService.getWorkforceMetrics());
  const [classificationAudits] = useState<WorkerClassificationAudit[]>(HRAgentService.auditWorkerClassificationRisk());

  const [activeTab, setActiveTab] = useState<'employees' | 'pto' | 'timesheets' | 'benefits' | 'compliance'>('employees');

  // Modals State
  const [isPtoModalOpen, setIsPtoModalOpen] = useState(false);
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleApprovePTO = (requestId: string) => {
    const { ptoRequest, a2aMessage } = HRAgentService.approvePTO(requestId);
    if (ptoRequest) {
      setPtoRequests(HRAgentService.getPTORequests());
      setSuccessToast(`Approved PTO for ${ptoRequest.employeeName} (${ptoRequest.totalHours} hrs) — A2A event dispatched to Payroll Agent.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleCreatePTOSubmission = (req: Omit<PTORequest, 'id' | 'status' | 'requestedAt'>) => {
    const newReq = HRAgentService.requestPTO(req);
    setPtoRequests(HRAgentService.getPTORequests());
    setSuccessToast(`PTO request submitted for ${newReq.employeeName}.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCreateTimesheetSubmission = (entry: Omit<TimesheetEntry, 'id' | 'totalLaborCost' | 'status' | 'createdAt'>) => {
    const { timesheet, a2aMessage } = HRAgentService.logTimesheet(entry);
    setTimesheets(HRAgentService.getTimesheets());
    setSuccessToast(`Logged ${timesheet.hours} hrs for ${timesheet.employeeName} (${formatCurrency(timesheet.totalLaborCost)}) — Allocated to ${timesheet.projectName || 'Project'}.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#10b981',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner */}
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
        color: '#ffffff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          }}>
            <Users size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>Financial HR & Workforce Intelligence</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Autonomous employee lifecycle, project timesheets, PTO management, and benefits synchronization
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsPtoModalOpen(true)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Calendar size={14} /> Request PTO
          </button>
          <button
            type="button"
            onClick={() => setIsTimesheetModalOpen(true)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
            <Clock size={14} /> Log Timesheet
          </button>
          <button
            type="button"
            onClick={() => setIsBenefitsModalOpen(true)}
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
            <Heart size={14} /> Benefits Plans
          </button>
        </div>
      </div>

      {/* Workforce Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Total Workforce</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {metrics.totalHeadcount + metrics.contractorCount} Personnel
          </div>
          <span style={{ fontSize: '10px', color: '#60a5fa' }}>{metrics.fullTimeCount} W-2 Employees • {metrics.contractorCount} Contractors</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Monthly Gross Wages</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {formatCurrency(metrics.totalMonthlyPayrollDisbursement)}
          </div>
          <span style={{ fontSize: '10px', color: '#10b981' }}>Synchronized with General Ledger</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Employer Benefits Cost</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ec4899', marginTop: '4px' }}>
            {formatCurrency(metrics.totalMonthlyBenefitsCost)}
          </div>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{metrics.benefitsBurdenRatioPercent}% Benefits Burden Rate</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Compliance Posture</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {metrics.w4ComplianceRatePercent}% Compliant
          </div>
          <span style={{ fontSize: '10px', color: '#10b981' }}>Form W-4 & I-9 Documents Verified</span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('employees')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'employees' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
          }}
        >
          Employee Profiles ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('pto')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'pto' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
          }}
        >
          PTO & Leave Management ({ptoRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('timesheets')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'timesheets' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
          }}
        >
          Project Labor Timesheets ({timesheets.length})
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'benefits' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
          }}
        >
          Benefits & Deductions ({benefitPlans.length})
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'compliance' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
          }}
        >
          Worker Classification Sentinel
        </button>
      </div>

      {/* Tab 1: Employee Profiles */}
      {activeTab === 'employees' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {employees.map((emp) => (
            <div
              key={emp.id}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                color: '#f1f5f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{emp.firstName} {emp.lastName}</h3>
                  <span style={{ fontSize: '11px', color: '#60a5fa' }}>{emp.jobTitle} • {emp.department}</span>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '100px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: 800,
                }}>
                  FULL-TIME
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                <div>• Annual Salary: <strong>{formatCurrency(emp.annualSalary || 0)}</strong></div>
                <div>• Pay Frequency: <strong>{emp.payFrequency}</strong></div>
                <div>• Form W-4: <strong style={{ color: '#10b981' }}>Verified</strong></div>
                <div>• Form I-9: <strong style={{ color: '#10b981' }}>Verified</strong></div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '10px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
              }}>
                <span>PTO Accrued: <strong>{emp.ptoAccruedDays} Days</strong></span>
                <span style={{ color: '#10b981' }}>Available: <strong>{emp.ptoAvailableDays} Days</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: PTO Management */}
      {activeTab === 'pto' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ptoRequests.map((req) => (
            <div
              key={req.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                color: '#f1f5f9',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: req.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: req.status === 'approved' ? '#10b981' : '#f59e0b',
                  }}>
                    {req.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>{req.employeeName}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {req.type.toUpperCase()} LEAVE: {req.startDate} to {req.endDate} ({req.totalHours} Hours)
                </div>
                {req.reason && <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>Reason: {req.reason}</div>}
              </div>

              {req.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleApprovePTO(req.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={14} /> Approve & Sync with Payroll
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Project Labor Timesheets */}
      {activeTab === 'timesheets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {timesheets.map((ts) => (
            <div
              key={ts.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#f1f5f9',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>{ts.employeeName}</span>
                  <span style={{ fontSize: '11px', color: '#60a5fa' }}>• {ts.projectName || 'Project'}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {ts.taskDescription}
                </div>
                <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>
                  A2A Job Costing Synced with Project Management AI
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#60a5fa' }}>{formatCurrency(ts.totalLaborCost)}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{ts.hours} hrs @ ${ts.hourlyLaborRate}/hr</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Benefits Plans */}
      {activeTab === 'benefits' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {benefitPlans.map((bp) => (
            <div
              key={bp.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                color: '#f1f5f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 800 }}>{bp.name}</span>
                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>PRE-TAX</span>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>{bp.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
                <span>Employee: <strong>{formatCurrency(bp.employeeMonthlyCost)}/mo</strong></span>
                <span style={{ color: '#10b981' }}>Employer Match: <strong>{formatCurrency(bp.employerMonthlyMatch)}/mo</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Worker Classification */}
      {activeTab === 'compliance' && (
        <WorkerClassificationCard audits={classificationAudits} />
      )}

      {/* MODALS */}
      <PTORequestModal
        isOpen={isPtoModalOpen}
        onClose={() => setIsPtoModalOpen(false)}
        employees={employees}
        onSubmitRequest={handleCreatePTOSubmission}
      />

      <TimesheetLogModal
        isOpen={isTimesheetModalOpen}
        onClose={() => setIsTimesheetModalOpen(false)}
        employees={employees}
        onLogTimesheet={handleCreateTimesheetSubmission}
      />

      <BenefitsManagerModal
        isOpen={isBenefitsModalOpen}
        onClose={() => setIsBenefitsModalOpen(false)}
        benefitPlans={benefitPlans}
      />
    </div>
  );
}
