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
          Diesel week
        </button>
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
      <p className="sidebar-foot">
        Lives in IndexedDB (<code>copper-synapse-xmind</code>). Export JSON before you wipe site data.
      </p>
      <div className="shortcuts">
        <h3>Keys</h3>
        <ul>
          <li><kbd>Tab</kbd> branch child</li>
          <li><kbd>Enter</kbd> sibling</li>
          <li><kbd>C</kbd> link mode</li>
          <li><kbd>⌘E</kbd> AI expand</li>
          <li><kbd>⌘O</kbd> outline</li>
          <li><kbd>Del</kbd> delete</li>
          <li><kbd>Alt</kbd>+drag pan</li>
        </ul>
      </div>
    </aside>
  )
}
