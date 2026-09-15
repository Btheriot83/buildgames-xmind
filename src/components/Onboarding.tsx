import { useEffect, useState } from 'react'
import {
  ONBOARD_CARDS,
  isOnboardDone,
  writeOnboardState,
  type OnboardState,
} from '../lib/onboarding'

type Props = {
  active: boolean
}

export function Onboarding({ active }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!active) return
    if (isOnboardDone()) {
      setOpen(false)
      return
    }
    setOpen(true)
    setStep(0)
  }, [active])

  if (!open || !active) return null

  const card = ONBOARD_CARDS[step]
  const total = ONBOARD_CARDS.length
  const last = step >= total - 1

  const finish = (skipped: boolean) => {
    const state: OnboardState = { completed: true, step, skipped }
    writeOnboardState(state)
    setOpen(false)
  }

  const next = () => {
    if (last) {
      finish(false)
      return
    }
    const nextStep = step + 1
    setStep(nextStep)
    writeOnboardState({ completed: false, step: nextStep })
  }

  return (
    <div className="onboard-layer" data-testid="onboarding" role="dialog" aria-modal="true" aria-label="Quick start">
      <div className="onboard-card">
        <div className="onboard-progress" aria-label={`Step ${step + 1} of ${total}`}>
          {ONBOARD_CARDS.map((c, i) => (
            <span key={c.id} className={`onboard-dot ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`} />
          ))}
        </div>
        <h2 className="onboard-title">{card.title}</h2>
        <p className="onboard-body">{card.body}</p>
        <div className="onboard-actions">
          <button type="button" className="btn ghost onboard-skip" data-testid="onboard-skip" onClick={() => finish(true)}>
            Skip
          </button>
          <button type="button" className="btn primary onboard-cta" data-testid="onboard-next" onClick={next}>
            {card.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
