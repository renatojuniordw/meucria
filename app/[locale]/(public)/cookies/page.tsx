import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies — MeuCrIA',
}

export default function CookiesPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 16px' }}>
      <h1>Política de Cookies — MeuCrIA</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Última atualização: Março 2026</p>

      <h2>O que são cookies</h2>
      <p>Pequenos arquivos de texto armazenados no seu dispositivo ao visitar um site.</p>

      <h2>Cookies essenciais (sempre ativos)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead><tr><th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Cookie</th><th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Finalidade</th><th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Duração</th></tr></thead>
        <tbody>
          <tr><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>sb-*-auth-token</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>Sessão Supabase</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>Sessão</td></tr>
          <tr><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>meucrIA_cookie_consent</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>Preferência de cookies</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>365 dias</td></tr>
        </tbody>
      </table>

      <h2>Cookies de pagamento (com consentimento)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead><tr><th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Cookie</th><th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Origem</th><th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Finalidade</th></tr></thead>
        <tbody>
          <tr><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>__stripe_mid</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>Stripe</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>Prevenção de fraudes</td></tr>
          <tr><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>__stripe_sid</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>Stripe</td><td style={{ padding: 8, borderBottom: '1px solid #1a1a1a' }}>Sessão de checkout</td></tr>
        </tbody>
      </table>

      <h2>O que NÃO fazemos</h2>
      <p>Não usamos cookies de rastreamento publicitário, Google Analytics, Facebook Pixel ou similares.</p>

      <h2>Gerenciar cookies</h2>
      <p>Clique em &quot;Gerenciar cookies&quot; no rodapé a qualquer momento.</p>

      <h2>Contato</h2>
      <p>privacidade@meucrIA.com.br</p>
    </main>
  )
}
