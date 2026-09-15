import type { OutlineNode } from './outline'

export type ExpandResult = {
  mode: 'llm'
  provider: string
  model: string
  children: string[]
}

export type OutlineResult = {
  mode: 'llm'
  provider: string
  model: string
  title: string
  root: OutlineNode
}

async function postAi(body: Record<string, unknown>): Promise<Response> {
  return fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function expandNodeAi(
  text: string,
  context: string[] = [],
  count = 5,
): Promise<ExpandResult> {
  const res = await postAi({ action: 'expand', text, context, count })
  const data = (await res.json()) as ExpandResult & { error?: string; hint?: string }
  if (!res.ok) {
    throw new Error(data.error || data.hint || `expand failed (${res.status})`)
  }
  if (!data.children?.length) throw new Error('No branches returned')
  return data
}

export async function outlineToMapAi(
  outline: string,
  title?: string,
): Promise<OutlineResult> {
  const res = await postAi({ action: 'outline', outline, title })
  const data = (await res.json()) as OutlineResult & { error?: string; hint?: string }
  if (!res.ok) {
    throw new Error(data.error || data.hint || `outline failed (${res.status})`)
  }
  if (!data.root) throw new Error('No map returned')
  return data
}
