'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Calendar, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import DateFilter from '@/components/DateFilter';
import { useAuth } from '@/hooks/useAuth';

export default function PayrollPage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [employees, setEmployees] = useState<any[]>([]);
  const [paystubs, setPaystubs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: 'Engineering',
    employmentType: 'full_time',
    salary: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch employees
      const empRes = await fetch('/api/payroll');
      const empData = await empRes.json();
      if (empData.success) {
        setEmployees(empData.data);
      }

      // Fetch paystubs
      const stubRes = await fetch(`/api/payroll?type=paystubs&year=${selectedYear}&month=${selectedMonth}`);
      const stubData = await stubRes.json();
      if (stubData.success) {
        setPaystubs(stubData.data);
      }
    } catch (e) {
      console.error('Failed to fetch payroll data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRunPayroll = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_payroll' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.error || 'Failed to run payroll');
      }
    } catch (e) {
      console.error(e);
      alert('Error running payroll');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEmployee,
          salary: parseFloat(newEmployee.salary),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmployees(prev => [...prev, data.data]);
        setIsModalOpen(false);
        setNewEmployee({
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          department: 'Engineering',
          employmentType: 'full_time',
          salary: '',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalPayroll = paystubs.reduce((s, stub) => s + (stub.grossPay || 0), 0);

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
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Add Employee</button>
          <button className="btn btn-primary" id="run-payroll-btn" onClick={handleRunPayroll} disabled={isLoading || employees.length === 0}>
            <Plus size={16} /> Run Payroll
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsModalOpen(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleAddEmployee} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="input" value={newEmployee.firstName} onChange={e => setNewEmployee({...newEmployee, firstName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="input" value={newEmployee.lastName} onChange={e => setNewEmployee({...newEmployee, lastName: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="input" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" className="input" placeholder="e.g. Developer" value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Salary (Annual)</label>
                  <input type="number" className="input" placeholder="e.g. 80000" value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select className="input" value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})}>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Employment Type</label>
                  <select className="input" value={newEmployee.employmentType} onChange={e => setNewEmployee({...newEmployee, employmentType: e.target.value})}>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contractor">Contractor</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pay-summary">
        <div className="glass-card pay-card">
          <DollarSign size={18} style={{ color: '#3b82f6' }} />
          <div>
            <span className="pay-value value-financial">{formatCurrency(totalPayroll)}</span>
            <span className="pay-label">Monthly Gross Payroll</span>
          </div>
        </div>
        <div className="glass-card pay-card">
          <Users size={18} style={{ color: '#10b981' }} />
          <div>
            <span className="pay-value">{employees.length}</span>
            <span className="pay-label">Employees</span>
          </div>
        </div>
        <div className="glass-card pay-card">
          <Calendar size={18} style={{ color: '#f59e0b' }} />
          <div>
            <span className="pay-value">{paystubs.length > 0 ? paystubs[0].payDate : 'No Runs'}</span>
            <span className="pay-label">Last Pay Date</span>
          </div>
        </div>
        <div className="glass-card pay-card">
          <CheckCircle2 size={18} style={{ color: '#8b5cf6' }} />
          <div>
            <span className="pay-value">{paystubs.length}</span>
            <span className="pay-label">Processed Stubs</span>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Employees</h3>
        <table className="table" style={{ marginBottom: 'var(--space-8)' }}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Department</th>
              <th>Type</th>
              <th>Annual Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-tertiary)' }}>No employees yet. Click &quot;Add Employee&quot; to get started.</td></tr>
            ) : employees.map(emp => (
              <tr key={emp.id}>
                <td><strong style={{ color: 'var(--color-text-primary)' }}>{emp.firstName} {emp.lastName}</strong></td>
                <td>{emp.role}</td>
                <td><span className="badge badge-neutral">{emp.department}</span></td>
                <td>{emp.employmentType === 'full_time' ? 'Full Time' : emp.employmentType === 'part_time' ? 'Part Time' : 'Contractor'}</td>
                <td className="value-financial">{formatCurrency(emp.salary)}</td>
                <td><span className="badge badge-positive">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        {paystubs.length > 0 && (
          <>
            <h3>Paystubs for {selectedMonth} {selectedYear}</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Gross Pay</th>
                  <th>Taxes</th>
                  <th>Net Pay</th>
                  <th>Pay Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paystubs.map(stub => (
                  <tr key={stub.id}>
                    <td><strong style={{ color: 'var(--color-text-primary)' }}>{stub.employeeName}</strong></td>
                    <td className="value-financial">{formatCurrency(stub.grossPay)}</td>
                    <td className="value-financial" style={{ color: 'var(--color-negative)' }}>-{formatCurrency(stub.federalTax + stub.stateTax + stub.socialSecurity + stub.medicare)}</td>
                    <td className="value-financial value-positive">{formatCurrency(stub.netPay)}</td>
                    <td>{stub.payDate}</td>
                    <td><span className="badge badge-positive">Processed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
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
