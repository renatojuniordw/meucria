'use client'

import React from 'react'
import { Type, Sparkles } from 'lucide-react'
import styles from './FontOverride.module.scss'
import { FONTS } from '@/lib/constants/fonts'

export type FontModeOverride = 'manual' | 'ai'

export interface BrandFontsOverride {
  title?: string
  body?: string
  accent?: string
}

interface FontOverrideProps {
  mode: FontModeOverride
  fonts: BrandFontsOverride
  brandFontMode: 'manual' | 'ai'
  onChangeMode: (mode: FontModeOverride) => void
  onChangeFonts: (fonts: BrandFontsOverride) => void
}

export function FontOverride({
  mode,
  fonts,
  brandFontMode,
  onChangeMode,
  onChangeFonts,
}: FontOverrideProps) {
  const [isOverriding, setIsOverriding] = React.useState(false)

  const handleFontSelect = (slot: keyof BrandFontsOverride, value: string) => {
    onChangeFonts({ ...fonts, [slot]: value })
  }

  const allFonts = [
    { label: 'Display', options: FONTS.display },
    { label: 'Sans', options: FONTS.sans },
    { label: 'Serif', options: FONTS.serif },
    { label: 'Handwriting', options: FONTS.accent },
  ]

  if (!isOverriding) {
    return (
      <div className={styles.container}>
        <div className={styles.summaryBox}>
          <div className={styles.info}>
            <Type size={18} className={styles.icon} />
            <span>
              <strong>Tipografia: </strong>
              {brandFontMode === 'ai' 
                ? 'A IA escolherá as fontes com base no nicho da marca.'
                : 'Usando as fontes predefinidas da sua marca ativa.'}
            </span>
          </div>
          <button 
            type="button" 
            className={styles.overrideBtn}
            onClick={() => setIsOverriding(true)}
          >
            Mudar apenas para este prompt
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <Type size={18} /> Substituir Fontes da Marca
        </div>
        <button 
          type="button"
          className={styles.cancelBtn}
          onClick={() => {
            setIsOverriding(false)
            onChangeMode(brandFontMode)
            onChangeFonts({}) // Reset overrides
          }}
        >
          Cancelar / Usar da Marca
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={mode === 'ai' ? styles.activeTab : ''}
          onClick={() => onChangeMode('ai')}
        >
          <Sparkles size={16} /> IA Decide
        </button>
        <button
          type="button"
          className={mode === 'manual' ? styles.activeTab : ''}
          onClick={() => onChangeMode('manual')}
        >
          <Type size={16} /> Escolha Manual
        </button>
      </div>

      <div className={styles.content}>
        {mode === 'ai' && (
          <div className={styles.aiHint}>
            A IA vai ignorar as fontes da sua marca e buscar a melhor combinação exclusivamente para este criativo.
          </div>
        )}

        {mode === 'manual' && (
          <div className={styles.manualGrid}>
            {(['title', 'body', 'accent'] as const).map((slot) => (
              <div key={slot} className={styles.slot}>
                <label>
                  {slot === 'title' && 'Título'}
                  {slot === 'body' && 'Corpo'}
                  {slot === 'accent' && 'Destaque'}
                </label>
                <select
                  value={fonts[slot] || ''}
                  onChange={(e) => handleFontSelect(slot, e.target.value)}
                  className={styles.select}
                >
                  <option value="">Nenhuma (IA decide)</option>
                  {allFonts.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
