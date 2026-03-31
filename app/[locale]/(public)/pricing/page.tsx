import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos — MeuCrIA',
  description: 'Escolha o plano ideal para criar prompts profissionais com IA. Free, Básico ou Pro.',
}

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <Footer />
    </>
  )
}
