import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { getFinancialSummary } from '@/lib/firestore';

const SUPER_ADMINS = ['chancellor@ichancetek.com', 'chanceminus@gmail.com'];

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded.email || !SUPER_ADMINS.includes(decoded.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Get real users from Firebase Auth
    const listUsersResult = await adminAuth.listUsers();
    const totalUsers = listUsersResult.users.length;
    
    // 2. Extract users for the table
    const users = listUsersResult.users.map(u => ({
      id: u.uid,
      name: u.displayName || u.email?.split('@')[0] || 'Unknown User',
      email: u.email,
      role: SUPER_ADMINS.includes(u.email || '') ? 'Admin' : 'Owner',
      org: 'Default Org',
      status: u.disabled ? 'Inactive' : 'Active',
      joined: u.metadata.creationTime,
    })).sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime());

    // 3. Aggregate Platform Stats
    let totalPlatformRevenue = 0;
    let totalInvoices = 0;
    
    // Iterate over each user (orgId) to sum up platform revenue
    for (const u of listUsersResult.users) {
      const summary = await getFinancialSummary(u.uid);
      totalPlatformRevenue += summary.totalRevenue;
      totalInvoices += summary.invoiceCount;
    }

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        users,
        platformRevenue: totalPlatformRevenue,
        organizations: totalUsers,
        activeAgents: totalInvoices, // Rough metric representing agent interactions
      }
    });

  } catch (error: any) {
    console.error('[Admin Stats API]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
