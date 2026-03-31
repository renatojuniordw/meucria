import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis/client'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const checks: Record<string, string> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    redis: 'unknown',
    supabase: 'unknown',
  }

  // 1. Check Redis
  try {
    const redis = getRedis()
    const pong = await redis.ping()
    checks.redis = pong === 'PONG' ? 'ok' : 'error'
  } catch (err) {
    checks.redis = 'error'
  }

  // 2. Check Supabase
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    checks.supabase = error ? 'error' : 'ok'
  } catch (err) {
    checks.supabase = 'error'
  }

  const allOk = checks.redis === 'ok' && checks.supabase === 'ok'

  return NextResponse.json(checks, { status: allOk ? 200 : 503 })
}
