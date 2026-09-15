import { describe, expect, it } from 'vitest'
import {
  addChild,
  computeStats,
  connectNodes,
  createEmptyMap,
  deleteNode,
  mapDepth,
  moveNode,
  resizeNode,
  sanitizeText,
  updateNodeText,
  validateImportedMap,
} from '../src/lib/model'

describe('mind map model', () => {
  it('creates a map with a root node', () => {
    const map = createEmptyMap('Test')
    expect(map.nodes).toHaveLength(1)
    expect(map.edges).toHaveLength(0)
    expect(map.title).toBe('Test')
  })

  it('adds children, tracks depth, and deletes subtrees', () => {
    let map = createEmptyMap()
    const root = map.nodes[0].id
    map = addChild(map, root, 'Branch A')
    const a = map.nodes[1].id
    map = addChild(map, a, 'Leaf')
    expect(computeStats(map).nodeCount).toBe(3)
    expect(mapDepth(map)).toBe(3)
    map = deleteNode(map, a)
    expect(map.nodes).toHaveLength(1)
    expect(map.edges).toHaveLength(0)
  })

  it('moves, resizes, renames, and connects nodes', () => {
    let map = createEmptyMap()
    const root = map.nodes[0].id
    map = addChild(map, root, 'Side')
    const side = map.nodes[1].id
    map = moveNode(map, side, 10, 20)
    expect(map.nodes[1].x).toBe(10)
    map = resizeNode(map, side, 50, 10)
    expect(map.nodes[1].width).toBeGreaterThanOrEqual(120)
    map = updateNodeText(map, side, '  Renamed  ')
    expect(map.nodes[1].text).toBe('Renamed')
    // reconnect root→side already exists via addChild; connect a fresh orphan path
    map = addChild(map, root, 'Other')
    const other = map.nodes[2].id
    map = connectNodes(map, side, other)
    expect(map.edges.some((e) => e.from === side && e.to === other)).toBe(true)
  })

  it('sanitizes text and validates imports', () => {
    expect(sanitizeText('  hi\u0000there  ')).toBe('hithere')
    expect(validateImportedMap(null)).toBeNull()
    expect(validateImportedMap({ nodes: [], edges: [] })).toBeNull()
    const good = validateImportedMap({
      title: 'Imported',
      nodes: [{ id: 'a', text: 'Root', x: 0, y: 0, width: 160, height: 50, parentId: null }],
      edges: [],
    })
    expect(good?.title).toBe('Imported')
    expect(good?.nodes).toHaveLength(1)
  })

  it('refuses deleting the root', () => {
    const map = createEmptyMap()
    const next = deleteNode(map, map.nodes[0].id)
    expect(next).toBe(map)
  })
})
