// hooks/useOnboardingStore.ts
import { create } from 'zustand'

interface OnboardingState {
  step: number
  data: {
    name: string
    segment: string
    niche: string
    description: string
    colorMode: 'manual' | 'palette' | 'ai'
    colors: { primary: string; secondary: string; accent: string }
    fontMode: 'manual' | 'ai'
    fonts: { title: string; body: string; accent: string } | null
    contentPreference: 'manual' | 'ai'
  }
  setStep: (step: number) => void
  updateData: (data: Partial<OnboardingState['data']>) => void
  nextStep: () => void
  prevStep: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  data: {
    name: '',
    segment: '',
    niche: '',
    description: '',
    colorMode: 'ai',
    colors: { primary: '#000000', secondary: '#ffffff', accent: '#39ff14' },
    fontMode: 'ai',
    fonts: null,
    contentPreference: 'ai',
  },
  setStep: (step) => set({ step }),
  updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
}))
