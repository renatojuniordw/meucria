// lib/stripe/plans.ts

export const PLANS = {
  free: {
    name: 'Freemium',
    price: 0,
    promptLimit: 15,
    brandLimit: 1,
    resetDays: 30,
    features: {
      history: false,
      presets: false,
      shareLink: true,
      imageUpload: true,
      cloneArtwork: false,
    },
  },
  basic: {
    name: 'Básico',
    price: 2900,               // R$29
    promptLimit: 60,
    brandLimit: 3,
    resetDays: 30,
    features: {
      history: false,
      presets: false,
      shareLink: true,
      imageUpload: true,
      cloneArtwork: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 4900,               // R$49
    promptLimit: Infinity,
    brandLimit: Infinity,
    resetDays: 30,
    features: {
      history: true,
      presets: true,
      shareLink: true,
      imageUpload: true,
      cloneArtwork: true,
      copyGeneration: true,
    },
  },
} as const
