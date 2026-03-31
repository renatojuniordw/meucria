// app/[locale]/(auth)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        {children}
      </div>
    </div>
  )
}
