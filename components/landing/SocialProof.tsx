'use client'

import styles from './SocialProof.module.scss'

export function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span>Mais de 500 prompts gerados</span>
        <span className={styles.dot}>•</span>
        <span>3 formatos suportados</span>
        <span className={styles.dot}>•</span>
        <span>Resultado em &lt; 10s</span>
      </div>
    </section>
  )
}
