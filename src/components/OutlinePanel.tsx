import { useState } from 'react'
import { useMapStore } from '../store/mapStore'

const SAMPLE = `Product launch
  Audience
    Beta cohort
    Early adopters
  Channels
    Press kit
    Launch webinar
  Risks
    Supply slip
    Messaging drift`

export function OutlinePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const outlineToMap = useMapStore((s) => s.outlineToMap)
  const aiBusy = useMapStore((s) => s.aiBusy)
  const [text, setText] = useState(SAMPLE)
  const [useAi, setUseAi] = useState(false)

  if (!open) return null

  return (
    <div className="outline-panel panel-reveal is-open" role="dialog" aria-label="Outline to map">
      <header className="outline-head">
        <div>
          <h2>Outline → map</h2>
          <p>Indent with spaces or bullets. AI reshapes when keyed; otherwise local parse.</p>
        </div>
        <button type="button" className="btn ghost sm" onClick={onClose} aria-label="Close outline">
          Close
        </button>
      </header>
      <textarea
        className="outline-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        data-testid="outline-input"
        aria-label="Outline text"
      />
      <div className="outline-actions">
        <label className="outline-ai-toggle">
          <input
            type="checkbox"
            checked={useAi}
            onChange={(e) => setUseAi(e.target.checked)}
          />
          Ask AI to reshape
        </label>
        <button
          type="button"
          className="btn accent"
          disabled={aiBusy}
          data-testid="outline-grow"
          onClick={() => void outlineToMap(text, { useAi }).then(() => onClose())}
        >
          {aiBusy ? 'Growing…' : 'Grow map'}
        </button>
      </div>
    </div>
  )
}
