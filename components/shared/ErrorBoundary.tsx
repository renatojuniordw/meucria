'use client'

import { Component, ReactNode } from 'react'
import styles from './ErrorBoundary.module.scss'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className={styles.fallback}>
          <h3>Algo deu errado</h3>
          <p>Tente recarregar a página. Se o problema persistir, entre em contato.</p>
          <button onClick={() => this.setState({ hasError: false })}>Tentar novamente</button>
        </div>
      )
    }
    return this.props.children
  }
}
