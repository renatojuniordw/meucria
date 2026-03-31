'use client'

import { useBrands } from '@/hooks/useBrands'
import { useCurrentPlan } from '@/hooks/useCurrentPlan'
import { Link } from '@/i18n/routing'
import styles from './brands.module.scss'

export default function BrandsPage() {
  const { brands, loading } = useBrands()
  const { planData, plan } = useCurrentPlan()

  const brandLimit = planData.brandLimit === Infinity ? '∞' : planData.brandLimit
  const canCreate = planData.brandLimit === Infinity || brands.length < planData.brandLimit

  if (loading) return <div className={styles.loading}>Carregando marcas...</div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Minhas marcas</h1>
        <span className={styles.badge}>{brands.length}/{brandLimit} marcas</span>
      </div>

      <div className={styles.grid}>
        {brands.map((brand) => (
          <Link key={brand.id} href={`/brands/${brand.id}`} className={styles.card}>
            <div className={styles.colorDot} style={{ background: brand.colors?.primary ?? '#39ff14' }} />
            <div>
              <h3>{brand.name}</h3>
              <p>{brand.niche ?? 'Sem nicho definido'}</p>
            </div>
          </Link>
        ))}

        {canCreate && (
          <Link href="/brands/new" className={styles.addCard}>
            <span>+ Nova marca</span>
          </Link>
        )}

        {!canCreate && (
          <div className={styles.limitCard}>
            <p>Limite de marcas do plano {plan} atingido.</p>
            <Link href="/pricing">Fazer upgrade</Link>
          </div>
        )}
      </div>
    </div>
  )
}
