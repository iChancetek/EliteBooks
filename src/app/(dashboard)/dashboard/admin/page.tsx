'use client';

import { useState } from 'react';
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

// Mock Admin Data
const growthDataMap = {
  '1W': [
    { name: 'Mon', users: 12 }, { name: 'Tue', users: 15 }, { name: 'Wed', users: 18 },
    { name: 'Thu', users: 14 }, { name: 'Fri', users: 22 }, { name: 'Sat', users: 10 }, { name: 'Sun', users: 8 }
  ],
  '1M': [
    { name: 'Week 1', users: 85 }, { name: 'Week 2', users: 92 },
    { name: 'Week 3', users: 78 }, { name: 'Week 4', users: 110 }
  ],
  '3M': [
    { name: 'Feb', users: 320 }, { name: 'Mar', users: 410 }, { name: 'Apr', users: 512 }
  ],
  '6M': [
    { name: 'Nov', users: 840 }, { name: 'Dec', users: 920 }, { name: 'Jan', users: 1050 },
    { name: 'Feb', users: 1120 }, { name: 'Mar', users: 1210 }, { name: 'Apr', users: 1284 }
  ],
  '1Y': [
    { name: 'May 25', users: 450 }, { name: 'Jun 25', users: 520 }, { name: 'Jul 25', users: 610 },
    { name: 'Aug 25', users: 680 }, { name: 'Sep 25', users: 750 }, { name: 'Oct 25', users: 820 },
    { name: 'Nov 25', users: 840 }, { name: 'Dec 25', users: 920 }, { name: 'Jan 26', users: 1050 },
    { name: 'Feb 26', users: 1120 }, { name: 'Mar 26', users: 1210 }, { name: 'Apr 26', users: 1284 }
  ]
};

const userRoleData = [
  { name: 'Owners', value: 412 },
  { name: 'Admins', value: 245 },
  { name: 'Accountants', value: 387 },
  { name: 'Viewers', value: 240 },
];

const ROLE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

// Mock Admin Data
const platformStats = [
  { label: 'Total Users', value: '1,284', change: '+12%', icon: Users, color: '#3b82f6' },
  { label: 'Organizations', value: '412', change: '+8%', icon: Building2, color: '#8b5cf6' },
  { label: 'Active Agents', value: '2,448', change: '+24%', icon: Bot, color: '#10b981' },
  { label: 'Platform Revenue', value: '$42,500', change: '+18%', icon: Activity, color: '#f59e0b' },
];

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Owner', org: 'Acme Corp', status: 'Active', joined: '2026-04-01' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@design.co', role: 'Admin', org: 'DesignCo', status: 'Active', joined: '2026-04-05' },
  { id: '3', name: 'Mike Johnson', email: 'mike@tech.io', role: 'Accountant', org: 'TechIO', status: 'Inactive', joined: '2026-04-10' },
  { id: '4', name: 'Elena Rodriguez', email: 'elena@global.com', role: 'Viewer', org: 'Global Logistics', status: 'Active', joined: '2026-04-12' },
  { id: '5', name: 'David Chen', email: 'david@fintech.com', role: 'Owner', org: 'FinTech Solutions', status: 'Active', joined: '2026-04-15' },
];

const aiLogs = [
  { id: 'L1', agent: 'Ledger', user: 'John Doe', action: 'Journal Entry Created', status: 'Success', time: '2 mins ago' },
  { id: 'L2', agent: 'Expense', user: 'Sarah Smith', action: 'Receipt OCR Match', status: 'Success', time: '5 mins ago' },
  { id: 'L3', agent: 'Payroll', user: 'David Chen', action: 'Tax Calculation', status: 'Processing', time: '12 mins ago' },
  { id: 'L4', agent: 'Compliance', user: 'Elena Rodriguez', action: 'Audit Log Export', status: 'Success', time: '45 mins ago' },
];

export default function AdminDashboard() {
  const { isSuperAdmin, loading } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof growthDataMap>('6M');

  if (loading) return null;
  if (!isSuperAdmin) {
    redirect('/dashboard');
    return null;
  }

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
        {platformStats.map((stat) => (
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
            <h3>User Growth</h3>
            <div className="admin-period-tabs">
              {(['1W', '1M', '3M', '6M', '1Y'] as const).map(p => (
                <button 
                  key={p} 
                  className={`admin-period-btn ${selectedPeriod === p ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthDataMap[selectedPeriod]}>
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
                  {userRoleData.map((entry, index) => (
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
                {mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(user => (
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
              {aiLogs.map(log => (
                <div key={log.id} className="ai-log-item">
                  <div className="ai-log-icon">
                    <Bot size={14} />
                  </div>
                  <div className="ai-log-info">
                    <div className="ai-log-meta">
                      <span className="ai-log-agent">{log.agent} Agent</span>
                      <span className="ai-log-time">{log.time}</span>
                    </div>
                    <p className="ai-log-action">{log.action}</p>
                    <div className="ai-log-footer">
                      <span>User: {log.user}</span>
                      <span className={`ai-log-status ${log.status.toLowerCase()}`}>{log.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-section-footer">
              <button className="btn btn-ghost btn-sm">View Full Audit Trail</button>
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
        
        .admin-section-footer { margin-top: var(--space-6); display: flex; justify(content: center; padding-top: var(--space-4); border-top: 1px solid var(--color-border-secondary); }

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
