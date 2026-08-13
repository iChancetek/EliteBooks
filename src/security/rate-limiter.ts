/**
 * EliteBooks — Serverless Redis Rate Limiter & Abuse Prevention Engine
 * Protects MCP tool invocations, AI agent routes, and sensitive endpoints using @upstash/ratelimit.
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let ratelimitEngine: Ratelimit | null = null;

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (url && token && url !== 'undefined') {
  try {
    const redis = new Redis({ url, token });
    ratelimitEngine = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 requests per minute per IP/user
      analytics: true,
      prefix: 'elitebooks:ratelimit',
    });
    console.log('[RateLimiter] Upstash Redis Rate Limiter initialized (30 req/min).');
  } catch (err) {
    console.warn('[RateLimiter] Failed to initialize Redis Rate Limiter:', err);
  }
}

export async function checkRateLimit(
  identifier: string = 'anonymous'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (!ratelimitEngine) {
    // Fallback if Redis credentials are not configured
    return { success: true, limit: 30, remaining: 30, reset: Date.now() + 60000 };
  }

  try {
    const result = await ratelimitEngine.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (err) {
    console.warn('[RateLimiter] Error during rate limit check, passing through:', err);
    return { success: true, limit: 30, remaining: 30, reset: Date.now() + 60000 };
  }
}
