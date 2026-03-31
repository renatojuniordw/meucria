import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ratelimit } from '@/lib/upstash/ratelimit'
import { getBrand } from '@/lib/repositories/brandRepo'
import { getProfile } from '@/lib/repositories/profileRepo'
import { logUsageEvent } from '@/lib/repositories/profileRepo'
import { cloneArtwork } from '@/lib/openai/cloneArtwork'
import { sanitizeInput } from '@/lib/utils/sanitizeInput'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // 1. Verify Pro plan
    const profile = await getProfile(user.id)
    if (profile.plan !== 'pro') {
      return NextResponse.json({ error: 'Recurso exclusivo do plano Pro' }, { status: 403 })
    }

    // 2. Rate limit (5 req/min for vision)
    const { success } = await ratelimit.limit(`clone:${user.id}`)
    if (!success) return NextResponse.json({ error: 'Muitas requisições.' }, { status: 429 })

    // 3. Parse form data
    const formData = await req.formData()
    const image = formData.get('image') as File | null
    const brandId = formData.get('brandId') as string
    const disclaimerAccepted = formData.get('disclaimerAccepted') === 'true'

    if (!image || !brandId || !disclaimerAccepted) {
      return NextResponse.json({ error: 'Dados incompletos ou disclaimer não aceito' }, { status: 400 })
    }

    // 4. Validate image
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(image.type) || image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem inválida (max 5MB, jpeg/png/webp)' }, { status: 400 })
    }

    // 5. Convert to base64
    const buffer = Buffer.from(await image.arrayBuffer())
    const base64 = buffer.toString('base64')

    // 6. Get brand data
    const brand = await getBrand(brandId, user.id)
    const brandData = sanitizeInput({ name: brand.name, niche: brand.niche, description: brand.description })

    // 7. Clone via Vision
    const generatedPrompt = await cloneArtwork({ imageBase64: base64, brandData })

    // 8. Upload image to storage
    const imagePath = `${user.id}/${crypto.randomUUID()}.jpg`
    await supabaseAdmin.storage.from('clone-sources').upload(imagePath, buffer, { contentType: image.type })
    const { data: urlData } = supabaseAdmin.storage.from('clone-sources').getPublicUrl(imagePath)

    // 9. Save to cloned_prompts
    await supabaseAdmin.from('cloned_prompts').insert({
      user_id: user.id,
      brand_id: brandId,
      source_image_url: urlData.publicUrl,
      generated_prompt: generatedPrompt,
      disclaimer_accepted_at: new Date().toISOString(),
    })

    // 10. Log events
    await logUsageEvent(user.id, 'disclaimer_accepted')
    await logUsageEvent(user.id, 'artwork_cloned', { brandId })

    return NextResponse.json({ prompt: generatedPrompt })
  } catch (error) {
    console.error('Clone Error:', error)
    return NextResponse.json({ error: 'Erro ao clonar arte' }, { status: 500 })
  }
}
