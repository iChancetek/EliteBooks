'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, RefreshCw, Key, Layers } from 'lucide-react';
import { auditLock, AuditBlock } from '@/security/audit-lock';

export const AIAuditCenter: React.FC<{ orgId?: string }> = ({ orgId = 'default' }) => {
  const [blocks, setBlocks] = useState<AuditBlock[]>([]);
  const [integrity, setIntegrity] = useState<{ isValid: boolean; error?: string }>({
    isValid: true,
  });

  const loadAuditLogs = () => {
    const chain = auditLock.getAuditChain(orgId);
    const result = auditLock.verifyAuditChainIntegrity(orgId);
    setBlocks(chain);
    setIntegrity(result);
  };

  useEffect(() => {
    loadAuditLogs();
  }, [orgId]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              AI Activity & Cryptographic Audit Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable SHA-256 block chain trail recording every observation, tool call, recommendation, and approval
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
              integrity.isValid
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-red-950/40 border-red-800/60 text-red-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {integrity.isValid ? 'SHA-256 Chain Verified Intact' : 'Chain Tampered Warning'}
          </div>

          <button
            onClick={loadAuditLogs}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Refresh Audit Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Block Stream Table */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
        {blocks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No cryptographic audit blocks logged yet for {orgId}</p>
          </div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.index}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all font-mono text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold text-[10px]">
                    Block #{block.index}
                  </span>
                  <span className="text-slate-200 font-bold font-sans">{block.actionType}</span>
                </div>
                <span className="text-slate-400 text-[11px] font-sans">
                  Agent: <span className="text-slate-200 font-semibold">{block.agentUsed}</span>
                </span>
                <span className="text-slate-500 text-[10px]">
                  {new Date(block.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-lg text-[10px] text-slate-400 border border-slate-800/50">
                <div>
                  <span className="text-slate-500 block">Payload Hash:</span>
                  <span className="text-amber-400/90 font-mono block truncate">{block.dataHash}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Previous Hash:</span>
                  <span className="text-slate-400 font-mono block truncate">{block.previousHash.substring(0, 16)}...</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Block Hash:</span>
                  <span className="text-emerald-400 font-mono block truncate">{block.blockHash.substring(0, 16)}...</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
