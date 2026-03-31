'use client'

import { setCookieConsent } from '@/app/actions/consent'
import styles from './CookieBanner.module.scss'

export function CookieBanner() {
  return (
    <div className={styles.banner}>
      <p>
        Usamos cookies essenciais para o funcionamento da plataforma e cookies do Stripe para processar pagamentos.
        Saiba mais na nossa <a href="/privacy">Política de Privacidade</a> e <a href="/cookies">Política de Cookies</a>.
      </p>
      <div className={styles.actions}>
        <button className={styles.secondary} onClick={() => setCookieConsent('essential')}>
          Apenas essenciais
        </button>
        <button className={styles.primary} onClick={() => setCookieConsent('all')}>
          Aceitar todos
        </button>
      </div>
    </div>
  )
}
