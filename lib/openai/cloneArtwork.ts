import OpenAI from 'openai'
import { getSystemPrompt } from './promptCache'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface CloneInput {
  imageBase64: string
  brandData: Record<string, unknown>
}

export async function cloneArtwork(input: CloneInput): Promise<string> {
  const systemPrompt = await getSystemPrompt('clone')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${input.imageBase64}` } },
          { type: 'text', text: `Brand data: ${JSON.stringify(input.brandData)}` },
        ],
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  const result = response.choices[0].message.content
  if (!result) throw new Error('Failed to analyze image')

  return result
}
