import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ratelimit } from '@/lib/upstash/ratelimit'
import { sanitizeInput } from '@/lib/utils/sanitizeInput'
import { CopyGenerateSchema } from '@/lib/validations/copy.schema'
import { generateCopyService } from '@/lib/services/copyService'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { success } = await ratelimit.limit(user.id)
    if (!success) return NextResponse.json({ error: 'Muitas requisições.' }, { status: 429 })

    const rawBody = await req.json()
    const sanitized = sanitizeInput(rawBody)
    const result = CopyGenerateSchema.safeParse(sanitized)
    if (!result.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    const copy = await generateCopyService(user.id, result.data)
    return NextResponse.json(copy)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro ao gerar copy'
    console.error('Copy Generation Error:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
