'use client'

import { usePromptUsage } from '@/hooks/usePromptUsage'
import styles from './UsageCounter.module.scss'

export function UsageCounter() {
  const { used, limit, remaining, percentage, resetAt, loading } = usePromptUsage()

  if (loading) return null

  const daysUntilReset = resetAt
    ? Math.max(0, Math.ceil((new Date(resetAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div className={styles.counter}>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      <div className={styles.info}>
        <span>
          {limit === Infinity ? `${used} prompts usados` : `${used}/${limit} prompts`}
        </span>
        {limit !== Infinity && (
          <span className={styles.remaining}>
            {remaining} restantes · Reseta em {daysUntilReset}d
          </span>
        )}
      </div>
    </div>
  )
}
