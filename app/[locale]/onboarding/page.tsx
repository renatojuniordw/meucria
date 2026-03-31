// app/[locale]/onboarding/page.tsx
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { Header } from '@/components/layout/Header'

export default function OnboardingPage() {
  return (
    <>
      <Header />
      <main className="container">
        <OnboardingWizard />
      </main>
    </>
  )
}
