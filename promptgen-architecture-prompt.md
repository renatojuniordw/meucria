# PROMPT DE ARQUITETURA — MeuCrIA Platform

## CONTEXTO DO PROJETO

Construa uma plataforma SaaS chamada **MeuCrIA** com Next.js 14+ (App Router), Supabase e GPT-4.1-mini. O produto permite que usuários criem prompts otimizados para geração de imagens de criativos (Instagram feed/story) via Google ImageFX (Imagen 3). O sistema deve seguir as melhores práticas de desenvolvimento, ser completamente componentizado, internacionalizado e escalável.

---

## STACK DEFINIDA

- **Framework:** Next.js 14+ com App Router e Server Components
- **Linguagem:** TypeScript (strict mode)
- **Banco de dados:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **IA:** OpenAI GPT-4.1-mini via API REST (Route Handlers do Next.js)
- **Estilização:** CSS Modules + SCSS (sem Tailwind)
- **Internacionalização:** next-intl (pt-BR como padrão, en-US como secundário)
- **Formulários:** React Hook Form + Zod
- **Estado global:** Zustand (apenas para estado de UI leve; dados do servidor via Server Components + SWR/React Query)
- **Pagamentos:** Stripe (webhooks via Route Handler)
- **E-mail transacional:** Resend (boas-vindas, alertas de uso, confirmação de plano)
- **Rate limiting:** Upstash Redis + @upstash/ratelimit
- **Testes:** Vitest + React Testing Library + Playwright (E2E)
- **CI/CD:** GitHub Actions
- **Hospedagem:** VPS própria com Docker + Nginx (Next.js containerizado)

---

## ESTRUTURA DE PASTAS

```
/
├── app/
│   ├── [locale]/
│   │   ├── (public)/
│   │   │   ├── page.tsx                        # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── privacy/page.tsx                # Política de Privacidade (LGPD)
│   │   │   ├── terms/page.tsx                  # Termos de Uso
│   │   │   ├── cookies/page.tsx                # Política de Cookies
│   │   │   └── p/[id]/page.tsx                 # Prompt público compartilhável
│   │   ├── (auth)/
│   │   │   ├── onboarding/page.tsx             # Onboarding obrigatório pós-cadastro
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── brands/page.tsx                 # Listagem e gestão de marcas/clientes
│   │   │   ├── brands/[id]/page.tsx            # Edição de uma marca específica
│   │   │   ├── create/page.tsx
│   │   │   ├── history/page.tsx                # Histórico (plano Pro)
│   │   │   ├── presets/page.tsx                # Presets salvos (plano Pro)
│   │   │   ├── clone/page.tsx                  # Módulo de clonagem (apenas Pro)
│   │   │   └── settings/page.tsx
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── page.tsx                    # Dashboard admin
│   │   │       ├── users/page.tsx
│   │   │       └── prompts/page.tsx
│   │   └── layout.tsx
├── components/
│   ├── ui/                                     # shadcn/ui base components
│   ├── brand/
│   │   ├── BrandForm.tsx                       # criar/editar marca
│   │   ├── BrandCard.tsx                       # card de marca na listagem
│   │   ├── BrandList.tsx                       # grade de cards de marcas
│   │   ├── BrandSwitcher.tsx                   # dropdown no header para trocar marca ativa
│   │   ├── BrandLimitBadge.tsx                 # exibe X/limite de marcas do plano
│   │   ├── ColorPicker.tsx                     # hex manual + paleta + IA decide
│   │   ├── FontPicker.tsx                      # seletor de 3 fontes (título, corpo, destaque) com preview
│   │   └── NicheSelector.tsx
│   ├── prompt/
│   │   ├── PromptWizard.tsx
│   │   ├── FormatSelector.tsx                  # feed / story / carrossel
│   │   ├── ContentInput.tsx                    # texto manual ou IA sugere
│   │   ├── PersonaSelector.tsx
│   │   ├── FontOverride.tsx                    # troca de fonte na hora de criar (herda da marca, editável)
│   │   ├── PromptResult.tsx
│   │   ├── PromptCopyButton.tsx                # copiar com feedback visual
│   │   ├── PromptShareLink.tsx                 # link público /p/[id]
│   │   ├── PromptExport.tsx                    # download .txt
│   │   ├── PromptImageUpload.tsx               # upload da imagem gerada
│   │   ├── PromptFeedback.tsx
│   │   ├── CopyGenerator.tsx                   # geração de copy de conversão (Pro)
│   │   ├── CopyToneSelector.tsx                # seletor de tom: urgência | emocional | curiosidade | autoridade
│   │   └── CopyResult.tsx                      # exibe hook, corpo, CTA e hashtags com botões de cópia
│   ├── clone/
│   │   ├── CloneWizard.tsx                     # shell do fluxo de clonagem
│   │   ├── CloneUploadZone.tsx                 # drag-and-drop + preview da imagem
│   │   ├── CloneDisclaimerModal.tsx            # aviso de uso + aceite obrigatório
│   │   ├── CloneAnalysisLoader.tsx             # skeleton/loading durante análise da IA
│   │   └── CloneResult.tsx                     # exibe prompt clonado + copiar + baixar
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx
│   │   ├── OnboardingStep1.tsx                 # dados básicos do negócio
│   │   ├── OnboardingStep2.tsx                 # nicho e descrição
│   │   ├── OnboardingStep3.tsx                 # cores da marca
│   │   ├── OnboardingStep4.tsx                 # fontes da marca (FontPicker)
│   │   └── OnboardingStep5.tsx                 # preferências de conteúdo
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── PromptPreview.tsx                   # demo sem login (1 uso)
│   │   ├── Pricing.tsx
│   │   └── Testimonials.tsx
│   ├── admin/
│   │   ├── StatsCards.tsx
│   │   ├── UsersTable.tsx
│   │   └── PromptsTable.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── LocaleSwitcher.tsx
│   └── shared/
│       ├── PlanGate.tsx
│       ├── UsageCounter.tsx
│       ├── UsageLimitWarning.tsx               # alerta visual ao atingir 80%
│       ├── CookieBanner.tsx                    # banner de consentimento de cookies
│       └── UpgradeModal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── openai/
│   │   ├── promptCache.ts                      # cache em memória dos system prompts (TTL 10min)
│   │   ├── buildDescriptive.ts                 # monta descritivo estruturado dos inputs do usuário
│   │   ├── generatePrompt.ts
│   │   ├── generateCopy.ts                     # geração de copy de conversão para Instagram
│   │   ├── cloneArtwork.ts                     # vision: analisa imagem + gera prompt clonado
│   │   └── suggestContent.ts
│   ├── stripe/
│   │   ├── client.ts
│   │   └── plans.ts
│   ├── resend/
│   │   ├── client.ts
│   │   ├── templates/welcome.tsx
│   │   ├── templates/usageWarning.tsx
│   │   └── templates/planUpgraded.tsx
│   ├── upstash/
│   │   └── ratelimit.ts
│   ├── fingerprint/
│   │   └── guestFingerprint.ts
│   ├── validations/
│   │   ├── brand.schema.ts
│   │   ├── prompt.schema.ts
│   │   ├── copy.schema.ts                      # validação do input de geração de copy
│   │   └── clone.schema.ts                     # validação do upload de imagem para clonagem
│   ├── constants/
│   │   └── fonts.ts                            # lista curada de fontes disponíveis no FontPicker
│   └── utils/
│       ├── colorUtils.ts
│       ├── sanitizeInput.ts                    # normaliza espaços e chars de controle
│       ├── usageLimits.ts
│       └── ogUtils.ts
├── lib/
│   ├── services/
│   │   ├── promptService.ts                    # orquestra geração: limite + marca + descritivo + IA
│   │   ├── copyService.ts                      # orquestra geração de copy
│   │   └── cloneService.ts                     # orquestra clonagem de arte
│   ├── repositories/
│   │   ├── brandRepo.ts                        # queries de marca
│   │   ├── promptRepo.ts                       # queries de prompt
│   │   └── profileRepo.ts                      # queries de perfil e incremento de uso
│   ├── cache/
│   │   └── index.ts                            # cache de perfil e marca ativa (Upstash)
│   └── logger/
│       └── index.ts                            # pino logger com redact de dados sensíveis
├── components/
│   └── shared/
│       └── skeletons/
│           ├── SkeletonCard.tsx
│           ├── SkeletonInput.tsx
│           ├── SkeletonWizard.tsx
│           └── SkeletonHistory.tsx
├── hooks/
│   ├── useBrands.ts                            # lista todas as marcas do usuário
│   ├── useActiveBrand.ts                       # marca ativa no momento (persiste em cookie de sessão)
│   ├── usePromptUsage.ts
│   ├── useCurrentPlan.ts
│   └── useOnboardingStatus.ts
├── app/api/
│   ├── prompt/
│   │   ├── generate/route.ts
│   │   ├── guest/route.ts
│   │   ├── feedback/route.ts
│   │   ├── share/route.ts
│   │   └── image/route.ts
│   ├── copy/
│   │   └── generate/route.ts                   # POST: gera copy de conversão (Pro)
│   ├── clone/
│   │   └── route.ts                            # POST: upload + análise vision + retorna prompt
│   ├── brands/
│   │   ├── route.ts                            # GET: lista marcas | POST: cria marca
│   │   └── [id]/route.ts                       # GET/PATCH/DELETE: operações por marca
│   ├── ai/
│   │   ├── suggest-content/route.ts
│   │   └── suggest-colors/route.ts
│   ├── admin/
│   │   ├── stats/route.ts
│   │   └── users/route.ts
│   └── stripe/webhook/route.ts
├── i18n/
│   ├── messages/
│   │   ├── pt-BR.json
│   │   └── en-US.json
│   └── config.ts
├── middleware.ts
├── supabase/
│   └── migrations/
└── docker/
    ├── Dockerfile
    └── nginx.conf
```

---

## MODELO DE BANCO DE DADOS (Supabase)

```sql
profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  plan text default 'free',              -- 'free' | 'basic' | 'pro'
  role text default 'user',             -- 'user' | 'admin'
  onboarding_completed boolean default false,
  active_brand_id uuid,                  -- marca ativa no momento (FK brands.id, nullable)
  prompts_used int default 0,
  prompts_reset_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
)

-- Múltiplas marcas/clientes por usuário
-- Limite por plano controlado em usageLimits.ts (free: 1, basic: 3, pro: ilimitado)
brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  name text not null,                    -- nome da marca ou cliente
  niche text,
  description text,
  color_mode text,                       -- 'manual' | 'palette' | 'ai'
  colors jsonb,                          -- { primary, secondary, accent }
  content_mode text,                     -- 'manual' | 'ai'
  font_mode text default 'ai',          -- 'manual' (usuario escolhe) | 'ai' (IA decide pelo nicho)
  fonts jsonb,                           -- { title, body, accent } -- null se font_mode = 'ai'
  deleted_at timestamptz,               -- soft delete
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  brand_id uuid references brands(id),
  format text,                           -- 'feed' | 'story' | 'carousel'
  has_persona boolean,
  raw_input jsonb,
  generated_prompt text,
  generated_copy jsonb,                  -- { hook, body, cta, hashtags } — exclusivo Pro
  copy_tone text,                        -- tom escolhido: 'urgency' | 'emotional' | 'curiosity' | 'authority'
  is_preset boolean default false,
  preset_name text,
  is_public boolean default false,
  result_image_url text,
  deleted_at timestamptz,               -- soft delete
  created_at timestamptz default now()
)

prompt_feedbacks (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid references prompts(id),
  user_id uuid references profiles(id),
  feedback text,
  created_at timestamptz default now()
)

-- Prompts do sistema — fonte de verdade dos system prompts da IA
-- Acesso apenas via service_role — RLS bloqueia anon e authenticated
-- Editável via Supabase Studio sem necessidade de deploy
system_prompts (
  id text primary key,           -- 'generate' | 'copy' | 'clone' | 'suggest_colors' | 'suggest_content'
  content text not null,         -- texto completo do system prompt
  description text,              -- descrição interna do que este prompt faz
  version int default 1,         -- incrementar manualmente a cada alteração relevante
  updated_at timestamptz default now()
)

guest_usage (
  id uuid primary key default gen_random_uuid(),
  fingerprint text unique,
  used boolean default false,
  created_at timestamptz default now()
)

usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  event_type text,   -- 'prompt_generated' | 'copy_generated' | 'plan_upgraded' | 'feedback_submitted' | 'image_uploaded' | 'prompt_shared' | 'artwork_cloned' | 'disclaimer_accepted'
  metadata jsonb,
  created_at timestamptz default now()
)
```

---

## PLANOS E LIMITES

```typescript
// lib/stripe/plans.ts

export const PLANS = {
  free: {
    name: 'Freemium',
    price: 0,
    promptLimit: 15,
    brandLimit: 1,             // 1 marca — usuário comum não precisa de mais
    resetDays: 30,
    features: {
      history: false,
      presets: false,
      ads: false,
      shareLink: true,
      imageUpload: true,
      cloneArtwork: false,
    },
  },
  basic: {
    name: 'Básico',
    price: 2900,               // R$29
    promptLimit: 60,
    brandLimit: 3,             // até 3 clientes/marcas
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
    brandLimit: Infinity,      // social media com N clientes
    resetDays: 30,
    features: {
      history: true,
      presets: true,
      shareLink: true,
      imageUpload: true,
      cloneArtwork: true,      // exclusivo Pro
      copyGeneration: true,    // copy de conversão para Instagram — exclusivo Pro
    },
  },
} as const
```

---

## ONBOARDING OBRIGATÓRIO

```typescript
// middleware.ts — após login, verificar profiles.onboarding_completed
// Se false → redirecionar /onboarding antes de qualquer rota autenticada

// OnboardingWizard — 5 steps obrigatórios:
// Step 1: nome do negócio/cliente + segmento
// Step 2: nicho detalhado + descrição
// Step 3: cores da marca (ColorPicker 3 modos)
// Step 4: fontes da marca (FontPicker — título, corpo e destaque)
// Step 5: preferência de conteúdo (manual ou IA sugere)
// Ao finalizar:
//   - POST /api/brands → cria a primeira marca
//   - PATCH /api/profiles → onboarding_completed = true, active_brand_id = nova marca
//   - Redireciona para /create
// O usuário comum nunca precisará criar outra marca — fluxo transparente pra ele
```

---

## LÓGICA DE DEMO SEM LOGIN (anti-cookie)

```typescript
// Route Handler POST /api/prompt/guest:
// 1. Servidor: hash SHA-256 de (IP + User-Agent + Accept-Language)
// 2. Consulta guest_usage por fingerprint
//    - Não existe: cria registro, permite geração
//    - Existe e used=true: bloqueia, exibe CTA de cadastro
// 3. Cliente: salva { guestUsed: true, timestamp } no localStorage
// 4. Checagem dupla — qualquer um bloqueando, bloqueia

// Limitação: fingerprint não é 100% único em NAT/VPN — suficiente para demo
```

---

## FLUXO DE GERAÇÃO DE PROMPT

```typescript
// app/api/prompt/generate/route.ts

// 1. Autenticação via Supabase JWT
// 2. Rate limiting Upstash (10 req/min por user_id)
// 3. Verificar limite do plano → 403 + trigger UpgradeModal se excedido
// 4. Receber input do front-end — APENAS dados brutos do usuário, sem lógica de prompt:
//    { brandId, format, contentMode, contentText?, colorMode, colors?, hasPersona, personaDescription?, objective, fontsOverride? }
//    fontsOverride?: { title?, body?, accent? } — se null, usa as fontes salvas na marca
//    O front NUNCA envia instruções, templates ou partes de prompt. Só dados.
// 5. SANITIZAÇÃO DO INPUT antes de qualquer processamento:
//    - Trim em todas as strings
//    - Colapsar múltiplos espaços/quebras de linha em espaço único: str.replace(/\s+/g, ' ').trim()
//    - Remover caracteres de controle invisíveis (ex: \u200b, \r, tabs extras)
//    - NÃO truncar, NÃO resumir, NÃO remover palavras — apenas normalizar espaços
// 6. Buscar dados completos da marca no banco (brandId → Supabase)
// 7. Carregar system prompt via getSystemPrompt('generate') — lib/openai/promptCache.ts
//    - Busca da tabela system_prompts via supabaseAdmin (service_role)
//    - Cache em memória por 10 minutos — atualiza automaticamente sem deploy
//    - A lógica de prompt NUNCA está no código-fonte nem no front
// 8. MONTAR DESCRITIVO ESTRUTURADO — lib/openai/buildDescriptive.ts
//    Combina dados da marca + input do usuário em bloco de texto organizado
//    Enviado ao GPT junto com o system prompt para refinamento
//    (ver seção DESCRITIVO ESTRUTURADO abaixo)
// 9. Montar payload: system prompt (banco) + descritivo estruturado
// 10. Chamar GPT-4.1-mini — refina o descritivo e gera o prompt final para o ImageFX
// 11. Salvar resultado em prompts
// 12. Incrementar profiles.prompts_used
// 13. Registrar usage_events { event_type: 'prompt_generated' }
// 14. Se atingiu 80% do limite → disparar e-mail de alerta via Resend
// 15. Retornar apenas o prompt gerado — nada mais

// ⚠️ REGRA ABSOLUTA:
// Nenhum componente, hook ou utilitário do front-end deve conter
// instruções, templates ou lógica de montagem de prompt.
// O front coleta input → envia para o back → recebe o prompt pronto.
```

---

## DESCRITIVO ESTRUTURADO (lib/openai/buildDescriptive.ts)

### Conceito

```
Front-end coleta dados brutos
        ↓
Back-end busca dados da marca no banco
        ↓
buildDescriptive() organiza tudo em um bloco de texto limpo
        ↓
system prompt (banco) + descritivo → GPT refina e gera prompt final
        ↓
Prompt otimizado pronto para o Google ImageFX (Imagen 3)
```

O GPT não recebe os dados espalhados — recebe um briefing já estruturado,
o que melhora a consistência e qualidade do prompt gerado.

---

### Estrutura do descritivo

```typescript
// lib/openai/buildDescriptive.ts
// Recebe dados da marca (banco) + input sanitizado (usuário)
// Retorna string estruturada para enviar ao GPT como user message

export function buildDescriptive(brand: Brand, input: PromptInput): string {
  const lines: string[] = []

  // MARCA
  lines.push(`Brand: ${brand.name}`)
  lines.push(`Niche: ${brand.niche}`)
  if (brand.description) lines.push(`Brand description: ${brand.description}`)

  // FORMATO DO CRIATIVO
  lines.push(`Creative format: ${input.format}`) // feed | story | carousel
  if (input.hasPersona && input.personaDescription) {
    lines.push(`Persona: ${input.personaDescription}`)
  }

  // OBJETIVO / MENSAGEM
  lines.push(`Objective: ${input.objective}`)
  if (input.contentMode === 'manual' && input.contentText) {
    lines.push(`Content text: ${input.contentText}`)
  }

  // CORES
  if (input.colorMode === 'manual' && input.colors) {
    lines.push(`Brand colors: primary ${input.colors.primary}, secondary ${input.colors.secondary}, accent ${input.colors.accent}`)
  } else if (input.colorMode === 'ai' || brand.color_mode === 'ai') {
    lines.push(`Colors: choose colors appropriate to the niche and brand personality`)
  }

  // TIPOGRAFIA
  const fontMode = input.fontModeOverride ?? brand.font_mode
  const fonts    = input.fontsOverride    ?? brand.fonts

  if (fontMode === 'ai' || !fonts) {
    lines.push(`Typography: choose fonts appropriate to the niche and brand style`)
  } else {
    const parts: string[] = []
    if (fonts.title)  parts.push(`${fonts.title} for headlines`)
    if (fonts.body)   parts.push(`${fonts.body} for body text`)
    if (fonts.accent) parts.push(`${fonts.accent} for accent`)
    if (parts.length) lines.push(`Typography: ${parts.join(', ')}`)
  }

  return lines.join('
')
}

// EXEMPLO DE OUTPUT para um criativo de moda feminina:
//
// Brand: Boutique Alma
// Niche: Moda feminina — boutique
// Brand description: Roupas femininas para mulheres modernas e sofisticadas
// Creative format: feed
// Persona: mulher entre 28 e 40 anos, urbana, gosta de minimalismo
// Objective: promover a coleção de verão com 30% de desconto
// Content text: Sale de verão — até 30% off em toda a coleção
// Brand colors: primary #C97B9C, secondary #F2E9E4, accent #4A2040
// Typography: Playfair Display for headlines, Lato for body text, Dancing Script for accent
```

---

### Como o GPT usa o descritivo

```typescript
// O payload enviado ao GPT tem sempre esta estrutura:
// [system]: conteúdo de system_prompts.content (id = 'generate')
//           contém as regras, restrições e formato esperado do output
//           nunca muda por usuário — é a inteligência central do sistema
//
// [user]:   descritivo estruturado gerado por buildDescriptive()
//           muda a cada geração — são os dados específicos daquele criativo
//
// O GPT lê o system prompt (regras) + user message (briefing)
// e gera o prompt final otimizado para o Imagen 3 / Google ImageFX

const response = await openai.chat.completions.create({
  model: 'gpt-4.1-mini',
  messages: [
    { role: 'system', content: systemPrompt },      // regras + formato de output
    { role: 'user',   content: descriptive },        // briefing do criativo
  ],
  temperature: 0.7,
})
```

---

### Validação do descritivo antes de enviar

```typescript
// lib/validations/prompt.schema.ts
// Garantir que o descritivo não está vazio e não tem dados corrompidos

export const DescriptiveSchema = z.object({
  brandId:             z.string().uuid(),
  format:              z.enum(['feed', 'story', 'carousel']),
  objective:           z.string().min(5).max(500),
  contentMode:         z.enum(['manual', 'ai']),
  contentText:         z.string().max(500).optional(),
  colorMode:           z.enum(['manual', 'palette', 'ai']),
  colors:              z.object({
    primary:   z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accent:    z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }).optional(),
  hasPersona:          z.boolean(),
  personaDescription:  z.string().max(300).optional(),
  fontModeOverride:    z.enum(['manual', 'ai']).optional(),
  fontsOverride:       z.object({
    title:   z.string().optional(),
    body:    z.string().optional(),
    accent:  z.string().optional(),
  }).optional(),
})

---

### Sanitização de input (lib/utils/sanitizeInput.ts)

```typescript
// lib/utils/sanitizeInput.ts

export function sanitizeString(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F\u200B\uFEFF]/g, '') // remove controle + zero-width chars
    .replace(/\s+/g, ' ')                               // colapsa múltiplos espaços/tabs/newlines
    .trim()
}

export function sanitizeInput<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      typeof value === 'string' ? sanitizeString(value) : value,
    ])
  ) as T
}

// Uso obrigatório em TODOS os route handlers antes de qualquer processamento:
// const clean = sanitizeInput(rawBody)
// Aplicar também na rota /api/clone antes de enviar para o Vision
```

---

### System Prompts — fonte de verdade (lib/openai/promptCache.ts)

```typescript
// lib/openai/promptCache.ts
// Busca system prompts da tabela system_prompts no Supabase via service_role
// Cache em memória com TTL de 10 minutos — sem latência extra após primeira chamada
// Atualização automática ao editar no Supabase Studio — sem necessidade de deploy

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type PromptId = 'generate' | 'copy' | 'clone' | 'suggest_colors' | 'suggest_content'

const cache = new Map<PromptId, { content: string; fetchedAt: number }>()
const TTL_MS = 1000 * 60 * 10  // 10 minutos

export async function getSystemPrompt(id: PromptId): Promise<string> {
  const now = Date.now()
  const cached = cache.get(id)

  if (cached && now - cached.fetchedAt < TTL_MS) {
    return cached.content  // retorna do cache — zero latência
  }

  const { data, error } = await supabaseAdmin
    .from('system_prompts')
    .select('content')
    .eq('id', id)
    .single()

  if (error || !data) {
    throw new Error(`System prompt '${id}' não encontrado. Verifique a tabela system_prompts.`)
  }

  cache.set(id, { content: data.content, fetchedAt: now })
  return data.content
}

// USO em qualquer route handler:
// const systemPrompt = await getSystemPrompt('generate')
// const systemPrompt = await getSystemPrompt('copy')
// const systemPrompt = await getSystemPrompt('clone')
// const systemPrompt = await getSystemPrompt('suggest_colors')
// const systemPrompt = await getSystemPrompt('suggest_content')
```

---

### Configuração inicial da tabela system_prompts

```sql
-- RLS: bloquear TUDO para anon e authenticated — service_role bypassa por definição
alter table system_prompts enable row level security;
-- Nenhuma policy criada = nenhum acesso via JWT de usuário

-- Seed inicial — preencher content com o prompt real via Supabase Studio
insert into system_prompts (id, description, content) values
  ('generate',        'Geração de prompt de imagem para Google ImageFX', '[SEU PROMPT AQUI]'),
  ('copy',            'Geração de copy de conversão para Instagram',      '[SEU PROMPT AQUI]'),
  ('clone',           'Análise de imagem e clonagem via GPT Vision',      '[SEU PROMPT AQUI]'),
  ('suggest_colors',  'Sugestão de paleta de cores por nicho',            '[SEU PROMPT AQUI]'),
  ('suggest_content', 'Sugestão de texto e objetivo por nicho',           '[SEU PROMPT AQUI]');
```

---

### Por que Supabase e não .env nem repositório

```
.env                    Texto longo em variável de ambiente fica ilegível
                        e sem histórico de versão — difícil de manter

Repositório (privado)   Qualquer colaborador com acesso ao repo vê os prompts
                        Se o repo vazar por qualquer motivo, o produto vaza junto

Supabase (service_role) Editável visualmente no Supabase Studio — sem SSH
                        Backup automático junto com o resto do banco
                        Nenhum usuário acessa — RLS bloqueia tudo sem exceção
                        Atualização sem deploy — cache expira em 10 minutos
                        Histórico de versão via coluna version + updated_at
                        Possibilidade futura de versionamento completo por linha
```

---

### Variáveis de ambiente obrigatórias (.env)

```bash
# Secrets de API — únicos valores que ficam no .env
# Os system prompts NÃO ficam aqui — ficam na tabela system_prompts no Supabase
OPENAI_API_KEY="..."
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."      # usado pelo supabaseAdmin para ler system_prompts
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
RESEND_API_KEY="..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

---

## GESTÃO DE MARCA — ColorPicker e FontPicker

```typescript
// components/brand/ColorPicker.tsx
// Três modos controlados por tab/toggle — estilizado com CSS Modules + SCSS:

// MODO 1 — Manual
// Input text com validação hex (#RRGGBB) via Zod + preview swatch em tempo real

// MODO 2 — Paleta visual
// Grade de cores por categoria de nicho + react-colorful para picker completo

// MODO 3 — IA decide
// POST /api/ai/suggest-colors com { niche, description } — dados brutos apenas
// Back-end carrega system prompt via getSystemPrompt('suggest_colors')
// Retorna { primary, secondary, accent } e popula os campos automaticamente
```

---

### FontPicker (components/brand/FontPicker.tsx)

```typescript
// DOIS MODOS controlados por toggle no topo do componente

// MODO "IA decide" (padrão ao criar nova marca)
// brands.font_mode = 'ai', brands.fonts = null
// Os 3 slots ficam desativados — placeholder: "A IA escolhe pelo seu nicho"
// Aviso informativo exibido abaixo do toggle (icone info):
//   "A IA interpreta o estilo das fontes e tenta reproduzir visualmente.
//    O resultado captura a personalidade tipográfica, não a fonte pixel a pixel."

// MODO "Eu escolho"
// brands.font_mode = 'manual'
// Ativa os 3 slots com preview visual de cada fonte

// AVISO FIXO (em ambos os modos, sempre visível, tom neutro):
// "As fontes são interpretadas pela IA para capturar o estilo visual —
//  o resultado pode variar da fonte original."

// SLOT TÍTULO  — Display ou Sans bold: alto impacto
// SLOT CORPO   — Sans ou Serif leve: leitura em tamanho menor
// SLOT DESTAQUE — Script, Serif elegante ou Display alternativo: personalidade

// PREVIEW VISUAL (modo manual):
// Fonte renderizada via Google Fonts (font-display: swap)
// Texto: "Aa — Título de Exemplo" na própria fonte
// Lista com scroll vertical — sem paginação

// SALVO EM:
// brands.font_mode — 'ai' | 'manual'
// brands.fonts     — { title, body, accent } | null
// Reutilizado em cada geração da marca
// Sobrescrito pontualmente via FontOverride no PromptWizard
```

---

### Lista de fontes disponíveis (lib/constants/fonts.ts)

```typescript
// lib/constants/fonts.ts
// Lista curada de fontes conhecidas por modelos de geração de imagem
// Organizadas por categoria para facilitar a escolha do usuário

export const FONTS = {
  display: [
    'Bebas Neue',       // condensada, impactante, muito usada em esporte/lifestyle
    'Oswald',           // condensada geométrica, versátil
    'Anton',            // bold forte, atenção imediata
    'Righteous',        // arredondada, jovem
    'Abril Fatface',    // serifa display elegante e expressiva
    'Alfa Slab One',    // serifa slab pesada, autoridade
  ],
  sans: [
    'Montserrat',       // geométrica moderna, muito versátil — recomendada como padrão título
    'Raleway',          // elegante, premium
    'Nunito',           // arredondada, amigável
    'Poppins',          // geométrica limpa, tech/startup
    'Inter',            // leitura digital, neutra
    'Lato',             // humanista, corpo de texto — recomendada como padrão corpo
    'Open Sans',        // clássica para corpo, legível
    'Source Sans 3',    // editorial, profissional
  ],
  serif: [
    'Playfair Display', // elegante, editorial, moda/luxo — recomendada como padrão destaque
    'Merriweather',     // leitura longa, editorial
    'Cormorant Garamond', // luxo, alta costura
    'Lora',             // humanista, quente
    'EB Garamond',      // clássica, literária
  ],
  script: [
    'Pacifico',         // informal, divertida, alimentação/lifestyle
    'Dancing Script',   // manuscrita elegante
    'Great Vibes',      // caligrafia refinada, casamentos/eventos
    'Satisfy',          // fluida, feminina
  ],
} as const

export type FontCategory = keyof typeof FONTS
export type FontName = typeof FONTS[FontCategory][number]

export const ALL_FONTS: FontName[] = Object.values(FONTS).flat()

// Como a IA interpreta as fontes:
// Os nomes são passados diretamente no prompt para o GPT montar a instrução
// Ex: "Typography: Bebas Neue for headlines, Lato for body text, Playfair Display for accent"
// Modelos como Imagen 3 reconhecem esses nomes e interpretam a personalidade tipográfica
// O resultado é aproximado — a IA captura o estilo e peso, não a fonte exata pixel a pixel
```

---

### FontOverride no PromptWizard (components/prompt/FontOverride.tsx)

```typescript
// components/prompt/FontOverride.tsx
// Seção colapsável "Tipografia" no PromptWizard — fechada por padrão
// Ao abrir: reflete o estado atual da marca com opção de ajustar só nesta geração
// Trocar aqui NAO altera a marca — aplica apenas nesta geração

// COMPORTAMENTO:
// Estado inicial: herda font_mode e fonts da marca ativa
// Toggle "IA decide / Eu escolho" — mesmo comportamento do FontPicker
// Se manual: slots individuais editáveis com preview
// Botão "Usar configuração da marca" → restaura estado da marca

// AVISO SEMPRE VISÍVEL (icone info, tom neutro):
// "As fontes são interpretadas pela IA — o resultado pode variar da fonte original."

// AO SUBMETER:
// font_mode = 'ai' ou igual ao da marca → não envia fontsOverride (back usa brands.fonts)
// font_mode = 'manual' e diferente da marca → envia { fontModeOverride: 'manual', fontsOverride }
// Back-end sempre valida e tem a palavra final
```

---

## GESTÃO DE MÚLTIPLAS MARCAS / CLIENTES

### Princípio de design

```
Usuário comum (1 marca):
  - Nunca vê o conceito de "marcas" — fluxo igual ao atual
  - BrandSwitcher não renderiza se houver só 1 marca
  - Onboarding cria a marca silenciosamente

Social media / agência (N marcas):
  - BrandSwitcher no header: dropdown para alternar entre clientes
  - Página /brands para criar, editar e arquivar marcas
  - Limite por plano: free=1, basic=3, pro=ilimitado
```

---

### BrandSwitcher — comportamento

```typescript
// components/brand/BrandSwitcher.tsx

// Renderização condicional:
// - brands.length <= 1: não renderiza nada (zero fricção pro usuário comum)
// - brands.length > 1: exibe dropdown com nome + avatar de cor da marca ativa

// Ao trocar de marca:
// 1. PATCH /api/profiles { active_brand_id: selectedId }
// 2. Atualiza cookie de sessão (httpOnly, SameSite=Lax) para persistir entre reloads
// 3. Revalida dados da página atual via router.refresh()

// Posição: header ao lado do LocaleSwitcher
// Formato: [ 🎨 Cliente A ▼ ] com bolinha colorida usando primary color da marca
```

---

### Limite de marcas por plano

```typescript
// lib/utils/usageLimits.ts — adicionar verificação de brandLimit

export async function canCreateBrand(userId: string): Promise<boolean> {
  const profile = await getProfile(userId)
  const brandCount = await countActiveBrands(userId)  // exclui soft-deleted
  const limit = PLANS[profile.plan].brandLimit
  return limit === Infinity || brandCount < limit
}

// Verificar em POST /api/brands antes de criar
// Se excedido: retornar 403 com mensagem e CTA de upgrade
// BrandLimitBadge exibe na página /brands: "2 de 3 marcas utilizadas"
```

---

### Fluxo de criação de nova marca

```typescript
// Página /brands — botão "+ Nova marca"
// Verifica limite do plano (canCreateBrand)
//   - Se no limite: abre UpgradeModal em vez do form
//   - Se ok: abre BrandForm em modal/drawer
// BrandForm reutiliza os mesmos componentes do onboarding (NicheSelector, ColorPicker)
// POST /api/brands → cria marca → redireciona e ativa a nova marca automaticamente
```

---

### Contexto ativo propagado para geração

```typescript
// Em /create e /clone:
// 1. Carregar active_brand_id do profile (ou do cookie de sessão)
// 2. Exibir BrandSwitcher no topo da página para trocar antes de gerar
// 3. Ao submeter, enviar brandId da marca ativa — back-end busca os dados no banco
// O usuário sempre sabe para qual cliente está gerando
```

---

## EXPORTAÇÃO E COMPARTILHAMENTO

```typescript
// PromptCopyButton: navigator.clipboard + feedback visual (ícone ✓ por 2s)

// PromptExport: Blob download como .txt

// PromptShareLink:
// POST /api/prompt/share → seta is_public=true
// Retorna URL: meucrIA.com.br/p/[id]

// /p/[id] — SSR com generateMetadata() dinâmico
// og:title e og:description baseados no nicho e formato do prompt
// CTA de cadastro para visitantes
```

---

## UPLOAD DA IMAGEM GERADA

```typescript
// Botão "Gerei a imagem, ver resultado" após receber o prompt
// Upload para Supabase Storage (bucket: prompt-results, path: {user_id}/{prompt_id}.jpg)
// Atualiza prompts.result_image_url
// Thumbnail exibido no histórico (Pro) e tela de resultado
// Registra usage_events { event_type: 'image_uploaded' }
```

---

## SISTEMA DE E-MAILS (Resend)

```typescript
// E-mail 1 — Boas-vindas
// Trigger: Supabase Database Webhook no insert em auth.users
// "Sua conta no MeuCrIA está pronta 🎨"
// Link direto para /onboarding + quantos prompts disponíveis

// E-mail 2 — Alerta de uso (80% do limite)
// Trigger: dentro de /api/prompt/generate ao incrementar prompts_used
// "Você está quase no limite dos seus prompts"
// X prompts restantes + CTA para upgrade

// E-mail 3 — Confirmação de upgrade
// Trigger: Stripe webhook invoice.paid
// "Plano [Básico/Pro] ativado com sucesso"
// Novo limite + features desbloqueadas
```

---

## RESET DE PROMPTS

```typescript
// profiles.prompts_reset_at = created_at + 30 dias

// A cada geração:
// 1. Verificar se now() > prompts_reset_at
//    - Sim: zerar prompts_used, atualizar prompts_reset_at += 30 dias
// 2. Verificar se prompts_used >= limit do plano

// UI: "Seus prompts resetam em X dias" exibido no UsageCounter
```

---

## ADMIN PANEL

```typescript
// Rota /admin — protegida por profiles.role = 'admin' no middleware

// GET /api/admin/stats retorna:
// {
//   totalUsers: number,
//   activeUsersLast7Days: number,
//   promptsGeneratedToday: number,
//   promptsGeneratedThisMonth: number,
//   paidUsers: number,
//   conversionRate: number,
//   totalFeedbacks: number,
//   totalBrandsCreated: number,       // métrica de engajamento
//   avgBrandsPerUser: number,         // indica se social medias estão usando
// }

// StatsCards: métricas em cards visuais
// UsersTable: listagem com filtro por plano
// PromptsTable: prompts recentes com feedbacks associados
```

---

## RATE LIMITING

```typescript
// lib/upstash/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

// Aplicar em: /api/prompt/generate (por user_id), /api/prompt/guest (por IP),
// /api/ai/suggest-colors (por user_id), /api/ai/suggest-content (por user_id)
// Retornar 429 com mensagem amigável
```

---

## MÓDULO DE CLONAGEM DE ARTE (exclusivo Pro)

### Visão geral do fluxo

```
Upload da imagem referência
        ↓
Disclaimer de uso (aceite obrigatório)
        ↓
GPT-4.1 Vision analisa a imagem
        ↓
IA mescla análise com dados da marca do usuário
        ↓
Prompt detalhado gerado em inglês
        ↓
Copiar / Baixar .txt
```

---

### Disclaimer obrigatório

```typescript
// components/clone/CloneDisclaimerModal.tsx
// Exibido ANTES do upload, com checkbox de aceite obrigatório para prosseguir
// Texto do disclaimer (i18n):
// "Ao usar este recurso, você declara que:
//  • A imagem enviada é de sua autoria ou você possui os direitos de uso
//  • Você não utilizará o resultado para infringir direitos autorais de terceiros
//  • O MeuCrIA não se responsabiliza pelo uso indevido desta funcionalidade"
// Aceite salvo em usage_events para registro de conformidade
```

---

### Banco de dados — tabela cloned_prompts

```sql
cloned_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  brand_id uuid references brands(id),
  source_image_url text,              -- imagem enviada (Supabase Storage, bucket: clone-sources)
  vision_analysis jsonb,              -- análise bruta retornada pelo GPT Vision
  generated_prompt text,              -- prompt final mesclado com dados da marca
  disclaimer_accepted_at timestamptz, -- timestamp do aceite do disclaimer
  deleted_at timestamptz,            -- soft delete
  created_at timestamptz default now()
)
```

---

### Route Handler — POST /api/clone

```typescript
// app/api/clone/route.ts

// 1. Autenticação via Supabase JWT
// 2. Verificar plano Pro — retornar 403 com UpgradeModal se não for Pro
// 3. Rate limiting Upstash (5 req/min por user_id — vision é mais caro)
// 4. Receber multipart/form-data:
//    { image: File, brandId: string, disclaimerAccepted: boolean }
// 5. Validar: disclaimerAccepted === true — rejeitar se false
// 6. Validar imagem: tipo (jpeg/png/webp), tamanho máximo 5MB (Zod)
// 7. Sanitizar todos os campos de texto com sanitizeInput()
// 8. Upload da imagem para Supabase Storage
//    bucket: clone-sources, path: {user_id}/{uuid}.jpg
// 9. Converter imagem para base64
// 10. Carregar system prompt via getSystemPrompt('clone')
// 11. Chamar GPT-4.1 Vision (lib/openai/cloneArtwork.ts)
// 12. Salvar em cloned_prompts com vision_analysis e generated_prompt
// 13. Registrar usage_events { event_type: 'artwork_cloned' }
// 14. Retornar apenas o generated_prompt
```

---

### Integração GPT-4.1 Vision

```typescript
// lib/openai/cloneArtwork.ts

// SYSTEM_PROMPT carregado via getSystemPrompt('clone') — tabela system_prompts
// NUNCA hardcoded no código-fonte

// Input para a API:
// messages: [{
//   role: 'user',
//   content: [
//     { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
//     { type: 'text', text: sanitizeString(`Dados da marca: ${JSON.stringify(brandData)}`) }
//   ]
// }]
// Todos os campos de texto do brandData passam por sanitizeInput() antes de serializar
```

---

### Componentes do módulo

```typescript
// components/clone/CloneUploadZone.tsx
// Drag-and-drop com react-dropzone
// Aceita: image/jpeg, image/png, image/webp
// Limite: 5MB com feedback visual de erro
// Preview da imagem após seleção com opção de trocar

// components/clone/CloneAnalysisLoader.tsx
// Skeleton animado exibido durante chamada ao GPT Vision
// Mensagens rotativas de loading:
// "Analisando composição...", "Identificando paleta...",
// "Mesclando com sua marca...", "Finalizando prompt..."

// components/clone/CloneResult.tsx
// Exibe o prompt gerado em textarea de leitura
// Botão copiar (PromptCopyButton reutilizado)
// Botão baixar .txt (PromptExport reutilizado)
// Botão "Clonar outra imagem" (reseta o wizard)
```

---

### Middleware — proteção da rota /clone

```typescript
// middleware.ts — adicionar ao plano gate:
// /clone verifica features.cloneArtwork === true no JWT
// Se não Pro → redireciona para /pricing com parâmetro ?highlight=pro
```

---

### Custo estimado por clonagem (GPT-4.1 Vision)

```
Input: ~1.000 tokens de texto + ~1.000 tokens de imagem (estimativa média) = ~2.000 tokens
Output: ~600 tokens (prompt gerado)

GPT-4.1: input $2,00/1M tokens | output $8,00/1M tokens
Custo por clonagem: (2.000 × $0,000002) + (600 × $0,000008) = $0,0040 + $0,0048 = ~$0,009
~R$0,05 por uso no câmbio atual

Usuário Pro com 200 clonagens/mês = ~R$10 de custo de API
Bem dentro da margem do plano de R$49.
```

---

## LANDING PAGE — Estrutura e Conversão

### Princípios gerais

```
Tom: profissional e direto — fala com resultado, não com feature
Objetivo primário: converter visitante em usuário (cadastro ou teste sem login)
Objetivo secundário: qualificar o lead (social media, agência, pequeno negócio)
Tráfego pago como fonte principal → hero deve converter acima de tudo
Nenhuma seção é decorativa — cada bloco tem CTA ou prova de valor
```

---

### Estrutura de seções (ordem obrigatória)

```
1. HEADER FIXO
2. HERO
3. PROVA SOCIAL (logos ou números)
4. PREVIEW AO VIVO (demo interativa)
5. COMO FUNCIONA (passo a passo)
6. DEPOIMENTOS
7. PLANOS
8. CTA FINAL
9. FOOTER
```

---

### 1. Header fixo

```typescript
// components/landing/Header.tsx
// Fixo no topo, fundo com blur backdrop ao rolar

// Esquerda: logo MeuCrIA
// Centro: nav — Como funciona | Planos | (oculto em mobile)
// Direita:
//   - Se não logado: [ Entrar ] [ Criar conta — grátis ▶ ]
//   - Se logado: [ Ir para o painel ▶ ]

// CTA "Criar conta — grátis" → destaque visual (cor primária, borda arredondada)
// Em mobile: hamburger menu, CTA "Criar conta" sempre visível
```

---

### 2. Hero

```typescript
// components/landing/Hero.tsx
// Seção mais importante — foco total em conversão

// LAYOUT (desktop): duas colunas
// Coluna esquerda (60%): copy + CTAs
// Coluna direita (40%): mockup animado do produto gerando um prompt

// COPY STRUCTURE:
// Supertítulo (pequeno, acima): "Geração de criativos com IA"
// H1 (grande, bold):
//   "Crie prompts profissionais para seus criativos em segundos."
// Subtítulo (1–2 linhas, peso normal):
//   "Informe sua marca, escolha o formato e a IA gera o prompt
//    perfeito para o Google ImageFX. Sem enrolação."
// Micro-prova: "✓ 15 prompts grátis  ✓ Sem cartão de crédito  ✓ Resultado em segundos"

// CTAs (dois botões lado a lado):
// [PRIMARY]  Testar grátis — sem cadastro  →  ancora na #demo
// [SECONDARY] Criar minha conta  →  /login?tab=register

// Nota abaixo dos CTAs: "Já tem conta? Entrar →"

// MOCKUP direito: animação CSS simples mostrando o wizard preenchendo
// e o prompt aparecendo linha por linha (typewriter effect)
// Não precisa ser funcional — só visual para reforçar o produto
```

---

### 3. Prova social rápida

```typescript
// components/landing/SocialProof.tsx
// Faixa fina entre hero e preview — fundo levemente contrastante

// Opção A (antes de ter usuários reais): métricas de produto
//   "Mais de 500 prompts gerados • 3 formatos suportados • Resultado em < 10s"

// Opção B (após ter usuários): logos de agências/clientes ou número de usuários
//   "Usado por social medias e agências em todo o Brasil"

// Trocar de A para B assim que tiver dados reais — campo fácil de atualizar
```

---

### 4. Preview ao vivo (demo interativa)

```typescript
// components/landing/PromptPreview.tsx
// SEÇÃO ÂNCORA: id="demo" — destino do CTA primário da hero

// Layout: card centralizado, largura máxima 640px

// HEADER do card:
//   "Teste agora — sem precisar criar conta"
//   Subtítulo: "Preencha os campos abaixo e veja o prompt gerado pela IA"

// FORMULÁRIO SIMPLIFICADO (apenas 3 campos para não assustar):
//   1. Nicho do negócio (select com 8 opções comuns + "Outro")
//   2. Formato (feed / story / carrossel — 3 botões toggle)
//   3. Objetivo do criativo (textarea livre, placeholder sugestivo)

// BOTÃO: [ ✨ Gerar meu prompt grátis ]
//   → chama POST /api/prompt/guest (fingerprint)
//   → loading state com texto "Gerando seu prompt..."
//   → exibe resultado em textarea com botão copiar

// PÓS-GERAÇÃO — bloco abaixo do resultado:
//   "Gostou? Crie sua conta e tenha 15 prompts grátis com sua marca configurada."
//   [ Criar conta grátis ] [ Ver planos ]

// Se fingerprint já usado: oculta form, exibe diretamente o CTA de cadastro
//   "Você já usou seu teste gratuito. Crie uma conta para continuar."
```

---

### 5. Como funciona (passo a passo)

```typescript
// components/landing/HowItWorks.tsx
// 3 passos — ícone + título curto + descrição de 1 linha

// Passo 1 — Configure sua marca
//   "Informe seu nicho, cores e estilo uma vez. A IA usa tudo isso."

// Passo 2 — Escolha o formato
//   "Feed, story ou carrossel. Com ou sem persona. Você decide."

// Passo 3 — Copie e use
//   "O prompt chega pronto para colar no Google ImageFX e gerar a imagem."

// Abaixo dos 3 passos: CTA secundário
//   [ Começar agora — é grátis ]  →  /login?tab=register

// Layout: 3 colunas desktop, stack vertical mobile
// Visual limpo, sem excesso — o produto fala por si
```

---

### 6. Depoimentos

```typescript
// components/landing/Testimonials.tsx

// Antes de ter depoimentos reais: OCULTAR essa seção completamente
// Não usar depoimentos falsos — prejudica credibilidade

// Quando tiver depoimentos reais (mínimo 3):
// Cards com: foto (opcional), nome, cargo/nicho, texto do depoimento
// Máximo 2 linhas de texto por card — direto ao ponto
// Foco em resultado: "Criei 10 prompts em 5 minutos", não "produto incrível"

// Layout: carrossel em mobile, grid 3 colunas em desktop
```

---

### 7. Planos

```typescript
// components/landing/Pricing.tsx
// Tabela simples — 3 colunas: Free | Básico | Pro

// Destacar o plano Pro com badge "Mais popular" ou borda colorida
// Listar apenas os 4–5 diferenciais mais importantes por plano
// NÃO listar tudo — menos é mais em pricing

// Diferencial por plano que deve aparecer:
// Free:   15 prompts/mês | 1 marca
// Básico: 60 prompts/mês | 3 marcas | R$29/mês
// Pro:    Ilimitado | Marcas ilimitadas | Clonagem de arte | Copy de conversão | Histórico | R$49/mês

// CTA por plano:
// Free:   [ Começar grátis ]     → /login?tab=register
// Básico: [ Assinar Básico ]     → /login?tab=register&plan=basic
// Pro:    [ Assinar Pro ]        → /login?tab=register&plan=pro

// Nota abaixo: "Cancele quando quiser. Sem fidelidade."
```

---

### 8. CTA Final

```typescript
// components/landing/FinalCTA.tsx
// Seção de fechamento — fundo com cor de destaque (primária ou escura)

// H2: "Pronto para criar criativos melhores em menos tempo?"
// Subtítulo: "Comece grátis hoje. 15 prompts para testar à vontade."
// Botão único grande: [ Criar minha conta grátis ]  →  /login?tab=register
// Micro-texto: "✓ Sem cartão  ✓ Sem contrato  ✓ Resultado imediato"
```

---

### 9. Footer

```typescript
// components/landing/Footer.tsx
// Mínimo necessário — não sobrecarregar

// Logo + tagline curta
// Links: Planos | Como funciona | Entrar | Criar conta
// Links legais: Termos de uso | Política de privacidade
// Copyright

// Sem newsletter, sem redes sociais por enquanto — foco em conversão
```

---

### SEO e Meta tags da landing

```typescript
// app/[locale]/(public)/page.tsx — generateMetadata

title: "MeuCrIA — Crie prompts para criativos com IA em segundos"
description: "Gere prompts profissionais para o Google ImageFX. Configure sua marca uma vez e crie criativos para Instagram com IA. 15 prompts grátis, sem cartão."

og:title: "MeuCrIA — Prompts para criativos com IA"
og:description: "Seu próximo criativo começa com o prompt certo."
og:image: "/og-home.png"  // imagem 1200x630 mostrando o produto

// Palavras-chave naturais no conteúdo (não stuffing):
// "prompt para google imagefx", "criativo com ia para instagram",
// "gerador de prompt para tráfego pago", "prompt para social media"
```

---

### Otimizações para tráfego pago

```typescript
// 1. Parâmetros UTM preservados no redirecionamento
//    /login?tab=register&utm_source=...&utm_campaign=...
//    Salvar UTM no localStorage antes do cadastro
//    Após cadastro: PATCH /api/profiles { acquisition_source: utmData }
//    → Saber qual campanha converte melhor

// 2. Variante de hero por parâmetro (A/B simples sem ferramenta externa)
//    /?v=a → hero com foco em "social media e agências"
//    /?v=b → hero com foco em "pequenos negócios"
//    Registrar variant em usage_events para medir conversão

// 3. Scroll depth tracking mínimo
//    Evento simples quando usuário chega na seção #demo
//    Registrar em usage_events { event_type: 'demo_section_viewed' }
//    Medir: chegou na demo mas não gerou vs gerou mas não cadastrou

// 4. Adicionar coluna acquisition_source jsonb em profiles
//    { utm_source, utm_medium, utm_campaign, utm_content, variant }
```

---

## MÓDULO DE COPY DE CONVERSÃO (exclusivo Pro)

### Visão geral

```
Prompt de imagem gerado
        ↓
Botão "✦ Gerar copy para este criativo" (visível apenas Pro)
        ↓
Usuário escolhe o tom (opcional — padrão: urgência)
        ↓
Back-end usa dados da marca + prompt gerado + tom escolhido
        ↓
GPT-4.1-mini retorna copy estruturada em 4 blocos
        ↓
CopyResult exibe cada bloco com botão de cópia individual
```

---

### Posicionamento na UI

```typescript
// components/prompt/PromptResult.tsx
// Após exibir o prompt de imagem gerado, renderizar condicionalmente:

// Se plano Pro:
//   <CopyGenerator promptId={prompt.id} brandId={brand.id} objective={raw_input.objective} />

// Se plano Free ou Basic:
//   Bloco de upsell sutil abaixo do prompt:
//   "Gere também a copy de conversão para este criativo — disponível no Pro"
//   [ Conhecer o Pro ]  →  /pricing?highlight=pro

// O bloco de copy NÃO bloqueia o fluxo principal
// O usuário já tem o prompt de imagem — a copy é bônus opcional
```

---

### Tons disponíveis (CopyToneSelector)

```typescript
// components/prompt/CopyToneSelector.tsx
// 4 botões toggle, seleção única, padrão: 'urgency'

export const COPY_TONES = {
  urgency:   { label: 'Urgência',    description: 'Prazo, escassez, última chance' },
  emotional: { label: 'Emocional',   description: 'Conexão, identificação, desejo' },
  curiosity: { label: 'Curiosidade', description: 'Hook que instiga, pergunta, mistério' },
  authority: { label: 'Autoridade',  description: 'Prova social, expertise, resultado' },
} as const
```

---

### Route Handler — POST /api/copy/generate

```typescript
// app/api/copy/generate/route.ts

// 1. Autenticação via Supabase JWT
// 2. Verificar plano Pro — 403 com UpgradeModal se não for Pro
// 3. Rate limiting Upstash (10 req/min por user_id)
// 4. Receber input — APENAS dados brutos, sem lógica de copy no front:
//    { promptId, brandId, tone }
//    tone: 'urgency' | 'emotional' | 'curiosity' | 'authority'
// 5. Sanitizar input com sanitizeInput()
// 6. Buscar dados da marca (brandId → Supabase)
// 7. Buscar prompt de imagem (promptId → prompts.generated_prompt + raw_input.objective)
// 8. Carregar system prompt via getSystemPrompt('copy')
// 9. Chamar GPT-4.1-mini via lib/openai/generateCopy.ts
// 10. Parsear e validar resposta JSON com Zod (CopyOutputSchema)
// 11. Salvar em prompts.generated_copy e prompts.copy_tone (PATCH)
// 12. Registrar usage_events { event_type: 'copy_generated', metadata: { tone } }
// 13. Retornar { hook, body, cta, hashtags }

// ⚠️ O system prompt fica na tabela system_prompts no Supabase
// Acesso apenas via service_role — nunca exposto ao front ou no código-fonte
```

---

### Integração GPT-4.1-mini (lib/openai/generateCopy.ts)

```typescript
// lib/openai/generateCopy.ts

// SYSTEM_PROMPT carregado via getSystemPrompt('copy') — tabela system_prompts
// O system prompt instrui a IA a:
//   - Gerar copy de conversão para Instagram em português do Brasil
//   - Aplicar o tom recebido ao estilo e escolha de palavras
//   - Retornar APENAS JSON válido, sem markdown, sem explicações
//   - Estrutura obrigatória:
//     {
//       "hook": "1 linha que para o scroll — máx 10 palavras",
//       "body": "2 a 3 linhas de contexto ou benefício",
//       "cta": "instrução clara de ação — máx 8 palavras",
//       "hashtags": ["#tag1", "#tag2", ...] — 8 a 10 tags
//     }
//   - Usar nicho, nome da marca e objetivo do criativo
//   - Linguagem natural, sem clichês genéricos de marketing

// Parse seguro da resposta:
const raw = data.content[0].text
const clean = raw.replace(/```json|```/g, '').trim()
const parsed = CopyOutputSchema.parse(JSON.parse(clean)) // valida com Zod antes de usar
```

---

### Validação de output (lib/validations/copy.schema.ts)

```typescript
import { z } from 'zod'

export const CopyOutputSchema = z.object({
  hook:      z.string().min(1).max(120),
  body:      z.string().min(1).max(400),
  cta:       z.string().min(1).max(80),
  hashtags:  z.array(z.string().startsWith('#')).min(5).max(12),
})

export type CopyOutput = z.infer<typeof CopyOutputSchema>

// Se falhar na validação: logar erro + retornar 500 com mensagem amigável
// Nunca retornar output não validado ao front
```

---

### Componente CopyResult

```typescript
// components/prompt/CopyResult.tsx
// 4 blocos independentes, cada um com botão de cópia próprio

// BLOCO HOOK — label "Hook" + badge "Para o scroll"
// Texto em destaque (peso 500, fonte ligeiramente maior)
// [ Copiar hook ]

// BLOCO CORPO — label "Corpo do texto"
// Texto normal, line-height generoso
// [ Copiar corpo ]

// BLOCO CTA — label "Call to action"
// Texto em destaque com cor de acento da marca
// [ Copiar CTA ]

// BLOCO HASHTAGS — label "Hashtags"
// Pills horizontais, wrap, uma por tag
// [ Copiar todas ] — copia string separada por espaço

// RODAPÉ do card:
// [ Copiar tudo ]  →  hook + \n\n + body + \n\n + cta + \n\n + hashtags
//                     pronto para colar direto no Instagram

// [ Gerar nova versão ]  →  repete chamada com mesmo tom
// [ Mudar tom ]          →  exibe CopyToneSelector novamente
```

---

### Custo estimado por geração de copy

```
Input:  ~800 tokens (system prompt + dados da marca + objetivo + tom)
Output: ~300 tokens (JSON com os 4 campos)

GPT-4.1-mini: input $0,40/1M | output $1,60/1M
Custo por geração: ~$0,0008 → menos de R$0,01 por uso

Usuário Pro com 100 copies/mês = ~R$0,48 de custo de API
Margem totalmente confortável dentro do plano de R$49
```

---

```typescript
// Feedbacks em prompt_feedbacks salvos estruturados
// Futuramente: incluir como few-shot examples no system prompt
// "O usuário preferiu prompts com: [feedback1], [feedback2]"
// Personaliza geração ao longo do tempo sem fine-tuning
```

---

## SISTEMA DE TRADUÇÃO

```typescript
export const locales = ['pt-BR', 'en-US'] as const
export const defaultLocale = 'pt-BR'
// middleware detecta locale por Accept-Language
// Uso: import { useTranslations } from 'next-intl'
```

---

## MIDDLEWARE (ordem de verificação)

```typescript
// 1. next-intl: locale routing
// 2. Supabase auth: rotas (auth) → redireciona /login se não autenticado
// 3. Onboarding gate: onboarding_completed = false → força /onboarding
// 4. Admin gate: /admin verifica role = 'admin' no JWT
// 5. Plano gate: /history e /presets verificam plano Pro no JWT
```

---

## DOCKER + VPS

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```nginx
server {
  listen 443 ssl;
  server_name meucrIA.com.br;
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## PWA

```typescript
// next.config.ts — integrar next-pwa
// manifest.json com nome, ícones e theme_color
// Permite instalação via "Adicionar à tela inicial" no mobile
```


---

## PÁGINAS LEGAIS E CONSENTIMENTO DE COOKIES

### Cookie Banner (components/shared/CookieBanner.tsx)

```typescript
// Exibido na primeira visita de qualquer usuário
// Posição: fixo no rodapé da tela (position: fixed, bottom: 0)
// Persiste até o usuário tomar uma ação — não some sozinho

// CONTEÚDO:
// Texto: "Usamos cookies essenciais para o funcionamento da plataforma
//         e cookies de terceiros (Stripe) para processar pagamentos.
//         Saiba mais na nossa [Política de Cookies] e [Política de Privacidade]."
// Botões:
//   [ Apenas essenciais ]  →  salva consent = 'essential'
//   [ Aceitar todos ]      →  salva consent = 'all'

// ARMAZENAMENTO:
// Cookie: meucrIA_cookie_consent | valor: 'all' | 'essential'
// Expires: 365 dias | SameSite: Lax | Secure: true | httpOnly: false
// Leitura no layout.tsx para decidir se carrega Stripe.js

// COMPORTAMENTO:
// 'essential': carrega apenas Supabase (necessário para auth)
// 'all':       carrega Supabase + Stripe.js
// Stripe.js NUNCA carregado antes do consentimento 'all'

// REABERTURA:
// Link "Gerenciar cookies" no footer → deleta o cookie e reabre o banner
```

---

### Implementação técnica

```typescript
// app/[locale]/layout.tsx — carregamento condicional
import { cookies } from 'next/headers'

export default function RootLayout({ children }) {
  const cookieStore = cookies()
  const consent = cookieStore.get('meucrIA_cookie_consent')?.value
  return (
    <html>
      <body>
        {children}
        {!consent && <CookieBanner />}
        {consent === 'all' && (
          <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />
        )}
      </body>
    </html>
  )
}

// app/actions/consent.ts — Server Action
'use server'
import { cookies } from 'next/headers'

export async function setCookieConsent(value: 'all' | 'essential') {
  cookies().set('meucrIA_cookie_consent', value, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
}

// components/shared/CookieBanner.tsx
'use client'
export function CookieBanner() {
  return (
    <div className={styles.banner}>
      <p>
        Usamos cookies essenciais para o funcionamento da plataforma e cookies
        do Stripe para processar pagamentos. Saiba mais na nossa{' '}
        <a href="/cookies">Política de Cookies</a> e{' '}
        <a href="/privacy">Política de Privacidade</a>.
      </p>
      <div className={styles.actions}>
        <button onClick={() => setCookieConsent('essential')}>Apenas essenciais</button>
        <button onClick={() => setCookieConsent('all')}>Aceitar todos</button>
      </div>
    </div>
  )
}
```

---

### Política de Privacidade — conteúdo (/privacy)

```markdown
# Política de Privacidade — MeuCrIA
Última atualização: [data]

## 1. Quem somos
MeuCrIA é uma plataforma de geração de prompts para criativos de Instagram,
operada por [seu nome ou razão social], com sede no Brasil.
Contato: privacidade@meucrIA.com.br

## 2. Dados que coletamos

Dados que você fornece:
- Nome e e-mail (cadastro)
- Dados da marca: nicho, cores, descrição do negócio
- Textos e objetivos dos criativos criados
- Imagens enviadas no módulo de clonagem de arte

Dados coletados automaticamente:
- Endereço IP (segurança e prevenção de abuso)
- User-Agent do navegador (demo sem cadastro)
- Dados de uso: prompts gerados, plano, datas de acesso

Dados de pagamento:
- Processados diretamente pelo Stripe — não armazenamos dados de cartão
- Recebemos apenas: status da assinatura e ID do cliente Stripe

## 3. Para que usamos seus dados
- Autenticar sua conta e manter sessão ativa
- Gerar prompts e copies personalizados com os dados da sua marca
- Processar pagamentos e gerenciar assinatura
- Enviar e-mails transacionais (boas-vindas, alertas, confirmações)
- Prevenir abusos e garantir segurança da plataforma

## 4. Com quem compartilhamos

Apenas com prestadores essenciais ao funcionamento:
- Supabase: banco de dados e autenticação (EUA, criptografia em repouso)
- OpenAI: geração de prompts e copies. Dados da marca e objetivo enviados
  para processamento. A OpenAI não usa dados de API para treinar modelos.
- Stripe: pagamentos e assinatura
- Resend: envio de e-mails transacionais

Não vendemos dados. Não compartilhamos com anunciantes.

## 5. Retenção de dados
- Conta e marca: enquanto ativa + 30 dias após exclusão
- Prompts e copies: mesmo prazo acima
- Imagens de clonagem: deletadas com a conta
- Eventos de uso: 12 meses, depois anonimizados (user_id removido)
- Visitantes sem cadastro (demo): 90 dias

## 6. Seus direitos (LGPD)
- Acessar os dados que temos sobre você
- Corrigir dados incorretos
- Deletar sua conta e todos os dados
- Portabilidade dos dados em formato legível
- Revogar consentimento de cookies a qualquer momento

Exercício de direitos: privacidade@meucrIA.com.br
Prazo de resposta: até 15 dias úteis.

## 7. Menores de idade
O MeuCrIA não é direcionado a menores de 18 anos.
Não coletamos dados de menores intencionalmente.

## 8. Alterações
Alterações relevantes serão comunicadas por e-mail com antecedência.
A data de "última atualização" indica a versão vigente.
```

---

### Termos de Uso — conteúdo (/terms)

```markdown
# Termos de Uso — MeuCrIA
Última atualização: [data]

## 1. Aceitação
Ao criar uma conta ou usar o MeuCrIA, você concorda com estes termos.

## 2. O que é o MeuCrIA
Plataforma que gera prompts de texto para Google ImageFX e copies de conversão
para Instagram. Não geramos imagens — fornecemos o prompt para uso em ferramentas
de geração de imagem de terceiros.

## 3. Cadastro
- Deve ter 18 anos ou mais
- Responsável por manter credenciais em segurança
- Uma conta por pessoa ou empresa
- Dados fornecidos devem ser verdadeiros

## 4. Uso aceitável

Permitido:
- Gerar prompts para criativos do seu negócio ou de clientes
- Usar os prompts em ferramentas de geração de imagem
- Compartilhar prompts via link público

Proibido:
- Gerar conteúdo ilegal, discriminatório ou que viole direitos de terceiros
- Fazer engenharia reversa do sistema de geração de prompts
- Usar bots ou automações para contornar limites de uso
- Upload de imagens no módulo de clonagem sem ter direitos sobre elas
- Revender acesso à plataforma sem autorização

## 5. Módulo de clonagem
Ao usar este módulo, você declara que:
- A imagem enviada é de sua autoria ou você possui direitos de uso
- Não usará o resultado para infringir direitos autorais de terceiros
O MeuCrIA não se responsabiliza pelo uso indevido deste módulo.

## 6. Propriedade intelectual
- Os prompts gerados pertencem a você
- O sistema, interface, código e lógica de geração pertencem ao MeuCrIA

## 7. Planos e pagamentos
- Planos cobrados mensalmente via Stripe
- Cancelamento tem efeito no fim do período vigente — sem reembolso proporcional
- Alterações de preço comunicadas com 30 dias de antecedência por e-mail
- Limite de prompts reseta a cada 30 dias a partir da data de cadastro

## 8. Disponibilidade
- Buscamos disponibilidade contínua, sem garantia de 100% de uptime
- Manutenções comunicadas com antecedência quando possível
- Suporte: suporte@meucrIA.com.br

## 9. Limitação de responsabilidade
O MeuCrIA não se responsabiliza por:
- Qualidade das imagens geradas por ferramentas de terceiros
- Uso dos prompts para fins que violem leis ou direitos de terceiros
- Perdas indiretas decorrentes do uso ou indisponibilidade da plataforma

## 10. Encerramento
Podemos suspender contas que violem estes termos, com aviso prévio,
exceto em casos de fraude ou conteúdo ilegal.

## 11. Lei aplicável
Regidos pelas leis brasileiras. Foro: [sua cidade], Brasil.

## 12. Contato
contato@meucrIA.com.br
```

---

### Política de Cookies — conteúdo (/cookies)

```markdown
# Política de Cookies — MeuCrIA
Última atualização: [data]

## O que são cookies
Pequenos arquivos de texto armazenados no seu dispositivo ao visitar um site.

## Cookies que utilizamos

### Essenciais (sempre ativos — necessários para o funcionamento)
| Cookie                  | Finalidade                          | Duração  |
|-------------------------|-------------------------------------|----------|
| sb-[id]-auth-token      | Sessão de autenticação Supabase     | Sessão   |
| meucrIA_cookie_consent  | Salva sua preferência de cookies    | 365 dias |

### Funcionalidade
| Cookie                  | Finalidade                          | Duração  |
|-------------------------|-------------------------------------|----------|
| meucrIA_active_brand    | Lembra qual marca/cliente estava ativo | 30 dias |
| meucrIA_locale          | Lembra o idioma escolhido           | 365 dias |

### Pagamentos (apenas com consentimento 'aceitar todos')
| Cookie          | Origem | Finalidade                      | Duração  |
|-----------------|--------|---------------------------------|----------|
| __stripe_mid    | Stripe | Prevenção de fraudes            | 1 ano    |
| __stripe_sid    | Stripe | Sessão de checkout              | 30 min   |

## O que NÃO fazemos
- Não usamos cookies de rastreamento publicitário
- Não compartilhamos cookies com redes de anúncios
- Não usamos Google Analytics, Facebook Pixel ou similares

## Como gerenciar
Clique em "Gerenciar cookies" no rodapé a qualquer momento para alterar
suas preferências. Limpar cookies no navegador encerrará sua sessão.

## Contato
privacidade@meucrIA.com.br
```

---

### Footer — links legais obrigatórios

```typescript
// components/layout/Footer.tsx e components/landing/Footer.tsx
// Links sempre visíveis em todos os contextos

// Privacidade | Termos de Uso | Cookies | Gerenciar cookies

// "Gerenciar cookies" → Server Action que deleta meucrIA_cookie_consent
// e redireciona para a página atual → banner reaparece automaticamente

export async function resetCookieConsent() {
  'use server'
  cookies().delete('meucrIA_cookie_consent')
  redirect('/')
}
```



## SEGURANÇA

### Front-End

```typescript
// 1. JWT/SESSION — HttpOnly Cookies
// Supabase Auth já emite JWT — configurar para usar cookies HttpOnly, SameSite=Lax
// NUNCA armazenar token de acesso em localStorage ou sessionStorage
// Configurar em lib/supabase/client.ts usando @supabase/ssr:
// createBrowserClient(url, key, { cookies: { ... } })

// 2. Validação de Permissões no Cliente (progressive disclosure)
// PlanGate.tsx verifica plano antes de renderizar features Pro/Basic
// BrandSwitcher só renderiza se brands.length > 1
// Verificações no cliente são APENAS visuais — validação real sempre no back-end

// 3. CSRF Protection
// Next.js App Router com Server Actions usa tokens CSRF automaticamente
// Para Route Handlers com mutations (POST/PATCH/DELETE):
//   - Verificar header Origin contra domínio próprio
//   - Supabase JWT já mitiga CSRF em chamadas autenticadas

// 4. Sanitização de Output da IA
// Todo texto gerado pela IA antes de renderizar no front:
// - NUNCA usar dangerouslySetInnerHTML com output da IA
// - Renderizar sempre em <textarea readonly> ou <p> como texto puro
// - Se precisar renderizar markdown: usar DOMPurify para sanitizar antes

// 5. Content Security Policy (CSP) — next.config.ts
// Content-Security-Policy:
//   default-src 'self';
//   script-src 'self' 'unsafe-inline' https://js.stripe.com;
//   connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com https://*.upstash.io;
//   img-src 'self' data: blob: https://*.supabase.co;
//   frame-src https://js.stripe.com;
//   frame-ancestors 'none';

// 6. Validação de Entrada no Cliente
// React Hook Form + Zod em TODOS os formulários (BrandForm, PromptWizard, onboarding)
// Validação client-side é UX — validação real é sempre no back-end com Zod também
// Nunca enviar dados não validados para os route handlers

// 7. Debounce em chamadas de IA no cliente
// Campos que disparam sugestões de IA (cores, conteúdo):
// Aplicar debounce de 600ms antes de cada chamada para evitar spam
// Desabilitar botão durante loading para evitar duplo envio

// 8. localStorage — apenas dados não sensíveis
// Permitido: { guestUsed: true, timestamp } para demo guest
// PROIBIDO: JWT, tokens, dados pessoais, API keys, dados de sessão
// Sessão: cookies HttpOnly gerenciados pelo Supabase — nunca localStorage

// 9. HTTPS obrigatório
// nginx: redirecionar todo tráfego HTTP (porta 80) para HTTPS (porta 443)
// Certbot com Let's Encrypt + renovação automática via crontab

// 10. HSTS Header
// Strict-Transport-Security: max-age=31536000; includeSubDomains
// Configurar no nginx e em next.config.ts headers()
```

---

### Back-End

```typescript
// 1. Validar JWT em Cada Requisição
// Usar lib/supabase/server.ts (createServerClient do @supabase/ssr) em todos os route handlers
// Padrão obrigatório:
const { data: { user }, error } = await supabase.auth.getUser()
if (!user || error) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
// NUNCA confiar em dados do body para identificar o usuário — sempre via JWT

// 2. Row-Level Security (RLS) no Supabase — CRÍTICO
// Habilitar RLS em TODAS as tabelas sem exceção
// Políticas obrigatórias:
//   profiles:         SELECT/UPDATE apenas WHERE id = auth.uid()
//   brands:           ALL apenas WHERE user_id = auth.uid()
//   prompts:          ALL apenas WHERE user_id = auth.uid()
//   cloned_prompts:   ALL apenas WHERE user_id = auth.uid()
//   prompt_feedbacks: ALL apenas WHERE user_id = auth.uid()
//   usage_events:     INSERT apenas WHERE user_id = auth.uid(), SELECT negado ao anon
//   guest_usage:      INSERT/SELECT apenas via service_role (sem acesso anon direto)
// Sem RLS: qualquer usuário autenticado pode ler dados de outro — risco crítico

// 3. Prepared Statements
// Supabase client usa prepared statements por padrão via PostgREST — seguro
// NUNCA usar SQL raw com interpolação: `SELECT * FROM brands WHERE id = '${id}'`
// Sempre usar: supabase.from('brands').select().eq('id', id)
// Se usar SQL raw: parâmetros sempre separados ($1, $2...)

// 4. Rate Limiting — Upstash (já configurado)
// Limites por endpoint:
//   /api/prompt/generate:     10 req/min por user_id
//   /api/copy/generate:       10 req/min por user_id
//   /api/clone:                5 req/min por user_id
//   /api/ai/suggest-colors:   10 req/min por user_id
//   /api/ai/suggest-content:  10 req/min por user_id
//   /api/prompt/guest:         3 req/min por IP
// Retornar 429 com header Retry-After

// 5. DDoS Protection via Cloudflare (free tier)
// Cloudflare na frente do nginx — free tier resolve na fase inicial
// Configurar: SSL/TLS → Full (strict), Always Use HTTPS, Bot Fight Mode ativado

// 6. Validação de Entrada no Back-End — Zod obrigatório
// Padrão em TODO route handler antes de qualquer processamento:
const result = MySchema.safeParse(await request.json())
if (!result.success) return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
const data = result.data // nunca usar dados brutos do request

// 7. Hashing de Senhas
// Supabase Auth gerencia senhas com bcrypt internamente
// Documentado para garantir que nenhum fluxo custom bypass o Supabase Auth
// NUNCA armazenar senha em texto plano em qualquer tabela própria

// 8. Escape de Output da IA
// Output da OpenAI tratado como dado não confiável
// Salvar no banco como texto puro (sem processar)
// Retornar ao front como string — renderizar sem dangerouslySetInnerHTML
// Se output for JSON: validar com Zod antes de usar (CopyOutputSchema já previsto)

// 9. Não Logar Dados Sensíveis
// PROIBIDO em console.log, logger ou Sentry:
//   - JWT tokens ou fragmentos
//   - API keys (OPENAI_API_KEY, STRIPE_SECRET_KEY etc.)
//   - E-mails, nomes completos, dados pessoais
//   - Conteúdo de prompts de usuários identificáveis
// Logar apenas: event_type, status code, user_id anonimizado

// 10. Variáveis de Ambiente — separação obrigatória
// NEXT_PUBLIC_*: apenas valores sem risco (Supabase URL, Supabase anon key)
// Sem NEXT_PUBLIC_: tudo que é secret (OpenAI, Stripe, Resend, Upstash, system prompts)
// .env.local no .gitignore — NUNCA commitar secrets
// Na VPS: variáveis injetadas via docker-compose ou arquivo .env fora do repositório
```

---

### LGPD

```typescript
// 1. Cookie Banner e Consentimento
// Exibir banner na primeira visita para usuários não autenticados
// Consentimento obrigatório antes de carregar Stripe.js ou analytics
// Salvar preferência em cookie próprio para leitura no cliente
// Componente: components/shared/CookieBanner.tsx

// 2. Política de Privacidade
// Página /privacy-policy com linguagem clara (não juridiquês)
// Informar: dados coletados, como usamos, com quem compartilhamos
// (OpenAI, Stripe, Supabase, Resend), retenção e como solicitar exclusão
// Link no footer e no cadastro: "Ao criar sua conta, você concorda com..."

// 3. Right to be Forgotten — DELETE de conta
// Rota: DELETE /api/account
// Fluxo:
//   1. Re-autenticação obrigatória antes de deletar
//   2. Soft delete: profiles.deleted_at = now()
//   3. Agendar exclusão definitiva em 30 dias
//   4. Cascata: brands, prompts, cloned_prompts, usage_events, imagens no Storage
//   5. Cancelar subscription Stripe se ativa (stripe.subscriptions.cancel)
//   6. Enviar e-mail de confirmação de exclusão via Resend
// Componente: settings/page.tsx → seção "Excluir minha conta"

// 4. Criptografia de Dados em Repouso
// Supabase (PostgreSQL no AWS) já criptografa em repouso por padrão (AES-256)
// Imagens no Supabase Storage: também criptografadas em repouso
// Nenhuma ação manual necessária — documentado para referência de auditoria LGPD

// 5. HTTPS em Trânsito
// Coberto pelo nginx + Let's Encrypt + Cloudflare
// Todas as chamadas externas (OpenAI, Stripe, Supabase, Resend) já usam HTTPS

// 6. Retenção Automática de Dados
// Política definida:
//   - Prompts e copies: ativos enquanto conta existe + 30 dias após exclusão
//   - Imagens no Storage: deletadas junto com a conta
//   - usage_events: retidos por 12 meses, depois anonimizados (user_id → null)
//   - guest_usage: deletar registros com mais de 90 dias (Supabase pg_cron semanal)
// Implementar via Supabase pg_cron extension

// 7. Logs de Acesso e Auditoria
// usage_events cobre o essencial (prompt_generated, plan_upgraded, artwork_cloned etc.)
// Tabela adicional admin_logs para ações administrativas:
// admin_logs { id, admin_id, action, target_user_id, metadata jsonb, created_at }
// Suficiente para conformidade LGPD sem necessidade de solução enterprise
```

---

### Checklist de Deploy

```nginx
# nginx.conf completo com todos os headers de segurança

server {
  listen 80;
  server_name meucrIA.com.br www.meucrIA.com.br;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name meucrIA.com.br;

  ssl_certificate     /etc/letsencrypt/live/meucrIA.com.br/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/meucrIA.com.br/privkey.pem;
  ssl_protocols       TLSv1.2 TLSv1.3;
  ssl_ciphers         HIGH:!aNULL:!MD5;

  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```typescript
// next.config.ts — CSP e headers adicionais
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com https://*.upstash.io",
      "img-src 'self' data: blob: https://*.supabase.co",
      "frame-src https://js.stripe.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

// CORS — apenas origens permitidas nos route handlers
const ALLOWED_ORIGINS = ['https://meucrIA.com.br', 'https://www.meucrIA.com.br']
// Verificar em cada route handler com mutation:
const origin = request.headers.get('origin')
if (!ALLOWED_ORIGINS.includes(origin ?? '')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Monitoramento de Erros — Sentry
// npm install @sentry/nextjs
// tracesSampleRate: 0.1 em produção (10% das transações)
Sentry.init({
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers['authorization']
      delete event.request.headers['cookie']
    }
    return event
  },
})
```

```bash
# Checklist final obrigatório antes do go-live

# Banco
# [ ] RLS habilitado e testado em TODAS as tabelas no Supabase
# [ ] Políticas RLS verificadas: nenhum acesso cross-user possível
# [ ] pg_cron configurado para limpeza de guest_usage e anonimização de usage_events
# [ ] Backup automático habilitado (Supabase Pro ou pg_dump agendado)

# Infra
# [ ] .env.local no .gitignore — confirmar que não está no repositório
# [ ] Variáveis de ambiente injetadas via docker-compose na VPS
# [ ] Certbot instalado com renovação automática (crontab: 0 0 * * * certbot renew)
# [ ] Cloudflare configurado: SSL Full strict + Always Use HTTPS + Bot Fight Mode
# [ ] nginx com todos os headers de segurança (HSTS, X-Frame-Options, nosniff)

# Aplicação
# [ ] Rate limiting Upstash ativo e testado em todos os endpoints de IA
# [ ] Stripe webhook secret configurado e verificação de assinatura ativa
# [ ] Sentry configurado sem dados sensíveis nos breadcrumbs
# [ ] Cookie Banner implementado e funcional
# [ ] Página /privacy-policy publicada
# [ ] Fluxo de exclusão de conta testado end-to-end
# [ ] CSP headers testados (sem erros no console do navegador)
# [ ] CORS testado: rejeitar origens desconhecidas

# Testes OWASP (pós-MVP, antes de escalar)
# [ ] Testar SQL injection nas rotas de API
# [ ] Testar acesso cross-user (tentar acessar prompt de outro user_id)
# [ ] Verificar que nenhuma rota retorna dados sem autenticação
# [ ] Auditar variáveis NEXT_PUBLIC_ para garantir que nenhum secret está exposto
```

---

---

## CODE QUALITY

### ESLint + Prettier

```bash
# Instalação
npm install -D eslint prettier eslint-config-next @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-import

# .eslintrc.json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "import/order": ["warn", { "alphabetize": { "order": "asc" } }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}

# .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}

# package.json — scripts
"lint":   "next lint",
"format": "prettier --write .",
"check":  "prettier --check ."
```

---

### Testes (Vitest + Playwright)

```typescript
// Prioridade de cobertura — testar primeiro o que quebra mais caro:

// UNITÁRIOS (Vitest) — funções puras e isoladas
// lib/openai/buildDescriptive.ts   → garante que o descritivo está correto para cada combinação
// lib/utils/sanitizeInput.ts       → garante que não trunca nem quebra inputs válidos
// lib/utils/usageLimits.ts         → garante limites corretos por plano
// lib/utils/resetCycle.ts          → garante que o reset de 30 dias funciona
// lib/stripe/plans.ts              → garante que as features por plano estão corretas

// INTEGRAÇÃO (Vitest + Supabase local via supabase start)
// POST /api/prompt/generate        → autenticação, limite de plano, sanitização, chamada GPT mock
// POST /api/copy/generate          → verificação Pro, chamada GPT mock, validação Zod do output
// POST /api/brands                 → limite de marcas por plano, RLS cross-user
// stripe/webhook                   → assinatura do webhook, atualização de plano no banco

// E2E (Playwright) — journeys críticos
// Journey 1: cadastro → onboarding → gerar primeiro prompt → copiar
// Journey 2: demo guest → gerar prompt → CTA de cadastro
// Journey 3: upgrade de plano → feature Pro desbloqueada → geração de copy

// vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['lib/**', 'app/api/**'],
      exclude: ['lib/supabase/**', '**/*.d.ts'],
      thresholds: { lines: 60, functions: 60 }, // meta realista para MVP
    },
  },
})
```

---

## PERFORMANCE

### Lazy loading e code splitting

```typescript
// Componentes pesados carregados com next/dynamic
import dynamic from 'next/dynamic'

// FontPicker — carrega Google Fonts, não precisa estar no bundle inicial
const FontPicker = dynamic(() => import('@/components/brand/FontPicker'), {
  loading: () => <SkeletonInput />,
})

// PromptWizard — wizard multi-step, carregado só na página /create
const PromptWizard = dynamic(() => import('@/components/prompt/PromptWizard'), {
  loading: () => <SkeletonWizard />,
})

// CloneWizard — exclusivo Pro, não faz sentido no bundle de todos
const CloneWizard = dynamic(() => import('@/components/clone/CloneWizard'), {
  loading: () => <SkeletonCard />,
})

// react-colorful — picker de cores só carrega quando o usuário abre o ColorPicker
const ColorfulPicker = dynamic(() => import('react-colorful').then(m => m.HexColorPicker), {
  ssr: false,
})
```

---

### Índices no banco (Supabase)

```sql
-- Executar em supabase/migrations/ como migration versionada

-- brands: busca por usuário (BrandSwitcher, listagem)
create index idx_brands_user_id on brands (user_id) where deleted_at is null;

-- prompts: histórico do usuário, ordenado por data
create index idx_prompts_user_id_created on prompts (user_id, created_at desc) where deleted_at is null;

-- prompts: busca por marca (histórico filtrado por cliente)
create index idx_prompts_brand_id on prompts (brand_id) where deleted_at is null;

-- cloned_prompts: histórico de clonagem
create index idx_cloned_prompts_user_id on cloned_prompts (user_id, created_at desc) where deleted_at is null;

-- usage_events: analytics e admin
create index idx_usage_events_user_type on usage_events (user_id, event_type);
create index idx_usage_events_created on usage_events (created_at desc);

-- guest_usage: verificação de fingerprint (chamada em todo acesso guest)
create index idx_guest_usage_fingerprint on guest_usage (fingerprint);

-- system_prompts: busca por id (alta frequência via cache)
-- primary key já indexa — sem ação necessária
```

---

### Caching com Upstash

```typescript
// Upstash Redis já está na stack para rate limiting
// Usar também para cache de dados frequentes

// lib/cache/index.ts
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()

// Cache do perfil + plano ativo (evita query no Supabase a cada request)
export async function getCachedProfile(userId: string) {
  const key = `profile:${userId}`
  const cached = await redis.get(key)
  if (cached) return cached
  const profile = await getProfileFromDB(userId)
  await redis.set(key, profile, { ex: 60 * 5 }) // 5 minutos
  return profile
}

// Invalidar cache ao atualizar plano (webhook Stripe)
export async function invalidateProfileCache(userId: string) {
  await redis.del(`profile:${userId}`)
}

// Cache da marca ativa (usada em cada geração)
export async function getCachedActiveBrand(brandId: string) {
  const key = `brand:${brandId}`
  const cached = await redis.get(key)
  if (cached) return cached
  const brand = await getBrandFromDB(brandId)
  await redis.set(key, brand, { ex: 60 * 10 }) // 10 minutos
  return brand
}
```

---

### Web Vitals e Lighthouse

```typescript
// app/[locale]/layout.tsx — reportar Web Vitals
export function reportWebVitals(metric: any) {
  // Enviar para analytics interno ou console em dev
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }
  // Em produção: enviar para Sentry ou endpoint próprio
  // Métricas críticas para tráfego pago: LCP < 2.5s, CLS < 0.1, FID < 100ms
}

// next.config.ts — otimizações de imagem
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ hostname: '*.supabase.co' }],
  },
  compress: true,
  poweredByHeader: false,
}
```

---

## MANUTENIBILIDADE

### Separação de responsabilidades

```typescript
// Padrão adotado em todos os route handlers:
// Route Handler  → valida auth, rate limit, input (Zod) e chama o service
// Service        → lógica de negócio (usageLimits, buildDescriptive, chamada IA)
// Repository     → acesso ao banco (queries Supabase isoladas)

// Exemplo: lib/services/promptService.ts
export async function generatePromptService(userId: string, input: PromptInput) {
  await checkUsageLimit(userId)           // lib/utils/usageLimits.ts
  const brand = await getBrand(input.brandId, userId)  // lib/repositories/brandRepo.ts
  const descriptive = buildDescriptive(brand, input)   // lib/openai/buildDescriptive.ts
  const systemPrompt = await getSystemPrompt('generate') // lib/openai/promptCache.ts
  const result = await callOpenAI(systemPrompt, descriptive) // lib/openai/generatePrompt.ts
  await savePrompt(userId, input, result)              // lib/repositories/promptRepo.ts
  await incrementUsage(userId)                         // lib/repositories/profileRepo.ts
  return result
}

// lib/repositories/brandRepo.ts — apenas queries, sem lógica de negócio
export async function getBrand(brandId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .eq('user_id', userId)   // garantir ownership mesmo com RLS
    .single()
  if (error || !data) throw new NotFoundError('Brand not found')
  return data
}
```

---

### Seeds de banco

```typescript
// supabase/seeds/dev.sql — dados para desenvolvimento local

-- Usuário free
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'free@test.com');
insert into profiles (id, plan, prompts_used) values
  ('00000000-0000-0000-0000-000000000001', 'free', 8);

-- Usuário pro
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000002', 'pro@test.com');
insert into profiles (id, plan) values
  ('00000000-0000-0000-0000-000000000002', 'pro');

-- Marcas de exemplo
insert into brands (id, user_id, name, niche, font_mode, colors) values
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Boutique Alma',
   'Moda feminina', 'manual',
   '{"primary":"#C97B9C","secondary":"#F2E9E4","accent":"#4A2040"}');

-- System prompts de exemplo (para dev — substituir pelos reais)
insert into system_prompts (id, description, content) values
  ('generate', 'Geração de prompt', '[PROMPT DE DESENVOLVIMENTO]'),
  ('copy',     'Geração de copy',   '[PROMPT DE DESENVOLVIMENTO]'),
  ('clone',    'Clonagem de arte',  '[PROMPT DE DESENVOLVIMENTO]');
```

---

## OBSERVABILIDADE

### Structured logging (Pino)

```typescript
// lib/logger/index.ts
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

// USO nos route handlers:
logger.info({ userId, event: 'prompt_generated', format: input.format }, 'Prompt generated')
logger.error({ userId, error: err.message }, 'Failed to generate prompt')

// O que logar: event_type, user_id, status, duração da chamada de IA
// O que NUNCA logar: JWT, API keys, e-mail, dados pessoais, conteúdo do prompt do usuário
```

---

## QUALIDADE DE UX

### Error Boundaries

```typescript
// components/shared/ErrorBoundary.tsx
'use client'
import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    logger.error({ error: error.message }, 'React ErrorBoundary caught')
    // Sentry.captureException(error) — descomentar quando Sentry estiver configurado
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback />
    }
    return this.props.children
  }
}

// Uso: envolver seções críticas individualmente
// <ErrorBoundary fallback={<PromptErrorFallback />}>
//   <PromptWizard />
// </ErrorBoundary>

// Fallbacks específicos por contexto:
// PromptErrorFallback  → "Erro ao carregar o wizard. Tente recarregar a página."
// BrandErrorFallback   → "Erro ao carregar sua marca. Verifique sua conexão."
// HistoryErrorFallback → "Não foi possível carregar o histórico."
```

---

### Toast Notifications

```typescript
// lib/toast/index.ts — wrapper sobre react-hot-toast (leve, sem dependências pesadas)
import toast from 'react-hot-toast'

export const notify = {
  success: (msg: string) => toast.success(msg, { duration: 3000 }),
  error:   (msg: string) => toast.error(msg,   { duration: 5000 }),
  info:    (msg: string) => toast(msg,          { duration: 3000 }),
  loading: (msg: string) => toast.loading(msg),
  dismiss: (id: string)  => toast.dismiss(id),
}

// Uso padronizado em toda a aplicação:
// notify.success('Prompt copiado!')
// notify.success('Marca salva com sucesso.')
// notify.error('Erro ao gerar prompt. Tente novamente.')
// notify.info('Você atingiu 80% do seu limite mensal.')

// Posição: top-right no desktop, bottom-center no mobile (CSS)
// Nunca usar para erros de validação de formulário — esses ficam inline no campo
```

---

### Skeleton Loading

```typescript
// components/shared/skeletons/
// Skeletons reutilizáveis para cada tipo de conteúdo

// SkeletonCard.tsx    — card de marca, card de resultado
// SkeletonInput.tsx   — campos de formulário
// SkeletonWizard.tsx  — wizard de criação inteiro
// SkeletonHistory.tsx — lista de histórico de prompts

// REGRA: toda chamada assíncrona que demora > 300ms deve ter skeleton
// Chamadas de IA (2-5s): skeleton animado + mensagens rotativas de progresso
// Busca de dados (< 500ms): skeleton estático simples
```

---

### Tratamento de timeout e erros de IA

```typescript
// lib/openai/generatePrompt.ts — timeout e retry
const TIMEOUT_MS = 30_000  // 30 segundos

export async function callOpenAI(systemPrompt: string, descriptive: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4.1-mini', messages: [...], max_tokens: 1000 }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) {
      throw new OpenAIError(`OpenAI API error: ${response.status}`)
    }
    return await response.json()

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new TimeoutError('A geração demorou mais que o esperado. Tente novamente.')
    }
    throw err
  }
}

// Mensagens de erro amigáveis por tipo — nunca expor erro técnico ao usuário:
// TimeoutError    → "A IA demorou para responder. Tente novamente em instantes."
// RateLimitError  → "Muitas tentativas. Aguarde alguns segundos antes de tentar novamente."
// PlanLimitError  → "Você atingiu o limite do seu plano. [Ver opções de upgrade]"
// NetworkError    → "Verifique sua conexão e tente novamente."
// UnknownError    → "Algo deu errado. Se o problema persistir, entre em contato."
```

---

## DEPENDABOT

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    groups:
      dependencies:
        patterns: ["*"]
        exclude-patterns: ["eslint*", "prettier*"]  # agrupar atualizações menores
```


## ORDEM DE DESENVOLVIMENTO SUGERIDA

1. Setup base: Next.js + Supabase + TypeScript + CSS Modules/SCSS + next-intl + ESLint + Prettier
2. Auth completo (login, cadastro, sessão, middleware) + RLS habilitado desde o início
3. Onboarding obrigatório (wizard 5 steps + cria primeira marca + redirect gate)
4. Gestão de marca única (BrandForm + ColorPicker 3 modos + FontPicker)
5. Services + Repositories + buildDescriptive + promptCache estruturados
6. Route Handler de geração + GPT-4.1-mini + rate limiting + validação Zod + logger
7. Wizard de criação de prompt (PromptWizard + FontOverride + Error Boundaries)
8. Toast notifications + Skeleton loading em toda a aplicação
9. Exportação, cópia e compartilhamento (/p/[id] + Open Graph)
10. Upload de imagem gerada (Supabase Storage)
11. E-mails transacionais (Resend: boas-vindas + alerta + upgrade)
12. Landing page + demo guest (fingerprint)
13. Planos + Stripe + webhook + e-mail de confirmação + cache invalidation
14. Reset de prompts com ciclo de 30 dias
15. Seeds de banco + testes unitários das funções críticas
16. **Múltiplas marcas** (BrandSwitcher + /brands + limite por plano + active_brand_id)
17. **Copy de conversão** (CopyGenerator + CopyToneSelector + CopyResult)
18. **Módulo de clonagem** (CloneWizard + disclaimer + Vision + CloneResult)
19. Admin panel (/admin + stats + users + prompts + marcas)
20. Histórico e presets (Pro)
21. Feedback pós-prompt + feedback loop para IA
22. Cookie Banner + Política de Privacidade + Termos de Uso + LGPD
23. Fluxo de exclusão de conta (Right to be Forgotten)
24. Testes de integração (fluxos críticos) + E2E Playwright (3 journeys principais)
25. Índices SQL + Web Vitals + Lighthouse
26. PWA (manifest + next-pwa)
27. Sentry + pino logger + Dependabot
28. **Checklist de segurança e deploy** (nginx headers, CSP, CORS, Cloudflare, backup)
