'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './login.module.scss'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login'
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/onboarding')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>MeuCrIA</h1>

        <div className={styles.tabs}>
          <button className={tab === 'login' ? styles.active : ''} onClick={() => setTab('login')}>
            Entrar
          </button>
          <button className={tab === 'register' ? styles.active : ''} onClick={() => setTab('register')}>
            Criar conta
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha (min 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <button type="submit" disabled={loading}>{loading ? 'Criando conta...' : 'Criar conta grátis'}</button>
            <p className={styles.legal}>
              Ao criar sua conta, você concorda com nossos <a href="/terms">Termos de Uso</a> e <a href="/privacy">Política de Privacidade</a>.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
