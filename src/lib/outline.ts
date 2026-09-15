import { addChild, createEmptyMap, createNode, createEdge } from './model'
import type { MindMap, NodeId } from './types'

export type OutlineNode = {
  text: string
  children: OutlineNode[]
}

/** Deterministic indented outline parser (tabs / 2-spaces / - * •). */
export function parseOutlineText(raw: string): OutlineNode | null {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/\t/g, '  '))
    .filter((l) => l.trim().length > 0)
  if (!lines.length) return null

  type StackItem = { indent: number; node: OutlineNode }
  const root: OutlineNode = { text: 'Central idea', children: [] }
  const stack: StackItem[] = [{ indent: -1, node: root }]

  for (const line of lines) {
    const m = line.match(/^(\s*)([-*•]\s+)?(.*)$/)
    if (!m) continue
    const indent = m[1].length
    const text = m[3].trim()
    if (!text) continue
    const node: OutlineNode = { text: text.slice(0, 120), children: [] }
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }
    stack[stack.length - 1].node.children.push(node)
    stack.push({ indent, node })
  }

  if (root.children.length === 1 && root.children[0].children.length > 0) {
    return root.children[0]
  }
  if (root.children.length === 1) return root.children[0]
  if (!root.children.length) return null
  root.text = root.children[0]?.text || root.text
  return root
}

function layoutChildren(
  map: MindMap,
  parentId: NodeId,
  kids: OutlineNode[],
  depth: number,
): MindMap {
  let next = map
  const parent = next.nodes.find((n) => n.id === parentId)
  if (!parent) return next
  const startY = parent.y - ((kids.length - 1) * 72) / 2
  kids.forEach((kid, i) => {
    const before = next.nodes.length
    next = addChild(next, parentId, kid.text)
    const child = next.nodes[before]
    if (!child) return
    const x = parent.x + parent.width + 110
    const y = startY + i * 72
    next = {
      ...next,
      nodes: next.nodes.map((n) => (n.id === child.id ? { ...n, x, y } : n)),
    }
    if (kid.children.length && depth < 5) {
      next = layoutChildren(next, child.id, kid.children, depth + 1)
    }
  })
  return next
}

export function mapFromOutlineTree(
  tree: OutlineNode,
  title?: string,
): MindMap {
  const map = createEmptyMap(title || tree.text || 'Outline map')
  const root = map.nodes[0]
  const withRootText = {
    ...map,
    nodes: map.nodes.map((n) =>
      n.id === root.id
        ? { ...n, text: (tree.text || 'Central idea').slice(0, 120), width: 200, height: 64 }
        : n,
    ),
  }
  return layoutChildren(withRootText, root.id, tree.children || [], 1)
}

export function addChildrenLabels(
  map: MindMap,
  parentId: NodeId,
  labels: string[],
): MindMap {
  let next = map
  for (const label of labels) {
    next = addChild(next, parentId, label)
  }
  // fan out vertically around parent
  const parent = next.nodes.find((n) => n.id === parentId)
  if (!parent) return next
  const kids = next.nodes.filter((n) => n.parentId === parentId)
  const startY = parent.y - ((kids.length - 1) * 76) / 2
  return {
    ...next,
    nodes: next.nodes.map((n) => {
      if (n.parentId !== parentId) return n
      const idx = kids.findIndex((k) => k.id === n.id)
      return {
        ...n,
        x: parent.x + parent.width + 120,
        y: startY + idx * 76,
      }
    }),
  }
}

export function addSibling(
  map: MindMap,
  nodeId: NodeId,
  text = 'New idea',
): MindMap {
  const node = map.nodes.find((n) => n.id === nodeId)
  if (!node || !node.parentId) {
    return addChild(map, nodeId, text)
  }
  if (!map.nodes.some((n) => n.id === node.parentId)) return map
  const child = createNode({
    text,
    x: node.x,
    y: node.y + node.height + 24,
    parentId: node.parentId,
  })
  // nudge later siblings down a bit
  const nodes = [
    ...map.nodes.map((n) => {
      if (n.parentId === node.parentId && n.y > node.y) {
        return { ...n, y: n.y + 80 }
      }
      return n
    }),
    child,
  ]
  return {
    ...map,
    nodes,
    edges: [...map.edges, createEdge(node.parentId, child.id)],
    updatedAt: Date.now(),
  }
}
