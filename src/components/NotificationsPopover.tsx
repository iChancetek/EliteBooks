'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  Clock,
  Trash2,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { AIBusinessFeedService } from '@/lib/feed-service';
import { AIBusinessFeedItem } from '@/types/agent-system';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (actionPrompt: string) => void;
}

export default function NotificationsPopover({
  isOpen,
  onClose,
  onSelectAction,
}: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState<AIBusinessFeedItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load live feed items as notifications
    const items = AIBusinessFeedService.getFeedItems();
    setNotifications(items);
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Check if click was on the trigger button
        const trigger = document.getElementById('notifications-btn');
        if (trigger && trigger.contains(e.target as Node)) return;
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const markAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.3)', icon: AlertTriangle, label: 'Critical' };
      case 'attention':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', icon: AlertTriangle, label: 'Attention' };
      case 'opportunity':
        return { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', icon: Zap, label: 'Opportunity' };
      case 'forecast':
        return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', icon: Bot, label: 'Forecast' };
      default:
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', icon: CheckCircle2, label: 'Insight' };
    }
  };

  return (
    <div
      ref={popoverRef}
      className="animate-scale-in"
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        width: '380px',
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: '520px',
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-xl), 0 20px 40px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'var(--glass-blur-lg)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px',
        borderBottom: '1px solid var(--color-border-secondary)',
        background: 'var(--color-bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'var(--color-accent-subtle)',
            color: 'var(--color-accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bell size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              Notifications & Alerts
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
              {unreadCount > 0 ? `${unreadCount} unread intelligence update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {notifications.length > 0 && (
            <>
              <button
                onClick={markAllRead}
                title="Mark all as read"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Check size={13} /> Read All
              </button>
              <button
                onClick={clearAll}
                title="Clear all notifications"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{
        overflowY: 'auto',
        flex: 1,
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--color-text-tertiary)',
          }}>
            <ShieldCheck size={36} style={{ color: 'var(--color-positive)', opacity: 0.8 }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Zero Pending Alerts
            </span>
            <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4, color: 'var(--color-text-tertiary)' }}>
              Your 10 autonomous agents are monitoring accounts, double-entry ledgers, and compliance rules in the background.
            </p>
          </div>
        ) : (
          notifications.map((item) => {
            const badge = getSeverityBadge(item.severity);
            const isRead = readIds.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => {
                  setReadIds(prev => new Set(prev).add(item.id));
                  if (item.recommendedAction && onSelectAction) {
                    onSelectAction(item.recommendedAction);
                    onClose();
                  }
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isRead ? 'transparent' : 'var(--color-accent-subtle)',
                  border: `1px solid ${isRead ? 'var(--color-border-secondary)' : 'var(--color-border-accent)'}`,
                  cursor: item.recommendedAction ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: badge.color,
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      padding: '2px 6px',
                      borderRadius: '100px',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}>
                      <badge.icon size={10} /> {badge.label}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-primary)' }}>
                      {item.responsibleAgent || 'AI Agent'}
                    </span>
                  </div>

                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                  {item.event}
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '2px 0 6px 0' }}>
                  {item.whyItMatters}
                </p>

                {item.recommendedAction && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-accent-primary)',
                    marginTop: '2px',
                  }}>
                    {item.recommendedAction} <ChevronRight size={12} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--color-border-secondary)',
        background: 'var(--color-bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
      }}>
        <span style={{ color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Bot size={13} style={{ color: 'var(--color-positive)' }} /> Autonomous Monitoring Active
        </span>
        <Link
          href="/dashboard"
          onClick={onClose}
          style={{ color: 'var(--color-accent-primary)', fontWeight: 700, textDecoration: 'none' }}
        >
          View Command Center →
        </Link>
      </div>
    </div>
  );
}
