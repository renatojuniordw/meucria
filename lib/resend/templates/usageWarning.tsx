import { resend } from '../client'

export async function sendUsageWarningEmail(email: string, remaining: number, total: number) {
  await resend.emails.send({
    from: 'MeuCrIA <noreply@meucrIA.com.br>',
    to: email,
    subject: 'Você está quase no limite dos seus prompts',
    html: `
      <h1>Atenção: limite próximo</h1>
      <p>Você usou <strong>${total - remaining}</strong> de <strong>${total}</strong> prompts neste ciclo.</p>
      <p>Restam apenas <strong>${remaining} prompts</strong>.</p>
      <p>Faça upgrade para continuar criando sem limites.</p>
      <a href="https://meucrIA.com.br/pt-BR/pricing" style="display:inline-block;padding:12px 24px;background:#39ff14;color:#000;text-decoration:none;font-weight:bold;">Ver planos</a>
    `,
  })
}
