'use client'

import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import styles from './ColorPicker.module.scss'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loader2, Sparkles, Palette, PenTool } from 'lucide-react'
import toast from 'react-hot-toast'

export type ColorMode = 'manual' | 'palette' | 'ai'

export interface BrandColors {
  primary: string
  secondary: string
  accent: string
}

interface ColorPickerProps {
  mode: ColorMode
  colors: BrandColors
  niche?: string
  description?: string
  onChangeMode: (mode: ColorMode) => void
  onChangeColors: (colors: BrandColors) => void
}

export function ColorPicker({
  mode,
  colors,
  niche,
  description,
  onChangeMode,
  onChangeColors,
}: ColorPickerProps) {
  const [activeSlot, setActiveSlot] = useState<keyof BrandColors>('primary')
  const [isLoadingAi, setIsLoadingAi] = useState(false)

  const handleManualHexChange = (e: React.ChangeEvent<HTMLInputElement>, slot: keyof BrandColors) => {
    const val = e.target.value
    onChangeColors({ ...colors, [slot]: val })
  }

  const handleColorPick = (color: string) => {
    onChangeColors({ ...colors, [activeSlot]: color })
  }

  const handleAiSuggest = async () => {
    if (!niche) {
      toast.error('Informe o nicho da marca para a IA sugerir cores.')
      return
    }

    try {
      setIsLoadingAi(true)
      const res = await fetch('/api/ai/suggest-colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, description }),
      })

      if (!res.ok) throw new Error('Erro ao gerar paleta')
      
      const data = await res.json()
      onChangeColors({
        primary: data.primary || '#000000',
        secondary: data.secondary || '#FFFFFF',
        accent: data.accent || '#888888',
      })
      toast.success('Paleta gerada com sucesso!')
    } catch (error) {
      console.error(error)
      toast.error('Falha ao gerar sugerir cores. Tente novamente.')
    } finally {
      setIsLoadingAi(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Tabs / Toggle */}
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
          className={mode === 'palette' ? styles.activeTab : ''}
          onClick={() => onChangeMode('palette')}
        >
          <Palette size={16} /> Visual
        </button>
        <button
          type="button"
          className={mode === 'manual' ? styles.activeTab : ''}
          onClick={() => onChangeMode('manual')}
        >
          <PenTool size={16} /> Manual
        </button>
      </div>

      <div className={styles.content}>
        {mode === 'ai' && (
          <div className={styles.aiMode}>
            <p className={styles.hint}>
              A IA analisará seu nicho <strong>{niche || '(Nenhum nicho informado)'}</strong> e escolherá as melhores cores.
            </p>
            <Button
              type="button"
              onClick={handleAiSuggest}
              disabled={isLoadingAi || !niche}
              className={styles.aiBtn}
            >
              {isLoadingAi ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Gerar Cores Agora
            </Button>
          </div>
        )}

        {mode === 'manual' && (
          <div className={styles.manualMode}>
            {['primary', 'secondary', 'accent'].map((slot) => {
              const s = slot as keyof BrandColors
              return (
                <div key={slot} className={styles.inputGroup}>
                  <label>Cor {slot === 'primary' ? 'Primária' : slot === 'secondary' ? 'Secundária' : 'Destaque'}</label>
                  <div className={styles.inputWrapper}>
                    <div
                      className={styles.swatchInline}
                      style={{ backgroundColor: colors[s] || '#CCCCCC' }}
                    />
                    <Input
                      value={colors[s]}
                      onChange={(e) => handleManualHexChange(e, s)}
                      placeholder="#FFFFFF"
                      maxLength={7}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {mode === 'palette' && (
          <div className={styles.paletteMode}>
            <div className={styles.slots}>
              {['primary', 'secondary', 'accent'].map((slot) => {
                const s = slot as keyof BrandColors
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`${styles.slotBtn} ${activeSlot === s ? styles.slotActive : ''}`}
                    onClick={() => setActiveSlot(s)}
                  >
                    <span className={styles.slotLabel}>
                      {slot === 'primary' ? 'Prin.' : slot === 'secondary' ? 'Sec.' : 'Dest.'}
                    </span>
                    <div
                      className={styles.slotColor}
                      style={{ backgroundColor: colors[s] || '#CCC' }}
                    />
                  </button>
                )
              })}
            </div>
            
            <div className={styles.colorPickerWrapper}>
              <HexColorPicker color={colors[activeSlot] || '#fff'} onChange={handleColorPick} />
            </div>
          </div>
        )}

        {/* Preview final das cores escolhidas, abaixo de qualquer modo se já houver */}
        {(mode === 'ai' || mode === 'manual' || mode === 'palette') && colors.primary && colors.secondary && colors.accent && (
          <div className={styles.finalPreview}>
            <span>Paleta Atual:</span>
            <div className={styles.swatches}>
              <div className={styles.previewSwatch} style={{ backgroundColor: colors.primary }} title="Primária" />
              <div className={styles.previewSwatch} style={{ backgroundColor: colors.secondary }} title="Secundária" />
              <div className={styles.previewSwatch} style={{ backgroundColor: colors.accent }} title="Destaque" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
