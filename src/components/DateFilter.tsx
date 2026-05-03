'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  initialMonth?: string;
  initialYear?: string;
  onDateChange?: (month: string, year: string) => void;
}

const months = [
  'Wk 1', 'Wk 2', 'Wk 3', 'Wk 4',
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 
  'All Months'
];
const years = Array.from({ length: 11 }, (_, i) => (2016 + i).toString());

export default function DateFilter({ initialMonth = 'Apr', initialYear = '2026', onDateChange }: DateFilterProps) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setMonth(val);
    if (onDateChange) onDateChange(val, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setYear(val);
    if (onDateChange) onDateChange(month, val);
  };

  return (
    <div className="date-filter glass-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-md)' }}>
      <Calendar size={16} style={{ color: 'var(--color-text-tertiary)' }} />
      
      <select 
        value={month} 
        onChange={handleMonthChange}
        className="date-filter-select"
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--color-text-primary)', 
          fontSize: 'var(--text-sm)',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        {months.map(m => (
          <option key={m} value={m} style={{ background: 'var(--color-bg-elevated)' }}>{m}</option>
        ))}
      </select>

      <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>

      <select 
        value={year} 
        onChange={handleYearChange}
        className="date-filter-select"
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--color-text-primary)', 
          fontSize: 'var(--text-sm)',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value="All Years" style={{ background: 'var(--color-bg-elevated)' }}>All Years</option>
        {years.map(y => (
          <option key={y} value={y} style={{ background: 'var(--color-bg-elevated)' }}>{y}</option>
        ))}
      </select>
    </div>
  );
}
