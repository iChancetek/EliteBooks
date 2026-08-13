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
} from 'lucide-react';
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

  const getSeverityBadge = (severity: FeedSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'CRITICAL',
          icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
          bg: 'bg-red-950/40 border-red-800/60 text-red-300',
        };
      case 'attention':
        return {
          label: 'ATTENTION REQUIRED',
          icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
          bg: 'bg-amber-950/40 border-amber-800/60 text-amber-300',
        };
      case 'insight':
        return {
          label: 'INSIGHT',
          icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
          bg: 'bg-blue-950/40 border-blue-800/60 text-blue-300',
        };
      case 'opportunity':
        return {
          label: 'OPPORTUNITY',
          icon: <Lightbulb className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
        };
      case 'forecast':
        return {
          label: 'FORECAST',
          icon: <BarChart3 className="w-4 h-4 text-purple-400" />,
          bg: 'bg-purple-950/40 border-purple-800/60 text-purple-300',
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              AI Business Intelligence Feed
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactive financial intelligence continuous stream from the EliteBooks AI Finance Department
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {(['all', 'critical', 'attention', 'insight', 'opportunity', 'forecast'] as const).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      {/* Feed Item Stream */}
      <div className="space-y-4 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No items found for severity tab "{activeFilter}"</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const badge = getSeverityBadge(item.severity);
            const isNegative = item.financialImpact < 0;

            return (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all rounded-xl p-5 shadow-lg group relative overflow-hidden"
              >
                {/* Severity indicator line */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1 ${
                    item.severity === 'critical'
                      ? 'bg-red-500'
                      : item.severity === 'attention'
                      ? 'bg-amber-500'
                      : item.severity === 'opportunity'
                      ? 'bg-emerald-500'
                      : item.severity === 'forecast'
                      ? 'bg-purple-500'
                      : 'bg-blue-500'
                  }`}
                />

                <div className="pl-3">
                  {/* Top Bar: Severity Badge, Responsible Agent, Financial Impact */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold tracking-wider ${badge.bg}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        by <span className="text-slate-200 font-semibold">{item.responsibleAgent}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-mono font-bold ${
                          isNegative ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {isNegative ? '-' : '+'}$
                        {Math.abs(item.financialImpact).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {item.event}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.whyItMatters}</p>

                  {/* Recommendation Box */}
                  <div className="mt-3 bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          Recommended Action:
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.recommendedAction}</p>
                      </div>
                    </div>

                    {/* Confidence Meter & Action Trigger */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Confidence
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>

                      {item.approvalRequirement?.requiresApproval ? (
                        <button
                          onClick={() =>
                            onOpenApprovalModal &&
                            onOpenApprovalModal(item.approvalRequirement!.targetEntityId || item.id)
                          }
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          Approval Required
                        </button>
                      ) : (
                        <button
                          onClick={() => onExecuteAction && onExecuteAction(item)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20"
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
