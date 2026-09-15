/** Friend walkthrough — persist so return visits never replay. */
export const ONBOARD_STORAGE_KEY = 'scm-onboard-v1'

export type OnboardState = {
  completed: boolean
  step: number
  skipped?: boolean
}

export function readOnboardState(): OnboardState | null {
  try {
    const raw = localStorage.getItem(ONBOARD_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as OnboardState
    if (typeof parsed?.completed !== 'boolean') return null
    return parsed
  } catch {
    return null
  }
}

export function writeOnboardState(state: OnboardState): void {
  try {
    localStorage.setItem(ONBOARD_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* private mode — walkthrough still works this session */
  }
}

export function isOnboardDone(): boolean {
  return readOnboardState()?.completed === true
}

export const ONBOARD_CARDS = [
  {
    id: 'welcome',
    title: 'Your week is already on the board',
    body: 'This sample is a content plan — hooks, pillars, formats. Edit any node.',
    cta: 'Got it',
  },
  {
    id: 'branch',
    title: 'Branch turns ideas into posts',
    body: 'Select a node, then hit Branch (or Tab). Pillars become Reels and carousels.',
    cta: 'Next',
  },
  {
    id: 'views',
    title: 'Map or Outline — same plan',
    body: 'Flip the switch when you want a list. Double-click a line to jump back to the board.',
    cta: 'Next',
  },
  {
    id: 'export',
    title: 'Export when the week’s mapped',
    body: 'That’s the loop: map → branch → export. You’re in.',
    cta: 'Start mapping',
  },
] as const
