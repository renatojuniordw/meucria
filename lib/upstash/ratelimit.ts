// lib/upstash/ratelimit.ts
// Rate limiting using ioredis (works with local Redis + Docker)
import { getRedis, redisIncr, redisExpire } from '@/lib/redis/client'

interface RateLimitResult {
  success: boolean
  remaining: number
}

const WINDOW_SIZE = 60 // seconds
const MAX_REQUESTS = 10

export const ratelimit = {
  async limit(identifier: string): Promise<RateLimitResult> {
    const key = `ratelimit:${identifier}:${Math.floor(Date.now() / 1000 / WINDOW_SIZE)}`

    try {
      const count = await redisIncr(key)

      // Set TTL on first request in window
      if (count === 1) {
        await redisExpire(key, WINDOW_SIZE)
      }

      return {
        success: count <= MAX_REQUESTS,
        remaining: Math.max(0, MAX_REQUESTS - count),
      }
    } catch (err) {
      console.error('[Ratelimit] Error:', err)
      // Fail open — don't block users if Redis is down
      return { success: true, remaining: MAX_REQUESTS }
    }
  },
}
