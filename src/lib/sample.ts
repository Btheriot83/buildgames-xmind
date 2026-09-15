import { createEdge, createNode } from './model'
import type { MindMap } from './types'

/**
 * Starter desk map — real ops content (Phoenix diesel week), not SAMPLE/lorem.
 * Easy to delete from the sidebar (isSample).
 */
export function buildSampleMap(): MindMap {
  const root = createNode({
    id: 'desk-root',
    text: 'Friday I-10 diesel pull',
    x: 340,
    y: 250,
    width: 248,
    height: 72,
  })
  const yard = createNode({
    id: 'desk-yard',
    text: 'Yard trucks',
    x: 680,
    y: 90,
    width: 168,
    height: 52,
    parentId: root.id,
  })
  const parts = createNode({
    id: 'desk-parts',
    text: 'Parts runs',
    x: 680,
    y: 230,
    width: 168,
    height: 52,
    parentId: root.id,
  })
  const dispatch = createNode({
    id: 'desk-dispatch',
    text: 'Dispatch',
    x: 680,
    y: 370,
    width: 168,
    height: 52,
    parentId: root.id,
  })
  const crew = createNode({
    id: 'desk-crew',
    text: 'Crew',
    x: 680,
    y: 500,
    width: 168,
    height: 52,
    parentId: root.id,
  })
  const unit41 = createNode({
    id: 'desk-u41',
    text: 'Unit 41 — DEF sensor',
    x: 920,
    y: 40,
    width: 190,
    height: 48,
    parentId: yard.id,
  })
  const unit18 = createNode({
    id: 'desk-u18',
    text: 'Unit 18 — leak-down',
    x: 920,
    y: 110,
    width: 190,
    height: 48,
    parentId: yard.id,
  })
  const napa = createNode({
    id: 'desk-napa',
    text: 'NAPA on Bell Rd',
    x: 920,
    y: 200,
    width: 180,
    height: 48,
    parentId: parts.id,
  })
  const freightliner = createNode({
    id: 'desk-fl',
    text: 'Freightliner Chandler',
    x: 920,
    y: 270,
    width: 200,
    height: 48,
    parentId: parts.id,
  })
  const mesa = createNode({
    id: 'desk-mesa',
    text: 'Mesa yard — 06:30',
    x: 920,
    y: 350,
    width: 180,
    height: 48,
    parentId: dispatch.id,
  })
  const tonto = createNode({
    id: 'desk-tonto',
    text: 'Tonto Basin call-out',
    x: 920,
    y: 420,
    width: 190,
    height: 48,
    parentId: dispatch.id,
  })
  const luis = createNode({
    id: 'desk-luis',
    text: 'Luis + Mira on dual',
    x: 920,
    y: 500,
    width: 180,
    height: 48,
    parentId: crew.id,
  })

  return {
    id: 'desk-friday-i10',
    title: 'Friday I-10 diesel pull',
    nodes: [root, yard, parts, dispatch, crew, unit41, unit18, napa, freightliner, mesa, tonto, luis],
    edges: [
      createEdge(root.id, yard.id),
      createEdge(root.id, parts.id),
      createEdge(root.id, dispatch.id),
      createEdge(root.id, crew.id),
      createEdge(yard.id, unit41.id),
      createEdge(yard.id, unit18.id),
      createEdge(parts.id, napa.id),
      createEdge(parts.id, freightliner.id),
      createEdge(dispatch.id, mesa.id),
      createEdge(dispatch.id, tonto.id),
      createEdge(crew.id, luis.id),
    ],
    updatedAt: Date.now(),
    isSample: true,
  }
}
