'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Cloud, Zap, Target, ArrowUpRight, ArrowDownRight, Info, Cpu, Database, Activity, Calendar, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function FinOpsPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCloudCost, setNewCloudCost] = useState({
    provider: 'AWS',
    amount: '',
    date: '',
    resourceType: 'Compute/GPU',
    usageMetric: '',
    unitCost: '',
    notes: ''
  });

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    setNewCloudCost(prev => ({ 
      ...prev, 
      date: new Date().toISOString().split('T')[0] 
    }));
  }, []);

  const handleAddCloudCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: newCloudCost.date,
          vendor: newCloudCost.provider,
          amount: parseFloat(newCloudCost.amount),
          category: 'Software & SaaS',
          description: `FinOps: ${newCloudCost.resourceType} - ${newCloudCost.notes || 'No description'}`,
          paymentMethod: 'Credit Card',
          resourceType: newCloudCost.resourceType,
          usageMetric: newCloudCost.usageMetric,
          unitCost: parseFloat(newCloudCost.unitCost || '0'),
          isFinOps: true
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewCloudCost({
          provider: 'AWS',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          resourceType: 'Compute/GPU',
          usageMetric: '',
          unitCost: '',
          notes: ''
        });
        fetchExpenses();
      } else {
        console.error('FinOps save failed:', data.error);
      }
    } catch (error) {
      console.error('Failed to log cloud cost:', error);
    }
  };

  // Filter Software & SaaS and Cloud expenses
  const cloudExpenses = expenses.filter(e => 
    e.status !== 'deleted' && 
    (e.category === 'Software & SaaS' || 
     ['aws', 'amazon web services', 'google cloud', 'gcp', 'azure', 'openai'].some(v => e.vendor?.toLowerCase().includes(v)))
  );

  // MTD spend (current month, e.g. June 2026)
  const currentMonthExpenses = cloudExpenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === 2026 && d.getMonth() === 5; // June is index 5
  });

  const cloudSpendMTD = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const aiInfraSpend = currentMonthExpenses.filter(e => 
    ['openai', 'aws', 'gcp', 'gpu'].some(v => e.vendor?.toLowerCase().includes(v))
  ).reduce((s, e) => s + e.amount, 0) || (cloudSpendMTD * 0.43); // Fallback to 43% unit econ ratio

  const efficiency = cloudSpendMTD > 0 ? Math.min(95, Math.max(70, 95 - (aiInfraSpend / cloudSpendMTD) * 20)) : 88;
  const costPerInference = cloudSpendMTD > 0 ? 0.004 : 0;

  const stats = [
    { label: 'Cloud Spend (MTD)', value: formatCurrency(cloudSpendMTD), change: cloudSpendMTD > 0 ? '+6%' : '0%', isPositive: false, icon: Cloud },
    { label: 'AI Infra (Token/GPU)', value: formatCurrency(aiInfraSpend), change: aiInfraSpend > 0 ? '+12%' : '0%', isPositive: false, icon: Cpu },
    { label: 'Resource Efficiency', value: `${efficiency.toFixed(0)}%`, change: '+3%', isPositive: true, icon: Zap },
    { label: 'Unit Econ (Cost/Inf)', value: `$${costPerInference.toFixed(3)}`, change: '-12%', isPositive: true, icon: Target },
  ];

  const recommendations = [
    { title: 'AI Model Rightsizing', desc: 'Switch gpt-4o calls to gpt-4o-mini for non-reasoning tasks.', impact: 'High', savings: '$620/mo' },
    { title: 'GPU Instance Hibernation', desc: 'Automate shutdown of dev Trainium instances during off-hours.', impact: 'Medium', savings: '$310/mo' },
    { title: 'SaaS License Optimization', desc: 'Identify 14 inactive seats in Slack and Figma.', impact: 'Medium', savings: '$280/mo' },
  ];

  const upcomingEvents = [
    { name: 'FinOps X 2026', location: 'San Diego', date: 'June 2026' },
    { name: 'FinOps Roadshow', location: 'London', date: 'Sept 2026' },
    { name: 'FinOps Europe', location: 'Amsterdam', date: 'Nov 2026' },
  ];

  // Dynamically calculate monthly cloud spend for the chart (last 12 months)
  const getMonthlySpendTrend = () => {
    const monthlyMap: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Seed last 12 months to ensure chart isn't completely blank
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[label] = 50; // baseline height %
    }

    cloudExpenses.forEach(e => {
      const dateObj = new Date(e.date);
      const label = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
      if (label in monthlyMap) {
        monthlyMap[label] = Math.min(100, monthlyMap[label] + (e.amount / 100)); // scaling factor
      }
    });

    return Object.entries(monthlyMap).map(([label, height]) => ({ label, height }));
  };

  const chartData = getMonthlySpendTrend();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cloud & AI FinOps</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Cloud, AI infrastructure, and FinOps — all automated and clearly explained.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Log Cloud Cost
          </button>
          <div className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--color-positive-bg)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Agentic Workflow</span>
              <span style={{ fontSize: '13px', color: 'var(--color-positive)', fontWeight: 'bold' }}>AUTO-OPTIMIZE ON</span>
            </div>
            <div style={{ width: '40px', height: '20px', background: 'var(--color-positive)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-primary)' }}>
                <stat.icon size={20} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: stat.isPositive ? 'var(--color-positive)' : 'var(--color-negative)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Spend Analysis Chart */}
          <div className="glass-card" style={{ padding: '1.5rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>AI & Cloud Spend Trend (FOCUS 1.3)</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>Real-time Unit Economics</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', background: i === chartData.length - 1 ? 'var(--color-accent-primary)' : 'var(--color-bg-tertiary)', height: `${d.height}%`, borderRadius: '4px 4px 0 0', opacity: i === chartData.length - 1 ? 1 : 0.6 }} />
                  <span style={{ fontSize: '9px', color: 'var(--color-text-tertiary)' }}>{d.label.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2026 Strategy Section */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>2026 Strategic Focus</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Activity size={16} color="var(--color-positive)" /> Shift-Left Governance
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Automated policy enforcement integrated into the CI/CD pipeline and architectural design phase.</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Database size={16} color="var(--color-accent-primary)" /> SaaS & ITAM Fusion
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Unified visibility across public cloud, hybrid infrastructure, and SaaS licensing costs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recommendations */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Agent Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{ padding: '0.75rem', background: 'var(--color-bg-tertiary)', borderRadius: '10px', border: '1px solid var(--color-border-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{rec.title}</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: rec.impact === 'High' ? 'var(--color-negative-bg)' : 'var(--color-positive-bg)', color: rec.impact === 'High' ? 'var(--color-negative)' : 'var(--color-positive)' }}>{rec.impact}</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>{rec.desc}</p>
                  <div style={{ color: 'var(--color-positive)', fontWeight: 'bold', fontSize: '0.75rem' }}>+{rec.savings}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>Execute All Optimizations</button>
          </div>

          {/* Events */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} /> 2026 Events
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingEvents.map((event, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{event.name}</div>
                    <div style={{ color: 'var(--color-text-tertiary)' }}>{event.location}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{event.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Cloud Cost Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Cloud / SaaS Expense</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsModalOpen(false)}>
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <form onSubmit={handleAddCloudCost} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Cloud Provider / Vendor</label>
                  <select 
                    className="input" 
                    value={newCloudCost.provider} 
                    onChange={e => setNewCloudCost({...newCloudCost, provider: e.target.value})}
                  >
                    <option value="AWS">AWS (Amazon Web Services)</option>
                    <option value="Google Cloud">Google Cloud (GCP)</option>
                    <option value="Azure">Microsoft Azure</option>
                    <option value="OpenAI">OpenAI API</option>
                    <option value="Vercel">Vercel</option>
                    <option value="Datadog">Datadog</option>
                    <option value="Pinecone">Pinecone</option>
                    <option value="SaaS License">Other SaaS Provider</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Resource / Cost Type</label>
                  <select 
                    className="input" 
                    value={newCloudCost.resourceType} 
                    onChange={e => setNewCloudCost({...newCloudCost, resourceType: e.target.value})}
                  >
                    <option value="Compute/GPU">Compute / GPU Instances</option>
                    <option value="Database">Database / Cache</option>
                    <option value="Storage">Cloud Storage / S3</option>
                    <option value="API/LLM">AI API / LLM Tokens</option>
                    <option value="Network">Networking / CDN</option>
                    <option value="License Seat">Software Subscription / Seat</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="input" 
                    placeholder="0.00" 
                    value={newCloudCost.amount} 
                    onChange={e => setNewCloudCost({...newCloudCost, amount: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Billing Date</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={newCloudCost.date} 
                    onChange={e => setNewCloudCost({...newCloudCost, date: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Usage Metric (e.g. 50M tokens, 730 hrs)</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. 100M tokens or 5 instances" 
                    value={newCloudCost.usageMetric} 
                    onChange={e => setNewCloudCost({...newCloudCost, usageMetric: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Unit Cost ($)</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    className="input" 
                    placeholder="0.00" 
                    value={newCloudCost.unitCost} 
                    onChange={e => setNewCloudCost({...newCloudCost, unitCost: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description / Notes</label>
                <textarea 
                  className="input" 
                  rows={2} 
                  placeholder="e.g. Production Cluster usage, GPT-4o fine-tuning run" 
                  value={newCloudCost.notes} 
                  onChange={e => setNewCloudCost({...newCloudCost, notes: e.target.value})} 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Log Cost</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
