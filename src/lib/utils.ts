/**
 * EliteBooks — Utility Functions
 */

/** Format currency with proper locale/symbol */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format compact currency (e.g., $12.5K, $1.2M) */
export function formatCompactCurrency(amount: number, currency = 'USD'): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `${currency === 'USD' ? '$' : ''}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${currency === 'USD' ? '$' : ''}${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount, currency);
}

/** Format percentage */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/** Format date */
export function formatDate(dateStr: string, style: 'short' | 'medium' | 'long' = 'medium'): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions =
    style === 'short' ? { month: 'short', day: 'numeric' } :
    style === 'long' ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } :
    { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/** Format relative time (e.g., "2 hours ago") */
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr, 'short');
}

/** Generate unique ID */
export function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Generate invoice number */
export function generateInvoiceNumber(sequence: number): string {
  return `INV-${new Date().getFullYear()}-${String(sequence).padStart(4, '0')}`;
}

/** Classify transaction amount sign */
export function getAmountClass(amount: number): string {
  if (amount > 0) return 'value-positive';
  if (amount < 0) return 'value-negative';
  return '';
}

/** Debounce function */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** cn() - Simple className merge utility */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
