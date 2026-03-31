// app/api/brands/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    
    // 1. Create the Brand
    const { data: brand, error: brandErr } = await supabase
      .from('brands')
      .insert({
        user_id: user.id,
        name: body.name,
        niche: body.niche,
        description: body.description,
        color_mode: body.colorMode,
        colors: body.colors,
        font_mode: body.fontMode,
        fonts: body.fonts,
        content_mode: body.contentPreference
      })
      .select('id')
      .single()

    if (brandErr) throw brandErr

    // 2. Update Profile (Onboarding completed + Active Brand)
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        active_brand_id: brand.id
      })
      .eq('id', user.id)

    if (profileErr) throw profileErr

    return NextResponse.json({ success: true, brandId: brand.id })

  } catch (error) {
    console.error('Onboarding Finalize Error:', error)
    return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)

  return NextResponse.json({ brands })
}
