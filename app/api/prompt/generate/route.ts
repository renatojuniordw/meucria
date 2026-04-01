import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ratelimit } from '@/lib/upstash/ratelimit'
import { sanitizeInput } from '@/lib/utils/sanitizeInput'
import { PromptGenerateSchema } from '@/lib/validations/prompt.schema'
import { generatePromptService, LimitExceededError } from '@/lib/services/promptService'
import type { PromptInput } from '@/lib/openai/buildDescriptive'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { success } = await ratelimit.limit(user.id)
    if (!success) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente em 1 minuto.' },
        { status: 429 }
      )
    }

    const rawBody = await req.json()
    const sanitized = sanitizeInput(rawBody)
    const result = PromptGenerateSchema.safeParse(sanitized)
    console.log({ rawBody, sanitized, result })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.format() },
        { status: 400 }
      )
    }

    const input = result.data as PromptInput & { brandId: string }
    const response = await generatePromptService(user.id, input)

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof LimitExceededError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 403 })
    }
    console.error('Generation Error:', error)
    return NextResponse.json({ error: 'Erro interno ao gerar prompt' }, { status: 500 })
  }
}
