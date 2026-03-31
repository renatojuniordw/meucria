import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface BrandRow {
  id: string
  user_id: string
  name: string
  niche: string | null
  description: string | null
  color_mode: string | null
  colors: { primary: string; secondary: string; accent: string } | null
  content_mode: string | null
  font_mode: string
  fonts: { title: string; body: string; accent: string } | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export async function getBrand(brandId: string, userId: string): Promise<BrandRow> {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  if (error || !data) throw new Error('Brand not found')
  return data as BrandRow
}

export async function listBrands(userId: string): Promise<BrandRow[]> {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to list brands')
  return (data ?? []) as BrandRow[]
}

export async function createBrand(userId: string, brand: Partial<BrandRow>): Promise<BrandRow> {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .insert({ ...brand, user_id: userId })
    .select()
    .single()

  if (error || !data) throw new Error('Failed to create brand')
  return data as BrandRow
}

export async function updateBrand(brandId: string, userId: string, updates: Partial<BrandRow>): Promise<BrandRow> {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', brandId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error || !data) throw new Error('Failed to update brand')
  return data as BrandRow
}

export async function softDeleteBrand(brandId: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('brands')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', brandId)
    .eq('user_id', userId)

  if (error) throw new Error('Failed to delete brand')
}

export async function countActiveBrands(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('brands')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (error) throw new Error('Failed to count brands')
  return count ?? 0
}
