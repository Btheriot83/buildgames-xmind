import { CONTENT_PRESETS } from '../lib/sample'
import { useMapStore } from '../store/mapStore'

export function Sidebar() {
  const maps = useMapStore((s) => s.maps)
  const map = useMapStore((s) => s.map)
  const openMap = useMapStore((s) => s.openMap)
  const removeMap = useMapStore((s) => s.removeMap)
  const loadPreset = useMapStore((s) => s.loadPreset)

  return (
    <aside className="sidebar t-panel-slide" data-open="true" aria-label="Maps">
      <div className="sidebar-head">
        <h2>Maps</h2>
      </div>

      <div className="preset-packs" data-testid="preset-packs" aria-label="Content presets">
        <h3 className="preset-packs-label">Presets</h3>
        <ul className="preset-list">
          {CONTENT_PRESETS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="preset-item"
                data-testid={`preset-${p.id}`}
                onClick={() => void loadPreset(p.id)}
                title={p.blurb}
              >
                <span className="preset-item-title">{p.label}</span>
                <span className="preset-item-blurb">{p.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ul className="map-list">
        {maps.map((m) => (
          <li key={m.id} className={m.id === map?.id ? 'active' : ''}>
            <button type="button" className="map-item" onClick={() => openMap(m.id)}>
              <span className="map-item-title">{m.title}</span>
              {m.isSample && <span className="starter-tag">Starter</span>}
            </button>
            <button
              type="button"
              className="btn ghost sm danger-text"
              aria-label={`Delete ${m.title}`}
              onClick={() => removeMap(m.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <p className="sidebar-foot">Local · export before a wipe.</p>
    </aside>
  )
}
