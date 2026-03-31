'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Loader2, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './BrandSwitcher.module.scss'
import { useBrands } from '@/hooks/useBrands'
import { useActiveBrand } from '@/hooks/useActiveBrand'

export function BrandSwitcher() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const { brands, isLoading } = useBrands()
  const { activeBrandId, setActiveBrand } = useActiveBrand()

  const activeBrand = brands.find(b => b.id === activeBrandId) || brands[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (id: string) => {
    setActiveBrand(id)
    setIsOpen(false)
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader2 className="animate-spin" size={16} />
      </div>
    )
  }

  if (!brands.length) return null

  return (
    <div className={styles.container} ref={menuRef}>
      <button 
        type="button" 
        className={styles.triggerBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.activeInfo}>
          <span className={styles.label}>Nicho: {activeBrand?.niche || 'Geral'}</span>
          <span className={styles.name}>{activeBrand?.name || 'Selecione...'}</span>
        </div>
        <ChevronDown size={16} className={isOpen ? styles.iconOpen : styles.icon} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span>Alterar Marca Ativa</span>
          </div>
          <ul className={styles.brandList}>
            {brands.map(brand => (
              <li 
                key={brand.id}
                className={brand.id === activeBrand?.id ? styles.selectedItem : styles.item}
                onClick={() => handleSelect(brand.id)}
              >
                <div className={styles.itemInfo}>
                  <strong>{brand.name}</strong>
                  {brand.niche && <span>{brand.niche}</span>}
                </div>
                {brand.id === activeBrand?.id && <Check size={16} className={styles.checkIcon} />}
              </li>
            ))}
          </ul>
          
          <div className={styles.dropdownFooter} onClick={() => { setIsOpen(false); router.push('/brands/new') }}>
            <PlusCircle size={16} />
            Nova Marca
          </div>
        </div>
      )}
    </div>
  )
}
