import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBrand, updateBrand, softDeleteBrand } from '@/lib/repositories/brandRepo'
import { sanitizeInput } from '@/lib/utils/sanitizeInput'
import { BrandUpdateSchema } from '@/lib/validations/brand.schema'
import { invalidateBrandCache } from '@/lib/cache'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { id } = await params
    const brand = await getBrand(id, user.id)
    return NextResponse.json(brand)
  } catch (error) {
    console.error('Get Brand Error:', error)
    return NextResponse.json({ error: 'Marca não encontrada' }, { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { id } = await params
    const rawBody = await req.json()
    const sanitized = sanitizeInput(rawBody)
    const result = BrandUpdateSchema.safeParse(sanitized)
    if (!result.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    const brand = await updateBrand(id, user.id, result.data as Partial<import('@/lib/repositories/brandRepo').BrandRow>)
    await invalidateBrandCache(id)

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Update Brand Error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar marca' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { id } = await params
    await softDeleteBrand(id, user.id)
    await invalidateBrandCache(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Brand Error:', error)
    return NextResponse.json({ error: 'Erro ao deletar marca' }, { status: 500 })
  }
}
