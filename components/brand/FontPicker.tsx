'use client'

import React from 'react'
import { Sparkles, Type, Info } from 'lucide-react'
import styles from './FontPicker.module.scss'
// import alternativo para fontes se houver
import { FONTS } from '@/lib/constants/fonts'

export type FontMode = 'manual' | 'ai'

export interface BrandFonts {
  title?: string
  body?: string
  accent?: string
}

interface FontPickerProps {
  mode: FontMode
  fonts: BrandFonts
  onChangeMode: (mode: FontMode) => void
  onChangeFonts: (fonts: BrandFonts) => void
}

export function FontPicker({
  mode,
  fonts,
  onChangeMode,
  onChangeFonts,
}: FontPickerProps) {
  
  const handleFontSelect = (slot: keyof BrandFonts, value: string) => {
    onChangeFonts({ ...fonts, [slot]: value })
  }

  // Juntar todas as fontes para o select
  const allFonts = [
    { label: 'Display (Títulos fortes)', options: FONTS.display },
    { label: 'Sans (Leitura limpa)', options: FONTS.sans },
    { label: 'Serif (Elegante)', options: FONTS.serif },
    { label: 'Handwriting (Personalidade)', options: FONTS.accent },
  ]

  return (
    <div className={styles.container}>
      {/* Aviso Fixo */}
      <div className={styles.disclaimer}>
        <Info size={16} className={styles.icon} />
        <p>
          As fontes são interpretadas pela IA para capturar o estilo visual — o resultado na imagem gerada pode variar um pouco da fonte exata original.
        </p>
      </div>

      {/* Toggle */}
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
          <Type size={16} /> Eu escolho
        </button>
      </div>

      <div className={styles.content}>
        {mode === 'ai' && (
          <div className={styles.aiMode}>
            <div className={styles.aiHint}>
              <Sparkles size={24} className={styles.aiIcon} />
              <p>
                A IA interpretará seu nicho e selecionará as melhores fontes automaticamente durante a geração do prompt.
              </p>
            </div>
            {/* Slots desabilitados visualmente para indicar o que a IA fará */}
            <div className={styles.disabledSlots}>
              <div className={styles.slot}>
                <label>Título</label>
                <div className={styles.fakeInput}>A IA escolhe pelo seu nicho</div>
              </div>
              <div className={styles.slot}>
                <label>Corpo</label>
                <div className={styles.fakeInput}>A IA escolhe pelo seu nicho</div>
              </div>
              <div className={styles.slot}>
                <label>Destaque</label>
                <div className={styles.fakeInput}>A IA escolhe pelo seu nicho</div>
              </div>
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <div className={styles.manualMode}>
            {(['title', 'body', 'accent'] as const).map((slot) => (
              <div key={slot} className={styles.slot}>
                <label>
                  {slot === 'title' && 'Fonte de Título (Alto impacto)'}
                  {slot === 'body' && 'Fonte de Corpo (Leitura leve)'}
                  {slot === 'accent' && 'Fonte de Destaque (Personalidade)'}
                </label>
                
                <select
                  value={fonts[slot] || ''}
                  onChange={(e) => handleFontSelect(slot, e.target.value)}
                  className={styles.select}
                  style={{ fontFamily: fonts[slot] ? `'${fonts[slot]}', sans-serif` : 'inherit' }}
                >
                  <option value="">Selecione uma fonte...</option>
                  {allFonts.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((f) => (
                        <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>
                          {f}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {/* Preview Visual */}
                {fonts[slot] && (
                  <div 
                    className={styles.preview} 
                    style={{ fontFamily: `'${fonts[slot]}', sans-serif` }}
                  >
                    Aa — Título de Exemplo ({fonts[slot]})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
