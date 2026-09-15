import { useMapStore } from '../store/mapStore'

export function Toast() {
  const toast = useMapStore((s) => s.toast)
  return (
    <div
      className={`t-toast app-toast ${toast.open ? 'is-open' : ''} kind-${toast.kind}`}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  )
}
