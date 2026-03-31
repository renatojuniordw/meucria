'use client'

import styles from './Pricing.module.scss'
import { Check } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$0',
    period: '/mês',
    features: ['15 prompts/mês', '1 marca', 'Compartilhamento de prompts', 'Upload de resultado'],
    cta: 'Começar grátis',
    href: '/login?tab=register',
    highlight: false,
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$29',
    period: '/mês',
    features: ['60 prompts/mês', '3 marcas', 'Compartilhamento de prompts', 'Upload de resultado'],
    cta: 'Assinar Básico',
    href: '/login?tab=register&plan=basic',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$49',
    period: '/mês',
    badge: 'Mais popular',
    features: ['Prompts ilimitados', 'Marcas ilimitadas', 'Clonagem de arte IA', 'Copy de conversão', 'Histórico completo'],
    cta: 'Assinar Pro',
    href: '/login?tab=register&plan=pro',
    highlight: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <h2>Planos</h2>
        <div className={styles.grid}>
          {plans.map((plan) => (
            <div key={plan.id} className={`${styles.card} ${plan.highlight ? styles.highlighted : ''}`}>
              {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
              <h3>{plan.name}</h3>
              <div className={styles.price}>
                <span className={styles.amount}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>
              <ul>
                {plan.features.map((f, i) => (
                  <li key={i}><Check size={14} /> {f}</li>
                ))}
              </ul>
              <a href={plan.href} className={styles.cta}>{plan.cta}</a>
            </div>
          ))}
        </div>
        <p className={styles.note}>Cancele quando quiser. Sem fidelidade.</p>
      </div>
    </section>
  )
}
