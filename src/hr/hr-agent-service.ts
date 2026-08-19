/**
 * EliteBooks Financial HR — HR & Workforce Agentic AI Service
 * Manages employee & contractor profiles, PTO balances, project labor timesheets, benefits deductions,
 * and autonomous A2A collaboration with the Payroll Agent, Projects Agent, and Tax Agent.
 */

import {
  HREmployeeProfile,
  PTORequest,
  TimesheetEntry,
  BenefitPlan,
  EmployeeBenefitEnrollment,
  WorkforceSummaryMetrics,
  WorkerClassificationAudit,
} from './types';
import { HRComplianceEngine } from './hr-compliance-engine';
import { StructuredA2AMessage } from '@/types/agent-system';

export class HRAgentService {
  private static defaultEmployees: HREmployeeProfile[] = [
    // ─── 3 W-2 Full-Time Employees ───
    {
      id: 'emp_001',
      employeeNumber: 'EMP-1001',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.chen@elitebooks.io',
      phone: '+1 (555) 234-5678',
      department: 'Engineering & Cloud',
      classId: 'cls_cloud_eng',
      locationId: 'loc_nyc_hq',
      jobTitle: 'Principal Cloud Architect',
      employmentType: 'full_time',
      hireDate: '2025-02-01',
      annualSalary: 165000,
      payFrequency: 'semimonthly',
      w4Status: 'verified',
      i9Status: 'verified',
      directDepositConfigured: true,
      emergencyContactName: 'David Chen',
      emergencyContactPhone: '+1 (555) 234-9999',
      ptoAccruedDays: 18.0,
      ptoUsedDays: 4.0,
      ptoAvailableDays: 14.0,
      createdAt: '2025-02-01T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp_002',
      employeeNumber: 'EMP-1002',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.vance@elitebooks.io',
      phone: '+1 (555) 345-6789',
      department: 'Commercial Construction',
      classId: 'cls_commercial_const',
      locationId: 'loc_nyc_hq',
      jobTitle: 'Lead Project Superintendent',
      employmentType: 'full_time',
      hireDate: '2025-06-15',
      annualSalary: 125000,
      hourlyRate: 60.0,
      payFrequency: 'biweekly',
      w4Status: 'verified',
      i9Status: 'verified',
      directDepositConfigured: true,
      emergencyContactName: 'Elena Vance',
      emergencyContactPhone: '+1 (555) 345-8888',
      ptoAccruedDays: 15.0,
      ptoUsedDays: 3.0,
      ptoAvailableDays: 12.0,
      createdAt: '2025-06-15T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp_003',
      employeeNumber: 'EMP-1003',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.rostova@elitebooks.io',
      phone: '+1 (555) 456-7890',
      department: 'Digital Media & Studio',
      classId: 'cls_digital_infra',
      locationId: 'loc_chicago_studio',
      jobTitle: 'Senior Infrastructure Engineer',
      employmentType: 'full_time',
      hireDate: '2025-09-01',
      annualSalary: 135000,
      payFrequency: 'semimonthly',
      w4Status: 'verified',
      i9Status: 'verified',
      directDepositConfigured: true,
      emergencyContactName: 'Viktor Rostov',
      emergencyContactPhone: '+1 (555) 456-1111',
      ptoAccruedDays: 12.0,
      ptoUsedDays: 2.0,
      ptoAvailableDays: 10.0,
      createdAt: '2025-09-01T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },

    // ─── 4 1099 Independent Contractors ───
    {
      id: 'emp_004',
      employeeNumber: 'CON-2001',
      firstName: 'Liam',
      lastName: 'Gallagher',
      email: 'liam.gallagher@devops-apex.com',
      phone: '+1 (555) 789-1020',
      department: 'Engineering & Cloud',
      classId: 'cls_cloud_eng',
      locationId: 'loc_nyc_hq',
      jobTitle: 'Senior DevOps & SRE Consultant',
      employmentType: 'contractor',
      hireDate: '2025-04-10',
      hourlyRate: 95.0,
      annualSalary: 98800,
      payFrequency: 'monthly',
      w4Status: 'verified', // Form W-9 on file
      i9Status: 'verified',
      directDepositConfigured: true,
      emergencyContactName: 'Fiona Gallagher',
      emergencyContactPhone: '+1 (555) 789-2222',
      ptoAccruedDays: 0,
      ptoUsedDays: 0,
      ptoAvailableDays: 0,
      createdAt: '2025-04-10T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp_005',
      employeeNumber: 'CON-2002',
      firstName: 'Sophia',
      lastName: 'Al-Mansoor',
      email: 'sophia@almansoor-design.io',
      phone: '+1 (555) 890-2345',
      department: 'Product & Design',
      classId: 'cls_digital_infra',
      locationId: 'loc_chicago_studio',
      jobTitle: 'Principal UI/UX Design Lead',
      employmentType: 'contractor',
      hireDate: '2025-07-01',
      hourlyRate: 85.0,
      annualSalary: 72250,
      payFrequency: 'monthly',
      w4Status: 'verified',
      i9Status: 'verified',
      directDepositConfigured: true,
      emergencyContactName: 'Tariq Al-Mansoor',
      emergencyContactPhone: '+1 (555) 890-3333',
      ptoAccruedDays: 0,
      ptoUsedDays: 0,
      ptoAvailableDays: 0,
      createdAt: '2025-07-01T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp_006',
      employeeNumber: 'CON-2003',
      firstName: 'David K.',
      lastName: 'Sterling',
      email: 'dsterling@sterling-mep.com',
      phone: '+1 (555) 901-3456',
      department: 'Commercial Construction',
      classId: 'cls_commercial_const',
      locationId: 'loc_nyc_hq',
      jobTitle: 'Structural MEP Engineering Specialist',
      employmentType: 'contractor',
      hireDate: '2025-08-15',
      hourlyRate: 110.0,
      annualSalary: 114400,
      payFrequency: 'monthly',
      w4Status: 'verified',
      i9Status: 'verified',
      directDepositConfigured: true,
      emergencyContactName: 'Katherine Sterling',
      emergencyContactPhone: '+1 (555) 901-4444',
      ptoAccruedDays: 0,
      ptoUsedDays: 0,
      ptoAvailableDays: 0,
      createdAt: '2025-08-15T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp_007',
      employeeNumber: 'CON-2004',
      firstName: 'Amara',
      lastName: 'Okafor',
      email: 'amara@okafor-taxadvisors.com',
      phone: '+1 (555) 012-4567',
      department: 'Finance & Legal',
      classId: 'cls_finance_ops',
      locationId: 'loc_nyc_hq',
      jobTitle: 'Tax Compliance & 1099 Auditor',
      employmentType: 'contractor',
      hireDate: '2025-11-01',
      hourlyRate: 75.0,
      annualSalary: 45000,
      payFrequency: 'monthly',
      w4Status: 'verified',
      i9Status: 'verified',
      directDepositConfigured: true,
      emergencyContactName: 'Chidi Okafor',
      emergencyContactPhone: '+1 (555) 012-5555',
      ptoAccruedDays: 0,
      ptoUsedDays: 0,
      ptoAvailableDays: 0,
      createdAt: '2025-11-01T09:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];

  private static defaultPTORequests: PTORequest[] = [
    {
      id: 'pto_req_001',
      employeeId: 'emp_001',
      employeeName: 'Sarah Chen',
      type: 'vacation',
      startDate: '2026-04-10',
      endDate: '2026-04-14',
      totalHours: 24,
      reason: 'Annual family vacation',
      status: 'pending',
      requestedAt: '2026-03-10T14:30:00Z',
    },
    {
      id: 'pto_req_002',
      employeeId: 'emp_002',
      employeeName: 'Marcus Vance',
      type: 'sick',
      startDate: '2026-02-18',
      endDate: '2026-02-19',
      totalHours: 16,
      reason: 'Medical recovery',
      status: 'approved',
      requestedAt: '2026-02-17T08:00:00Z',
      reviewedBy: 'Operations Manager',
      reviewedAt: '2026-02-17T09:30:00Z',
    },
  ];

  private static defaultTimesheets: TimesheetEntry[] = [
    {
      id: 'ts_001',
      employeeId: 'emp_002',
      employeeName: 'Marcus Vance',
      date: '2026-03-16',
      hours: 8,
      projectId: 'proj_hudson_reno',
      projectName: 'Hudson Commercial Office Renovation',
      classId: 'cls_commercial_const',
      className: 'Commercial Construction',
      taskDescription: 'On-site HVAC ductwork supervision and subcontractor coordination',
      isBillable: true,
      hourlyLaborRate: 60.0,
      totalLaborCost: 480.0,
      status: 'allocated_to_project',
      createdAt: '2026-03-16T17:00:00Z',
    },
    {
      id: 'ts_002',
      employeeId: 'emp_003',
      employeeName: 'Elena Rostova',
      date: '2026-03-16',
      hours: 8,
      projectId: 'proj_wndr_hq',
      projectName: 'WNDR Studio Infrastructure & Buildout',
      classId: 'cls_digital_infra',
      className: 'Digital Infrastructure',
      taskDescription: 'Low-voltage studio broadcast network calibration and server rack deployment',
      isBillable: true,
      hourlyLaborRate: 65.0,
      totalLaborCost: 520.0,
      status: 'manager_approved',
      createdAt: '2026-03-16T17:30:00Z',
    },
    {
      id: 'ts_003',
      employeeId: 'emp_004',
      employeeName: 'Liam Gallagher (Contractor)',
      date: '2026-03-16',
      hours: 6,
      projectId: 'proj_apex_cloud',
      projectName: 'Apex Cloud Migration & Kubernetes Overhaul',
      classId: 'cls_cloud_eng',
      className: 'Engineering & Cloud',
      taskDescription: 'Terraform multi-region cluster automation & observability logging setup',
      isBillable: true,
      hourlyLaborRate: 95.0,
      totalLaborCost: 570.0,
      status: 'allocated_to_project',
      createdAt: '2026-03-16T18:00:00Z',
    },
    {
      id: 'ts_004',
      employeeId: 'emp_006',
      employeeName: 'David K. Sterling (Contractor)',
      date: '2026-03-16',
      hours: 7,
      projectId: 'proj_hudson_reno',
      projectName: 'Hudson Commercial Office Renovation',
      classId: 'cls_commercial_const',
      className: 'Commercial Construction',
      taskDescription: 'Mechanical engineering MEP structural load calculations and permit review',
      isBillable: true,
      hourlyLaborRate: 110.0,
      totalLaborCost: 770.0,
      status: 'allocated_to_project',
      createdAt: '2026-03-16T18:30:00Z',
    },
  ];

  private static defaultBenefitPlans: BenefitPlan[] = [
    {
      id: 'bp_health_gold',
      name: 'Executive Premier Health (PPO)',
      type: 'health_insurance',
      provider: 'Blue Cross Blue Shield',
      description: 'Comprehensive medical coverage with $500 deductible and $10 copay',
      isPreTax: true,
      employeeMonthlyCost: 180.0,
      employerMonthlyMatch: 620.0,
      ledgerLiabilityAccount: 'Account 2200 - Payroll Liabilities',
      ledgerExpenseAccount: 'Account 5100 - Employee Benefits',
    },
    {
      id: 'bp_401k_match',
      name: 'Safe Harbor 401(k) Plan',
      type: '401k_retirement',
      provider: 'Fidelity Investments',
      description: 'Pre-tax retirement savings with 4% dollar-for-dollar employer matching',
      isPreTax: true,
      employeeMonthlyCost: 450.0,
      employerMonthlyMatch: 450.0,
      ledgerLiabilityAccount: 'Account 2200 - Payroll Liabilities',
      ledgerExpenseAccount: 'Account 5100 - Employee Benefits',
    },
    {
      id: 'bp_dental_vision',
      name: 'Comprehensive Dental & Vision Care',
      type: 'dental',
      provider: 'Delta Dental',
      description: 'Preventative and major dental care plus annual vision exam and hardware credit',
      isPreTax: true,
      employeeMonthlyCost: 35.0,
      employerMonthlyMatch: 85.0,
      ledgerLiabilityAccount: 'Account 2200 - Payroll Liabilities',
      ledgerExpenseAccount: 'Account 5100 - Employee Benefits',
    },
  ];

  public static getEmployees(): HREmployeeProfile[] {
    return JSON.parse(JSON.stringify(this.defaultEmployees));
  }

  public static getPTORequests(): PTORequest[] {
    return JSON.parse(JSON.stringify(this.defaultPTORequests));
  }

  public static getTimesheets(): TimesheetEntry[] {
    return JSON.parse(JSON.stringify(this.defaultTimesheets));
  }

  public static getBenefitPlans(): BenefitPlan[] {
    return JSON.parse(JSON.stringify(this.defaultBenefitPlans));
  }

  /**
   * Submit new PTO request
   */
  public static requestPTO(request: Omit<PTORequest, 'id' | 'status' | 'requestedAt'>): PTORequest {
    const newReq: PTORequest = {
      ...request,
      id: `pto_req_${Date.now()}`,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    this.defaultPTORequests.unshift(newReq);
    return newReq;
  }

  /**
   * Approve PTO Request and dispatch A2A synchronization event to Payroll Agent
   */
  public static approvePTO(
    requestId: string,
    reviewerName: string = 'Financial HR Manager'
  ): { ptoRequest: PTORequest | null; a2aMessage: StructuredA2AMessage | null } {
    const req = this.defaultPTORequests.find((r) => r.id === requestId);
    if (!req) return { ptoRequest: null, a2aMessage: null };

    req.status = 'approved';
    req.reviewedBy = reviewerName;
    req.reviewedAt = new Date().toISOString();

    // Deduct available days from employee
    const emp = this.defaultEmployees.find((e) => e.id === req.employeeId);
    if (emp && emp.employmentType !== 'contractor') {
      const days = req.totalHours / 8;
      emp.ptoUsedDays += days;
      emp.ptoAvailableDays = Math.max(0, emp.ptoAccruedDays - emp.ptoUsedDays);
    }

    // Dispatch A2A Message to Payroll Agent
    const a2aMessage: StructuredA2AMessage = {
      messageId: `a2a_hr_pto_${Date.now()}`,
      agentId: 'HR Agent',
      targetAgentId: 'Payroll Agent',
      taskId: `sync_pto_${req.employeeId}`,
      source: 'HRAgentService.approvePTO',
      event: 'PTO_APPROVED_READY_FOR_PAYROLL',
      data: {
        employeeId: req.employeeId,
        employeeName: req.employeeName,
        ptoType: req.type,
        hours: req.totalHours,
        startDate: req.startDate,
        endDate: req.endDate,
      },
      confidence: 1.0,
      recommendation: `Credit ${req.totalHours} hours of ${req.type} PTO into upcoming payroll cycle for ${req.employeeName}.`,
      financialImpact: 0,
      approvalStatus: 'approved',
      timestamp: new Date().toISOString(),
    };

    return { ptoRequest: { ...req }, a2aMessage };
  }

  /**
   * Log billable project timesheet and dispatch A2A job costing event to Projects Agent
   */
  public static logTimesheet(
    entry: Omit<TimesheetEntry, 'id' | 'totalLaborCost' | 'status' | 'createdAt'>
  ): { timesheet: TimesheetEntry; a2aMessage: StructuredA2AMessage } {
    const totalLaborCost = entry.hours * entry.hourlyLaborRate;
    const newEntry: TimesheetEntry = {
      ...entry,
      id: `ts_${Date.now()}`,
      totalLaborCost,
      status: 'allocated_to_project',
      createdAt: new Date().toISOString(),
    };

    this.defaultTimesheets.unshift(newEntry);

    // Dispatch A2A Message to Projects Agent
    const a2aMessage: StructuredA2AMessage = {
      messageId: `a2a_hr_labor_${Date.now()}`,
      agentId: 'HR Agent',
      targetAgentId: 'Projects Agent',
      taskId: `allocate_labor_${entry.projectId || 'general'}`,
      source: 'HRAgentService.logTimesheet',
      event: 'PROJECT_LABOR_HOURS_LOGGED',
      data: {
        projectId: entry.projectId,
        projectName: entry.projectName,
        employeeName: entry.employeeName,
        hours: entry.hours,
        hourlyRate: entry.hourlyLaborRate,
        totalLaborCost,
      },
      confidence: 0.98,
      recommendation: `Allocate $${totalLaborCost.toFixed(2)} in direct labor costs to ${entry.projectName || 'Project'}.`,
      financialImpact: -totalLaborCost,
      approvalStatus: 'approved',
      timestamp: new Date().toISOString(),
    };

    return { timesheet: newEntry, a2aMessage };
  }

  /**
   * Compute workforce executive summary metrics
   */
  public static getWorkforceMetrics(): WorkforceSummaryMetrics {
    const all = this.defaultEmployees;
    const w2Employees = all.filter((e) => e.employmentType === 'full_time' || e.employmentType === 'part_time');
    const contractors = all.filter((e) => e.employmentType === 'contractor');

    const totalSalaries = w2Employees.reduce((s, e) => s + (e.annualSalary || 0), 0);
    const monthlyGrossPayroll = totalSalaries / 12;

    const totalMonthlyBenefits = this.defaultBenefitPlans.reduce(
      (s, bp) => s + bp.employerMonthlyMatch * w2Employees.length,
      0
    );

    const pendingPTO = this.defaultPTORequests.filter((r) => r.status === 'pending').length;
    const docCompliance = HRComplianceEngine.auditTaxDocumentCompliance(all);

    return {
      totalHeadcount: w2Employees.length,
      fullTimeCount: w2Employees.filter((e) => e.employmentType === 'full_time').length,
      partTimeCount: w2Employees.filter((e) => e.employmentType === 'part_time').length,
      contractorCount: contractors.length,
      totalMonthlyPayrollDisbursement: Math.round(monthlyGrossPayroll),
      totalMonthlyBenefitsCost: Math.round(totalMonthlyBenefits),
      averageFullyLoadedLaborRate: 78.50,
      benefitsBurdenRatioPercent: monthlyGrossPayroll > 0
        ? parseFloat(((totalMonthlyBenefits / monthlyGrossPayroll) * 100).toFixed(1))
        : 0,
      activePendingPTORequests: pendingPTO,
      w4ComplianceRatePercent: docCompliance.w4ComplianceRate,
    };
  }

  /**
   * Audit contractor classification risk
   */
  public static auditWorkerClassificationRisk(): WorkerClassificationAudit[] {
    const sampleContractors = [
      { name: 'Liam Gallagher (DevOps Consultant)', totalPaid: 62000, invoiceCount: 14, isExclusive: true },
      { name: 'David K. Sterling (MEP Specialist)', totalPaid: 26000, invoiceCount: 4, isExclusive: false },
      { name: 'Sophia Al-Mansoor (UI/UX Lead)', totalPaid: 18400, invoiceCount: 3, isExclusive: false },
      { name: 'Amara Okafor (Tax Auditor)', totalPaid: 4500, invoiceCount: 2, isExclusive: false },
    ];
    return HRComplianceEngine.auditWorkerClassifications(sampleContractors);
  }
}
