# Gauntlet workbench R4 — integrity re-run (Shop Chalk Map LOCKED)

**Identity locked:** Shop Chalk Map (`docs/IDENTITY.md`) — no reseed  
**Demo:** https://buildgames-xmind.vercel.app  
**Bar:** https://xmind.app/  
**Job ≤3s:** central topic → branch → connect → export  
**Gate:** `/workspace/build-games/gauntlet/INTEGRITY_GATE.md`  
**Focus pool:** fonts · contrast · buttons · bar gap  
**Rule:** one commit per counted round (`rN: <focus>`); no batch; honest verdict vs original (no self-cheer scores)


## transitions.dev wiring (real actions)
| Recipe | Fires on |
|--------|----------|
| success-check | Export SVG/PNG/JSON (`flashSuccess`) |
| toast | Export ok/fail, AI/import messages (`flashToast`) |
| error-state-shake | Empty map title validation |
| skeleton-reveal | Boot `LoadingShell` → ready |
| texts-reveal | Brand + empty-state staggered lines |
| number-pop-in | Nodes/Links stats when counts change |
| panel-reveal | Outline dock open/close (`t-panel-slide data-open`) |

## r1 — fonts
- files: src/index.css
- shot: gauntlet/shots-r4/r1-board.png
- verdict: Root reads larger than limbs in ~3s; original still wins editorial type polish on marketing pages.
- commit: c71688d

## r2 — contrast
- files: src/index.css
- shot: gauntlet/shots-r4/r2-board.png
- verdict: Limb stroke and chalk-dim labels hold on board green; original still wins bright editorial contrast on light canvases.
- commit: faedfbc

## r3 — buttons
- files: src/components/OutlinePanel.tsx, src/components/Sidebar.tsx, src/components/SuccessOverlay.tsx, src/index.css, gauntlet/workbench-r4.md
- shot: gauntlet/shots-r4/r3-board.png
- verdict: Outline dock uses real panel-reveal; success-check chalk flat on export — original still quieter on chrome motion.
- commit: a55680c
- dream-loop: target locked at .dream-loop/target.png (from live baseline refine); critic also vs bar

## r4 — bar gap
- files: src/components/MindCanvas.tsx, src/index.css
- shot: gauntlet/shots-r4/r4-board.png
- verdict: Side-attach chalk limbs close dream-loop target silhouette; original still wins soft editorial bezier photography.
- commit: a9a5682

## r5 — fonts
- files: src/index.css
- shot: gauntlet/shots-r4/r5-board.png ; gauntlet/shots-r4/r5-bar-xmind.png
- verdict: Brand/title type denser vs target; bar A/B — original marketing hero still outranks chalkboard chrome.
- commit: 8b4f065

## r6 — contrast
- files: src/index.css
- shot: gauntlet/shots-r4/r6-board.png
- verdict: Desk photo underlay killed — flat chalk board closer to dream-loop target; original still wins light map photography.
- commit: 33d3875

## r7 — buttons
- files: src/index.css
- shot: gauntlet/shots-r4/r7-board.png
- verdict: Job cluster square denser matching target chrome; original CTAs still cleaner on light UI.
- commit: 1ce06d2

## r8 — bar gap
- files: src/components/MindCanvas.tsx, src/index.css
- shot: gauntlet/shots-r4/r8-board.png
- verdict: Chalk link ports on node edges — closer to dream-loop anchors; original still subtler.
- commit: 91f0af7

## r9 — fonts
- files: src/index.css
- shot: gauntlet/shots-r4/r9-board.png
- verdict: Limb mono 13px denser; root display holds — target type hierarchy closer; original still wins editorial type.
- commit: 5e2105c

## r10 — contrast
- files: src/index.css
- shot: gauntlet/shots-r4/r10-board.png ; gauntlet/shots-r4/r10-bar-xmind.png
- verdict: Limb stroke chalk-brighter on board; bar A/B — original light canvas contrast still preferred.
- commit: 9b6f6ac

## r11 — buttons
- files: src/index.css
- shot: gauntlet/shots-r4/r11-board.png
- verdict: Export SVG sole copper primary with hard offset — matches target CTA weight; original still quieter.
- commit: 976ba48

## r12 — bar gap
- files: src/lib/model.ts, src/index.css
- shot: gauntlet/shots-r4/r12-board.png
- verdict: Right-fan sibling spacing denser toward dream-loop tree; original still wins fluid org layouts.
- commit: 682c4de

## r13 — fonts
- files: src/index.css
- shot: gauntlet/shots-r4/r13-board.png
- verdict: Job tape tracking denser billboard; still chalkboard vs Xmind photo hero.
- commit: a50e878

## r14 — contrast
- files: src/index.css
- shot: gauntlet/shots-r4/r14-board.png
- verdict: Selected limb chalk wash + acid stroke; vs target selection clarity; original softer.
- commit: 9627ece

## r15 — buttons
- files: src/index.css
- shot: gauntlet/shots-r4/r15-board.png ; gauntlet/shots-r4/r15-bar-xmind.png
- verdict: AI Expand outline secondary vs Export primary; bar A/B — original CTA hierarchy cleaner on light UI.
- commit: 8c355aa

## r16 — bar gap
- files: src/components/MindCanvas.tsx, src/index.css
- shot: gauntlet/shots-r4/r16-board.png
- verdict: Root capsule + limb cards tighter rx — dream-loop node silhouette; original still polished.
- commit: a6f496b

## r17 — fonts
- files: src/index.css
- shot: gauntlet/shots-r4/r17-board.png
- verdict: Shortcuts/kbd mono hierarchy denser; original chrome quieter.
- commit: 77a8882

## r18 — contrast
- files: src/index.css
- shot: gauntlet/shots-r4/r18-board.png
- verdict: Toast/save pill chalk contrast hold; closer to target flat chrome; original still softer.
- commit: 57f1a3e

## r19 — buttons
- files: src/index.css
- shot: gauntlet/shots-r4/r19-board.png
- verdict: Map-list cards square chalk + delete danger weight; original nav still cleaner.
- commit: 5427501

## r20 — bar gap
- files: src/index.css
- shot: gauntlet/shots-r4/r20-board.png ; gauntlet/shots-r4/r20-bar-xmind.png
- verdict: Final coherence vs dream-loop target + bar: candidate closer on chalkboard map craft; original still preferred for marketing photography. Honest: original wins unlabeled A/B overall.
- commit: b72d10a


## dream-loop
- baseline: `.dream-loop/baseline.png` (live core job board)
- target: `.dream-loop/target.png` (Higgsfield gpt_image_2_5 refine of baseline — exact UI screenshot, not concept art)
- closing rounds: r4 side-attach limbs, r6 flat chalk field (kill desk underlay), r8 port dots, r12 denser right-fan, r16 root/limb silhouette, r20 coherence
- critic: each of those rounds judged vs target.png AND live xmind.app bar
