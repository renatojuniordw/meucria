import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const url = new URL(req.url)
    const plan = url.searchParams.get('plan')
    const page = parseInt(url.searchParams.get('page') ?? '1')
    const limit = 50

    let query = supabaseAdmin
      .from('profiles')
      .select('id, full_name, plan, role, prompts_used, created_at')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (plan) query = query.eq('plan', plan)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ users: data ?? [], page })
  } catch (error) {
    console.error('Admin Users Error:', error)
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}
