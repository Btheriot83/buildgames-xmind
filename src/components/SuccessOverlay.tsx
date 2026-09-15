import { useEffect, useRef } from "react"
import { useMapStore } from "../store/mapStore"

export function SuccessOverlay() {
  const show = useMapStore((s) => s.showSuccess)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (show) {
      void v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [show])

  return (
    <div className={`success-overlay ${show ? "visible" : ""}`} aria-hidden={!show}>
      <div className="success-pulse-wrap" aria-hidden>
        <video
          ref={videoRef}
          className="success-pulse-video"
          src="/art/synapse-pulse.mp4"
          muted
          playsInline
          loop
        />
      </div>
      <span className="t-success-check" data-state={show ? "in" : "out"}>
        <svg viewBox="0 0 48 48" width="72" height="72" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="22" stroke="#e8d84a" strokeWidth="3" />
          <path
            d="M14 24.5 L21 31.5 L34 16"
            stroke="#e8d84a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p>Board exported</p>
    </div>
  )
}
