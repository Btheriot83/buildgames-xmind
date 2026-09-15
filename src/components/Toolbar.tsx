import { useRef, useState } from 'react'
import { downloadJson, downloadPng, downloadSvg } from '../lib/export'
import { useMapStore } from '../store/mapStore'
import { NumberPop } from './NumberPop'

export function Toolbar({
  viewMode,
  onViewMode,
  onOpenOutlineGrow,
}: {
  viewMode: 'map' | 'outline'
  onViewMode: (m: 'map' | 'outline') => void
  onOpenOutlineGrow: () => void
}) {
  const map = useMapStore((s) => s.map)
  const stats = useMapStore((s) => s.stats)
  const saveStatus = useMapStore((s) => s.saveStatus)
  const addChildToSelected = useMapStore((s) => s.addChildToSelected)
  const addSiblingToSelected = useMapStore((s) => s.addSiblingToSelected)
  const removeSelected = useMapStore((s) => s.removeSelected)
  const setConnectFrom = useMapStore((s) => s.setConnectFrom)
  const selectedId = useMapStore((s) => s.selectedId)
  const patchTitle = useMapStore((s) => s.patchTitle)
  const newMap = useMapStore((s) => s.newMap)
  const importJson = useMapStore((s) => s.importJson)
  const flashSuccess = useMapStore((s) => s.flashSuccess)
  const flashToast = useMapStore((s) => s.flashToast)
  const expandSelectedAi = useMapStore((s) => s.expandSelectedAi)
  const aiBusy = useMapStore((s) => s.aiBusy)
  const fileRef = useRef<HTMLInputElement>(null)
  const [titleError, setTitleError] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  if (!map) return null

  const onExport = async (kind: 'svg' | 'png' | 'json') => {
    try {
      if (kind === 'svg') downloadSvg(map)
      else if (kind === 'png') await downloadPng(map)
      else downloadJson(map)
      flashSuccess()
      flashToast(`${kind.toUpperCase()} exported`, 'ok')
      setExportOpen(false)
    } catch {
      flashToast('Export failed', 'err')
    }
  }

  return (
    <header className="toolbar" role="banner">
      <div className="brand">
        <img className="brand-mark-img" src="/art/brand-mark.svg" width={44} height={44} alt="Shop Chalk Map" />
        <div className="t-stagger is-shown brand-copy">
          <strong className="t-stagger-line t-stagger-line--1">Shop Chalk Map</strong>
          <span className="t-stagger-line t-stagger-line--2">Branch · Link · Export</span>
        </div>
      </div>

      <div className="view-switch" role="group" aria-label="Map or outline">
        <button
          type="button"
          className={`view-switch-btn ${viewMode === 'map' ? 'is-active' : ''}`}
          aria-pressed={viewMode === 'map'}
          data-testid="view-map"
          onClick={() => onViewMode('map')}
        >
          Map
        </button>
        <button
          type="button"
          className={`view-switch-btn ${viewMode === 'outline' ? 'is-active' : ''}`}
          aria-pressed={viewMode === 'outline'}
          data-testid="view-outline"
          onClick={() => onViewMode('outline')}
        >
          Outline
        </button>
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
        <p className="t-error-msg">Name the map.</p>
      </div>

      <div className="stats-row" aria-label="Map stats">
        <NumberPop value={stats.nodeCount} label="nodes" />
        <NumberPop value={stats.edgeCount} label="links" />
      </div>

      <div className="toolbar-actions">
        <div className="job-cluster" aria-label="Core job actions">
          <button type="button" className="btn job" onClick={() => addChildToSelected()} disabled={!selectedId} data-testid="add-child">
            Branch
          </button>
          <button type="button" className="btn job" onClick={() => addSiblingToSelected()} disabled={!selectedId} data-testid="add-sibling">
            Sibling
          </button>
          <button
            type="button"
            className="btn job"
            onClick={() => selectedId && setConnectFrom(selectedId)}
            disabled={!selectedId}
            data-testid="connect"
          >
            Link
          </button>
          <button
            type="button"
            className="btn job-primary primary"
            onClick={() => void onExport('svg')}
            data-testid="export-svg"
          >
            Export
          </button>
          <div className="more-wrap">
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => setExportOpen((v) => !v)}
              aria-expanded={exportOpen}
              aria-label="More export formats"
            >
              ▾
            </button>
            {exportOpen && (
              <div className="more-menu" role="menu">
                <button type="button" role="menuitem" className="btn ghost" onClick={() => void onExport('png')}>
                  PNG
                </button>
                <button type="button" role="menuitem" className="btn ghost" onClick={() => void onExport('json')}>
                  JSON
                </button>
              </div>
            )}
          </div>
        </div>
        <button type="button" className="btn danger" onClick={() => removeSelected()} disabled={!selectedId}>
          Delete
        </button>
        <div className="more-wrap">
          <button type="button" className="btn ghost" onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen}>
            More
          </button>
          {moreOpen && (
            <div className="more-menu" role="menu">
              <button type="button" role="menuitem" className="btn ghost" data-testid="ai-expand" disabled={!selectedId || aiBusy} onClick={() => { void expandSelectedAi(); setMoreOpen(false) }}>{aiBusy ? 'Expanding…' : 'AI Expand'}</button>
              <button type="button" role="menuitem" className="btn ghost" data-testid="open-outline" onClick={() => { onOpenOutlineGrow(); setMoreOpen(false) }}>Grow from outline</button>
              <button type="button" role="menuitem" className="btn ghost" onClick={() => { newMap(); setMoreOpen(false) }}>Blank board</button>
              <button type="button" role="menuitem" className="btn ghost" onClick={() => { fileRef.current?.click(); setMoreOpen(false) }}>Import</button>
            </div>
          )}
        </div>
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
