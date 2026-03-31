import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const FeedbackSchema = z.object({
  promptId: z.string().uuid(),
  feedback: z.string().min(1).max(1000),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const result = FeedbackSchema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    const { error } = await supabase.from('prompt_feedbacks').insert({
      prompt_id: result.data.promptId,
      user_id: user.id,
      feedback: result.data.feedback,
    })

    if (error) return NextResponse.json({ error: 'Erro ao salvar feedback' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback Error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
