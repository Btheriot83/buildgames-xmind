import { useMapStore } from '../store/mapStore'

export function Sidebar() {
  const maps = useMapStore((s) => s.maps)
  const map = useMapStore((s) => s.map)
  const openMap = useMapStore((s) => s.openMap)
  const removeMap = useMapStore((s) => s.removeMap)
  const seedSample = useMapStore((s) => s.seedSample)

  return (
    <aside className="sidebar panel-reveal is-open" aria-label="Maps">
      <div className="sidebar-head">
        <h2>Maps</h2>
        <button type="button" className="btn ghost sm" onClick={() => seedSample()} data-testid="load-sample">
          Sample
        </button>
      </div>
      <ul className="map-list">
        {maps.map((m) => (
          <li key={m.id} className={m.id === map?.id ? 'active' : ''}>
            <button type="button" className="map-item" onClick={() => openMap(m.id)}>
              <span className="map-item-title">{m.title}</span>
              {m.isSample && <span className="sample-tag">SAMPLE</span>}
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
      <p className="sidebar-foot">
        Data lives in IndexedDB (<code>copper-synapse-xmind</code>). Export JSON to back up.
      </p>
      <div className="shortcuts">
        <h3>Shortcuts</h3>
        <ul>
          <li><kbd>Tab</kbd> add child</li>
          <li><kbd>Del</kbd> delete node</li>
          <li><kbd>C</kbd> connect mode</li>
          <li><kbd>Esc</kbd> cancel</li>
          <li><kbd>Alt</kbd>+drag pan</li>
        </ul>
      </div>
    </aside>
  )
}
