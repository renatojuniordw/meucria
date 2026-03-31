import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updatePrompt } from '@/lib/repositories/promptRepo'
import { logUsageEvent } from '@/lib/repositories/profileRepo'
import { z } from 'zod'

const ImageSchema = z.object({
  promptId: z.string().uuid(),
  imageUrl: z.string().url(),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const result = ImageSchema.safeParse(await req.json())
    if (!result.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    await updatePrompt(result.data.promptId, user.id, {
      result_image_url: result.data.imageUrl,
    })

    await logUsageEvent(user.id, 'image_uploaded', { promptId: result.data.promptId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Image Upload Error:', error)
    return NextResponse.json({ error: 'Erro ao salvar imagem' }, { status: 500 })
  }
}
