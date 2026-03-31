import OpenAI from 'openai'
import { getSystemPrompt } from './promptCache'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function suggestContent(niche: string, description?: string): Promise<{ objective: string; contentText: string }> {
  const systemPrompt = await getSystemPrompt('suggest_content')

  const userMessage = [
    `Niche: ${niche}`,
    description ? `Description: ${description}` : '',
  ].filter(Boolean).join('\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0].message.content
  if (!raw) throw new Error('Empty response from AI')

  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

export async function suggestColors(niche: string, description?: string): Promise<{ primary: string; secondary: string; accent: string }> {
  const systemPrompt = await getSystemPrompt('suggest_colors')

  const userMessage = [
    `Niche: ${niche}`,
    description ? `Description: ${description}` : '',
  ].filter(Boolean).join('\n')

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

  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}
