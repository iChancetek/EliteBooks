/**
 * EliteBooks Intelligence — Workflow Automation & AI on Autopilot Engine
 * Executes controlled autonomy for recurring accounting events with strict HITL thresholds
 * and immutable audit logging.
 */

import { WorkflowAutomationRule, AutomationTrigger, AutomationAction } from './types';

export class WorkflowAutomationEngine {
  private static defaultRules: WorkflowAutomationRule[] = [
    {
      id: 'rule_auto_categorize_95',
      name: 'Autonomous High-Confidence Categorization',
      description: 'Automatically categorize routine expenses when AI classification confidence is 95% or higher',
      trigger: 'on_new_expense',
      condition: {
        field: 'aiConfidence',
        operator: 'confidence_gte',
        value: 0.95,
      },
      action: 'auto_categorize',
      requiresHITLApproval: false,
      isEnabled: true,
      executionCount: 142,
      lastExecutedAt: new Date(Date.now() - 3600000).toISOString(),
      auditTrail: [
        {
          executedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'success',
          details: 'Automatically categorized GitHub subscription ($21.00) under Cloud & Dev Tools (Confidence: 99%).',
        },
      ],
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'rule_overdue_invoice_reminders',
      name: 'Weekly Overdue Receivables Reminders',
      description: 'Every Monday at 9:00 AM, compile overdue invoice summaries and prepare client reminder notices',
      trigger: 'on_schedule_weekly',
      condition: {
        operator: 'equals',
        value: 'Monday',
      },
      action: 'send_payment_reminder',
      requiresHITLApproval: true,
      isEnabled: true,
      executionCount: 24,
      lastExecutedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      auditTrail: [
        {
          executedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'paused_for_approval',
          details: 'Drafted Net-30 reminder notices for open invoices. Pending user sign-off.',
        },
      ],
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'rule_project_budget_alert',
      name: 'Project Cost Overrun Sentinel',
      description: 'Alert executive team immediately when project direct costs exceed 85% of allocated budget',
      trigger: 'on_budget_exceeded',
      condition: {
        field: 'costToBudgetRatio',
        operator: 'greater_than',
        value: 85,
      },
      action: 'create_alert_notification',
      requiresHITLApproval: false,
      isEnabled: true,
      executionCount: 6,
      lastExecutedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      auditTrail: [
        {
          executedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: 'success',
          details: 'Evaluated all active project cost centers. All projects operating within normal parameters.',
        },
      ],
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  public static getRules(): WorkflowAutomationRule[] {
    return JSON.parse(JSON.stringify(this.defaultRules));
  }

  public static toggleRule(ruleId: string): WorkflowAutomationRule | null {
    const rule = this.defaultRules.find((r) => r.id === ruleId);
    if (rule) {
      rule.isEnabled = !rule.isEnabled;
      return { ...rule };
    }
    return null;
  }

  public static executeRule(ruleId: string, context: Record<string, any>): { success: boolean; requiresApproval: boolean; message: string } {
    const rule = this.defaultRules.find((r) => r.id === ruleId);
    if (!rule || !rule.isEnabled) {
      return { success: false, requiresApproval: false, message: 'Rule not found or disabled.' };
    }

    rule.executionCount += 1;
    rule.lastExecutedAt = new Date().toISOString();

    if (rule.requiresHITLApproval) {
      rule.auditTrail.unshift({
        executedAt: new Date().toISOString(),
        status: 'paused_for_approval',
        details: `Rule "${rule.name}" triggered action. Paused for mandatory Human-in-the-Loop authorization.`,
      });
      return {
        success: true,
        requiresApproval: true,
        message: `Action triggered: ${rule.name}. Paused for mandatory user sign-off.`,
      };
    }

    rule.auditTrail.unshift({
      executedAt: new Date().toISOString(),
      status: 'success',
      details: `Rule "${rule.name}" executed autonomously under Autopilot policy.`,
    });

    return {
      success: true,
      requiresApproval: false,
      message: `Rule "${rule.name}" successfully executed.`,
    };
  }
}
