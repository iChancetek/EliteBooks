'use client';

import React, { useState } from 'react';
import { X, Clock, Check, HardHat, DollarSign } from 'lucide-react';
import { TimesheetEntry, HREmployeeProfile } from '../types';
import { ProjectManagementAIEngine } from '@/intelligence/project-management-ai';
import { formatCurrency } from '@/lib/utils';

interface TimesheetLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: HREmployeeProfile[];
  onLogTimesheet: (entry: Omit<TimesheetEntry, 'id' | 'totalLaborCost' | 'status' | 'createdAt'>) => void;
}

export default function TimesheetLogModal({
  isOpen,
  onClose,
  employees,
  onLogTimesheet,
}: TimesheetLogModalProps) {
  const projects = ProjectManagementAIEngine.getProjects();

  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState<number>(8);
  const [hourlyRate, setHourlyRate] = useState<number>(60);
  const [taskDescription, setTaskDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);

  if (!isOpen) return null;

  const selectedEmp = employees.find((e) => e.id === employeeId) || employees[0];
  const selectedProj = projects.find((p) => p.id === projectId) || projects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim() || hours <= 0) return;

    onLogTimesheet({
      employeeId: selectedEmp?.id || 'emp_001',
      employeeName: `${selectedEmp?.firstName} ${selectedEmp?.lastName}`.trim(),
      date,
      hours,
      projectId: selectedProj?.id,
      projectName: selectedProj?.name,
      classId: selectedProj?.class,
      className: selectedProj?.class,
      taskDescription,
      isBillable,
      hourlyLaborRate: hourlyRate,
    });
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
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        color: 'var(--color-text-primary, #f1f5f9)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Log Project Labor Timesheet</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Directly allocates job labor cost to Project Management AI
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Employee
              </label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} style={{ background: '#0f172a' }}>
                    {emp.firstName} {emp.lastName} ({emp.jobTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Target Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id} style={{ background: '#0f172a' }}>
                    {proj.name} ({proj.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Hours Logged
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                max="24"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Hourly Labor Rate ($)
              </label>
              <input
                type="number"
                min="10"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Task Description & Milestone Details
            </label>
            <input
              type="text"
              required
              placeholder="e.g. On-site MEP engineering coordination and architectural inspection"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
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

          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}>
            <span>Calculated Direct Labor Cost:</span>
            <strong style={{ fontSize: '15px', color: '#60a5fa' }}>{formatCurrency(hours * hourlyRate)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
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
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              }}
            >
              Post Labor to Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
