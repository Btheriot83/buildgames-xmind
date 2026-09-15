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
  const [pan, setPan] = useState({ x: 72, y: 56 })
  const [zoom, setZoom] = useState(0.92)
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
          <defs>
            <filter id="chalk-limb-grit" x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="11" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.55" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          {map.edges.map((e) => {
            const a = byId.get(e.from)
            const b = byId.get(e.to)
            if (!a || !b) return null
            const acy = a.y + a.height / 2
            const bcx = b.x + b.width / 2
            const bcy = b.y + b.height / 2
            const acx = a.x + a.width / 2
            const toRight = bcx >= acx
            const x1 = toRight ? a.x + a.width - 1 : a.x + 1
            const y1 = acy
            const x2 = toRight ? b.x + 1 : b.x + b.width - 1
            const y2 = bcy
            /* Organic cubic limbs — seeded bow, no self-intersecting smooth-S */
            const seed =
              e.id.split('').reduce((acc, ch, i) => acc + ch.charCodeAt(0) * (i + 3), 0) || 17
            const spanX = Math.abs(x2 - x1)
            const dx = Math.max(64, spanX * 0.55)
            const bend = ((seed % 11) - 5) * 4.2
            const lift = ((seed % 7) - 3) * 2.4
            const dy = (y2 - y1) * 0.18 + bend
            const c1x = toRight ? x1 + dx : x1 - dx
            const c1y = y1 + dy * 0.22 + lift
            const c2x = toRight ? x2 - dx * 0.88 : x2 + dx * 0.88
            const c2y = y2 - dy * 0.42 - lift * 0.35
            const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`
            const dust = `M ${x1.toFixed(1)} ${(y1 + 1.2).toFixed(1)} C ${(c1x + 0.5).toFixed(1)} ${(c1y + 1.6).toFixed(1)}, ${(c2x + 0.4).toFixed(1)} ${(c2y + 1.1).toFixed(1)}, ${x2.toFixed(1)} ${(y2 + 0.9).toFixed(1)}`
            return (
              <g key={e.id} className="edge-group" filter="url(#chalk-limb-grit)">
                <path d={d} className="edge-line-under" aria-hidden />
                <path d={dust} className="edge-line-dust" aria-hidden />
                <path
                  d={d}
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
                  rx={isRoot ? 999 : 3}
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
                <circle className="port-dot" cx={0} cy={n.height / 2} r={5.25} aria-hidden />
                <circle className="port-dot" cx={n.width} cy={n.height / 2} r={5.25} aria-hidden />
                <circle
                  cx={n.width}
                  cy={n.height / 2}
                  r={7.5}
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
          Pick a limb · Esc cancels
        </div>
      ) : null}
    </div>
  )
}
