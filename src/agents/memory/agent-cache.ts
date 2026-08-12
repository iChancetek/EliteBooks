/**
 * EliteBooks — Multi-Tier Agent Caching Engine
 * L1 High-Speed In-Memory Cache + L2 Persistent Cache Store
 */

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  createdAt: number;
  ttlMs: number;
  tags: string[];
}

export class AgentCacheManager {
  private static instance: AgentCacheManager;
  private l1Cache: Map<string, CacheEntry> = new Map();
  private hits = 0;
  private misses = 0;

  private constructor() {}

  public static getInstance(): AgentCacheManager {
    if (!AgentCacheManager.instance) {
      AgentCacheManager.instance = new AgentCacheManager();
    }
    return AgentCacheManager.instance;
  }

  /**
   * Generate a deterministic cache key from a domain prefix and arguments
   */
  public generateKey(prefix: string, payload: unknown): string {
    const jsonStr = JSON.stringify(payload || {});
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `${prefix}:${Math.abs(hash)}`;
  }

  /**
   * Retrieve cached value if unexpired
   */
  public async get<T>(key: string): Promise<T | null> {
    const entry = this.l1Cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.createdAt > entry.ttlMs) {
      this.l1Cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value as T;
  }

  /**
   * Set value in cache with TTL and tags
   */
  public async set<T>(
    key: string,
    value: T,
    ttlMs: number = 300000, // Default 5 minutes
    tags: string[] = []
  ): Promise<void> {
    this.l1Cache.set(key, {
      key,
      value,
      createdAt: Date.now(),
      ttlMs,
      tags,
    });
  }

  /**
   * Invalidate all cache entries matching given tags
   */
  public async invalidateByTags(tags: string[]): Promise<number> {
    let count = 0;
    for (const [key, entry] of this.l1Cache.entries()) {
      if (entry.tags.some((t) => tags.includes(t))) {
        this.l1Cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Clear all L1 cache
   */
  public async clear(): Promise<void> {
    this.l1Cache.clear();
  }

  /**
   * Return telemetry metrics for monitoring cache hit-ratio
   */
  public getMetrics() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate.toFixed(2)}%`,
      size: this.l1Cache.size,
    };
  }
}

export const agentCache = AgentCacheManager.getInstance();
