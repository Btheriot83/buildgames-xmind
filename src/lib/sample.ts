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
  const root = createNode({
    id: `${id}-root`,
    text: rootText,
    x: 180,
    y: 220,
    width: Math.min(280, Math.max(200, rootText.length * 11)),
    height: 70,
  })
  const nodes = [root]
  const edges = [] as ReturnType<typeof createEdge>[]
  const y0 = 30
  const gap = Math.max(110, Math.floor(420 / Math.max(branches.length, 1)))
  branches.forEach((b, i) => {
    const branch = createNode({
      id: `${id}-b${i}`,
      text: b.label,
      x: 520,
      y: y0 + i * gap,
      width: 160,
      height: 48,
      parentId: root.id,
    })
    nodes.push(branch)
    edges.push(createEdge(root.id, branch.id))
    b.kids.forEach((kid, j) => {
      const leaf = createNode({
        id: `${id}-b${i}-k${j}`,
        text: kid,
        x: 740,
        y: branch.y - 12 + j * 58,
        width: Math.min(210, Math.max(140, kid.length * 9)),
        height: 44,
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
