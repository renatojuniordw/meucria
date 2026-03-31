// lib/openai/generatePrompt.ts
import OpenAI from 'openai'
import { getSystemPrompt } from './promptCache'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePrompt(descriptive: string): Promise<string> {
  const systemPrompt = await getSystemPrompt('generate')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // GPT-4.1-mini is often mapped to gpt-4o-mini or specify exact if available
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: descriptive },
    ],
    temperature: 0.7,
  })

  const result = response.choices[0].message.content
  if (!result) throw new Error('Falha ao gerar prompt da IA')

  return result
}
