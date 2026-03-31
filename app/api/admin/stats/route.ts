import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalUsers, paidUsers, promptsToday, promptsMonth, brandsCount] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).neq('plan', 'free'),
      supabaseAdmin.from('prompts').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabaseAdmin.from('prompts').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
      supabaseAdmin.from('brands').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    ])

    const activeWeek = await supabaseAdmin
      .from('usage_events')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString())

    return NextResponse.json({
      totalUsers: totalUsers.count ?? 0,
      activeUsersLast7Days: activeWeek.count ?? 0,
      promptsGeneratedToday: promptsToday.count ?? 0,
      promptsGeneratedThisMonth: promptsMonth.count ?? 0,
      paidUsers: paidUsers.count ?? 0,
      totalBrandsCreated: brandsCount.count ?? 0,
    })
  } catch (error) {
    console.error('Admin Stats Error:', error)
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}
