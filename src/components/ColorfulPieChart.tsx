'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface PieChartSlice {
  name: string;
  value: number;
  color: string;
}

interface ColorfulPieChartProps {
  title: string;
  subtitle?: string;
  data: PieChartSlice[];
  height?: number;
  centerText?: string;
  centerSubtext?: string;
  formatAsCurrency?: boolean;
  onClick?: () => void;
  className?: string;
}

const CustomPieTooltip = ({ active, payload, formatAsCurrency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${data.payload.color || 'rgba(99, 131, 196, 0.25)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-3) var(--space-4)',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: data.payload.color, fontWeight: 700 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: data.payload.color }} />
          <span>{data.name}</span>
        </div>
        <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
          {formatAsCurrency ? formatCurrency(data.value) : data.value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function ColorfulPieChart({
  title,
  subtitle,
  data,
  height = 320,
  centerText,
  centerSubtext,
  formatAsCurrency = true,
  onClick,
  className = ''
}: ColorfulPieChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div 
      className={`glass-card ${className}`} 
      style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
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

      <div style={{ display: 'flex', alignItems: 'center', height: height, gap: 'var(--space-4)' }}>
        <div style={{ width: '55%', height: '100%', minWidth: 0, minHeight: height, position: 'relative' }}>
          {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={height}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(0, 0, 0, 0.4)"
                      strokeWidth={2}
                      style={{ outline: 'none' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip formatAsCurrency={formatAsCurrency} />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {(centerText || totalValue > 0) && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {centerText || (formatAsCurrency ? formatCurrency(totalValue) : totalValue.toLocaleString())}
              </div>
              {centerSubtext && (
                <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {centerSubtext}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', overflowY: 'auto', maxHeight: '100%' }}>
          {data.map((item, idx) => {
            const pct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0';
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatAsCurrency ? formatCurrency(item.value) : item.value.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
