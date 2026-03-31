import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — MeuCrIA',
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 16px' }}>
      <h1>Política de Privacidade — MeuCrIA</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Última atualização: Março 2026</p>

      <h2>1. Quem somos</h2>
      <p>MeuCrIA é uma plataforma de geração de prompts para criativos de Instagram operada no Brasil. Contato: privacidade@meucrIA.com.br</p>

      <h2>2. Dados que coletamos</h2>
      <p><strong>Dados que você fornece:</strong> Nome e e-mail (cadastro), dados da marca (nicho, cores, descrição), textos e objetivos dos criativos, imagens enviadas no módulo de clonagem.</p>
      <p><strong>Dados coletados automaticamente:</strong> Endereço IP (segurança), User-Agent (demo sem cadastro), dados de uso (prompts gerados, plano, datas de acesso).</p>
      <p><strong>Dados de pagamento:</strong> Processados pelo Stripe — não armazenamos dados de cartão.</p>

      <h2>3. Para que usamos seus dados</h2>
      <p>Autenticação, geração de prompts personalizados, processamento de pagamentos, e-mails transacionais e prevenção de abusos.</p>

      <h2>4. Com quem compartilhamos</h2>
      <p>Apenas com prestadores essenciais: Supabase (banco de dados), OpenAI (geração de prompts), Stripe (pagamentos), Resend (e-mails). Não vendemos dados.</p>

      <h2>5. Retenção de dados</h2>
      <p>Conta ativa + 30 dias após exclusão. Imagens deletadas com a conta. Eventos de uso retidos por 12 meses, depois anonimizados.</p>

      <h2>6. Seus direitos (LGPD)</h2>
      <p>Acessar, corrigir, deletar, portabilidade, revogar consentimento de cookies. Contato: privacidade@meucrIA.com.br — prazo de até 15 dias úteis.</p>

      <h2>7. Menores de idade</h2>
      <p>O MeuCrIA não é direcionado a menores de 18 anos.</p>

      <h2>8. Alterações</h2>
      <p>Alterações relevantes serão comunicadas por e-mail com antecedência.</p>
    </main>
  )
}
