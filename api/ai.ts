import type { VercelRequest, VercelResponse } from '@vercel/node'

type Action = 'expand' | 'outline'

type ExpandBody = {
  action: 'expand'
  text: string
  context?: string[]
  count?: number
}

type OutlineBody = {
  action: 'outline'
  outline: string
  title?: string
}

type Body = ExpandBody | OutlineBody

type Provider = {
  name: 'xai' | 'openai'
  url: string
  key: string
  model: string
}

function resolveProviders(): Provider[] {
  const shared = (process.env.BUILD_GAMES_LLM_API_KEY || '').trim()
  const xai =
    (process.env.XAI_API_KEY || process.env.GROK_API_KEY || '').trim() ||
    (shared.startsWith('xai-') ? shared : '') ||
    (shared ? shared : '')
  const openai =
    (process.env.OPENAI_API_KEY || '').trim() ||
    (shared && !shared.startsWith('xai-') ? shared : '')

  const out: Provider[] = []
  const seen = new Set<string>()
  const push = (p: Provider) => {
    const id = `${p.name}:${p.model}`
    if (seen.has(id)) return
    seen.add(id)
    out.push(p)
  }

  if (xai) {
    push({
      name: 'xai',
      url: `${(process.env.XAI_BASE_URL || 'https://api.x.ai/v1').replace(/\/$/, '')}/chat/completions`,
      key: xai,
      model: process.env.XAI_MODEL || process.env.GROK_MODEL || 'grok-2-latest',
    })
  }
  if (openai) {
    push({
      name: 'openai',
      url: `${(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')}/chat/completions`,
      key: openai,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    })
  }
  return out
}

async function chatJson(system: string, user: string): Promise<{
  provider: string
  model: string
  json: Record<string, unknown>
} | null> {
  const providers = resolveProviders()
  if (!providers.length) return null

  let lastErr = ''
  for (const p of providers) {
    try {
      const res = await fetch(p.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${p.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: p.model,
          temperature: 0.4,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
      })
      if (!res.ok) {
        lastErr = `${p.name} ${res.status}`
        continue
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[]
      }
      const raw = data.choices?.[0]?.message?.content || '{}'
      const json = JSON.parse(raw) as Record<string, unknown>
      return { provider: p.name, model: p.model, json }
    } catch (e) {
      lastErr = e instanceof Error ? e.message : 'chat failed'
    }
  }
  throw new Error(lastErr || 'all providers failed')
}

function cleanChildren(raw: unknown, max: number): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const item of raw) {
    const t = String(item ?? '')
      .replace(/[\u0000-\u001F]/g, '')
      .trim()
      .slice(0, 80)
    if (t && !out.includes(t)) out.push(t)
    if (out.length >= max) break
  }
  return out
}

type OutlineNode = { text: string; children: OutlineNode[] }

function cleanOutlineTree(raw: unknown, depth = 0): OutlineNode | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const text = String(obj.text ?? obj.title ?? '')
    .replace(/[\u0000-\u001F]/g, '')
    .trim()
    .slice(0, 120)
  if (!text) return null
  const kidsRaw = Array.isArray(obj.children) ? obj.children : []
  const children: OutlineNode[] = []
  if (depth < 5) {
    for (const k of kidsRaw.slice(0, 10)) {
      const n = cleanOutlineTree(k, depth + 1)
      if (n) children.push(n)
    }
  }
  return { text, children }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

  const body = (
    typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  ) as Body

  if (!body?.action) return res.status(400).json({ error: 'action required' })

  try {
    if (body.action === 'expand') {
      const text = String(body.text || '').trim()
      if (text.length < 1) return res.status(400).json({ error: 'text required' })
      const count = Math.min(8, Math.max(3, Number(body.count) || 5))
      const context = Array.isArray(body.context)
        ? body.context.map(String).slice(0, 12)
        : []

      const out = await chatJson(
        `You expand mind-map nodes. Return JSON {"children":["..."]} with ${count} short sibling branch labels (2–6 words). Concrete, non-generic. No emoji. No numbering. No marketing fluff.`,
        `Parent node: ${text}\nExisting siblings/context: ${context.join(' · ') || '(none)'}`,
      )
      if (!out) {
        return res.status(503).json({
          mode: 'unavailable',
          error: 'AI not configured',
          hint: 'Set BUILD_GAMES_LLM_API_KEY, XAI_API_KEY, or OPENAI_API_KEY on the server',
        })
      }
      const children = cleanChildren(out.json.children, count)
      if (!children.length) return res.status(502).json({ error: 'empty expand' })
      return res.status(200).json({
        mode: 'llm',
        provider: out.provider,
        model: out.model,
        children,
      })
    }

    if (body.action === 'outline') {
      const outline = String(body.outline || '').trim()
      if (outline.length < 3) {
        return res.status(400).json({ error: 'outline too short' })
      }
      const titleHint = String(body.title || '').trim()

      const out = await chatJson(
        'You convert indented / bulleted outlines into a mind-map tree. Return JSON {"title":"...","root":{"text":"...","children":[{"text":"...","children":[]}]}}. Max depth 4. Max 8 children per node. Short labels. No emoji.',
        `Preferred title: ${titleHint || '(infer)'}\n\nOutline:\n${outline.slice(0, 8000)}`,
      )
      if (!out) {
        return res.status(503).json({
          mode: 'unavailable',
          error: 'AI not configured',
          hint: 'Set BUILD_GAMES_LLM_API_KEY, XAI_API_KEY, or OPENAI_API_KEY on the server',
        })
      }
      const root = cleanOutlineTree(out.json.root) || cleanOutlineTree(out.json)
      if (!root) return res.status(502).json({ error: 'empty outline tree' })
      const title =
        String(out.json.title || titleHint || root.text).slice(0, 120) || root.text
      return res.status(200).json({
        mode: 'llm',
        provider: out.provider,
        model: out.model,
        title,
        root,
      })
    }

    return res.status(400).json({ error: 'unknown action' })
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'ai failed',
    })
  }
}
