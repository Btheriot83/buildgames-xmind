# Lenny / Anshu — Copper Synapse (Xmind)

## 1. Discover
- Seed (never shown in UI): generated via `openssl rand -hex 24` → `1d8d8021da843f17b0d3e3fc3fc54fd668413eecbeeee77c`
- Direction briefs derived from seed hex chunks (`#1d8d80` teal, `#da843f` copper, `#e3fc3f` acid):
  1. **Copper Synapse** — charcoal drafting desk, copper root, teal living links (picked)
  2. Cartographer Night — parchment overlays, sepia ink (too quiet for canvas motion)
  3. Acid Circuit — lime-first HUD (too game-HUD / close to SaaS neon)
- Ambition: WebGL ink/grid shader + animated synapse dashes + transitions.dev microinteractions — not “clean modern SaaS”.

## 2. Define
- Implementer built React+Vite+IndexedDB editor.
- Independent critic reviewed **screenshots of live original** (`docs/original-xmind-*.png` from xmind.app / xmind.com/features) **and** live demo (`docs/live-smoke.png` from https://buildgames-xmind.vercel.app).
- Critic scores logged in `docs/CRITIC.md`.

## 3. Deliver
- Core loop: sample map → add child → connect/drag/resize → autosave IndexedDB → SVG/PNG/JSON export.
- Cut: multiplayer, AI, templates library, Gantt, Outliner, Zones (paid-product advantages per brief).
- transitions.dev free recipes in real UX: success-check, toast, skeleton-reveal, texts-reveal, error-state-shake, number-pop-in.
- Live demo: https://buildgames-xmind.vercel.app (App Desk smoke 2026-09-14 PT: add child + SVG export OK, HTTP 200).
