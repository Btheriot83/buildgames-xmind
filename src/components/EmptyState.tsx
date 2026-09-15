import { useEffect, useState } from 'react'
import { useMapStore } from '../store/mapStore'

export function EmptyState() {
  const newMap = useMapStore((s) => s.newMap)
  const seedSample = useMapStore((s) => s.seedSample)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div className="empty-state" data-testid="empty-state">
      <img
        className="empty-hero-art"
        src="/art/empty-chalk-map.jpg"
        width={560}
        height={320}
        alt=""
      />
      <div className={`t-stagger ${shown ? 'is-shown' : ''}`}>
        <strong className="t-stagger-line t-stagger-line--1">Chalk the center</strong>
        <span className="t-stagger-line t-stagger-line--2">
          Amber root. Chalk limbs. Link sideways. Export the board.
        </span>
      </div>
      <div className="empty-actions">
        <button type="button" className="btn primary" onClick={() => newMap()} data-testid="new-map">
          New map
        </button>
        <button type="button" className="btn secondary" onClick={() => seedSample()} data-testid="load-sample">
          Load diesel week
        </button>
      </div>
    </div>
  )
}
