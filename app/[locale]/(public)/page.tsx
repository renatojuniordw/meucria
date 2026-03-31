import { Hero } from '@/components/landing/Hero'
import { SocialProof } from '@/components/landing/SocialProof'
import { PromptPreview } from '@/components/landing/PromptPreview'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Pricing } from '@/components/landing/Pricing'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeuCrIA — Crie prompts para criativos com IA em segundos',
  description: 'Gere prompts profissionais para o Google ImageFX. Configure sua marca uma vez e crie criativos para Instagram com IA. 15 prompts grátis, sem cartão.',
  openGraph: {
    title: 'MeuCrIA — Prompts para criativos com IA',
    description: 'Seu próximo criativo começa com o prompt certo.',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <PromptPreview />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  )
}
