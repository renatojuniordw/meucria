// components/ui/StatsCard.tsx
import React from 'react'
import styles from './StatsCard.module.scss'

interface StatsCardProps {
  label: string
  value: string | number
  sublabel?: string
  progress?: number // 0 to 1
}

export const StatsCard = ({ label, value, sublabel, progress }: StatsCardProps) => {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <div className={styles.value}>{value}</div>
      {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
      
      {progress !== undefined && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  )
}
