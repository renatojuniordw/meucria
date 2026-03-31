'use client'

import styles from './FinalCTA.module.scss'
import { Check } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Pronto para criar criativos melhores em menos tempo?</h2>
        <p>Comece grátis hoje. 15 prompts para testar à vontade.</p>
        <a href="/login?tab=register" className={styles.cta}>Criar minha conta grátis</a>
        <div className={styles.proof}>
          <span><Check size={14} /> Sem cartão</span>
          <span><Check size={14} /> Sem contrato</span>
          <span><Check size={14} /> Resultado imediato</span>
        </div>
      </div>
    </section>
  )
}
