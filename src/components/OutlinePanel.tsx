import { useState } from 'react'
import { useMapStore } from '../store/mapStore'

const CONTENT_OUTLINE = `Week of hooks
  Hooks
    Stop scrolling if…
    I was wrong about…
  Pillars
    Teach one tip
    Behind the scenes
  Formats
    Reel / Short
    Carousel
  CTAs
    Save this for later
    Comment your niche`

export function OutlinePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const outlineToMap = useMapStore((s) => s.outlineToMap)
  const aiBusy = useMapStore((s) => s.aiBusy)
  const [text, setText] = useState(CONTENT_OUTLINE)
  const [useAi, setUseAi] = useState(false)

  return (
    <div
      className={`outline-panel t-panel-slide ${open ? 'is-docked' : ''}`}
      data-open={open ? 'true' : 'false'}
      role="dialog"
      aria-label="Outline to map"
      hidden={!open}
    >
      <header className="outline-head">
        <div>
          <h2>Grow from outline</h2>
          <p>Indent with spaces. Paste a content list — it becomes chalk limbs.</p>
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
          AI reshape
        </label>
        <button
          type="button"
          className="btn accent"
          disabled={aiBusy}
          data-testid="outline-grow"
          onClick={() => void outlineToMap(text, { useAi }).then(() => onClose())}
        >
          {aiBusy ? 'Growing…' : 'Grow board'}
        </button>
      </div>
    </div>
  )
}
