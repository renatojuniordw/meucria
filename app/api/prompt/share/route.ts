import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setPromptPublic } from '@/lib/repositories/promptRepo'
import { logUsageEvent } from '@/lib/repositories/profileRepo'
import { z } from 'zod'

const ShareSchema = z.object({ promptId: z.string().uuid() })

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const result = ShareSchema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    const id = await setPromptPublic(result.data.promptId, user.id)
    await logUsageEvent(user.id, 'prompt_shared', { promptId: id })

    return NextResponse.json({ url: `/p/${id}` })
  } catch (error) {
    console.error('Share Error:', error)
    return NextResponse.json({ error: 'Erro ao compartilhar prompt' }, { status: 500 })
  }
}
