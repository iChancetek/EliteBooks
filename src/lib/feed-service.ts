/**
 * EliteBooks — Proactive AI Business Intelligence Feed Engine
 * Scans financial data streams, anomaly detectors, and forecasts to generate real-time,
 * actionable feed items categorized across 5 severity levels.
 */

import { AIBusinessFeedItem, HITLApprovalRequest } from '@/types/agent-system';

// In-memory store for dynamic feed items & approval requests
let activeFeedItems: AIBusinessFeedItem[] = [];
let pendingApprovals: HITLApprovalRequest[] = [];

export class AIBusinessFeedService {
  public static getFeedItems(): AIBusinessFeedItem[] {
    return [...activeFeedItems];
  }

  public static addFeedItem(item: AIBusinessFeedItem): void {
    activeFeedItems.unshift(item);
  }

  public static getPendingApprovals(): HITLApprovalRequest[] {
    return [...pendingApprovals];
  }

  public static addPendingApproval(request: HITLApprovalRequest): void {
    pendingApprovals.unshift(request);
  }

  public static approveRequest(requestId: string, user: string = 'Financial Controller'): boolean {
    const reqIndex = pendingApprovals.findIndex((r) => r.id === requestId);
    if (reqIndex !== -1) {
      pendingApprovals[reqIndex].status = 'approved';
      pendingApprovals[reqIndex].approvedAt = new Date().toISOString();
      pendingApprovals[reqIndex].approvedBy = user;

      // Update feed item if associated
      const feedItem = activeFeedItems.find(
        (f) => f.approvalRequirement && f.approvalRequirement.targetEntityId === requestId
      );
      if (feedItem && feedItem.approvalRequirement) {
        feedItem.approvalRequirement.approvalStatus = 'approved';
      }
      return true;
    }
    return false;
  }

  public static rejectRequest(requestId: string, user: string = 'Financial Controller'): boolean {
    const reqIndex = pendingApprovals.findIndex((r) => r.id === requestId);
    if (reqIndex !== -1) {
      pendingApprovals[reqIndex].status = 'rejected';
      const feedItem = activeFeedItems.find(
        (f) => f.approvalRequirement && f.approvalRequirement.targetEntityId === requestId
      );
      if (feedItem && feedItem.approvalRequirement) {
        feedItem.approvalRequirement.approvalStatus = 'rejected';
      }
      return true;
    }
    return false;
  }
}
