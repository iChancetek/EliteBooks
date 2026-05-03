/* ═══════════════════════════════════════════════════════════════
   EliteBooks — User & Organization Types
   Multi-tenant, role-based access
   ═══════════════════════════════════════════════════════════════ */

export type UserRole = 'owner' | 'admin' | 'accountant' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  currentOrgId: string;
  organizations: string[];
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  currency: string;
  dateFormat: string;
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  approvalThreshold: number;
}

export interface Organization {
  id: string;
  name: string;
  industry?: string;
  type: 'sole_proprietor' | 'llc' | 'corporation' | 'partnership' | 'nonprofit' | 'freelancer';
  address?: Address;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  fiscalYearStart: number;
  currency: string;
  logo?: string;
  members: OrgMember[];
  subscription: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrgMember {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  joinedAt: string;
}

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface ApprovalRequest {
  id: string;
  orgId: string;
  type: 'expense' | 'invoice' | 'payroll' | 'journal_entry';
  entityId: string;
  requestedBy: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}
