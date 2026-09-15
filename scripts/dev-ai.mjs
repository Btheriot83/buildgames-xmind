#!/usr/bin/env node
/**
 * Local /api/ai stand-in for Vite. Loads BUILD_GAMES_LLM_API_KEY without logging it.
 * Usage: node scripts/dev-ai.mjs
 */
import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

function loadKey() {
  const fromEnv = process.env.BUILD_GAMES_LLM_API_KEY || process.env.XAI_API_KEY || process.env.OPENAI_API_KEY
  if (fromEnv) return fromEnv.trim()
  for (const p of [
    '/home/box/.config/build-games-llm.env',
    new URL('../.local/llm.env', import.meta.url).pathname,
  ]) {
    if (!existsSync(p)) continue
    const text = readFileSync(p, 'utf8')
    for (const line of text.split('\n')) {
      const m = line.match(/^BUILD_GAMES_LLM_API_KEY=(.*)$/)
      if (m) return m[1].trim()
    }
  }
  return ''
}

const KEY = loadKey()
if (KEY) {
  process.env.BUILD_GAMES_LLM_API_KEY = KEY
  if (!process.env.XAI_API_KEY) process.env.XAI_API_KEY = KEY
  console.log('dev-ai: key loaded (silent)')
} else {
  console.log('dev-ai: no key — /api/ai will return 503')
}

// Dynamically compile-less: reimplement minimal handler by importing TS via tsx if available,
// else inline fetch logic (duplicate of api/ai.ts resolve).
async function handle(body) {
  const shared = (process.env.BUILD_GAMES_LLM_API_KEY || '').trim()
  const providers = []
  if (shared) {
    providers.push({
      name: 'xai',
      url: 'https://api.x.ai/v1/chat/completions',
      key: shared,
      model: process.env.XAI_MODEL || 'grok-2-latest',
    })
    if (!shared.startsWith('xai-')) {
      providers.push({
        name: 'openai',
        url: 'https://api.openai.com/v1/chat/completions',
        key: shared,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      })
    }
  }
  if (!providers.length) {
    return { status: 503, json: { mode: 'unavailable', error: 'AI not configured' } }
  }

  async function chat(system, user) {
    let last = 'fail'
    for (const p of providers) {
      const res = await fetch(p.url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${p.key}`, 'Content-Type': 'application/json' },
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
        last = `${p.name} ${res.status}`
        continue
      }
      const data = await res.json()
      const raw = data.choices?.[0]?.message?.content || '{}'
      return { provider: p.name, model: p.model, json: JSON.parse(raw) }
    }
    throw new Error(last)
  }

  if (body.action === 'expand') {
    const text = String(body.text || '').trim()
    const count = Math.min(8, Math.max(3, Number(body.count) || 5))
    const context = Array.isArray(body.context) ? body.context.map(String).slice(0, 12) : []
    const out = await chat(
      `You expand mind-map nodes. Return JSON {"children":["..."]} with ${count} short sibling branch labels (2–6 words). Concrete, non-generic. No emoji. No numbering.`,
      `Parent node: ${text}\nExisting siblings/context: ${context.join(' · ') || '(none)'}`,
    )
    const children = (Array.isArray(out.json.children) ? out.json.children : [])
      .map((x) => String(x).trim().slice(0, 80))
      .filter(Boolean)
      .slice(0, count)
    return { status: 200, json: { mode: 'llm', provider: out.provider, model: out.model, children } }
  }

  if (body.action === 'outline') {
    const outline = String(body.outline || '').trim()
    const titleHint = String(body.title || '').trim()
    const out = await chat(
      'You convert indented / bulleted outlines into a mind-map tree. Return JSON {"title":"...","root":{"text":"...","children":[{"text":"...","children":[]}]}}. Max depth 4. Max 8 children per node. Short labels. No emoji.',
      `Preferred title: ${titleHint || '(infer)'}\n\nOutline:\n${outline.slice(0, 8000)}`,
    )
    return {
      status: 200,
      json: {
        mode: 'llm',
        provider: out.provider,
        model: out.model,
        title: String(out.json.title || titleHint || out.json.root?.text || 'Outline').slice(0, 120),
        root: out.json.root,
      },
    }
  }

  return { status: 400, json: { error: 'unknown action' } }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'POST only' }))
    return
  }
  const chunks = []
  for await (const c of req) chunks.push(c)
  let body = {}
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'bad json' }))
    return
  }
  try {
    const out = await handle(body)
    res.writeHead(out.status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(out.json))
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'ai failed' }))
  }
})

const port = Number(process.env.AI_PORT || 8787)
server.listen(port, '127.0.0.1', () => {
  console.log(`dev-ai listening on http://127.0.0.1:${port}`)
})
