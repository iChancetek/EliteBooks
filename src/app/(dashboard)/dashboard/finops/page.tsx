'use client';

import React from 'react';
import { TrendingUp, Cloud, Zap, Target, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export default function FinOpsPage() {
  const stats = [
    { label: 'Cloud Spend (MTD)', value: '$4,280', change: '+12%', isPositive: false, icon: Cloud },
    { label: 'Resource Efficiency', value: '84%', change: '+5%', isPositive: true, icon: Zap },
    { label: 'Potential Savings', value: '$850', change: 'Monthly', isPositive: true, icon: Target },
  ];

  const recommendations = [
    { title: 'Reserved Instance Opportunity', desc: 'Convert 3 on-demand DB instances to RIs for 40% savings.', impact: 'High', savings: '$420/mo' },
    { title: 'Unused EBS Volumes', desc: 'Found 12 unattached volumes in us-east-1.', impact: 'Medium', savings: '$120/mo' },
    { title: 'S3 Lifecycle Policy', desc: 'Move 4TB of logs to Glacier Instant Retrieval.', impact: 'Low', savings: '$45/mo' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cloud FinOps</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Optimize your cloud spend and operational efficiency with AI-driven insights.</p>
        </div>
        <div className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Agent Autonomy</span>
            <span style={{ fontSize: '13px', color: 'var(--color-positive)', fontWeight: 'bold' }}>FULL AUTOPILOT</span>
          </div>
          <div style={{ width: '40px', height: '20px', background: 'var(--color-positive)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }} />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
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
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Spend Chart Mockup */}
        <div className="glass-card" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Spend Analysis</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>Last 30 Days</div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
            {[45, 52, 48, 61, 55, 68, 72, 65, 58, 63, 70, 75, 82, 78, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 14 ? 'var(--color-accent-primary)' : 'var(--color-bg-tertiary)', height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Recommendations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommendations.map((rec, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--color-bg-tertiary)', borderRadius: '12px', border: '1px solid var(--color-border-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{rec.title}</span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: rec.impact === 'High' ? 'var(--color-negative-bg)' : 'var(--color-positive-bg)', color: rec.impact === 'High' ? 'var(--color-negative)' : 'var(--color-positive)' }}>{rec.impact}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{rec.desc}</p>
                <div style={{ color: 'var(--color-positive)', fontWeight: 'bold', fontSize: '0.85rem' }}>Save {rec.savings}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>Automate Optimizations</button>
        </div>
      </div>
    </div>
  );
}
