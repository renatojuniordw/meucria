import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function getCachedProfile(userId: string) {
  const key = `profile:${userId}`
  const cached = await redis.get(key)
  if (cached) return cached as Record<string, unknown>
  return null
}

export async function setCachedProfile(userId: string, profile: Record<string, unknown>) {
  const key = `profile:${userId}`
  await redis.set(key, profile, { ex: 60 * 5 }) // 5 minutes
}

export async function invalidateProfileCache(userId: string) {
  await redis.del(`profile:${userId}`)
}

export async function getCachedActiveBrand(brandId: string) {
  const key = `brand:${brandId}`
  const cached = await redis.get(key)
  if (cached) return cached as Record<string, unknown>
  return null
}

export async function setCachedActiveBrand(brandId: string, brand: Record<string, unknown>) {
  const key = `brand:${brandId}`
  await redis.set(key, brand, { ex: 60 * 10 }) // 10 minutes
}

export async function invalidateBrandCache(brandId: string) {
  await redis.del(`brand:${brandId}`)
}
