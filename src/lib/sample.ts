import { createEdge, createNode } from './model'
import type { MindMap } from './types'

/**
 * Starter content plan — Week of hooks for social creators.
 * Easy to delete from the sidebar (isSample).
 */
export function buildSampleMap(): MindMap {
  const root = createNode({
    id: 'content-root',
    text: 'Week of hooks',
    x: 180,
    y: 240,
    width: 240,
    height: 72,
  })
  const hooks = createNode({
    id: 'content-hooks',
    text: 'Hooks',
    x: 520,
    y: 40,
    width: 148,
    height: 48,
    parentId: root.id,
  })
  const pillars = createNode({
    id: 'content-pillars',
    text: 'Pillars',
    x: 520,
    y: 170,
    width: 148,
    height: 48,
    parentId: root.id,
  })
  const formats = createNode({
    id: 'content-formats',
    text: 'Formats',
    x: 520,
    y: 300,
    width: 148,
    height: 48,
    parentId: root.id,
  })
  const cta = createNode({
    id: 'content-cta',
    text: 'CTAs',
    x: 520,
    y: 430,
    width: 148,
    height: 48,
    parentId: root.id,
  })
  const hook1 = createNode({
    id: 'content-h1',
    text: 'Stop scrolling if…',
    x: 740,
    y: 8,
    width: 188,
    height: 44,
    parentId: hooks.id,
  })
  const hook2 = createNode({
    id: 'content-h2',
    text: 'I was wrong about…',
    x: 740,
    y: 68,
    width: 188,
    height: 44,
    parentId: hooks.id,
  })
  const pillarTeach = createNode({
    id: 'content-p1',
    text: 'Teach one tip',
    x: 740,
    y: 140,
    width: 168,
    height: 44,
    parentId: pillars.id,
  })
  const pillarStory = createNode({
    id: 'content-p2',
    text: 'Behind the scenes',
    x: 740,
    y: 200,
    width: 178,
    height: 44,
    parentId: pillars.id,
  })
  const reel = createNode({
    id: 'content-reel',
    text: 'Reel / Short',
    x: 740,
    y: 270,
    width: 148,
    height: 44,
    parentId: formats.id,
  })
  const carousel = createNode({
    id: 'content-car',
    text: 'Carousel',
    x: 740,
    y: 330,
    width: 132,
    height: 44,
    parentId: formats.id,
  })
  const save = createNode({
    id: 'content-save',
    text: 'Save this for later',
    x: 740,
    y: 410,
    width: 188,
    height: 44,
    parentId: cta.id,
  })
  const comment = createNode({
    id: 'content-cm',
    text: 'Comment your niche',
    x: 740,
    y: 470,
    width: 188,
    height: 44,
    parentId: cta.id,
  })

  return {
    id: 'sample-week-of-hooks',
    title: 'Week of hooks',
    nodes: [
      root,
      hooks,
      pillars,
      formats,
      cta,
      hook1,
      hook2,
      pillarTeach,
      pillarStory,
      reel,
      carousel,
      save,
      comment,
    ],
    edges: [
      createEdge(root.id, hooks.id),
      createEdge(root.id, pillars.id),
      createEdge(root.id, formats.id),
      createEdge(root.id, cta.id),
      createEdge(hooks.id, hook1.id),
      createEdge(hooks.id, hook2.id),
      createEdge(pillars.id, pillarTeach.id),
      createEdge(pillars.id, pillarStory.id),
      createEdge(formats.id, reel.id),
      createEdge(formats.id, carousel.id),
      createEdge(cta.id, save.id),
      createEdge(cta.id, comment.id),
    ],
    updatedAt: Date.now(),
    isSample: true,
  }
}
