import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: {
    paths: ['authorization', 'cookie', 'password', 'email', 'stripe_customer_id'],
    censor: '[REDACTED]',
  },
})
