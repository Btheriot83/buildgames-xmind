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
      <div className="empty-media">
        <video
          className="empty-video"
          src="/art/synapse-pulse.mp4"
          poster="/art/empty-desk.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <img className="empty-still" src="/art/empty-desk.jpg" alt="" />
      </div>
      <div className={`t-stagger ${shown ? 'is-shown' : ''}`}>
        <strong className="t-stagger-line t-stagger-line--1">Desk is clear</strong>
        <span className="t-stagger-line t-stagger-line--2">
          Pin a central idea, Tab for children, Enter for siblings — or grow from an outline.
        </span>
      </div>
      <div className="empty-actions">
        <button type="button" className="btn accent" onClick={() => newMap()}>
          Blank map
        </button>
        <button type="button" className="btn" onClick={() => seedSample()}>
          Load sample
        </button>
      </div>
    </div>
  )
}
