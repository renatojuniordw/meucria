'use client'

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '../ui/Button'
import styles from './CloneDisclaimerModal.module.scss'

interface CloneDisclaimerModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

export function CloneDisclaimerModal({ isOpen, onAccept, onDecline }: CloneDisclaimerModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onDecline}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onDecline}>
          <X size={18} />
        </button>

        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <AlertTriangle size={24} className={styles.warningIcon} />
          </div>
          <h3>Aviso Importante (Deepfake & Copyright)</h3>
        </div>

        <div className={styles.content}>
          <p>
            O módulo de Clonagem analisa uma imagem de referência para recriar o <strong>estilo visual, iluminação e composição</strong>.
          </p>
          <ul>
            <li>Não nos responsabilizamos pelo uso de imagens com direitos autorais (copyright).</li>
            <li>Não utilize rostos de pessoas reais sem permissão expressa (proteção contra deepfakes).</li>
            <li>A IA pode recusar analisar imagens que violem políticas de segurança.</li>
          </ul>
          <p className={styles.confirmation}>
            Ao prosseguir, você concorda com nossas políticas e assume a responsabilidade pelo uso das imagens de referência.
          </p>
        </div>

        <div className={styles.footer}>
          <Button type="button" onClick={onDecline} className={styles.cancelBtn}>
            Cancelar
          </Button>
          <Button type="button" onClick={onAccept} className={styles.acceptBtn}>
            Eu Concordo & Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
