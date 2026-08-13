/**
 * EliteBooks — Multi-Tier Agent Caching Engine
 * L1 High-Speed In-Memory Cache + L2 Distributed Upstash Redis Cache Store
 */

import { Redis } from '@upstash/redis';

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
  private redis: Redis | null = null;
  private hits = 0;
  private misses = 0;

  private constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token && url !== 'undefined') {
      try {
        this.redis = new Redis({ url, token });
        console.log('[AgentCacheManager] Upstash Redis L2 Cache initialized.');
      } catch (err) {
        console.warn('[AgentCacheManager] Failed to initialize Redis L2 client, using L1 fallback:', err);
      }
    } else {
      console.log('[AgentCacheManager] Upstash Redis credentials not detected. Running in L1 In-Memory mode.');
    }
  }

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
      hash |= 0;
    }
    return `${prefix}:${Math.abs(hash)}`;
  }

  /**
   * Retrieve cached value if unexpired (L1 -> L2 fallback)
   */
  public async get<T>(key: string): Promise<T | null> {
    // 1. Check L1 In-Memory Cache
    const entry = this.l1Cache.get(key);
    if (entry) {
      const now = Date.now();
      if (now - entry.createdAt <= entry.ttlMs) {
        this.hits++;
        return entry.value as T;
      }
      this.l1Cache.delete(key);
    }

    // 2. Check L2 Upstash Redis Cache if available
    if (this.redis) {
      try {
        const redisValue = await this.redis.get<T>(key);
        if (redisValue !== null && redisValue !== undefined) {
          this.hits++;
          // Populate L1 cache for local fast read
          this.l1Cache.set(key, {
            key,
            value: redisValue,
            createdAt: Date.now(),
            ttlMs: 300000,
            tags: [],
          });
          return redisValue;
        }
      } catch (err) {
        console.warn('[AgentCacheManager] Redis L2 get error:', err);
      }
    }

    this.misses++;
    return null;
  }

  /**
   * Set value in cache with TTL and tags across L1 & L2 Redis
   */
  public async set<T>(
    key: string,
    value: T,
    ttlMs: number = 300000, // Default 5 minutes
    tags: string[] = []
  ): Promise<void> {
    // Set L1 Cache
    this.l1Cache.set(key, {
      key,
      value,
      createdAt: Date.now(),
      ttlMs,
      tags,
    });

    // Set L2 Upstash Redis Cache
    if (this.redis) {
      try {
        const ttlSeconds = Math.ceil(ttlMs / 1000);
        await this.redis.set(key, value, { ex: ttlSeconds });
      } catch (err) {
        console.warn('[AgentCacheManager] Redis L2 set error:', err);
      }
    }
  }

  /**
   * Invalidate cache entries matching given tags
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
      l2Connected: !!this.redis,
    };
  }
}

export const agentCache = AgentCacheManager.getInstance();
