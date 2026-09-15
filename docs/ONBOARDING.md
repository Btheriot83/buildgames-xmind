# Onboarding — Shop Chalk Map (social content)

## Activation event

**First social-content map with at least one branch the user can edit.**

We seed a “Week of hooks” sample (hooks → pillars → formats → CTAs) on first boot so the board is already a content plan. The walkthrough teaches Branch / Map|Outline / Export without leaving the real canvas.

## Copy deck (4 cards)

| # | Title | Body | CTA |
|---|-------|------|-----|
| 1 | Your week is already on the board | This sample is a content plan — hooks, pillars, formats. Edit any node. | Got it |
| 2 | Branch turns ideas into posts | Select a node, then hit Branch (or Tab). Pillars become Reels and carousels. | Next |
| 3 | Map or Outline — same plan | Flip the switch when you want a list. Double-click a line to jump back to the board. | Next |
| 4 | Export when the week’s mapped | That’s the loop: map → branch → export. You’re in. | Start mapping |

**Skip** is always visible. Progress: quiet dots (1–4).

## Persist

- Key: `scm-onboard-v1` in `localStorage`
- Shape: `{ completed: boolean, step: number, skipped?: boolean }`
- Return visits: if `completed === true`, never replay

## Shape

- Cards float over the real Map canvas (sample already loaded)
- One CTA per card + Skip
- Friend voice, second person, no feature dump
- Empty-state coach (if all maps deleted): “New board” + “Load week of hooks”

## Smoke

1. First visit → complete all cards → land on canvas with sample map
2. First visit → Skip → canvas, no further cards
3. Return visit → no replay
4. Sample title/nodes are social-content themed (not diesel/shop)
