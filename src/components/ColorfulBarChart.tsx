'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface BarChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface BarSeriesConfig {
  key: string;
  label: string;
  color: string;
}

interface ColorfulBarChartProps {
  title: string;
  subtitle?: string;
  data: BarChartDataPoint[];
  series: BarSeriesConfig[];
  height?: number;
  formatAsCurrency?: boolean;
}

const CustomTooltip = ({ active, payload, label, formatAsCurrency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(99, 131, 196, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-3) var(--space-4)',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600, marginBottom: '6px' }}>
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: entry.color, margin: '3px 0' }}>
            <span style={{ fontWeight: 500 }}>{entry.name}:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {formatAsCurrency ? formatCurrency(entry.value) : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ColorfulBarChart({
  title,
  subtitle,
  data,
  series,
  height = 320,
  formatAsCurrency = true
}: ColorfulBarChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: height, minWidth: 0, minHeight: height }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-text-tertiary)" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <YAxis stroke="var(--color-text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatAsCurrency ? `$${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}` : val} />
            <Tooltip content={<CustomTooltip formatAsCurrency={formatAsCurrency} />} />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={`url(#grad-${s.key})`}
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
