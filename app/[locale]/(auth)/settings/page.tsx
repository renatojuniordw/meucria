'use client'

import { useCurrentPlan } from '@/hooks/useCurrentPlan'
import { usePromptUsage } from '@/hooks/usePromptUsage'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { plan, planData } = useCurrentPlan()
  const { used, limit, remaining, resetAt } = usePromptUsage()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza? Todos os seus dados serão excluídos em 30 dias.')) return
    // Future: call DELETE /api/account
    alert('Funcionalidade em implementação. Contate suporte@meucrIA.com.br.')
  }

  const daysUntilReset = resetAt
    ? Math.max(0, Math.ceil((new Date(resetAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div style={{ padding: '32px 0', maxWidth: 480 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 32 }}>Configurações</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: 8 }}>Plano atual</h2>
        <p style={{ color: '#888' }}>
          <strong style={{ color: '#39ff14' }}>{planData.name}</strong> — R${(planData.price / 100).toFixed(0)}/mês
        </p>
        {plan !== 'pro' && (
          <a href="/pricing" style={{ color: '#39ff14', textDecoration: 'underline', fontSize: '0.85rem' }}>
            Fazer upgrade
          </a>
        )}
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: 8 }}>Uso</h2>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          {used}/{limit === Infinity ? '∞' : limit} prompts usados · {remaining} restantes · Reseta em {daysUntilReset} dias
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <button onClick={handleLogout} style={{ padding: '8px 24px', border: '1px solid #1a1a1a', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
          Sair da conta
        </button>
      </section>

      <section style={{ borderTop: '1px solid #1a1a1a', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: 8, color: '#ff4444' }}>Zona de perigo</h2>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 12 }}>Ao excluir sua conta, todos os dados serão removidos em até 30 dias.</p>
        <button onClick={handleDeleteAccount} style={{ padding: '8px 24px', border: '1px solid #ff4444', background: 'transparent', color: '#ff4444', cursor: 'pointer' }}>
          Excluir minha conta
        </button>
      </section>
    </div>
  )
}
