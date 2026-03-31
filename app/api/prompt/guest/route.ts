import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGuestFingerprint } from '@/lib/fingerprint/guestFingerprint'
import { ratelimit } from '@/lib/upstash/ratelimit'
import { sanitizeInput } from '@/lib/utils/sanitizeInput'
import { generatePrompt } from '@/lib/openai/generatePrompt'
import { buildDescriptive } from '@/lib/openai/buildDescriptive'
import { z } from 'zod'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GuestSchema = z.object({
  niche: z.string().min(1).max(100),
  format: z.enum(['feed', 'story', 'carousel']),
  objective: z.string().min(5).max(500),
})

export async function POST(req: Request) {
  try {
    const fingerprint = await getGuestFingerprint()

    const { success } = await ratelimit.limit(`guest:${fingerprint}`)
    if (!success) {
      return NextResponse.json({ error: 'Limite de requisições excedido.' }, { status: 429 })
    }

    // Check if guest already used
    const { data: existing } = await supabaseAdmin
      .from('guest_usage')
      .select('used')
      .eq('fingerprint', fingerprint)
      .single()

    if (existing?.used) {
      return NextResponse.json({
        error: 'Você já usou seu teste gratuito. Crie uma conta para continuar.',
        code: 'GUEST_USED',
      }, { status: 403 })
    }

    const rawBody = await req.json()
    const sanitized = sanitizeInput(rawBody)
    const result = GuestSchema.safeParse(sanitized)

    if (!result.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const input = result.data

    const brand = {
      id: 'guest',
      name: 'Demo',
      niche: input.niche,
      color_mode: 'ai',
      font_mode: 'ai',
    }

    const descriptive = buildDescriptive(brand as never, {
      format: input.format as 'feed' | 'story' | 'carousel',
      hasPersona: false,
      objective: input.objective,
      contentMode: 'ai',
      colorMode: 'ai',
    })

    const generatedPrompt = await generatePrompt(descriptive)

    // Mark guest as used
    if (!existing) {
      await supabaseAdmin.from('guest_usage').insert({ fingerprint, used: true })
    } else {
      await supabaseAdmin.from('guest_usage').update({ used: true }).eq('fingerprint', fingerprint)
    }

    return NextResponse.json({ prompt: generatedPrompt })
  } catch (error) {
    console.error('Guest Generation Error:', error)
    return NextResponse.json({ error: 'Erro ao gerar prompt' }, { status: 500 })
  }
}
