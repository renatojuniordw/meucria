import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface PromptRow {
  id: string
  user_id: string
  brand_id: string | null
  format: string
  has_persona: boolean
  raw_input: Record<string, unknown>
  generated_prompt: string | null
  generated_copy: { hook: string; body: string; cta: string; hashtags: string[] } | null
  copy_tone: string | null
  is_preset: boolean
  preset_name: string | null
  is_public: boolean
  result_image_url: string | null
  deleted_at: string | null
  created_at: string
}

export async function savePrompt(data: Partial<PromptRow>): Promise<PromptRow> {
  const { data: row, error } = await supabaseAdmin
    .from('prompts')
    .insert(data)
    .select()
    .single()

  if (error || !row) throw new Error('Failed to save prompt')
  return row as PromptRow
}

export async function getPrompt(promptId: string, userId: string): Promise<PromptRow> {
  const { data, error } = await supabaseAdmin
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .eq('user_id', userId)
    .single()

  if (error || !data) throw new Error('Prompt not found')
  return data as PromptRow
}

export async function getPublicPrompt(promptId: string): Promise<PromptRow> {
  const { data, error } = await supabaseAdmin
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .eq('is_public', true)
    .single()

  if (error || !data) throw new Error('Public prompt not found')
  return data as PromptRow
}

export async function listPrompts(userId: string, limit = 50): Promise<PromptRow[]> {
  const { data, error } = await supabaseAdmin
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error('Failed to list prompts')
  return (data ?? []) as PromptRow[]
}

export async function updatePrompt(promptId: string, userId: string, updates: Partial<PromptRow>): Promise<PromptRow> {
  const { data, error } = await supabaseAdmin
    .from('prompts')
    .update(updates)
    .eq('id', promptId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error || !data) throw new Error('Failed to update prompt')
  return data as PromptRow
}

export async function setPromptPublic(promptId: string, userId: string): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('prompts')
    .update({ is_public: true })
    .eq('id', promptId)
    .eq('user_id', userId)
    .select('id')
    .single()

  if (error || !data) throw new Error('Failed to share prompt')
  return data.id
}
