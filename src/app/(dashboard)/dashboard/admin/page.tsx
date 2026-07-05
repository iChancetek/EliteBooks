'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Users, Building2, Activity, Search, Filter, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Bot, 
  Server, Database, Lock, UserPlus, ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const ROLE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  const { user, isSuperAdmin, loading } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('6M');
  
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user || !isSuperAdmin) return;
    const fetchStats = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user, isSuperAdmin]);

  const computedStats = useMemo(() => {
    if (!stats) return null;

    const platformStats = [
      { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+0%', icon: Users, color: '#3b82f6' },
      { label: 'Organizations', value: stats.organizations.toLocaleString(), change: '+0%', icon: Building2, color: '#8b5cf6' },
      { label: 'Active Agents', value: stats.activeAgents.toLocaleString(), change: '+0%', icon: Bot, color: '#10b981' },
      { label: 'Platform Revenue', value: formatCurrency(stats.platformRevenue), change: '+0%', icon: Activity, color: '#f59e0b' },
    ];

    const rolesCount: Record<string, number> = { Owners: 0, Admins: 0, Accountants: 0, Viewers: 0 };
    stats.users.forEach((u: any) => {
      if (u.role === 'Super Admin' || u.role === 'Admin') rolesCount.Admins++;
      else rolesCount.Owners++;
    });

    const userRoleData = [
      { name: 'Owners', value: rolesCount.Owners },
      { name: 'Admins', value: rolesCount.Admins },
      { name: 'Accountants', value: rolesCount.Accountants },
      { name: 'Viewers', value: rolesCount.Viewers },
    ].filter(r => r.value > 0);

    // Group users by month joined for a simple dynamic growth chart
    const monthlyGrowth: Record<string, number> = {};
    stats.users.forEach((u: any) => {
      const d = new Date(u.joined);
      const month = d.toLocaleString('default', { month: 'short' });
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
    });

    const growthData = Object.keys(monthlyGrowth).map(k => ({
      name: k,
      users: monthlyGrowth[k]
    }));

    return { platformStats, userRoleData, growthData };
  }, [stats]);

  if (loading || loadingStats) return null;
  if (!isSuperAdmin) {
    redirect('/dashboard');
    return null;
  }

  const { platformStats, userRoleData, growthData } = computedStats || {};
  const usersList = stats?.users || [];
  const filteredUsers = usersList.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-accent-primary)', marginBottom: 'var(--space-2)' }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Super Admin Console</span>
          </div>
          <h1>Platform Overview</h1>
          <p>Global metrics and system administration for EliteBooks</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary"><Server size={16} /> System Status</button>
          <button className="btn btn-primary"><UserPlus size={16} /> Invite Admin</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {platformStats?.map((stat: any) => (
          <div key={stat.label} className="glass-card admin-stat-card">
            <div className="admin-stat-head">
              <div className="admin-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={20} />
              </div>
              <span className="admin-stat-change positive">
                <ArrowUpRight size={14} /> {stat.change}
              </span>
            </div>
            <div className="admin-stat-body">
              <span className="admin-stat-value">{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* User Analytics Charts */}
      <div className="admin-analytics-row">
        <div className="glass-card-static admin-chart-section">
          <div className="admin-section-header">
            <h3>User Growth (All Time)</h3>
          </div>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <XAxis dataKey="name" stroke="var(--color-text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-primary)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="users" fill="var(--color-accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card-static admin-chart-section">
          <div className="admin-section-header">
            <h3>User Distribution by Role</h3>
            <ShieldCheck size={16} />
          </div>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {userRoleData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-primary)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-content-grid">
        {/* User Management */}
        <div className="admin-section glass-card-static">
          <div className="admin-section-header">
            <h3>User Management</h3>
            <div className="admin-section-actions">
              <div className="admin-search">
                <Search size={14} />
                <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-ghost btn-icon"><Filter size={16} /></button>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Organization</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ color: 'var(--color-text-primary)' }}>{user.name}</strong>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{user.email}</span>
                      </div>
                    </td>
                    <td>{user.org}</td>
                    <td><span className="badge badge-neutral">{user.role}</span></td>
                    <td>
                      <span className={`status-dot ${user.status === 'Active' ? 'status-dot-active' : ''}`} style={{ marginRight: '8px' }} />
                      <span style={{ fontSize: 'var(--text-xs)' }}>{user.status}</span>
                    </td>
                    <td>{formatDate(user.joined, 'short')}</td>
                    <td>
                      <button className="btn btn-ghost btn-icon"><MoreHorizontal size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-section-footer">
            <button className="btn btn-ghost btn-sm">View All Users <ArrowUpRight size={14} /></button>
          </div>
        </div>

        {/* AI & System Logs */}
        <div className="admin-sidebar-section">
          <div className="admin-section glass-card-static">
            <div className="admin-section-header">
              <h3>AI Agent Activity</h3>
              <Activity size={16} style={{ color: 'var(--color-accent-primary)' }} />
            </div>
            <div className="ai-logs">
              {/* No real AI logs available globally yet */}
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
                No recent agent activity across the platform.
              </div>
            </div>
            <div className="admin-section-footer">
              <button className="btn btn-ghost btn-sm" disabled>View Full Audit Trail</button>
            </div>
          </div>

          <div className="admin-section glass-card-static" style={{ marginTop: 'var(--space-6)' }}>
            <div className="admin-section-header">
              <h3>Infrastructure</h3>
              <Database size={16} />
            </div>
            <div className="infra-stats">
              <div className="infra-item">
                <label>Firestore Usage</label>
                <div className="infra-bar"><div className="infra-bar-fill" style={{ width: '42%' }} /></div>
                <span>4.2 GB / 10 GB</span>
              </div>
              <div className="infra-item">
                <label>OpenAI Tokens (Daily)</label>
                <div className="infra-bar"><div className="infra-bar-fill" style={{ width: '68%', background: 'var(--color-warning)' }} /></div>
                <span>682k / 1.0M</span>
              </div>
              <div className="infra-item">
                <label>Active Connections</label>
                <div className="infra-bar"><div className="infra-bar-fill" style={{ width: '15%', background: '#10b981' }} /></div>
                <span>154 Concurrent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-page { max-width: 1200px; }
        
        .admin-stats-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: var(--space-6); 
          margin-bottom: var(--space-8); 
        }

        .admin-analytics-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .admin-period-tabs {
          display: flex;
          background: var(--color-bg-tertiary);
          padding: 2px;
          border-radius: var(--radius-md);
          gap: 2px;
        }

        .admin-period-btn {
          padding: 4px 8px;
          font-size: 10px;
          font-weight: var(--weight-bold);
          border-radius: var(--radius-sm);
          color: var(--color-text-tertiary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all var(--duration-fast);
        }

        .admin-period-btn:hover { color: var(--color-text-primary); }
        .admin-period-btn.active {
          background: var(--color-bg-secondary);
          color: var(--color-accent-primary);
          box-shadow: var(--shadow-sm);
        }
        
        .admin-chart-section { padding: var(--space-6); }
        
        .admin-stat-card { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
        .admin-stat-head { display: flex; justify-content: space-between; align-items: center; }
        .admin-stat-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .admin-stat-change { font-size: var(--text-xs); font-weight: var(--weight-bold); display: flex; align-items: center; gap: 2px; }
        .admin-stat-change.positive { color: var(--color-positive); }
        .admin-stat-value { font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-text-primary); display: block; }
        .admin-stat-label { font-size: var(--text-xs); color: var(--color-text-tertiary); font-weight: var(--weight-medium); }

        .admin-content-grid { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-8); }
        
        .admin-section { padding: var(--space-6); }
        .admin-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
        .admin-section-header h3 { font-size: var(--text-md); margin: 0; }
        
        .admin-section-actions { display: flex; gap: var(--space-2); align-items: center; }
        .admin-search { display: flex; align-items: center; gap: var(--space-2); padding: 4px 12px; background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: var(--radius-md); color: var(--color-text-muted); }
        .admin-search input { background: none; border: none; outline: none; color: var(--color-text-primary); font-size: var(--text-xs); width: 140px; }
        
        .admin-section-footer { margin-top: var(--space-6); display: flex; justify-content: center; padding-top: var(--space-4); border-top: 1px solid var(--color-border-secondary); }

        .ai-logs { display: flex; flex-direction: column; gap: var(--space-4); }
        .ai-log-item { display: flex; gap: var(--space-3); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border-secondary); }
        .ai-log-item:last-child { border-bottom: none; }
        .ai-log-icon { width: 28px; height: 28px; border-radius: var(--radius-full); background: var(--color-bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--color-accent-primary); flex-shrink: 0; }
        .ai-log-info { flex: 1; min-width: 0; }
        .ai-log-meta { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .ai-log-agent { font-size: 11px; font-weight: var(--weight-bold); color: var(--color-text-secondary); }
        .ai-log-time { font-size: 10px; color: var(--color-text-muted); }
        .ai-log-action { font-size: var(--text-sm); color: var(--color-text-primary); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ai-log-footer { display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: var(--color-text-tertiary); }
        .ai-log-status.success { color: var(--color-positive); }
        .ai-log-status.processing { color: var(--color-warning); }

        .infra-stats { display: flex; flex-direction: column; gap: var(--space-4); }
        .infra-item label { font-size: 11px; font-weight: var(--weight-semibold); color: var(--color-text-secondary); display: block; margin-bottom: 6px; }
        .infra-bar { height: 4px; background: var(--color-bg-tertiary); border-radius: 2px; margin-bottom: 4px; }
        .infra-bar-fill { height: 100%; border-radius: 2px; background: var(--color-accent-primary); }
        .infra-item span { font-size: 10px; color: var(--color-text-muted); }

        @media (max-width: 1024px) {
          .admin-content-grid { grid-template-columns: 1fr; }
          .admin-sidebar-section { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
          .admin-sidebar-section > div { margin-top: 0 !important; }
        }

        @media (max-width: 768px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-sidebar-section { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
