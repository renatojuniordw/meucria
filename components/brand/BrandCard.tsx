'use client'

import React from 'react'
import { MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import styles from './BrandCard.module.scss'

export interface BrandCardProps {
  brand: {
    id: string
    name: string
    niche?: string
    color_mode?: 'manual' | 'palette' | 'ai'
    colors?: { primary: string; secondary: string; accent: string }
  }
  isActive?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onActivate?: (id: string) => void
}

export function BrandCard({ brand, isActive, onEdit, onDelete, onActivate }: BrandCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`${styles.card} ${isActive ? styles.activeCard : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h3 className={styles.name}>{brand.name}</h3>
          {brand.niche && <span className={styles.niche}>{brand.niche}</span>}
        </div>

        <div className={styles.actions} ref={menuRef}>
          <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical size={18} />
          </button>
          
          {menuOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={() => { setMenuOpen(false); onEdit?.(brand.id) }}>
                <Edit2 size={14} /> Editar
              </button>
              <button 
                className={styles.dangerItem}
                onClick={() => { setMenuOpen(false); onDelete?.(brand.id) }}
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.colorRow}>
          <span className={styles.label}>Cores:</span>
          {brand.color_mode === 'ai' || !brand.colors ? (
            <span className={styles.aiBadge}>Decidido por IA</span>
          ) : (
            <div className={styles.swatches}>
              <div style={{ backgroundColor: brand.colors?.primary }} title="Primária" />
              <div style={{ backgroundColor: brand.colors?.secondary }} title="Secundária" />
              <div style={{ backgroundColor: brand.colors?.accent }} title="Destaque" />
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        {isActive ? (
          <div className={styles.activeStatus}>
            <CheckCircle2 size={16} /> Marca Ativa
          </div>
        ) : (
          <button className={styles.activateBtn} onClick={() => onActivate?.(brand.id)}>
            Definir como Ativa
          </button>
        )}
      </div>
    </div>
  )
}
