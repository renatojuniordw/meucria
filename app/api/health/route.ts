import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis/client'

export async function GET() {
  const checks: Record<string, string> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    redis: 'unknown',
  }

  try {
    const redis = getRedis()
    const pong = await redis.ping()
    checks.redis = pong === 'PONG' ? 'ok' : 'error'
  } catch {
    checks.redis = 'error'
  }

  const allOk = checks.redis === 'ok'

  return NextResponse.json(checks, { status: allOk ? 200 : 503 })
}
