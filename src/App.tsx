import { useEffect } from 'react'
import { EmptyState } from './components/EmptyState'
import { LoadingShell } from './components/LoadingShell'
import { MindCanvas } from './components/MindCanvas'
import { ShaderBg } from './components/ShaderBg'
import { Sidebar } from './components/Sidebar'
import { SuccessOverlay } from './components/SuccessOverlay'
import { Toast } from './components/Toast'
import { Toolbar } from './components/Toolbar'
import { useMapStore } from './store/mapStore'

export default function App() {
  const boot = useMapStore((s) => s.boot)
  const loadStatus = useMapStore((s) => s.loadStatus)
  const addChildToSelected = useMapStore((s) => s.addChildToSelected)
  const removeSelected = useMapStore((s) => s.removeSelected)
  const setConnectFrom = useMapStore((s) => s.setConnectFrom)
  const selectedId = useMapStore((s) => s.selectedId)
  const connectFrom = useMapStore((s) => s.connectFrom)

  useEffect(() => {
    void boot()
  }, [boot])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if (e.key === 'Escape') {
        setConnectFrom(null)
        return
      }
      if (typing) return
      if (e.key === 'Tab') {
        e.preventDefault()
        addChildToSelected()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        removeSelected()
      } else if (e.key === 'c' || e.key === 'C') {
        if (selectedId) setConnectFrom(selectedId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [addChildToSelected, removeSelected, setConnectFrom, selectedId, connectFrom])

  const ready = loadStatus === 'ready'
  const empty = loadStatus === 'empty'
  const errored = loadStatus === 'error'
  const booting = loadStatus === 'boot' || loadStatus === 'loading'

  return (
    <div className="app-shell">
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
                <Toolbar />
                <div className="workspace">
                  <Sidebar />
                  <MindCanvas />
                </div>
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
