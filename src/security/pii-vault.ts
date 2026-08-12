/**
 * EliteBooks — In-Process Ephemeral PII/PHI Financial Masking Vault
 * Protects client identity, financial accounts, SSNs/EINs, and healthcare PHI identifiers in RAM.
 * Replaces sensitive values with ephemeral tokens before sending data to external LLMs/APIs,
 * and restores values exclusively for local authorized UI presentation.
 */

export interface TokenMapping {
  token: string;
  originalValue: string;
  type: 'ssn' | 'ein' | 'bank_account' | 'routing' | 'credit_card' | 'email' | 'phone' | 'phi_policy';
  createdAt: number;
}

export interface EphemeralSessionVault {
  sessionId: string;
  tokenToOriginal: Map<string, TokenMapping>;
  originalToToken: Map<string, string>;
  lastAccessedAt: number;
}

export class EphemeralPIIVault {
  private static instance: EphemeralPIIVault;
  private vaultStore: Map<string, EphemeralSessionVault> = new Map();
  private readonly DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minute TTL

  private constructor() {}

  public static getInstance(): EphemeralPIIVault {
    if (!EphemeralPIIVault.instance) {
      EphemeralPIIVault.instance = new EphemeralPIIVault();
    }
    return EphemeralPIIVault.instance;
  }

  /**
   * Get or create an in-memory session vault
   */
  private getSessionVault(sessionId: string): EphemeralSessionVault {
    if (!this.vaultStore.has(sessionId)) {
      this.vaultStore.set(sessionId, {
        sessionId,
        tokenToOriginal: new Map(),
        originalToToken: new Map(),
        lastAccessedAt: Date.now(),
      });
    }

    const vault = this.vaultStore.get(sessionId)!;
    vault.lastAccessedAt = Date.now();
    return vault;
  }

  /**
   * Generate an ephemeral token for a sensitive value
   */
  private getOrCreateToken(
    sessionId: string,
    originalValue: string,
    type: TokenMapping['type']
  ): string {
    const vault = this.getSessionVault(sessionId);

    if (vault.originalToToken.has(originalValue)) {
      return vault.originalToToken.get(originalValue)!;
    }

    const tokenSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const token = `[${type.toUpperCase()}_TOK_${tokenSuffix}]`;

    const mapping: TokenMapping = {
      token,
      originalValue,
      type,
      createdAt: Date.now(),
    };

    vault.tokenToOriginal.set(token, mapping);
    vault.originalToToken.set(originalValue, token);

    return token;
  }

  /**
   * Mask all financial PII and healthcare PHI in input text for outbound LLM/API transmission
   */
  public mask(text: string, sessionId: string): string {
    if (!text || typeof text !== 'string') return text;

    let sanitized = text;

    // 1. SSN Detection: 000-00-0000
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, (match) =>
      this.getOrCreateToken(sessionId, match, 'ssn')
    );

    // 2. EIN Detection: 00-0000000
    sanitized = sanitized.replace(/\b\d{2}-\d{7}\b/g, (match) =>
      this.getOrCreateToken(sessionId, match, 'ein')
    );

    // 3. ABA Routing Number Detection: 9 digits starting with valid ABA prefix
    sanitized = sanitized.replace(/\b(0[1-9]|[1-2][0-9]|3[0-2]|6[1-9]|7[0-2]|80)\d{7}\b/g, (match) =>
      this.getOrCreateToken(sessionId, match, 'routing')
    );

    // 4. Credit Card Detection: 13-16 digits with optional dashes/spaces
    sanitized = sanitized.replace(/\b(?:\d[ -]*?){13,16}\b/g, (match) =>
      this.getOrCreateToken(sessionId, match, 'credit_card')
    );

    // 5. Bank Account Numbers: 8 to 17 standalone digits
    sanitized = sanitized.replace(/\b\d{8,17}\b/g, (match) =>
      this.getOrCreateToken(sessionId, match, 'bank_account')
    );

    // 6. Email Addresses
    sanitized = sanitized.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
      (match) => this.getOrCreateToken(sessionId, match, 'email')
    );

    // 7. Phone Numbers: e.g. 555-123-4567 or (555) 123-4567
    sanitized = sanitized.replace(
      /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g,
      (match) => this.getOrCreateToken(sessionId, match, 'phone')
    );

    // 8. Healthcare PHI Policy/Claim Numbers: e.g. POL-994821 or PHI-00129
    sanitized = sanitized.replace(/\b(POL|PHI|CLM|INS)-\d{5,10}\b/gi, (match) =>
      this.getOrCreateToken(sessionId, match, 'phi_policy')
    );

    return sanitized;
  }

  /**
   * Restore original PII/PHI values from ephemeral tokens for local authorized presentation
   */
  public unmask(text: string, sessionId: string): string {
    if (!text || typeof text !== 'string') return text;

    const vault = this.vaultStore.get(sessionId);
    if (!vault || vault.tokenToOriginal.size === 0) return text;

    let restored = text;
    for (const [token, mapping] of vault.tokenToOriginal.entries()) {
      restored = restored.split(token).join(mapping.originalValue);
    }

    return restored;
  }

  /**
   * Purge session tokens immediately from RAM
   */
  public purgeSession(sessionId: string): void {
    const vault = this.vaultStore.get(sessionId);
    if (vault) {
      vault.tokenToOriginal.clear();
      vault.originalToToken.clear();
      this.vaultStore.delete(sessionId);
      console.log(`[EphemeralPIIVault] Purged PII/PHI session vault [${sessionId}]`);
    }
  }

  /**
   * Automatic cleanup of stale session vaults exceeding TTL
   */
  public cleanStaleSessions(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, vault] of this.vaultStore.entries()) {
      if (now - vault.lastAccessedAt > this.DEFAULT_TTL_MS) {
        this.purgeSession(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

export const piiVault = EphemeralPIIVault.getInstance();
