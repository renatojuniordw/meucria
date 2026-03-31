'use client'

import React from 'react'
import { BrandCard, type BrandCardProps } from './BrandCard'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import styles from './BrandList.module.scss'
import { useBrands } from '@/hooks/useBrands'
import { useActiveBrand } from '@/hooks/useActiveBrand'

interface BrandListProps {
  onAddBrand?: () => void
  onEditBrand?: (id: string) => void
  onDeleteBrand?: (id: string) => void
}

export function BrandList({ onAddBrand, onEditBrand, onDeleteBrand }: BrandListProps) {
  const { brands, isLoading, error } = useBrands()
  const { activeBrandId, setActiveBrand } = useActiveBrand()

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Loader2 className="animate-spin" size={24} />
        <p>Carregando marcas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>Não foi possível carregar as marcas.</p>
        <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Suas Marcas / Clientes</h2>
        {onAddBrand && (
          <Button onClick={onAddBrand} className={styles.addBtn}>
            <Plus size={16} /> Nova Marca
          </Button>
        )}
      </div>

      {brands.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Você ainda não tem nenhuma marca cadastrada.</p>
          {onAddBrand && (
            <Button onClick={onAddBrand}>Criar Primeira Marca</Button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand as any}
              isActive={brand.id === activeBrandId}
              onActivate={setActiveBrand}
              onEdit={onEditBrand}
              onDelete={onDeleteBrand}
            />
          ))}
        </div>
      )}
    </div>
  )
}
