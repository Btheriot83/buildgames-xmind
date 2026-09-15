import { createEdge, createNode } from './model'
import type { MindMap } from './types'

/** Clearly labelled sample — easy to delete from the sidebar. */
export function buildSampleMap(): MindMap {
  const root = createNode({
    id: 'sample-root',
    text: 'Product launch',
    x: 380,
    y: 260,
    width: 210,
    height: 68,
  })
  const audience = createNode({
    id: 'sample-aud',
    text: 'Audience',
    x: 680,
    y: 120,
    width: 160,
    height: 52,
    parentId: root.id,
  })
  const channels = createNode({
    id: 'sample-ch',
    text: 'Channels',
    x: 680,
    y: 260,
    width: 160,
    height: 52,
    parentId: root.id,
  })
  const risks = createNode({
    id: 'sample-risk',
    text: 'Risks',
    x: 680,
    y: 400,
    width: 160,
    height: 52,
    parentId: root.id,
  })
  const beta = createNode({
    id: 'sample-beta',
    text: 'Beta cohort',
    x: 920,
    y: 80,
    width: 150,
    height: 48,
    parentId: audience.id,
  })
  const press = createNode({
    id: 'sample-press',
    text: 'Press kit',
    x: 920,
    y: 240,
    width: 150,
    height: 48,
    parentId: channels.id,
  })
  return {
    id: 'sample-product-launch',
    title: 'SAMPLE — Product launch map',
    nodes: [root, audience, channels, risks, beta, press],
    edges: [
      createEdge(root.id, audience.id),
      createEdge(root.id, channels.id),
      createEdge(root.id, risks.id),
      createEdge(audience.id, beta.id),
      createEdge(channels.id, press.id),
    ],
    updatedAt: Date.now(),
    isSample: true,
  }
}
