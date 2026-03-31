import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso — MeuCrIA',
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 16px' }}>
      <h1>Termos de Uso — MeuCrIA</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Última atualização: Março 2026</p>

      <h2>1. Aceitação</h2>
      <p>Ao criar uma conta ou usar o MeuCrIA, você concorda com estes termos.</p>

      <h2>2. O que é o MeuCrIA</h2>
      <p>Plataforma que gera prompts de texto para Google ImageFX e copies de conversão para Instagram. Não geramos imagens.</p>

      <h2>3. Cadastro</h2>
      <p>Deve ter 18 anos ou mais. Uma conta por pessoa ou empresa. Dados verdadeiros.</p>

      <h2>4. Uso aceitável</h2>
      <p><strong>Permitido:</strong> Gerar prompts para criativos, usar em ferramentas de geração de imagem, compartilhar via link.</p>
      <p><strong>Proibido:</strong> Conteúdo ilegal, engenharia reversa, bots, upload de imagens sem direitos, revenda.</p>

      <h2>5. Módulo de clonagem</h2>
      <p>Ao usar, você declara que a imagem é de sua autoria ou possui direitos de uso.</p>

      <h2>6. Propriedade intelectual</h2>
      <p>Os prompts gerados pertencem a você. O sistema, interface e lógica pertencem ao MeuCrIA.</p>

      <h2>7. Planos e pagamentos</h2>
      <p>Cobrados mensalmente via Stripe. Cancelamento no fim do período. Sem reembolso proporcional.</p>

      <h2>8. Limitação de responsabilidade</h2>
      <p>Não nos responsabilizamos pela qualidade das imagens geradas por ferramentas de terceiros.</p>

      <h2>9. Lei aplicável</h2>
      <p>Regidos pelas leis brasileiras.</p>

      <h2>10. Contato</h2>
      <p>contato@meucrIA.com.br</p>
    </main>
  )
}
