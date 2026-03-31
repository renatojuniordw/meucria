import { z } from 'zod'

export const CloneInputSchema = z.object({
  brandId: z.string().uuid(),
  disclaimerAccepted: z.literal(true, 'Aceite do disclaimer é obrigatório'),
})

export type CloneInput = z.infer<typeof CloneInputSchema>
