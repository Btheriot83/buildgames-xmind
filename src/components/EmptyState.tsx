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
      <svg className="empty-mini-map" viewBox="0 0 420 160" aria-hidden="true">
        <path d="M210 80 C 270 80, 270 40, 330 40" fill="none" stroke="#8fc9b4" strokeWidth="3" strokeDasharray="6 5" />
        <path d="M210 80 C 270 80, 270 80, 330 80" fill="none" stroke="#8fc9b4" strokeWidth="3" strokeDasharray="6 5" />
        <path d="M210 80 C 270 80, 270 120, 330 120" fill="none" stroke="#8fc9b4" strokeWidth="3" strokeDasharray="6 5" />
        <rect x="118" y="52" width="92" height="56" rx="28" fill="#e09a3e" stroke="#f0b45c" strokeWidth="3" />
        <text x="164" y="86" textAnchor="middle" fill="#1a2c23" fontFamily="Bricolage Grotesque, sans-serif" fontSize="13" fontWeight="700">Center</text>
        <rect x="318" y="22" width="78" height="36" rx="8" fill="#24382e" stroke="#f3efe2" strokeWidth="2" />
        <text x="357" y="45" textAnchor="middle" fill="#f3efe2" fontFamily="IBM Plex Mono, monospace" fontSize="11">Branch</text>
        <rect x="318" y="62" width="78" height="36" rx="8" fill="#24382e" stroke="#f3efe2" strokeWidth="2" />
        <text x="357" y="85" textAnchor="middle" fill="#f3efe2" fontFamily="IBM Plex Mono, monospace" fontSize="11">Link</text>
        <rect x="318" y="102" width="78" height="36" rx="8" fill="#24382e" stroke="#f3efe2" strokeWidth="2" />
        <text x="357" y="125" textAnchor="middle" fill="#f3efe2" fontFamily="IBM Plex Mono, monospace" fontSize="11">Export</text>
      </svg>
      <div className={`t-stagger ${shown ? 'is-shown' : ''}`}>
        <strong className="t-stagger-line t-stagger-line--1">Pin the center</strong>
        <span className="t-stagger-line t-stagger-line--2">
          One topic in the middle. Branch out. Link sideways. Export when it&apos;s done.
        </span>
      </div>
      <div className="empty-job-chips" aria-hidden>
        <span>Branch</span>
        <span>Link</span>
        <span>Export</span>
      </div>
      <div className="empty-actions">
        <button type="button" className="btn accent" onClick={() => newMap()}>
          New map
        </button>
        <button type="button" className="btn job" onClick={() => seedSample()}>
          Load diesel week
        </button>
      </div>
    </div>
  )
}
