import { useEffect, useRef, useState } from 'react'

export function NumberPop({ value, label }: { value: number; label: string }) {
  const [animating, setAnimating] = useState(true)
  const prev = useRef(value)
  const str = String(value)

  useEffect(() => {
    if (prev.current === value) return
    prev.current = value
    setAnimating(false)
    const id = requestAnimationFrame(() => {
      void document.body.offsetHeight
      setAnimating(true)
    })
    return () => cancelAnimationFrame(id)
  }, [value])

  return (
    <div className="stat-chip" title={label}>
      <span className="stat-label">{label}</span>
      <span className={`t-digit-group ${animating ? 'is-animating' : ''}`} aria-label={`${label}: ${value}`}>
        {str.split('').map((ch, i) => {
          const fromEnd = str.length - 1 - i
          const stagger = fromEnd === 0 ? '2' : fromEnd === 1 ? '1' : undefined
          return (
            <span key={`${value}-${i}-${ch}`} className="t-digit" data-stagger={stagger}>
              {ch}
            </span>
          )
        })}
      </span>
    </div>
  )
}
