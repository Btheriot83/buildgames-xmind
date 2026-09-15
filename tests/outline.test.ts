import { describe, expect, it } from 'vitest'
import {
  addChildrenLabels,
  addSibling,
  mapFromOutlineTree,
  parseOutlineText,
} from '../src/lib/outline'
import { createEmptyMap } from '../src/lib/model'

describe('outline', () => {
  it('parses indented outline into a tree', () => {
    const tree = parseOutlineText(`Launch
  Audience
    Beta
  Channels`)
    expect(tree?.text).toBe('Launch')
    expect(tree?.children.map((c) => c.text)).toEqual(['Audience', 'Channels'])
    expect(tree?.children[0].children[0].text).toBe('Beta')
  })

  it('builds a map from outline tree', () => {
    const map = mapFromOutlineTree({
      text: 'Root',
      children: [
        { text: 'A', children: [{ text: 'A1', children: [] }] },
        { text: 'B', children: [] },
      ],
    }, 'From outline')
    expect(map.title).toBe('From outline')
    expect(map.nodes.length).toBe(4)
    expect(map.edges.length).toBe(3)
  })

  it('adds AI children labels and siblings', () => {
    let map = createEmptyMap('T')
    const root = map.nodes[0].id
    map = addChildrenLabels(map, root, ['One', 'Two'])
    expect(map.nodes.length).toBe(3)
    const child = map.nodes[1].id
    map = addSibling(map, child, 'Sib')
    expect(map.nodes.some((n) => n.text === 'Sib')).toBe(true)
  })
})
