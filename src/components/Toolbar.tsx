import { useRef, useState } from 'react'
import { downloadJson, downloadPng, downloadSvg } from '../lib/export'
import { useMapStore } from '../store/mapStore'
import { NumberPop } from './NumberPop'

export function Toolbar() {
  const map = useMapStore((s) => s.map)
  const stats = useMapStore((s) => s.stats)
  const saveStatus = useMapStore((s) => s.saveStatus)
  const addChildToSelected = useMapStore((s) => s.addChildToSelected)
  const removeSelected = useMapStore((s) => s.removeSelected)
  const setConnectFrom = useMapStore((s) => s.setConnectFrom)
  const selectedId = useMapStore((s) => s.selectedId)
  const patchTitle = useMapStore((s) => s.patchTitle)
  const newMap = useMapStore((s) => s.newMap)
  const importJson = useMapStore((s) => s.importJson)
  const flashSuccess = useMapStore((s) => s.flashSuccess)
  const flashToast = useMapStore((s) => s.flashToast)
  const fileRef = useRef<HTMLInputElement>(null)
  const [titleError, setTitleError] = useState(false)

  if (!map) return null

  const onExport = async (kind: 'svg' | 'png' | 'json') => {
    try {
      if (kind === 'svg') downloadSvg(map)
      else if (kind === 'png') await downloadPng(map)
      else downloadJson(map)
      flashSuccess()
      flashToast(`Exported ${kind.toUpperCase()}`, 'ok')
    } catch {
      flashToast('Export failed', 'err')
    }
  }

  return (
    <header className="toolbar" role="banner">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <div className="t-stagger is-shown brand-copy">
          <strong className="t-stagger-line t-stagger-line--1">Copper Synapse</strong>
          <span className="t-stagger-line t-stagger-line--2">local mind maps</span>
        </div>
      </div>

      <div className={`t-input-wrap title-wrap ${titleError ? 'is-error' : ''}`}>
        <div className={`t-input title-input ${titleError ? 'is-error is-shaking' : ''}`}>
          <input
            aria-label="Map title"
            value={map.title}
            data-testid="map-title"
            onChange={(e) => {
              const v = e.target.value
              if (!v.trim()) {
                setTitleError(true)
                return
              }
              setTitleError(false)
              patchTitle(v)
            }}
            onBlur={() => {
              if (!map.title.trim()) {
                setTitleError(true)
                patchTitle('Untitled map')
                setTimeout(() => setTitleError(false), 2000)
              }
            }}
          />
        </div>
        <p className="t-error-msg">Title cannot be empty.</p>
      </div>

      <div className="stats-row" aria-label="Map stats">
        <NumberPop value={stats.nodeCount} label="nodes" />
        <NumberPop value={stats.depth} label="depth" />
        <NumberPop value={stats.edgeCount} label="links" />
      </div>

      <div className="toolbar-actions">
        <button type="button" className="btn" onClick={() => addChildToSelected()} disabled={!selectedId} data-testid="add-child">
          + Child
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => selectedId && setConnectFrom(selectedId)}
          disabled={!selectedId}
          data-testid="connect"
        >
          Connect
        </button>
        <button type="button" className="btn danger" onClick={() => removeSelected()} disabled={!selectedId}>
          Delete
        </button>
        <button type="button" className="btn ghost" onClick={() => newMap()}>
          New
        </button>
        <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file) return
            try {
              const text = await file.text()
              const raw = JSON.parse(text)
              await importJson(raw)
            } catch {
              flashToast('Could not read JSON', 'err')
            }
          }}
        />
        <button type="button" className="btn accent" onClick={() => onExport('svg')} data-testid="export-svg">
          SVG
        </button>
        <button type="button" className="btn accent" onClick={() => onExport('png')} data-testid="export-png">
          PNG
        </button>
        <button type="button" className="btn ghost" onClick={() => onExport('json')}>
          JSON
        </button>
        <span className={`save-pill status-${saveStatus}`} aria-live="polite">
          {saveStatus === 'saving' && 'Saving…'}
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'error' && 'Save error'}
          {saveStatus === 'idle' && 'Local'}
        </span>
      </div>
    </header>
  )
}
