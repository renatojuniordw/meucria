import { redisGet, redisSet, redisDel } from '@/lib/redis/client'

export async function getCachedProfile(userId: string) {
  return redisGet<Record<string, unknown>>(`profile:${userId}`)
}

export async function setCachedProfile(userId: string, profile: Record<string, unknown>) {
  await redisSet(`profile:${userId}`, profile, 60 * 5) // 5 minutes
}

export async function invalidateProfileCache(userId: string) {
  await redisDel(`profile:${userId}`)
}

export async function getCachedActiveBrand(brandId: string) {
  return redisGet<Record<string, unknown>>(`brand:${brandId}`)
}

export async function setCachedActiveBrand(brandId: string, brand: Record<string, unknown>) {
  await redisSet(`brand:${brandId}`, brand, 60 * 10) // 10 minutes
}

export async function invalidateBrandCache(brandId: string) {
  await redisDel(`brand:${brandId}`)
}
