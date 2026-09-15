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
- commit: 80dc62a

## r5 — fonts
- files: src/index.css
- shot: gauntlet/shots-r4/r5-board.png ; gauntlet/shots-r4/r5-bar-xmind.png
- verdict: Brand/title type denser vs target; bar A/B — original marketing hero still outranks chalkboard chrome.
- commit: 798245d

## r6 — contrast
- files: src/index.css
- shot: gauntlet/shots-r4/r6-board.png
- verdict: Desk photo underlay killed — flat chalk board closer to dream-loop target; original still wins light map photography.
- commit: c0129d3

## r7 — buttons
- files: src/index.css
- shot: gauntlet/shots-r4/r7-board.png
- verdict: Job cluster square denser matching target chrome; original CTAs still cleaner on light UI.
- commit: 2061c4b

## r8 — bar gap
- files: src/components/MindCanvas.tsx, src/index.css
- shot: gauntlet/shots-r4/r8-board.png
- verdict: Chalk link ports on node edges — closer to dream-loop anchors; original still subtler.
- commit: fc09014

## r9 — fonts
- files: src/index.css
- shot: gauntlet/shots-r4/r9-board.png
- verdict: Limb mono 13px denser; root display holds — target type hierarchy closer; original still wins editorial type.
- commit: 6367ad2

