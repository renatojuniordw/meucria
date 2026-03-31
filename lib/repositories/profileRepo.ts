import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ProfileRow {
  id: string
  full_name: string | null
  avatar_url: string | null
  plan: 'free' | 'basic' | 'pro'
  role: 'user' | 'admin'
  onboarding_completed: boolean
  active_brand_id: string | null
  prompts_used: number
  prompts_reset_at: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export async function getProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) throw new Error('Profile not found')
  return data as ProfileRow
}

export async function updateProfile(userId: string, updates: Partial<ProfileRow>): Promise<ProfileRow> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error || !data) throw new Error('Failed to update profile')
  return data as ProfileRow
}

export async function incrementPromptsUsed(userId: string, currentCount: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ prompts_used: currentCount + 1 })
    .eq('id', userId)

  if (error) throw new Error('Failed to increment usage')
}

export async function resetPromptsIfNeeded(userId: string, profile: ProfileRow): Promise<ProfileRow> {
  const resetAt = new Date(profile.prompts_reset_at)
  const now = new Date()

  if (now > resetAt) {
    const nextReset = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const updated = await updateProfile(userId, {
      prompts_used: 0,
      prompts_reset_at: nextReset.toISOString(),
    })
    return updated
  }

  return profile
}

export async function logUsageEvent(
  userId: string,
  eventType: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await supabaseAdmin.from('usage_events').insert({
    user_id: userId,
    event_type: eventType,
    metadata: metadata ?? null,
  })
}
