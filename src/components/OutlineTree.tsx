import { useMemo, useState } from 'react'
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
  onRename,
  onJumpToMap,
}: {
  node: TreeNode
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, text: string) => void
  onJumpToMap?: () => void
}) {
  const selected = node.id === selectedId
  const [editing, setEditing] = useState(false)

  return (
    <li className={`outline-tree-row ${selected ? 'is-selected' : ''} ${depth === 0 ? 'is-root' : ''}`}>
      <div
        className="outline-tree-item"
        style={{ paddingLeft: 14 + depth * 20 }}
        data-testid={`outline-row-${node.id}`}
      >
        <span className="outline-tree-mark" aria-hidden />
        {editing ? (
          <input
            className="outline-tree-edit"
            aria-label="Edit outline line"
            autoFocus
            defaultValue={node.text}
            onBlur={(e) => {
              onRename(node.id, e.target.value.trim() || node.text)
              setEditing(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
              if (e.key === 'Escape') setEditing(false)
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button
            type="button"
            className="outline-tree-text-btn"
            onClick={() => onSelect(node.id)}
            onDoubleClick={() => {
              onSelect(node.id)
              onJumpToMap?.()
            }}
          >
            <span className="outline-tree-text">{node.text}</span>
          </button>
        )}
        <button
          type="button"
          className="outline-tree-edit-btn"
          aria-label="Rename line"
          title="Rename"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(node.id)
            setEditing(true)
          }}
        >
          ✎
        </button>
      </div>
      {node.children.length > 0 && (
        <ul className="outline-tree-branch">
          {node.children.map((c) => (
            <Row
              key={c.id}
              node={c}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onRename={onRename}
              onJumpToMap={onJumpToMap}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

/** Live outline of the open map — MindNode dual-view steal. */
export function OutlineTree({ onJumpToMap }: { onJumpToMap?: () => void }) {
  const map = useMapStore((s) => s.map)
  const selectedId = useMapStore((s) => s.selectedId)
  const select = useMapStore((s) => s.select)
  const renameNode = useMapStore((s) => s.renameNode)
  const tree = useMemo(() => (map ? buildTree(map.nodes) : []), [map])

  if (!map) return null

  return (
    <div className="outline-tree" data-testid="outline-tree" aria-label="Outline view">
      <header className="outline-tree-head">
        <h2>Outline</h2>
        <p>Same map, as a list. Edit a line, or double-click to jump to the board.</p>
      </header>
      <ul className="outline-tree-root">
        {tree.map((n) => (
          <Row
            key={n.id}
            node={n}
            depth={0}
            selectedId={selectedId}
            onSelect={select}
            onRename={renameNode}
            onJumpToMap={onJumpToMap}
          />
        ))}
      </ul>
    </div>
  )
}
