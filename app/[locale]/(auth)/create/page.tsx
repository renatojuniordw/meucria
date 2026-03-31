// app/[locale]/(auth)/create/page.tsx
import { PromptWizard } from '@/components/prompt/PromptWizard'

export default function CreatePromptPage() {
  return (
    <div className="container">
      <PromptWizard />
    </div>
  )
}
