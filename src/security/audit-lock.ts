/**
 * EliteBooks — Cryptographic SHA-256 Audit Trail Lock
 * Generates an immutable, chained SHA-256 hash sequence for all financial journal entries, tax filings, and agent decisions,
 * providing CPA-audit readiness and tamper-proof verification.
 */

import crypto from 'crypto';

export interface AuditBlock {
  index: number;
  timestamp: string;
  orgId: string;
  actionType: string;
  agentUsed: string;
  dataHash: string;
  previousHash: string;
  blockHash: string;
}

export class CryptographicAuditLock {
  private static instance: CryptographicAuditLock;
  private auditChainsByOrg = new Map<string, AuditBlock[]>();

  private constructor() {}

  public static getInstance(): CryptographicAuditLock {
    if (!CryptographicAuditLock.instance) {
      CryptographicAuditLock.instance = new CryptographicAuditLock();
    }
    return CryptographicAuditLock.instance;
  }

  /**
   * Compute a SHA-256 hash string from stringified data
   */
  public hashData(data: unknown): string {
    const jsonStr = JSON.stringify(data || {});
    return crypto.createHash('sha256').update(jsonStr).digest('hex');
  }

  /**
   * Append a new financial event or agent decision to the immutable audit chain
   */
  public appendBlock(
    orgId: string,
    actionType: string,
    agentUsed: string,
    payload: Record<string, unknown>
  ): AuditBlock {
    const chain = this.auditChainsByOrg.get(orgId) || [];
    const index = chain.length;
    const timestamp = new Date().toISOString();
    const previousHash = index > 0 ? chain[index - 1].blockHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const dataHash = this.hashData(payload);

    const blockHeader = `${index}:${timestamp}:${orgId}:${actionType}:${agentUsed}:${dataHash}:${previousHash}`;
    const blockHash = crypto.createHash('sha256').update(blockHeader).digest('hex');

    const block: AuditBlock = {
      index,
      timestamp,
      orgId,
      actionType,
      agentUsed,
      dataHash,
      previousHash,
      blockHash,
    };

    chain.push(block);
    this.auditChainsByOrg.set(orgId, chain);

    console.log(`[CryptographicAuditLock] Appended Audit Block #${index} [${blockHash.substring(0, 12)}...] for org ${orgId}`);
    return block;
  }

  /**
   * Verify the mathematical integrity of an organization's cryptographic audit chain
   */
  public verifyAuditChainIntegrity(orgId: string): { isValid: boolean; brokenBlockIndex?: number; error?: string } {
    const chain = this.auditChainsByOrg.get(orgId) || [];

    for (let i = 0; i < chain.length; i++) {
      const current = chain[i];

      if (i > 0) {
        const previous = chain[i - 1];
        if (current.previousHash !== previous.blockHash) {
          return {
            isValid: false,
            brokenBlockIndex: i,
            error: `Chain broken at Block #${i}: Previous hash mismatch.`,
          };
        }
      }

      const expectedHeader = `${current.index}:${current.timestamp}:${current.orgId}:${current.actionType}:${current.agentUsed}:${current.dataHash}:${current.previousHash}`;
      const expectedBlockHash = crypto.createHash('sha256').update(expectedHeader).digest('hex');

      if (current.blockHash !== expectedBlockHash) {
        return {
          isValid: false,
          brokenBlockIndex: i,
          error: `Chain tampered at Block #${i}: Data payload or block hash modified.`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Get audit chain history for organization
   */
  public getAuditChain(orgId: string): AuditBlock[] {
    return [...(this.auditChainsByOrg.get(orgId) || [])];
  }
}

export const auditLock = CryptographicAuditLock.getInstance();
