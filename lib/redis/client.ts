import Redis from 'ioredis'

let redisInstance: Redis | null = null

export function getRedis(): Redis {
  if (!redisInstance) {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
    redisInstance = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })

    redisInstance.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message)
    })
  }

  return redisInstance
}

// Convenience wrappers matching previous API
export async function redisGet<T = string>(key: string): Promise<T | null> {
  try {
    const redis = getRedis()
    const value = await redis.get(key)
    if (!value) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as unknown as T
    }
  } catch (err) {
    console.error('[Redis] GET error:', err)
    return null
  }
}

export async function redisSet(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  try {
    const redis = getRedis()
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)

    if (ttlSeconds) {
      await redis.set(key, serialized, 'EX', ttlSeconds)
    } else {
      await redis.set(key, serialized)
    }
  } catch (err) {
    console.error('[Redis] SET error:', err)
  }
}

export async function redisDel(key: string): Promise<void> {
  try {
    const redis = getRedis()
    await redis.del(key)
  } catch (err) {
    console.error('[Redis] DEL error:', err)
  }
}

export async function redisIncr(key: string): Promise<number> {
  try {
    const redis = getRedis()
    return await redis.incr(key)
  } catch (err) {
    console.error('[Redis] INCR error:', err)
    return 0
  }
}

export async function redisExpire(key: string, ttlSeconds: number): Promise<void> {
  try {
    const redis = getRedis()
    await redis.expire(key, ttlSeconds)
  } catch (err) {
    console.error('[Redis] EXPIRE error:', err)
  }
}
