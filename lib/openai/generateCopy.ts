import OpenAI from 'openai'
import { getSystemPrompt } from './promptCache'
import { CopyOutputSchema, type CopyOutput } from '@/lib/validations/copy.schema'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface CopyInput {
  brandName: string
  niche: string
  objective: string
  generatedPrompt: string
  tone: string
}

export async function generateCopy(input: CopyInput): Promise<CopyOutput> {
  const systemPrompt = await getSystemPrompt('copy')

  const userMessage = [
    `Brand: ${input.brandName}`,
    `Niche: ${input.niche}`,
    `Objective: ${input.objective}`,
    `Image prompt: ${input.generatedPrompt}`,
    `Tone: ${input.tone}`,
  ].join('\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0].message.content
  if (!raw) throw new Error('Empty response from AI')

  const clean = raw.replace(/```json|```/g, '').trim()
  const parsed = CopyOutputSchema.parse(JSON.parse(clean))

  return parsed
}
