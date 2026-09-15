# Gauntlet workbench R6 — Shop Chalk Map (10 integrity)

**Identity:** Shop Chalk Map (`docs/IDENTITY.md`) — LOCKED  
**Demo:** https://buildgames-xmind.vercel.app  
**Bar:** https://xmind.app/  
**Job ≤3s:** central topic → branch → connect → export  
**Gate:** docs/sop/INTEGRITY_GATE.md (paths: workbench-r6 / shots-r6)

## transitions.dev wiring (real actions)
| Recipe | Fires on |
|--------|----------|
| success-check | Export SVG/PNG/JSON (`flashSuccess`) |
| toast | Export ok/fail, AI/import messages |
| error-state-shake | Empty map title validation |
| skeleton-reveal | Boot LoadingShell → ready |
| texts-reveal | Brand + empty-state staggered lines |
| number-pop-in | Nodes/Links stats when counts change |
| panel-reveal | Outline dock open/close |

## dream-loop
- baseline: `.dream-loop/baseline.png`
- target: `.dream-loop/target.png`
- closing rounds: r4 / r6 / r8 / r10 vs target + live xmind.app


## r1 — fonts
- files: docs/IDENTITY.md,src/index.css,
- shot: gauntlet/shots-r6/r1-board.png
- verdict: Root/title/limb type denser and heavier vs R5 board; original still wins light editorial marketing type on white canvas.
- commit: 3961e3a

## r2 — contrast
- files: src/index.css,
- shot: gauntlet/shots-r6/r2-board.png
- verdict: Limb stroke and chalk labels hold harder on board tooth; original still brighter on white map photography.
- commit: 848464b

## r3 — buttons
- files: src/index.css,
- shot: gauntlet/shots-r6/r3-board.png
- verdict: Square chalk controls + Export copper primary with harder offset; original CTAs still quieter on light marketing UI.
- commit: 190c445

## r4 — bar gap
- files: src/components/MindCanvas.tsx,src/index.css,src/lib/sample.ts,
- shot: gauntlet/shots-r6/r4-board.png
- verdict: Denser right-fan + brighter ports + copper root pill close dream-loop/Xmind limb silhouette; original still wins soft editorial bezier photography.
- commit: fc05e0a

## r5 — fonts
- files: src/index.css,
- shot: gauntlet/shots-r6/r5-board.png ; gauntlet/shots-r6/r5-bar-xmind.png
- verdict: Job tape denser billboard + map-list weight; bar A/B — original marketing hero still outranks chalkboard chrome for photography.
- commit: 6a9c878

## r6 — contrast
- files: src/index.css,
- shot: gauntlet/shots-r6/r6-board.png
- verdict: Chalk photo tooth stronger + selection wash clearer vs target; original still preferred for light-map contrast theater.
- commit: 244f3b6

## r7 — buttons
- files: src/index.css,
- shot: gauntlet/shots-r6/r7-board.png
- verdict: Empty/job button family weights unified; danger quieter until hover; original still cleaner on light marketing CTAs.
- commit: ebb2960
