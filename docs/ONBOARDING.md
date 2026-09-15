# Onboarding — Shop Chalk Map (social content)

## TC-EBC

- **Task:** social-content mind map (hooks → pillars → posts)
- **Context:** creators planning a content week
- **Elements:** canvas, Map|Outline, nodes, preset packs, onboarding cards
- **Behavior:** pick preset → expand branches → outline export
- **Constraints:** zero diesel/shop biz; chalkboard materials OK; friend onboarding ≤5 cards; chalk-on-slate palette

## Activation event

**First social-content map with at least one branch the user can edit.**

We seed a “Week of hooks” sample on first boot. Preset packs (Week of hooks / Reel batch / Carousel series) let creators swap plans. The walkthrough teaches Branch / Map|Outline / Export over the real canvas.

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

## Smoke

1. First visit → complete all cards → land on canvas with sample map
2. First visit → Skip → canvas, no further cards
3. Return visit → no replay
4. Preset packs load Reel batch / Carousel series
5. Sample is social-content themed (not diesel/shop)
