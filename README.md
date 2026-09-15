# Copper Synapse — Xmind replacement

Local-first browser mind mapping. Drag, resize, connect, keyboard shortcuts, **AI Expand** / outline→map, autosave to IndexedDB, export **SVG / PNG / JSON**.

**Live demo:** https://buildgames-xmind.vercel.app

**Aesthetic:** Copper Synapse (charcoal drafting desk + oxidized copper nodes + teal synapse links + acid lime stats). No accounts, ads, telemetry, or purple SaaS chrome.

Motion recipes from [transitions.dev](https://transitions.dev/) (free): success-check on export, skeleton reveal on boot, texts-reveal on brand/empty, error shake on empty title, toast confirmations, number-pop-in for node/depth/link counts.

## One command

```bash
npm install && npm run dev
```

Open the printed local URL (Vite default `http://localhost:5173`).

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm test` | Vitest unit + Playwright e2e smoke |
| `npm run test:unit` | Vitest only |
| `npm run test:e2e` | Playwright only (expects `npm run build` first for preview) |
| `npm run build` | Production build to `dist/` |
| `npm start` / `npm run preview` | Serve production build locally |

## Architecture

```
src/
  components/     # Canvas, toolbar, sidebar, toast, shader, overlays
  lib/            # Model, IndexedDB, sample data, SVG/PNG export
  store/          # Zustand map store + autosave
  styles/         # Extracted transitions.dev CSS
  transitions/    # Upstream recipe markdown (source of truth for motion)
```

- **Canvas:** SVG world with pan/zoom, node drag, corner resize, link handles, animated dashed synapse edges.
- **Persistence:** IndexedDB database `copper-synapse-xmind`.
- **Import/export:** Portable `.json` plus SVG/PNG downloads so you are never trapped.
- **Gamification:** live node count, map depth, and link count with number-pop-in.

## Permissions

- No camera, mic, or geo.
- File picker for JSON import.
- Downloads for exports.
- IndexedDB for autosave (degraded banner if unavailable).

## Data location & backup

- Browser IndexedDB: `copper-synapse-xmind` → `maps`, `meta`.
- Cleared when you wipe site data for this origin.
- Backup: toolbar **JSON**. Restore: **Import**.

## Environment

```bash
cp .env.example .env
```

Server AI (optional): set `BUILD_GAMES_LLM_API_KEY` (or `XAI_API_KEY` / `OPENAI_API_KEY`) on Vercel for `/api/ai`. Locally run `npm run ai:dev` alongside Vite (proxied). App remains useful without a key for outline parse + core map loop.

Optional `VITE_APP_TITLE`.

## Limitations vs paid Xmind

Deliberately excluded: multiplayer cursors/comments, large template libraries, high-fidelity proprietary import/export, Gantt/Zones. This ships the personal core loop + AI expand/outline only.

## Vercel

Static Vite app: framework preset **Vite**, build `npm run build`, output `dist`. No server env vars required. IndexedDB is client-local only.

## Design notes (Lenny)

- Seed-derived **Copper Synapse** palette (never shown in UI).
- WebGL ink/grid shader backdrop + pulsing connection dashes.
- Anti-slop: no vibe-purple, no Inter, no 3-card marketing grid, no fake stats.
