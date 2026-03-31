// components/layout/Sidebar.tsx
import React from 'react'
import { Link, usePathname } from '@/i18n/routing'
import styles from './Sidebar.module.scss'
import { LayoutDashboard, PlusSquare, History, Bookmark, UserCircle, Settings } from 'lucide-react'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusSquare, label: 'Criar Prompt', href: '/create' },
  { icon: Bookmark, label: 'Marcas', href: '/brands' },
  { icon: History, label: 'Histórico', href: '/history' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        MEU<span className={styles.accent}>CRIA</span>
      </div>
      
      <nav className={styles.nav}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.profileBox}>
        <UserCircle size={20} />
        <span className={styles.userName}>PERFIL</span>
      </div>
    </aside>
  )
}
