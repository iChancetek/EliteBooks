'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, RefreshCw, Layers, ShieldAlert } from 'lucide-react';
import styles from './AIAuditCenter.module.css';
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
    <div className={styles.auditContainer}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.shieldIconWrapper}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2>AI Activity & Cryptographic Audit Center</h2>
            <p>
              Immutable SHA-256 blockchain recording observations, tool calls, autonomous actions, and human approvals
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div
            className={`${styles.integrityBadge} ${
              integrity.isValid ? styles.integrityValid : styles.integrityInvalid
            }`}
          >
            {integrity.isValid ? <Lock size={13} /> : <ShieldAlert size={13} />}
            <span>{integrity.isValid ? 'SHA-256 Chain Intact' : 'Chain Warning'}</span>
          </div>

          <button
            onClick={loadAuditLogs}
            className={styles.refreshBtn}
            title="Refresh Audit Logs"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Block Stream */}
      <div className={styles.blockList}>
        {blocks.length === 0 ? (
          <div className={styles.emptyState}>
            <Layers size={36} color="rgba(255, 255, 255, 0.4)" />
            <h3 className={styles.emptyTitle}>Cryptographic Chain Initialized</h3>
            <p className={styles.emptyDesc}>
              Genesis block verified. New autonomous operations will append immutable SHA-256 blocks here in real time.
            </p>
          </div>
        ) : (
          blocks.map((block) => (
            <div key={block.index} className={styles.blockCard}>
              <div className={styles.blockHeader}>
                <div className={styles.blockTitleGroup}>
                  <span className={styles.blockIndexBadge}>
                    Block #{block.index}
                  </span>
                  <span className={styles.actionType}>{block.actionType}</span>
                </div>
                <span className={styles.agentName}>
                  Agent: <strong style={{ color: '#ffffff' }}>{block.agentUsed}</strong>
                </span>
                <span className={styles.timestamp}>
                  {new Date(block.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              <div className={styles.hashGrid}>
                <div className={styles.hashItem}>
                  <span className={styles.hashLabel}>Payload Hash:</span>
                  <span className={styles.hashValue}>{block.dataHash}</span>
                </div>
                <div className={styles.hashItem}>
                  <span className={styles.hashLabel}>Previous Hash:</span>
                  <span className={styles.hashValue}>
                    {block.previousHash.substring(0, 16)}...
                  </span>
                </div>
                <div className={styles.hashItem}>
                  <span className={styles.hashLabel}>Block Hash:</span>
                  <span className={styles.blockHashValue}>
                    {block.blockHash.substring(0, 16)}...
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
