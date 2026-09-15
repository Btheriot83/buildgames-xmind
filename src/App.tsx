import { useEffect, useState } from 'react'
import { EmptyState } from './components/EmptyState'
import { LoadingShell } from './components/LoadingShell'
import { MindCanvas } from './components/MindCanvas'
import { OutlinePanel } from './components/OutlinePanel'
import { OutlineTree } from './components/OutlineTree'
import { ShaderBg } from './components/ShaderBg'
import { Sidebar } from './components/Sidebar'
import { SuccessOverlay } from './components/SuccessOverlay'
import { Toast } from './components/Toast'
import { Toolbar } from './components/Toolbar'
import { useMapStore } from './store/mapStore'

export type ViewMode = 'map' | 'outline'

export default function App() {
  const boot = useMapStore((s) => s.boot)
  const loadStatus = useMapStore((s) => s.loadStatus)
  const addChildToSelected = useMapStore((s) => s.addChildToSelected)
  const addSiblingToSelected = useMapStore((s) => s.addSiblingToSelected)
  const removeSelected = useMapStore((s) => s.removeSelected)
  const setConnectFrom = useMapStore((s) => s.setConnectFrom)
  const selectedId = useMapStore((s) => s.selectedId)
  const connectFrom = useMapStore((s) => s.connectFrom)
  const expandSelectedAi = useMapStore((s) => s.expandSelectedAi)
  const aiBusy = useMapStore((s) => s.aiBusy)
  const [outlineOpen, setOutlineOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [igniting, setIgniting] = useState(false)

  useEffect(() => {
    void boot()
  }, [boot])

  useEffect(() => {
    if (!aiBusy) return
    setIgniting(true)
    const id = window.setTimeout(() => setIgniting(false), 750)
    return () => window.clearTimeout(id)
  }, [aiBusy])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if (e.key === 'Escape') {
        setConnectFrom(null)
        setOutlineOpen(false)
        return
      }
      if (typing) return
      if (e.key === 'Tab') {
        e.preventDefault()
        addChildToSelected()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        addSiblingToSelected()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        removeSelected()
      } else if (e.key === 'c' || e.key === 'C') {
        if (selectedId) setConnectFrom(selectedId)
      } else if ((e.key === 'e' || e.key === 'E') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        void expandSelectedAi()
      } else if ((e.key === 'o' || e.key === 'O') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setViewMode((v) => (v === 'map' ? 'outline' : 'map'))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    addChildToSelected,
    addSiblingToSelected,
    removeSelected,
    setConnectFrom,
    selectedId,
    connectFrom,
    expandSelectedAi,
  ])

  const ready = loadStatus === 'ready'
  const empty = loadStatus === 'empty'
  const errored = loadStatus === 'error'
  const booting = loadStatus === 'boot' || loadStatus === 'loading'

  return (
    <div className={`app-shell ${igniting ? 'is-igniting' : ''}`}>
      <ShaderBg />
      <LoadingShell revealed={!booting} />
      {!booting && (
        <>
          {errored && (
            <div className="fatal-banner" role="alert">
              Storage failed to open. You can still sketch in memory this session, but refresh will lose work — check browser IndexedDB permissions.
            </div>
          )}
          {empty ? (
            <EmptyState />
          ) : (
            ready && (
              <>
                <Toolbar
                  viewMode={viewMode}
                  onViewMode={setViewMode}
                  onOpenOutlineGrow={() => setOutlineOpen(true)}
                />
                <div className="workspace">
                  <Sidebar />
                  {viewMode === 'map' ? <MindCanvas /> : <OutlineTree />}
                </div>
                <OutlinePanel open={outlineOpen} onClose={() => setOutlineOpen(false)} />
              </>
            )
          )}
        </>
      )}
      <Toast />
      <SuccessOverlay />
    </div>
  )
}
