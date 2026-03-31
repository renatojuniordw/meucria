// components/ui/Button.tsx
import React from 'react'
import styles from './Button.module.scss'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'primary' | 'ghost'
  className?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'outline', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(styles.button, variant && styles[variant], className) as string}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
