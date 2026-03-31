'use client'

import React, { useEffect, useState } from 'react'
import { Aperture, Search, Sparkles, Binary } from 'lucide-react'
import styles from './CloneAnalysisLoader.module.scss'

export function CloneAnalysisLoader() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const steps = [
      { delay: 0, index: 0 },
      { delay: 2000, index: 1 },
      { delay: 4500, index: 2 },
      { delay: 7000, index: 3 },
    ]

    const timeouts = steps.map((s) => setTimeout(() => setStep(s.index), s.delay))

    return () => timeouts.forEach((t) => clearTimeout(t))
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.scanner}>
        <div className={styles.circle}>
          {step === 0 && <Search size={32} className={styles.icon} />}
          {step === 1 && <Aperture size={32} className={styles.icon} />}
          {step === 2 && <Binary size={32} className={styles.icon} />}
          {step === 3 && <Sparkles size={32} className={styles.icon} />}
        </div>
        <div className={styles.scanLine} />
      </div>

      <div className={styles.statusBox}>
        <p className={step === 0 ? styles.active : styles.done}>1. Processando arquivo visual...</p>
        <p className={step === 1 ? styles.active : step > 1 ? styles.done : styles.pending}>
          2. Identificando paleta de cores e iluminação...
        </p>
        <p className={step === 2 ? styles.active : step > 2 ? styles.done : styles.pending}>
          3. Extraindo estilo de direção de arte (Vision AI)...
        </p>
        <p className={step === 3 ? styles.active : step > 3 ? styles.done : styles.pending}>
          4. Convertendo estilo em Engenharia de Prompt...
        </p>
      </div>
    </div>
  )
}
