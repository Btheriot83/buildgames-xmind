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
      <div className={`t-stagger ${shown ? 'is-shown' : ''}`}>
        <strong className="t-stagger-line t-stagger-line--1">No maps yet</strong>
        <span className="t-stagger-line t-stagger-line--2">
          Start a blank canvas or load the labelled SAMPLE map.
        </span>
      </div>
      <div className="empty-actions">
        <button type="button" className="btn accent" onClick={() => newMap()}>
          New map
        </button>
        <button type="button" className="btn" onClick={() => seedSample()}>
          Load sample
        </button>
      </div>
    </div>
  )
}
