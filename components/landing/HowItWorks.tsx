'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import styles from './HowItWorks.module.scss'
import { Palette, Layers, Copy } from 'lucide-react'

const steps = [
  { icon: Palette, title: 'Configure sua marca', desc: 'Informe seu nicho, cores e estilo uma vez. A IA usa tudo isso.' },
  { icon: Layers, title: 'Escolha o formato', desc: 'Feed, story ou carrossel. Com ou sem persona. Você decide.' },
  { icon: Copy, title: 'Copie e use', desc: 'O prompt chega pronto para colar no Google ImageFX e gerar a imagem.' },
]

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Como funciona</h2>
        <div className={styles.grid}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={styles.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className={styles.iconWrap}>
                <step.icon size={28} />
                <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className={styles.cta}>
          <Link href="/login?tab=register">Começar agora — é grátis</Link>
        </div>
      </div>
    </section>
  )
}
