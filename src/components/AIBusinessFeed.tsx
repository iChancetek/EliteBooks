'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  Shield,
  Search,
  Activity,
  Layers,
} from 'lucide-react';
import styles from './AIBusinessFeed.module.css';
import { AIBusinessFeedItem, FeedSeverity } from '@/types/agent-system';

interface AIBusinessFeedProps {
  items: AIBusinessFeedItem[];
  onOpenApprovalModal?: (targetEntityId: string) => void;
  onExecuteAction?: (item: AIBusinessFeedItem) => void;
}

export const AIBusinessFeed: React.FC<AIBusinessFeedProps> = ({
  items,
  onOpenApprovalModal,
  onExecuteAction,
}) => {
  const [activeFilter, setActiveFilter] = useState<FeedSeverity | 'all'>('all');

  const filteredItems = items.filter((item) =>
    activeFilter === 'all' ? true : item.severity === activeFilter
  );

  const getFilterIcon = (filter: FeedSeverity | 'all') => {
    switch (filter) {
      case 'all':
        return <Sparkles size={13} />;
      case 'critical':
        return <AlertTriangle size={13} color="#f87171" />;
      case 'attention':
        return <AlertCircle size={13} color="#fbbf24" />;
      case 'insight':
        return <TrendingUp size={13} color="#60a5fa" />;
      case 'opportunity':
        return <Lightbulb size={13} color="#34d399" />;
      case 'forecast':
        return <BarChart3 size={13} color="#c084fc" />;
    }
  };

  const getSeverityBadge = (severity: FeedSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'CRITICAL',
          icon: <AlertTriangle size={12} color="#f87171" />,
          color: '#f87171',
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.4)',
        };
      case 'attention':
        return {
          label: 'ATTENTION REQUIRED',
          icon: <AlertCircle size={12} color="#fbbf24" />,
          color: '#fbbf24',
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.4)',
        };
      case 'insight':
        return {
          label: 'INSIGHT',
          icon: <TrendingUp size={12} color="#60a5fa" />,
          color: '#60a5fa',
          bg: 'rgba(59, 130, 246, 0.15)',
          border: 'rgba(59, 130, 246, 0.4)',
        };
      case 'opportunity':
        return {
          label: 'OPPORTUNITY',
          icon: <Lightbulb size={12} color="#34d399" />,
          color: '#34d399',
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.4)',
        };
      case 'forecast':
        return {
          label: 'FORECAST',
          icon: <BarChart3 size={12} color="#c084fc" />,
          color: '#c084fc',
          bg: 'rgba(168, 85, 247, 0.15)',
          border: 'rgba(168, 85, 247, 0.4)',
        };
    }
  };

  const filterOptions: (FeedSeverity | 'all')[] = [
    'all',
    'critical',
    'attention',
    'insight',
    'opportunity',
    'forecast',
  ];

  return (
    <div className={styles.feedContainer}>
      {/* Header & Filter Tabs */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.zapIconWrapper}>
            <Zap size={24} />
          </div>
          <div>
            <h2>AI Business Intelligence Feed</h2>
            <p>
              Proactive continuous intelligence stream powered by GPT-5.6-Terra & 10 Autonomous Financial Agents
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className={styles.filtersBar}>
          {filterOptions.map((filter) => {
            const count =
              filter === 'all'
                ? items.length
                : items.filter((i) => i.severity === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`${styles.filterBtn} ${
                  activeFilter === filter ? styles.active : ''
                }`}
              >
                {getFilterIcon(filter)}
                <span>{filter}</span>
                <span className={styles.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Item Stream */}
      <div className={styles.streamList}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateRadar}>
              <div className={styles.radarPulse} />
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className={styles.emptyTitle}>
                {activeFilter === 'all'
                  ? 'All Financial Operations Synchronized & Optimal'
                  : `Zero ${activeFilter.toUpperCase()} Anomalies Detected`}
              </h3>
              <p className={styles.emptyDesc}>
                Continuous background auditing across live Firestore ledgers, bank feeds, invoices, and expenses is 100% verified. No urgent action items found under filter &quot;{activeFilter}&quot;.
              </p>
            </div>

            <div className={styles.emptyMetrics}>
              <div className={styles.emptyMetricChip}>
                <Shield size={14} color="#10b981" />
                <span>100% Safe Harbor Integrity</span>
              </div>
              <div className={styles.emptyMetricChip}>
                <Activity size={14} color="#3b82f6" />
                <span>10 Specialized Agents Active</span>
              </div>
              <div className={styles.emptyMetricChip}>
                <Layers size={14} color="#f59e0b" />
                <span>SHA-256 Ledger Guarded</span>
              </div>
            </div>

            <button
              className={styles.scanBtn}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('elitebooks:ask-agent', {
                    detail: {
                      query:
                        'Perform a full-scope financial intelligence audit across all accounts, transactions, invoices, and tax obligations.',
                    },
                  })
                );
              }}
            >
              <Sparkles size={16} /> Run On-Demand AI Financial Scan
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const badge = getSeverityBadge(item.severity);
            const isNegative = item.financialImpact < 0;

            return (
              <div key={item.id} className={styles.feedItem}>
                {/* Severity indicator line */}
                <div
                  className={styles.severityStrip}
                  style={{ background: badge.color }}
                />

                <div className={styles.itemContent}>
                  {/* Top Bar: Severity Badge, Responsible Agent, Financial Impact */}
                  <div className={styles.itemTopBar}>
                    <div className={styles.badgeAgentGroup}>
                      <span
                        className={styles.severityBadge}
                        style={{
                          color: badge.color,
                          background: badge.bg,
                          borderColor: badge.border,
                        }}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                      <span className={styles.responsibleAgent}>
                        by <span className={styles.agentHighlight}>{item.responsibleAgent}</span>
                      </span>
                    </div>

                    <div className={styles.impactTimeGroup}>
                      <span
                        className={`${styles.impactAmount} ${
                          isNegative ? styles.impactNegative : styles.impactPositive
                        }`}
                      >
                        {isNegative ? '-' : '+'}$
                        {Math.abs(item.financialImpact).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className={styles.itemTime}>
                        <Clock size={12} />
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className={styles.itemTitle}>{item.event}</h3>
                  <p className={styles.itemDesc}>{item.whyItMatters}</p>

                  {/* Recommendation Box */}
                  <div className={styles.recommendationBox}>
                    <div className={styles.recLeft}>
                      <ShieldCheck size={18} className={styles.recIcon} />
                      <div className={styles.recText}>
                        <span className={styles.recLabel}>Recommended Action:</span>
                        <span className={styles.recAction}>{item.recommendedAction}</span>
                      </div>
                    </div>

                    {/* Confidence Meter & Action Trigger */}
                    <div className={styles.recRight}>
                      <div className={styles.confidenceBox}>
                        <span className={styles.confidenceLabel}>Confidence</span>
                        <span className={styles.confidenceValue}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>

                      {item.approvalRequirement?.requiresApproval ? (
                        <button
                          onClick={() =>
                            onOpenApprovalModal &&
                            onOpenApprovalModal(
                              item.approvalRequirement!.targetEntityId || item.id
                            )
                          }
                          className={styles.approvalRequiredBtn}
                        >
                          <AlertTriangle size={14} />
                          Approval Required
                        </button>
                      ) : (
                        <button
                          onClick={() => onExecuteAction && onExecuteAction(item)}
                          className={styles.applyActionBtn}
                        >
                          Apply Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
