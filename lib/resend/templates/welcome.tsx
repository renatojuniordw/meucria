import { resend } from '../client'

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'MeuCrIA <noreply@meucrIA.com.br>',
    to: email,
    subject: 'Sua conta no MeuCrIA está pronta 🎨',
    html: `
      <h1>Bem-vindo ao MeuCrIA, ${name}!</h1>
      <p>Sua conta está pronta. Você tem <strong>15 prompts grátis</strong> para começar.</p>
      <p>Configure sua marca e comece a criar prompts otimizados para o Google ImageFX.</p>
      <a href="https://meucrIA.com.br/pt-BR/onboarding" style="display:inline-block;padding:12px 24px;background:#39ff14;color:#000;text-decoration:none;font-weight:bold;">Começar agora</a>
    `,
  })
}
