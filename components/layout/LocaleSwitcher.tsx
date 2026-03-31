'use client'

import { useRouter, usePathname } from 'next/navigation'
import styles from './LocaleSwitcher.module.scss'

const locales = [
  { code: 'pt-BR', label: 'PT' },
  { code: 'en-US', label: 'EN' },
] as const

export function LocaleSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split('/')[1] || 'pt-BR'

  const switchLocale = (locale: string) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <div className={styles.switcher}>
      {locales.map((l) => (
        <button
          key={l.code}
          className={`${styles.btn} ${currentLocale === l.code ? styles.active : ''}`}
          onClick={() => switchLocale(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
