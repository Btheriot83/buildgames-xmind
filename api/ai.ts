import type { VercelRequest, VercelResponse } from '@vercel/node'

type Action = 'expand' | 'outline'
type Body =
  | { action: 'expand'; text: string; context?: string[]; count?: number }
  | { action: 'outline'; outline: string; title?: string }

type Attempt = { name: string; url: string; key: string; model: string; kind: 'openai' | 'anthropic' }

function buildAttempts(): Attempt[] {
  const shared = process.env.BUILD_GAMES_LLM_API_KEY?.trim()
  const out: Attempt[] = []
  const seen = new Set<string>()
  const push = (a: Attempt) => {
    const id = `${a.kind}|${a.url}|${a.model}|${a.key.slice(0, 4)}`
    if (seen.has(id)) return
    seen.add(id)
    out.push(a)
  }

  const xai =
    process.env.XAI_API_KEY?.trim() ||
    process.env.GROK_API_KEY?.trim() ||
    (shared?.startsWith('xai-') ? shared : undefined)
  if (xai) {
    push({
      name: 'xai',
      url: `${(process.env.XAI_BASE_URL || 'https://api.x.ai/v1').replace(/\/$/, '')}/chat/completions`,
      key: xai,
      model: process.env.XAI_MODEL?.trim() || process.env.GROK_MODEL?.trim() || 'grok-3-mini',
      kind: 'openai',
    })
  }

  const openaiCompat =
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.ZAI_API_KEY?.trim() ||
    (shared && !shared.startsWith('xai-') ? shared : undefined)
  if (openaiCompat) {
    const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
    push({
      name: base.includes('z.ai') ? 'zai' : 'openai',
      url: `${base}/chat/completions`,
      key: openaiCompat,
      model:
        process.env.OPENAI_MODEL?.trim() ||
        (base.includes('z.ai') ? 'glm-4.5-flash' : 'gpt-4o-mini'),
      kind: 'openai',
    })
  }

  const anth =
    process.env.ANTHROPIC_API_KEY?.trim() || process.env.ANTHROPIC_AUTH_TOKEN?.trim()
  const anthBase = process.env.ANTHROPIC_BASE_URL?.trim()
  if (anth && anthBase) {
    push({
      name: 'anthropic',
      url: `${anthBase.replace(/\/$/, '')}/v1/messages`,
      key: anth,
      model: (process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514').replace(/\[1m\]/g, ''),
      kind: 'anthropic',
    })
  }

  if (shared && !out.length) {
    push({
      name: 'xai',
      url: 'https://api.x.ai/v1/chat/completions',
      key: shared,
      model: process.env.XAI_MODEL?.trim() || 'grok-3-mini',
      kind: 'openai',
    })
  }
  return out
}

async function chatJson(system: string, user: string) {
  const attempts = buildAttempts()
  if (!attempts.length) return null
  let last = 'no provider'
  for (const a of attempts) {
    try {
      let content = ''
      if (a.kind === 'openai') {
        const res = await fetch(a.url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${a.key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: a.model,
            temperature: 0.4,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        })
        if (!res.ok) {
          last = `${a.name} ${res.status}`
          continue
        }
        const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
        content = data.choices?.[0]?.message?.content || ''
      } else {
        const res = await fetch(a.url, {
          method: 'POST',
          headers: {
            'x-api-key': a.key,
            Authorization: `Bearer ${a.key}`,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: a.model,
            max_tokens: 1200,
            temperature: 0.4,
            system,
            messages: [{ role: 'user', content: user }],
          }),
        })
        if (!res.ok) {
          last = `${a.name} ${res.status}`
          continue
        }
        const data = (await res.json()) as { content?: { type: string; text?: string }[] }
        content = (data.content || [])
          .filter((c) => c.type === 'text')
          .map((c) => c.text || '')
          .join('')
      }
      let raw = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
      const start = raw.indexOf('{')
      const end = raw.lastIndexOf('}')
      if (start < 0 || end <= start) {
        last = `${a.name} no-json`
        continue
      }
      const json = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>
      return { provider: a.name, model: a.model, json }
    } catch (e) {
      last = e instanceof Error ? e.message : 'fail'
    }
  }
  throw new Error(last)
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
      if (!text) return res.status(400).json({ error: 'text required' })
      const count = Math.min(8, Math.max(3, Number(body.count) || 5))
      const context = Array.isArray(body.context) ? body.context.map(String).slice(0, 12) : []
      const out = await chatJson(
        `You expand mind-map nodes. Return JSON {"children":["..."]} with ${count} short branch labels (2–6 words). Concrete. No emoji. No numbering.`,
        `Parent node: ${text}\nContext: ${context.join(' · ') || '(none)'}`,
      )
      if (!out) {
        return res.status(503).json({
          mode: 'unavailable',
          error: 'AI not configured',
          hint: 'Set BUILD_GAMES_LLM_API_KEY (and optionally OPENAI_BASE_URL) on the server',
        })
      }
      const children = cleanChildren(out.json.children, count)
      if (!children.length) return res.status(502).json({ error: 'empty expand' })
      return res.status(200).json({ mode: 'llm', provider: out.provider, model: out.model, children })
    }

    if (body.action === 'outline') {
      const outline = String(body.outline || '').trim()
      if (outline.length < 3) return res.status(400).json({ error: 'outline too short' })
      const titleHint = String(body.title || '').trim()
      const out = await chatJson(
        'Convert outlines to a mind-map tree. Return JSON {"title":"...","root":{"text":"...","children":[{"text":"...","children":[]}]}}. Max depth 4. Max 8 children/node. Short labels. No emoji.',
        `Preferred title: ${titleHint || '(infer)'}\n\nOutline:\n${outline.slice(0, 8000)}`,
      )
      if (!out) {
        return res.status(503).json({
          mode: 'unavailable',
          error: 'AI not configured',
          hint: 'Set BUILD_GAMES_LLM_API_KEY on the server',
        })
      }
      const root = cleanOutlineTree(out.json.root) || cleanOutlineTree(out.json)
      if (!root) return res.status(502).json({ error: 'empty outline tree' })
      const title = String(out.json.title || titleHint || root.text).slice(0, 120) || root.text
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
    return res.status(500).json({ error: err instanceof Error ? err.message : 'ai failed' })
  }
}
