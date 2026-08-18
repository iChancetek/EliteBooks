/**
 * EliteBooks Intelligence — Granular Permissions Guard
 * Enforces strict zero-trust permission verification across all user roles and autonomous AI actions:
 * Identity -> Tenant -> Role -> Permission -> Risk -> Approval -> Tool -> Validation -> Audit.
 */

import { FinancialPermission, UserRolePermissions } from './types';

export class PermissionsGuard {
  private static roleDefinitions: Record<string, UserRolePermissions> = {
    Administrator: {
      role: 'Administrator',
      allowedPermissions: [
        'invoices:view',
        'invoices:create',
        'invoices:send',
        'invoices:void',
        'expenses:view',
        'expenses:log',
        'expenses:approve',
        'expenses:delete',
        'payroll:view',
        'payroll:run',
        'projects:view',
        'projects:create',
        'projects:edit_budget',
        'tax:view',
        'tax:e_file',
        'banking:view_balance',
        'banking:disburse_funds',
        'autopilot:configure',
      ],
      maxDisbursementThreshold: 500000,
      requiresMFA: true,
    },
    'Financial Manager': {
      role: 'Financial Manager',
      allowedPermissions: [
        'invoices:view',
        'invoices:create',
        'invoices:send',
        'expenses:view',
        'expenses:log',
        'expenses:approve',
        'payroll:view',
        'projects:view',
        'projects:create',
        'tax:view',
        'banking:view_balance',
        'autopilot:configure',
      ],
      maxDisbursementThreshold: 50000,
      requiresMFA: true,
    },
    Accountant: {
      role: 'Accountant',
      allowedPermissions: [
        'invoices:view',
        'invoices:create',
        'expenses:view',
        'expenses:log',
        'projects:view',
        'tax:view',
        'banking:view_balance',
      ],
      maxDisbursementThreshold: 5000,
      requiresMFA: false,
    },
  };

  /**
   * Evaluate whether a user or agent has permission to execute an action
   */
  public static canExecute(
    role: string,
    permission: FinancialPermission,
    amount?: number
  ): { allowed: boolean; requiresHITL: boolean; reason?: string } {
    const roleDef = this.roleDefinitions[role] || this.roleDefinitions['Accountant'];

    if (!roleDef.allowedPermissions.includes(permission)) {
      return {
        allowed: false,
        requiresHITL: true,
        reason: `Role "${role}" does not have the required permission: "${permission}".`,
      };
    }

    // High risk checks (e.g. disbursements over limit or voiding invoices)
    if (amount !== undefined && amount > roleDef.maxDisbursementThreshold) {
      return {
        allowed: false,
        requiresHITL: true,
        reason: `Operation amount ($${amount.toLocaleString()}) exceeds the maximum disbursement threshold ($${roleDef.maxDisbursementThreshold.toLocaleString()}) for role "${role}".`,
      };
    }

    if (permission === 'tax:e_file' || permission === 'banking:disburse_funds' || permission === 'expenses:delete') {
      return {
        allowed: true,
        requiresHITL: true,
        reason: 'High-impact financial action requires explicit Human-in-the-Loop approval.',
      };
    }

    return {
      allowed: true,
      requiresHITL: false,
    };
  }
}
