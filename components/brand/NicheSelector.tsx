'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '../ui/Input'
import styles from './NicheSelector.module.scss'

interface NicheSelectorProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
}

const COMMON_NICHES = [
  'Moda Feminina',
  'Moda Masculina',
  'Beleza & Estética',
  'Saúde & Bem-estar',
  'Odontologia',
  'Advocacia',
  'Imobiliária',
  'Restaurante / Delivery',
  'Tecnologia / SaaS',
  'Educação / Cursos',
  'Marketing Digital',
  'Pet Shop',
  'Arquitetura & Interiores',
  'E-commerce'
]

export function NicheSelector({ value, onChange, onBlur, error }: NicheSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>(COMMON_NICHES)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fechar ao clicar fora
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)
    setIsOpen(true)
    
    if (!val) {
      setFiltered(COMMON_NICHES)
    } else {
      const lower = val.toLowerCase()
      setFiltered(COMMON_NICHES.filter(n => n.toLowerCase().includes(lower)))
    }
  }

  const handleSelect = (niche: string) => {
    onChange(niche)
    setIsOpen(false)
  }

  return (
    <div className={styles.container} ref={wrapperRef}>
      <Input
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
        placeholder="Ex: Moda Feminina, Odontologia..."
        error={error}
        autoComplete="off"
      />
      
      {isOpen && filtered.length > 0 && (
        <ul className={styles.dropdown}>
          {filtered.map(niche => (
            <li 
              key={niche} 
              onClick={() => handleSelect(niche)}
              className={styles.dropdownItem}
            >
              {niche}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
