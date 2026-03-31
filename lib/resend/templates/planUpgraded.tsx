import { resend } from '../client'

export async function sendPlanUpgradedEmail(email: string, planName: string) {
  await resend.emails.send({
    from: 'MeuCrIA <noreply@meucrIA.com.br>',
    to: email,
    subject: `Plano ${planName} ativado com sucesso ✨`,
    html: `
      <h1>Plano ${planName} ativado!</h1>
      <p>Seu plano foi atualizado com sucesso. Aproveite todos os recursos desbloqueados.</p>
      <a href="https://meucrIA.com.br/pt-BR/dashboard" style="display:inline-block;padding:12px 24px;background:#39ff14;color:#000;text-decoration:none;font-weight:bold;">Ir para o painel</a>
    `,
  })
}
