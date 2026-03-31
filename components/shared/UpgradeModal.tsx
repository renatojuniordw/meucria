'use client'

import Link from 'next/link'
import styles from './UpgradeModal.module.scss'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
}

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2>Recurso exclusivo Pro</h2>
        <p>
          {feature
            ? `"${feature}" está disponível apenas no plano Pro.`
            : 'Este recurso está disponível apenas no plano Pro.'}
        </p>
        <p className={styles.subtitle}>
          Desbloqueie prompts ilimitados, clonagem de arte, copy de conversão e muito mais.
        </p>
        <div className={styles.actions}>
          <Link href="/pricing?highlight=pro" className={styles.cta}>
            Ver plano Pro
          </Link>
          <button onClick={onClose} className={styles.cancel}>Voltar</button>
        </div>
      </div>
    </div>
  )
}
