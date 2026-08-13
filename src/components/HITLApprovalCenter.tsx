'use client';

import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Lock,
  Cpu,
  X,
} from 'lucide-react';
import { HITLApprovalRequest } from '@/types/agent-system';

interface HITLApprovalCenterProps {
  request: HITLApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const HITLApprovalCenter: React.FC<HITLApprovalCenterProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !request) return null;

  const isNegative = request.financialImpact < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 -mx-6 -mt-6 p-4 px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100 tracking-tight">
              Human-in-the-Loop (HITL) Authorization Required
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Overview Card */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-100">{request.title}</h2>
              <span
                className={`text-lg font-mono font-bold ${
                  isNegative ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isNegative ? '-' : '+'}$
                {Math.abs(request.financialImpact).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{request.description}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Responsible Agent
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {request.responsibleAgent}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                MCP Tool Name
              </span>
              <span className="text-xs font-mono text-amber-300 font-medium block mt-1">
                {request.toolName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Confidence Score
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${request.confidenceScore * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {Math.round(request.confidenceScore * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              AI Governance Rationale
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{request.reasoning}</p>
          </div>

          {/* Evidence List */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Verified Source Evidence
            </h4>
            <ul className="space-y-1.5">
              {request.evidence.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/50"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              onReject(request.id);
              onClose();
            }}
            className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject Action
          </button>

          <button
            onClick={() => {
              onApprove(request.id);
              onClose();
            }}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Authorize & Execute via MCP
          </button>
        </div>
      </div>
    </div>
  );
};
