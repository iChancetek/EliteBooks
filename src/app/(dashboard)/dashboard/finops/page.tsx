'use client';

import React from 'react';
import { TrendingUp, Cloud, Zap, Target, ArrowUpRight, ArrowDownRight, Info, Cpu, Database, Activity, Calendar } from 'lucide-react';

export default function FinOpsPage() {
  const stats = [
    { label: 'Cloud Spend (MTD)', value: '$4,280', change: '+12%', isPositive: false, icon: Cloud },
    { label: 'AI Infra (Token/GPU)', value: '$1,850', change: '+24%', isPositive: false, icon: Cpu },
    { label: 'Resource Efficiency', value: '84%', change: '+5%', isPositive: true, icon: Zap },
    { label: 'Unit Econ (Cost/Inf)', value: '$0.004', change: '-15%', isPositive: true, icon: Target },
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cloud & AI FinOps</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Cloud, AI infrastructure, and FinOps — all automated and clearly explained.</p>
        </div>
        <div className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--color-positive-bg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Agentic Workflow</span>
            <span style={{ fontSize: '13px', color: 'var(--color-positive)', fontWeight: 'bold' }}>AUTO-OPTIMIZE ON</span>
          </div>
          <div style={{ width: '40px', height: '20px', background: 'var(--color-positive)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }} />
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
              {[45, 52, 48, 61, 55, 68, 72, 65, 58, 63, 70, 75, 82, 78, 85].map((h, i) => (
                <div key={i} style={{ flex: 1, background: i > 11 ? 'var(--color-accent-primary)' : 'var(--color-bg-tertiary)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: i > 11 ? 1 : 0.6 }} />
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
    </div>
  );
}
