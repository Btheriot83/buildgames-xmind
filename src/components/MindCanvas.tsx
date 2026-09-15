import { useCallback, useEffect, useRef, useState } from 'react'
import { useMapStore } from '../store/mapStore'
import type { MapNode, NodeId } from '../lib/types'

type DragMode = null | { kind: 'move' | 'resize'; id: NodeId; ox: number; oy: number; startW?: number; startH?: number }

export function MindCanvas() {
  const map = useMapStore((s) => s.map)
  const selectedId = useMapStore((s) => s.selectedId)
  const connectFrom = useMapStore((s) => s.connectFrom)
  const select = useMapStore((s) => s.select)
  const move = useMapStore((s) => s.move)
  const resize = useMapStore((s) => s.resize)
  const renameNode = useMapStore((s) => s.renameNode)
  const connect = useMapStore((s) => s.connect)
  const setConnectFrom = useMapStore((s) => s.setConnectFrom)

  const svgRef = useRef<SVGSVGElement>(null)
  const [pan, setPan] = useState({ x: 40, y: 40 })
  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState<DragMode>(null)
  const [panning, setPanning] = useState<{ x: number; y: number; px: number; py: number } | null>(null)
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let raf = 0
    const tick = (t: number) => {
      setPulse(t / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const clientToWorld = useCallback(
    (cx: number, cy: number) => {
      const rect = svgRef.current!.getBoundingClientRect()
      return {
        x: (cx - rect.left - pan.x) / zoom,
        y: (cy - rect.top - pan.y) / zoom,
      }
    },
    [pan, zoom],
  )

  const onNodePointerDown = (e: React.PointerEvent, node: MapNode) => {
    e.stopPropagation()
    select(node.id)
    if (connectFrom && connectFrom !== node.id) {
      connect(node.id)
      return
    }
    const w = clientToWorld(e.clientX, e.clientY)
    setDrag({ kind: 'move', id: node.id, ox: w.x - node.x, oy: w.y - node.y })
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const onResizeDown = (e: React.PointerEvent, node: MapNode) => {
    e.stopPropagation()
    select(node.id)
    const w = clientToWorld(e.clientX, e.clientY)
    setDrag({
      kind: 'resize',
      id: node.id,
      ox: w.x,
      oy: w.y,
      startW: node.width,
      startH: node.height,
    })
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (panning) {
      setPan({
        x: panning.px + (e.clientX - panning.x),
        y: panning.py + (e.clientY - panning.y),
      })
      return
    }
    if (!drag || !map) return
    const w = clientToWorld(e.clientX, e.clientY)
    if (drag.kind === 'move') {
      move(drag.id, w.x - drag.ox, w.y - drag.oy)
    } else {
      const dw = w.x - drag.ox
      const dh = w.y - drag.oy
      resize(drag.id, (drag.startW ?? 180) + dw, (drag.startH ?? 56) + dh)
    }
  }

  const onPointerUp = () => {
    setDrag(null)
    setPanning(null)
  }

  if (!map) return null
  const byId = new Map(map.nodes.map((n) => [n.id, n]))

  return (
    <div className={`canvas-wrap ${connectFrom ? 'is-linking' : ''}`} data-testid="mind-canvas">
      <svg
        ref={svgRef}
        className="mind-svg"
        role="application"
        aria-label="Mind map canvas"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerDown={(e) => {
          if (e.button === 1 || e.altKey || e.target === svgRef.current) {
            setPanning({ x: e.clientX, y: e.clientY, px: pan.x, py: pan.y })
          } else {
            select(null)
          }
        }}
        onWheel={(e) => {
          e.preventDefault()
          const next = Math.min(2.2, Math.max(0.45, zoom * (e.deltaY > 0 ? 0.92 : 1.08)))
          setZoom(next)
        }}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {map.edges.map((e) => {
            const a = byId.get(e.from)
            const b = byId.get(e.to)
            if (!a || !b) return null
            const acx = a.x + a.width / 2
            const acy = a.y + a.height / 2
            const bcx = b.x + b.width / 2
            const bcy = b.y + b.height / 2
            const toRight = bcx >= acx
            const x1 = toRight ? a.x + a.width : a.x
            const y1 = acy
            const x2 = toRight ? b.x : b.x + b.width
            const y2 = bcy
            const dx = Math.max(40, Math.abs(x2 - x1) * 0.45)
            const c1x = toRight ? x1 + dx : x1 - dx
            const c2x = toRight ? x2 - dx : x2 + dx
            return (
              <g key={e.id} className="edge-group">
                <path
                  d={`M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`}
                  className="edge-line"
                  strokeDasharray={connectFrom ? '8 6' : undefined}
                  strokeDashoffset={connectFrom ? -pulse * 18 : undefined}
                />
              </g>
            )
          })}

          {map.nodes.map((n) => {
            const selected = n.id === selectedId
            const linking = connectFrom === n.id
            const isRoot = n.parentId == null
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                className={`map-node ${selected ? 'is-selected' : ''} ${linking ? 'is-linking' : ''} ${isRoot ? 'is-root' : ''}`}
                onPointerDown={(e) => onNodePointerDown(e, n)}
                data-testid={`node-${n.id}`}
              >
                <rect
                  width={n.width}
                  height={n.height}
                  rx={isRoot ? 999 : 6}
                  className="node-body"
                />
                <foreignObject width={n.width} height={n.height}>
                  <div className="node-html">
                    <input
                      className="node-input"
                      aria-label="Node text"
                      value={n.text}
                      onChange={(ev) => renameNode(n.id, ev.target.value)}
                      onPointerDown={(ev) => ev.stopPropagation()}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter') (ev.target as HTMLInputElement).blur()
                      }}
                    />
                  </div>
                </foreignObject>
                <circle
                  cx={n.width}
                  cy={n.height}
                  r={7}
                  className="resize-handle"
                  onPointerDown={(e) => onResizeDown(e, n)}
                  aria-label="Resize node"
                />
                <circle className="port-dot" cx={0} cy={n.height / 2} r={4} aria-hidden />
                <circle className="port-dot" cx={n.width} cy={n.height / 2} r={4} aria-hidden />
                <circle
                  cx={n.width}
                  cy={n.height / 2}
                  r={6}
                  className="link-handle"
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    setConnectFrom(n.id)
                  }}
                  aria-label="Start connection"
                />
              </g>
            )
          })}
        </g>
      </svg>
      {connectFrom ? (
        <div className="connect-hint" role="status">
          Click a node to link · Esc cancels
        </div>
      ) : (
        <div className="job-rail" aria-hidden>
          <span><strong>Tab</strong> branch</span>
          <span><strong>C</strong> link</span>
          <span><strong>Export</strong> SVG</span>
        </div>
      )}
    </div>
  )
}
