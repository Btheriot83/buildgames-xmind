import { createEdge, createNode } from './model'
import type { MindMap } from './types'

export type ContentPresetId = 'week-of-hooks' | 'reel-batch' | 'carousel-series'

export type ContentPreset = {
  id: ContentPresetId
  label: string
  blurb: string
  build: () => MindMap
}

function pack(
  id: string,
  title: string,
  rootText: string,
  branches: { label: string; kids: string[] }[],
): MindMap {
  /* Organic fan — MindNode air, not grid columns */
  const root = createNode({
    id: `${id}-root`,
    text: rootText,
    x: 168,
    y: 248,
    width: Math.min(292, Math.max(208, rootText.length * 11)),
    height: 72,
  })
  const nodes = [root]
  const edges = [] as ReturnType<typeof createEdge>[]
  const n = Math.max(branches.length, 1)
  const fanSpan = Math.min(520, 96 + n * 108)
  const y0 = 248 - fanSpan / 2
  const gap = fanSpan / Math.max(n - 1, 1)
  branches.forEach((b, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const bow = Math.sin(t * Math.PI) // outer branches farther
    const branchX = 508 + Math.round(bow * 36) + (i % 2 === 0 ? -6 : 10)
    const branchY = n === 1 ? 248 : y0 + i * gap + ((i % 3) - 1) * 8
    const branch = createNode({
      id: `${id}-b${i}`,
      text: b.label,
      x: branchX,
      y: Math.round(branchY),
      width: Math.min(176, Math.max(148, b.label.length * 10)),
      height: 50,
      parentId: root.id,
    })
    nodes.push(branch)
    edges.push(createEdge(root.id, branch.id))
    const kidCount = Math.max(b.kids.length, 1)
    b.kids.forEach((kid, j) => {
      const jt = kidCount === 1 ? 0.5 : j / (kidCount - 1)
      const leafX = branchX + 212 + Math.round(Math.sin(jt * Math.PI) * 18) + (j % 2) * 8
      const leafY = branch.y - 18 + j * 62 + ((j + i) % 2) * 6
      const leaf = createNode({
        id: `${id}-b${i}-k${j}`,
        text: kid,
        x: leafX,
        y: Math.round(leafY),
        width: Math.min(228, Math.max(148, kid.length * 9)),
        height: 46,
        parentId: branch.id,
      })
      nodes.push(leaf)
      edges.push(createEdge(branch.id, leaf.id))
    })
  })
  return {
    id: `sample-${id}`,
    title,
    nodes,
    edges,
    updatedAt: Date.now(),
    isSample: true,
  }
}

export function buildWeekOfHooks(): MindMap {
  return pack('week-of-hooks', 'Week of hooks', 'Week of hooks', [
    { label: 'Hooks', kids: ['Stop scrolling if…', 'I was wrong about…'] },
    { label: 'Pillars', kids: ['Teach one tip', 'Behind the scenes'] },
    { label: 'Formats', kids: ['Reel / Short', 'Carousel'] },
    { label: 'CTAs', kids: ['Save this for later', 'Comment your niche'] },
  ])
}

export function buildReelBatch(): MindMap {
  return pack('reel-batch', 'Reel batch', 'Reel batch · 5 ideas', [
    { label: 'Hooks', kids: ['3-second problem', 'Myth vs reality'] },
    { label: 'Beats', kids: ['Setup', 'Payoff', 'Punchline'] },
    { label: 'Platform', kids: ['IG Reel', 'TikTok / Short'] },
    { label: 'CTA', kids: ['Follow for part 2', 'Duet this'] },
  ])
}

export function buildCarouselSeries(): MindMap {
  return pack('carousel-series', 'Carousel series', 'Carousel series', [
    { label: 'Promise', kids: ['Save this swipe', '7 slides, one tip'] },
    { label: 'Slides', kids: ['Slide 1 hook', 'Slide 2–6 meat', 'Last slide CTA'] },
    { label: 'Batch', kids: ['Draft 3 covers', 'Reuse template'] },
    { label: 'Post', kids: ['Caption draft', 'Alt text'] },
  ])
}

/** Default starter — social content plan. */
export function buildSampleMap(): MindMap {
  return buildWeekOfHooks()
}

export const CONTENT_PRESETS: ContentPreset[] = [
  {
    id: 'week-of-hooks',
    label: 'Week of hooks',
    blurb: 'Hooks → pillars → formats → CTAs',
    build: buildWeekOfHooks,
  },
  {
    id: 'reel-batch',
    label: 'Reel batch',
    blurb: 'Five short-form ideas, ready to shoot',
    build: buildReelBatch,
  },
  {
    id: 'carousel-series',
    label: 'Carousel series',
    blurb: 'Swipe plan + batch covers',
    build: buildCarouselSeries,
  },
]
