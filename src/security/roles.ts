/**
 * EliteBooks — Granular Role-Based Access Control (RBAC)
 * Defines permissions for Administrator, Financial Manager, Accountant, Payroll Manager,
 * Business Manager, and AI Agent.
 */

import { UserRole } from '@/types/agent-system';

export type Permission =
  | 'read:ledger'
  | 'write:ledger'
  | 'read:invoices'
  | 'write:invoices'
  | 'approve:invoices'
  | 'read:expenses'
  | 'write:expenses'
  | 'read:payroll'
  | 'write:payroll'
  | 'approve:payroll'
  | 'read:customers'
  | 'write:customers'
  | 'read:projects'
  | 'write:projects'
  | 'read:reports'
  | 'execute:mcp_tool'
  | 'approve:hitl_action'
  | 'admin:manage_users';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Administrator: [
    'read:ledger',
    'write:ledger',
    'read:invoices',
    'write:invoices',
    'approve:invoices',
    'read:expenses',
    'write:expenses',
    'read:payroll',
    'write:payroll',
    'approve:payroll',
    'read:customers',
    'write:customers',
    'read:projects',
    'write:projects',
    'read:reports',
    'execute:mcp_tool',
    'approve:hitl_action',
    'admin:manage_users',
  ],

  'Financial Manager': [
    'read:ledger',
    'write:ledger',
    'read:invoices',
    'write:invoices',
    'approve:invoices',
    'read:expenses',
    'write:expenses',
    'read:payroll',
    'approve:payroll',
    'read:customers',
    'write:customers',
    'read:projects',
    'write:projects',
    'read:reports',
    'execute:mcp_tool',
    'approve:hitl_action',
  ],

  Accountant: [
    'read:ledger',
    'write:ledger',
    'read:invoices',
    'write:invoices',
    'read:expenses',
    'write:expenses',
    'read:reports',
    'execute:mcp_tool',
  ],

  'Payroll Manager': [
    'read:payroll',
    'write:payroll',
    'approve:payroll',
    'read:expenses',
    'read:reports',
  ],

  'Business Manager': [
    'read:invoices',
    'write:invoices',
    'read:customers',
    'write:customers',
    'read:projects',
    'write:projects',
    'read:reports',
  ],

  'AI Agent': [
    'read:ledger',
    'read:invoices',
    'read:expenses',
    'read:customers',
    'read:projects',
    'read:payroll',
    'read:reports',
    'execute:mcp_tool',
  ],
};

/**
 * Verify whether a role possesses a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Validate MCP tool invocation permission for a given role
 */
export function validateToolAccess(
  role: UserRole,
  toolName: string,
  requiresApproval: boolean
): { allowed: boolean; reason?: string } {
  if (!hasPermission(role, 'execute:mcp_tool')) {
    return { allowed: false, reason: `Role ${role} lacks permission to execute MCP tools.` };
  }

  // If tool operation requires human approval and caller is AI Agent, block execution until approved
  if (requiresApproval && role === 'AI Agent') {
    return {
      allowed: false,
      reason: `Tool "${toolName}" requires explicit Human-in-the-Loop authorization before execution.`,
    };
  }

  return { allowed: true };
}
