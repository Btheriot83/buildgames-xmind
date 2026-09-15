import { useMemo } from 'react'
import { useMapStore } from '../store/mapStore'
import type { MapNode, NodeId } from '../lib/types'

type TreeNode = MapNode & { children: TreeNode[] }

function buildTree(nodes: MapNode[]): TreeNode[] {
  const byParent = new Map<string | 'root', MapNode[]>()
  for (const n of nodes) {
    const key = n.parentId ?? 'root'
    const list = byParent.get(key) ?? []
    list.push(n)
    byParent.set(key, list)
  }
  const walk = (id: NodeId | 'root'): TreeNode[] => {
    const kids = byParent.get(id) ?? []
    return kids.map((n) => ({ ...n, children: walk(n.id) }))
  }
  return walk('root')
}

function Row({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: TreeNode
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const selected = node.id === selectedId
  return (
    <li className={`outline-tree-row ${selected ? 'is-selected' : ''} ${depth === 0 ? 'is-root' : ''}`}>
      <button
        type="button"
        className="outline-tree-item"
        style={{ paddingLeft: 12 + depth * 18 }}
        onClick={() => onSelect(node.id)}
        data-testid={`outline-row-${node.id}`}
      >
        <span className="outline-tree-mark" aria-hidden />
        <span className="outline-tree-text">{node.text}</span>
      </button>
      {node.children.length > 0 && (
        <ul className="outline-tree-branch">
          {node.children.map((c) => (
            <Row key={c.id} node={c} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  )
}

/** Live outline of the open map — MindNode dual-view steal. */
export function OutlineTree() {
  const map = useMapStore((s) => s.map)
  const selectedId = useMapStore((s) => s.selectedId)
  const select = useMapStore((s) => s.select)
  const tree = useMemo(() => (map ? buildTree(map.nodes) : []), [map])

  if (!map) return null

  return (
    <div className="outline-tree" data-testid="outline-tree" aria-label="Outline view">
      <header className="outline-tree-head">
        <h2>Outline</h2>
        <p>Same board as a list. Click a line to select it on the map.</p>
      </header>
      <ul className="outline-tree-root">
        {tree.map((n) => (
          <Row key={n.id} node={n} depth={0} selectedId={selectedId} onSelect={select} />
        ))}
      </ul>
    </div>
  )
}
