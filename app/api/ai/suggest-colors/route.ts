import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ratelimit } from '@/lib/upstash/ratelimit'
import { sanitizeInput } from '@/lib/utils/sanitizeInput'
import { suggestColors } from '@/lib/openai/suggestContent'
import { z } from 'zod'

const Schema = z.object({
  niche: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { success } = await ratelimit.limit(user.id)
    if (!success) return NextResponse.json({ error: 'Muitas requisições.' }, { status: 429 })

    const rawBody = await req.json()
    const sanitized = sanitizeInput(rawBody)
    const result = Schema.safeParse(sanitized)
    if (!result.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    const colors = await suggestColors(result.data.niche, result.data.description)
    return NextResponse.json(colors)
  } catch (error: any) {
    console.error('Suggest Colors Error:', error)
    return NextResponse.json({ error: 'Erro ao sugerir cores', details: error?.message || error?.details || String(error) }, { status: 500 })
  }
}
