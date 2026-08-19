/**
 * EliteBooks Financial HR & Workforce Module — Types & Schemas
 * Type definitions for Employee HR profiles, PTO balances & requests, project timesheets,
 * benefits & pre-tax deductions, and IRS worker classification audits.
 */

export type EmploymentType = 'full_time' | 'part_time' | 'contractor' | 'seasonal';
export type PTOType = 'vacation' | 'sick' | 'personal' | 'bereavement' | 'parental';
export type PTOStatus = 'pending' | 'approved' | 'rejected' | 'posted_to_payroll';
export type BenefitType = 'health_insurance' | 'dental' | 'vision' | '401k_retirement' | 'hsa_fsa' | 'commuter';

export interface HREmployeeProfile {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  classId?: string;
  locationId?: string;
  jobTitle: string;
  employmentType: EmploymentType;
  hireDate: string;
  annualSalary?: number;
  hourlyRate?: number;
  payFrequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
  
  // Tax & Legal Compliance
  w4Status: 'verified' | 'pending' | 'exempt';
  i9Status: 'verified' | 'pending' | 'expired';
  directDepositConfigured: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Balances
  ptoAccruedDays: number;
  ptoUsedDays: number;
  ptoAvailableDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface PTORequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: PTOType;
  startDate: string;
  endDate: string;
  totalHours: number;
  reason?: string;
  status: PTOStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  payrollRunId?: string;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  hours: number;
  projectId?: string;
  projectName?: string;
  classId?: string;
  className?: string;
  taskDescription: string;
  isBillable: boolean;
  hourlyLaborRate: number;
  totalLaborCost: number;
  status: 'logged' | 'manager_approved' | 'allocated_to_project';
  createdAt: string;
}

export interface BenefitPlan {
  id: string;
  name: string;
  type: BenefitType;
  provider: string;
  description: string;
  isPreTax: boolean;
  employeeMonthlyCost: number;
  employerMonthlyMatch: number;
  ledgerLiabilityAccount: string; // e.g. "Account 2200 - Payroll Liabilities"
  ledgerExpenseAccount: string; // e.g. "Account 5100 - Employee Benefits"
}

export interface EmployeeBenefitEnrollment {
  id: string;
  employeeId: string;
  employeeName: string;
  benefitPlanId: string;
  planName: string;
  type: BenefitType;
  employeeMonthlyDeduction: number;
  employerMonthlyContribution: number;
  isPreTax: boolean;
  effectiveDate: string;
  status: 'active' | 'waived' | 'terminated';
}

export interface WorkerClassificationAudit {
  contractorId: string;
  contractorName: string;
  totalPaymentsAnnual: number;
  contractType: string;
  behavioralControlScore: number; // 0 (independent) to 100 (employee-like)
  financialControlScore: number;
  relationshipTypeScore: number;
  overallIndependenceScore: number;
  classificationRisk: 'low_risk_contractor' | 'moderate_review_recommended' | 'high_risk_misclassification';
  reasons: string[];
  recommendedRemediation: string;
}

export interface WorkforceSummaryMetrics {
  totalHeadcount: number;
  fullTimeCount: number;
  partTimeCount: number;
  contractorCount: number;
  totalMonthlyPayrollDisbursement: number;
  totalMonthlyBenefitsCost: number;
  averageFullyLoadedLaborRate: number;
  benefitsBurdenRatioPercent: number; // (Benefits / Wages) * 100
  activePendingPTORequests: number;
  w4ComplianceRatePercent: number;
}
