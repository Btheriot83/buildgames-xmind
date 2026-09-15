export function LoadingShell({ revealed }: { revealed: boolean }) {
  return (
    <div className={`t-skel boot-skel ${revealed ? 'is-revealed' : ''}`} data-testid="boot-shell">
      <div className="t-skel-skeleton is-pulsing boot-skeleton">
        <div className="skel-bar skel-brand" />
        <div className="skel-bar skel-wide" />
        <div className="skel-grid">
          <div className="skel-card" />
          <div className="skel-card" />
          <div className="skel-card tall" />
        </div>
      </div>
      <div className="t-skel-content boot-content-slot" />
    </div>
  )
}
