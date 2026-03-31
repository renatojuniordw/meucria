// components/layout/Header.tsx
import React from 'react'
import { Link } from '@/i18n/routing'
import styles from './Header.module.scss'

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          MEU<span className={styles.accent}>CRIA</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/pricing">Planos</Link>
          <Link href="/login" className={styles.loginBtn}>Entrar</Link>
        </nav>
      </div>
    </header>
  )
}
