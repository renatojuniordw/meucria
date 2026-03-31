'use client'

import { Link } from '@/i18n/routing'
import styles from './Footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>MeuCrIA</span>
          <p>Prompts otimizados para criativos com IA.</p>
        </div>
        <div className={styles.links}>
          <Link href="/pricing">Planos</Link>
          <Link href="/login">Entrar</Link>
          <Link href="/privacy">Privacidade</Link>
          <Link href="/terms">Termos de Uso</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} MeuCrIA. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  )
}
