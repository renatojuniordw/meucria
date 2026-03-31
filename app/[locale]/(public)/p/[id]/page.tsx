import { getPublicPrompt } from '@/lib/repositories/promptRepo'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params
    const prompt = await getPublicPrompt(id)
    const raw = prompt.raw_input as Record<string, unknown>
    return {
      title: `Prompt: ${raw.objective ?? 'Criativo com IA'} — MeuCrIA`,
      description: prompt.generated_prompt?.slice(0, 160) ?? 'Prompt gerado com IA pelo MeuCrIA.',
      openGraph: {
        title: `MeuCrIA — Prompt para ${raw.format ?? 'criativo'}`,
        description: 'Seu próximo criativo começa com o prompt certo.',
      },
    }
  } catch {
    return { title: 'Prompt — MeuCrIA' }
  }
}

export default async function PublicPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let prompt
  try {
    prompt = await getPublicPrompt(id)
  } catch {
    return (
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
        <h1>Prompt não encontrado</h1>
        <p style={{ color: '#888' }}>Este prompt não existe ou não está mais público.</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '64px 16px' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Prompt compartilhado</h1>
      <textarea
        readOnly
        value={prompt.generated_prompt ?? ''}
        rows={12}
        style={{
          width: '100%',
          padding: 16,
          background: 'rgba(57, 255, 20, 0.05)',
          border: '1px solid #39ff14',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          resize: 'none',
        }}
      />
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <p style={{ color: '#888', marginBottom: 16 }}>Quer criar prompts como este? Cadastre-se grátis.</p>
        <a
          href="/login?tab=register"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#39ff14',
            color: '#000',
            fontWeight: 700,
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Criar minha conta grátis
        </a>
      </div>
    </main>
  )
}
