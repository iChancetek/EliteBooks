'use client';

import { Users, Plus, Calendar, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

import { useState } from 'react';
import DateFilter from '@/components/DateFilter';

import { BASE_EMPLOYEES } from '@/lib/mockData';

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('Apr');
  const [selectedYear, setSelectedYear] = useState('2026');

  const trendMultiplier = selectedYear === 'All Years' ? 1 : Math.pow(1.05, parseInt(selectedYear) - 2016);
  const activeEmployees = BASE_EMPLOYEES
    .filter(e => selectedYear === 'All Years' || e.startYear <= parseInt(selectedYear))
    .map(e => ({
      ...e,
      salary: Math.round(e.baseSalary * trendMultiplier),
      status: 'active'
    }));
  const totalPayroll = activeEmployees.reduce((s, e) => s + (selectedMonth.startsWith('Wk') ? e.salary : e.salary / 12), 0);

  return (
    <div className="page-payroll">
      <div className="page-header">
        <div>
          <h1>Payroll</h1>
          <p>AI-managed payroll processing, tax deductions, and compliance</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <DateFilter 
            initialMonth={selectedMonth} 
            initialYear={selectedYear} 
            onDateChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }} 
          />
          <button className="btn btn-primary" id="run-payroll-btn"><Plus size={16} /> Run Payroll</button>
        </div>
      </div>

      <div className="pay-summary">
        <div className="glass-card pay-card">
          <DollarSign size={18} style={{ color: '#3b82f6' }} />
          <div>
            <span className="pay-value value-financial">{formatCurrency(totalPayroll)}</span>
            <span className="pay-label">Monthly Payroll</span>
          </div>
        </div>
        <div className="glass-card pay-card">
          <Users size={18} style={{ color: '#10b981' }} />
          <div>
            <span className="pay-value">{activeEmployees.length}</span>
            <span className="pay-label">Employees</span>
          </div>
        </div>
        <div className="glass-card pay-card">
          <Calendar size={18} style={{ color: '#f59e0b' }} />
          <div>
            <span className="pay-value">May 15</span>
            <span className="pay-label">Next Pay Date</span>
          </div>
        </div>
        <div className="glass-card pay-card">
          <CheckCircle2 size={18} style={{ color: '#8b5cf6' }} />
          <div>
            <span className="pay-value">Apr 30</span>
            <span className="pay-label">Last Processed</span>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Department</th>
              <th>Type</th>
              <th>Annual Salary</th>
              <th>Monthly Net</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeEmployees.map(emp => (
              <tr key={emp.id}>
                <td><strong style={{ color: 'var(--color-text-primary)' }}>{emp.name}</strong></td>
                <td>{emp.role}</td>
                <td><span className="badge badge-neutral">{emp.department}</span></td>
                <td>{emp.type}</td>
                <td className="value-financial">{formatCurrency(emp.salary)}</td>
                <td className="value-financial">{formatCurrency(selectedMonth.startsWith('Wk') ? emp.salary : emp.salary / 12 * 0.72)}</td>
                <td><span className="badge badge-positive">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .page-payroll { max-width: 1100px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-8); }
        .page-header h1 { font-size: var(--text-3xl); margin-bottom: var(--space-1); }
        .page-header p { color: var(--color-text-secondary); font-size: var(--text-sm); }
        .pay-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); margin-bottom: var(--space-8); }
        .pay-card { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-5) var(--space-6); }
        .pay-value { display: block; font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--color-text-primary); }
        .pay-label { font-size: var(--text-xs); color: var(--color-text-tertiary); font-weight: var(--weight-medium); }
        @media (max-width: 768px) {
          .page-header { flex-direction: column; gap: var(--space-4); }
          .pay-summary { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
