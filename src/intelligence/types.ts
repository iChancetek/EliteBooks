/**
 * EliteBooks Intelligence — Core Type Definitions & Schemas
 * Comprehensive types for Project Management AI, Construction Financials,
 * Books Quality AI, Finance AI, Custom KPIs, Classes, Locations,
 * Automations, Receipts, Mileage, Batch Operations, Excel Sync, 1099, and Permissions.
 */

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
export type ProjectType = 'standard' | 'construction' | 'consulting' | 'internal';

export interface ProjectChangeOrder {
  id: string;
  orderNumber: string;
  description: string;
  amount: number;
  approvedDate?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface ProjectCostBreakdown {
  labor: number;
  materials: number;
  subcontractors: number;
  equipment: number;
  overhead: number;
  other: number;
}

export interface ProjectFinancials {
  id: string;
  name: string;
  code: string;
  type: ProjectType;
  customer: string;
  customerId?: string;
  location?: string;
  class?: string;
  status: ProjectStatus;
  startDate: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  
  // Financial Core
  contractAmount: number;
  estimatedRevenue: number;
  budgetCost: number;
  actualRevenue: number;
  actualCost: number;
  forecastCostToComplete: number; // ETC
  estimatedTotalCostAtCompletion: number; // EAC
  grossProfit: number;
  grossMarginPercent: number;
  
  // Construction Specifics
  retainagePercent?: number;
  retainageWithheld?: number;
  billedToDate?: number;
  collectedToDate?: number;
  changeOrders: ProjectChangeOrder[];
  costBreakdown: ProjectCostBreakdown;
  
  // AI Diagnostics
  aiConfidenceScore: number;
  isOverBudget: boolean;
  budgetVariance: number;
  aiRecommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAllocationRecommendation {
  transactionId: string;
  transactionDescription: string;
  amount: number;
  date: string;
  recommendedProjectId: string;
  recommendedProjectName: string;
  recommendedCategory: keyof ProjectCostBreakdown;
  confidenceScore: number;
  rationale: string;
  status: 'pending' | 'applied' | 'dismissed';
}

export interface NewProjectProposal {
  proposedName: string;
  suggestedCustomer: string;
  estimatedRevenue: number;
  estimatedCost: number;
  signals: string[];
  confidenceScore: number;
  status: 'proposed' | 'approved' | 'rejected';
}

// ═══════════════════════════════════════════
// 2. BOOKS QUALITY AI & QUARTERLY INTELLIGENCE
// ═══════════════════════════════════════════

export type QualityFindingSeverity = 'critical' | 'warning' | 'info';

export interface BooksQualityFinding {
  id: string;
  category: 'duplicate_expense' | 'duplicate_invoice' | 'uncategorized_transaction' | 'missing_receipt' | 'unallocated_project_cost' | 'unusual_spend' | 'reconciliation_gap';
  title: string;
  description: string;
  severity: QualityFindingSeverity;
  affectedEntityId?: string;
  affectedAmount?: number;
  evidence: string[];
  recommendedAction: string;
  status: 'open' | 'resolved' | 'ignored';
  detectedAt: string;
}

export interface QuarterlyBooksReport {
  quarter: string; // e.g. "Q1 2026", "Q2 2026"
  healthScore: number; // 0 to 100
  totalReviewedTransactions: number;
  uncategorizedCount: number;
  duplicateCount: number;
  unallocatedCostAmount: number;
  receiptCompliancePercent: number;
  keyFindings: BooksQualityFinding[];
  executiveSummary: string[];
  recommendedActions: string[];
  generatedAt: string;
}

// ═══════════════════════════════════════════
// 3. FINANCE AI & 5-PILLAR PERSONALIZED INSIGHTS
// ═══════════════════════════════════════════

export interface FinanceInsight5Pillars {
  id: string;
  title: string;
  category: 'revenue' | 'expense' | 'profitability' | 'cash_flow' | 'margins' | 'vendor' | 'project';
  whatHappened: string;
  whyItMatters: string;
  supportingData: string[];
  recommendedAction: string;
  confidenceScore: number; // 0.0 to 1.0
  severity: 'opportunity' | 'neutral' | 'caution' | 'alert';
  createdAt: string;
}

// ═══════════════════════════════════════════
// 4. CUSTOM KPI BUILDER & METRICS
// ═══════════════════════════════════════════

export type KPIVisualization = 'number' | 'currency' | 'percent' | 'progress_bar' | 'sparkline' | 'badge';

export interface CustomKPI {
  id: string;
  name: string;
  description: string;
  formula: string; // e.g. "Revenue - ProjectCosts", "(GrossProfit / Revenue) * 100"
  dataSource: 'general_ledger' | 'invoices' | 'expenses' | 'projects' | 'payroll' | 'inventory';
  period: 'all_time' | 'current_year' | 'current_quarter' | 'current_month' | 'trailing_30_days';
  currentValue: number;
  targetValue?: number;
  warningThreshold?: number;
  alertThreshold?: number;
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly';
  visualization: KPIVisualization;
  isAlertActive: boolean;
  alertMessage?: string;
  classScope?: string;
  locationScope?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════
// 5. UNLIMITED CLASSES & LOCATIONS
// ═══════════════════════════════════════════

export interface FinancialClass {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentClassId?: string;
  isActive: boolean;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  createdAt: string;
}

export interface FinancialLocation {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  type: 'office' | 'warehouse' | 'retail_store' | 'job_site' | 'region';
  isActive: boolean;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  createdAt: string;
}

// ═══════════════════════════════════════════
// 6. WORKFLOW AUTOMATION & AI AUTOPILOT
// ═══════════════════════════════════════════

export type AutomationTrigger =
  | 'on_new_expense'
  | 'on_new_invoice'
  | 'on_schedule_weekly'
  | 'on_schedule_monthly'
  | 'on_budget_exceeded'
  | 'on_vendor_price_spike';

export type AutomationAction =
  | 'auto_categorize'
  | 'auto_allocate_project'
  | 'send_payment_reminder'
  | 'generate_weekly_report'
  | 'route_for_hitl_approval'
  | 'create_alert_notification';

export interface WorkflowAutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  condition: {
    field?: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'confidence_gte';
    value: string | number;
  };
  action: AutomationAction;
  requiresHITLApproval: boolean;
  isEnabled: boolean;
  executionCount: number;
  lastExecutedAt?: string;
  auditTrail: Array<{
    executedAt: string;
    status: 'success' | 'failed' | 'paused_for_approval';
    details: string;
  }>;
  createdAt: string;
}

// ═══════════════════════════════════════════
// 7. AI RECEIPT TRACKING & OCR PIPELINE
// ═══════════════════════════════════════════

export interface ReceiptExtractionResult {
  id: string;
  fileName: string;
  fileUrl?: string;
  merchant: string;
  date: string;
  totalAmount: number;
  taxAmount?: number;
  suggestedCategory: string;
  confidenceScore: number;
  paymentMethodDetected?: string;
  suggestedProjectId?: string;
  suggestedClassId?: string;
  suggestedLocationId?: string;
  status: 'extracted' | 'pending_user_review' | 'approved_and_logged' | 'rejected';
  rawText?: string;
  createdAt: string;
}

// ═══════════════════════════════════════════
// 8. AI MILEAGE & BUSINESS TRAVEL TRACKING
// ═══════════════════════════════════════════

export interface MileageTripLog {
  id: string;
  date: string;
  origin: string;
  destination: string;
  distanceMiles: number;
  businessPurpose: string;
  isBusiness: boolean;
  ratePerMile: number; // e.g. $0.67 standard IRS rate
  totalDeductionAmount: number;
  projectId?: string;
  classId?: string;
  locationId?: string;
  status: 'logged' | 'reconciled_as_expense' | 'personal_archived';
  createdAt: string;
}

// ═══════════════════════════════════════════
// 9. BATCH OPERATIONS
// ═══════════════════════════════════════════

export interface BatchOperationItem {
  id: string;
  type: 'invoice' | 'expense' | 'project_allocation';
  summary: string;
  amount: number;
  status: 'valid' | 'requires_review' | 'duplicate_warning';
  data: Record<string, any>;
}

export interface BatchOperationPreview {
  batchId: string;
  totalItems: number;
  validCount: number;
  reviewCount: number;
  duplicateCount: number;
  totalDollarVolume: number;
  items: BatchOperationItem[];
}

// ═══════════════════════════════════════════
// 10. EXCEL SYNCHRONIZATION
// ═══════════════════════════════════════════

export interface ExcelFieldMapping {
  sourceColumn: string;
  targetField: string;
  isRequired: boolean;
  defaultValue?: any;
}

export interface ExcelSyncPreview {
  fileName: string;
  totalRows: number;
  parsedRecords: Array<Record<string, any>>;
  fieldMappings: ExcelFieldMapping[];
  warnings: string[];
  duplicateCount: number;
}

// ═══════════════════════════════════════════
// 11. 1099 VENDOR COMPLIANCE
// ═══════════════════════════════════════════

export interface Vendor1099Status {
  vendorId: string;
  vendorName: string;
  tinOrEinProvided: boolean;
  w9OnFile: boolean;
  totalNonEmployeeCompensation: number; // $600+ triggers 1099-NEC
  is1099Reportable: boolean;
  formType: '1099-NEC' | '1099-MISC';
  filingStatus: 'review_needed' | 'ready_for_approval' | 'draft_prepared' | 'filed';
  missingFields: string[];
}

// ═══════════════════════════════════════════
// 12. GRANULAR USER & AGENT PERMISSIONS
// ═══════════════════════════════════════════

export type FinancialPermission =
  | 'invoices:view'
  | 'invoices:create'
  | 'invoices:send'
  | 'invoices:void'
  | 'expenses:view'
  | 'expenses:log'
  | 'expenses:approve'
  | 'expenses:delete'
  | 'payroll:view'
  | 'payroll:run'
  | 'projects:view'
  | 'projects:create'
  | 'projects:edit_budget'
  | 'tax:view'
  | 'tax:e_file'
  | 'banking:view_balance'
  | 'banking:disburse_funds'
  | 'autopilot:configure';

export interface UserRolePermissions {
  role: string;
  allowedPermissions: FinancialPermission[];
  maxDisbursementThreshold: number;
  requiresMFA: boolean;
}
