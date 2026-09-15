import { nanoid } from 'nanoid'
import type { MapEdge, MapNode, MapStats, MindMap, NodeId } from './types'
import { MAX_NODE_H, MAX_NODE_W, MIN_NODE_H, MIN_NODE_W } from './types'

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function sanitizeText(raw: string, max = 280): string {
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max)
}

export function createNode(
  partial: Partial<MapNode> & Pick<MapNode, 'x' | 'y' | 'text'>,
): MapNode {
  return {
    id: partial.id ?? nanoid(10),
    text: sanitizeText(partial.text || 'Idea'),
    x: partial.x,
    y: partial.y,
    width: clamp(partial.width ?? 180, MIN_NODE_W, MAX_NODE_W),
    height: clamp(partial.height ?? 56, MIN_NODE_H, MAX_NODE_H),
    parentId: partial.parentId ?? null,
    color: partial.color,
  }
}

export function createEdge(from: NodeId, to: NodeId): MapEdge {
  return { id: nanoid(10), from, to }
}

export function createEmptyMap(title = 'Untitled map'): MindMap {
  const root = createNode({
    text: 'Central idea',
    x: 420,
    y: 280,
    width: 200,
    height: 64,
    parentId: null,
  })
  return {
    id: nanoid(12),
    title: sanitizeText(title, 120) || 'Untitled map',
    nodes: [root],
    edges: [],
    updatedAt: Date.now(),
  }
}

export function addChild(map: MindMap, parentId: NodeId, text = 'New idea'): MindMap {
  const parent = map.nodes.find((n) => n.id === parentId)
  if (!parent) return map
  const siblings = map.nodes.filter((n) => n.parentId === parentId)
  const offsetY = (siblings.length - (siblings.length - 1) / 2) * 80
  const child = createNode({
    text,
    x: parent.x + parent.width + 120,
    y: parent.y + offsetY - 40,
    parentId,
  })
  const edge = createEdge(parentId, child.id)
  return {
    ...map,
    nodes: [...map.nodes, child],
    edges: [...map.edges, edge],
    updatedAt: Date.now(),
  }
}

export function moveNode(map: MindMap, id: NodeId, x: number, y: number): MindMap {
  return {
    ...map,
    nodes: map.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    updatedAt: Date.now(),
  }
}

export function resizeNode(
  map: MindMap,
  id: NodeId,
  width: number,
  height: number,
): MindMap {
  return {
    ...map,
    nodes: map.nodes.map((n) =>
      n.id === id
        ? {
            ...n,
            width: clamp(width, MIN_NODE_W, MAX_NODE_W),
            height: clamp(height, MIN_NODE_H, MAX_NODE_H),
          }
        : n,
    ),
    updatedAt: Date.now(),
  }
}

export function updateNodeText(map: MindMap, id: NodeId, text: string): MindMap {
  const clean = sanitizeText(text)
  if (!clean) return map
  return {
    ...map,
    nodes: map.nodes.map((n) => (n.id === id ? { ...n, text: clean } : n)),
    updatedAt: Date.now(),
  }
}

export function connectNodes(map: MindMap, from: NodeId, to: NodeId): MindMap {
  if (from === to) return map
  if (!map.nodes.some((n) => n.id === from) || !map.nodes.some((n) => n.id === to)) {
    return map
  }
  if (map.edges.some((e) => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
    return map
  }
  // Prevent cycles that would break depth: treat as parent link if to has no parent
  const toNode = map.nodes.find((n) => n.id === to)!
  const nodes =
    toNode.parentId == null && toNode.id !== map.nodes[0]?.id
      ? map.nodes.map((n) => (n.id === to ? { ...n, parentId: from } : n))
      : map.nodes
  return {
    ...map,
    nodes,
    edges: [...map.edges, createEdge(from, to)],
    updatedAt: Date.now(),
  }
}

export function deleteNode(map: MindMap, id: NodeId): MindMap {
  const root = map.nodes[0]
  if (!root || root.id === id) return map // never delete root
  const doomed = new Set<NodeId>()
  const stack = [id]
  while (stack.length) {
    const cur = stack.pop()!
    if (doomed.has(cur)) continue
    doomed.add(cur)
    for (const n of map.nodes) {
      if (n.parentId === cur) stack.push(n.id)
    }
  }
  return {
    ...map,
    nodes: map.nodes.filter((n) => !doomed.has(n.id)),
    edges: map.edges.filter((e) => !doomed.has(e.from) && !doomed.has(e.to)),
    updatedAt: Date.now(),
  }
}

export function mapDepth(map: MindMap): number {
  const byId = new Map(map.nodes.map((n) => [n.id, n]))
  let max = 1
  for (const n of map.nodes) {
    let d = 1
    let cur: MapNode | undefined = n
    const seen = new Set<NodeId>()
    while (cur?.parentId && !seen.has(cur.id)) {
      seen.add(cur.id)
      cur = byId.get(cur.parentId)
      d += 1
    }
    max = Math.max(max, d)
  }
  return max
}

export function computeStats(map: MindMap): MapStats {
  return {
    nodeCount: map.nodes.length,
    depth: mapDepth(map),
    edgeCount: map.edges.length,
  }
}

export function validateImportedMap(raw: unknown): MindMap | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (!Array.isArray(obj.nodes) || !Array.isArray(obj.edges)) return null
  if (obj.nodes.length === 0) return null
  const nodes: MapNode[] = []
  for (const n of obj.nodes) {
    if (!n || typeof n !== 'object') return null
    const node = n as Record<string, unknown>
    if (typeof node.id !== 'string' || typeof node.text !== 'string') return null
    if (typeof node.x !== 'number' || typeof node.y !== 'number') return null
    nodes.push(
      createNode({
        id: String(node.id).slice(0, 64),
        text: String(node.text),
        x: Number(node.x),
        y: Number(node.y),
        width: typeof node.width === 'number' ? node.width : 180,
        height: typeof node.height === 'number' ? node.height : 56,
        parentId: typeof node.parentId === 'string' ? node.parentId : null,
      }),
    )
  }
  const ids = new Set(nodes.map((n) => n.id))
  const edges: MapEdge[] = []
  for (const e of obj.edges) {
    if (!e || typeof e !== 'object') continue
    const edge = e as Record<string, unknown>
    const from = String(edge.from ?? '')
    const to = String(edge.to ?? '')
    if (!ids.has(from) || !ids.has(to) || from === to) continue
    edges.push({ id: typeof edge.id === 'string' ? edge.id : nanoid(10), from, to })
  }
  return {
    id: typeof obj.id === 'string' ? obj.id.slice(0, 64) : nanoid(12),
    title: sanitizeText(typeof obj.title === 'string' ? obj.title : 'Imported map', 120),
    nodes,
    edges,
    updatedAt: Date.now(),
    isSample: false,
  }
}
