# Integrity gate — Phase B4 (Brandon 2026-09-14)

Prior “20 rounds” are **unverified**. Re-run ALL ten apps. A round only COUNTS if every item below is true:

1. **Named focus** — fonts / contrast / buttons / bar gap (one primary focus)
2. **Files touched** — list real paths in the workbench
3. **Shot** — before OR after for that round; **every 5th round** also capture live original (bar A/B)
4. **Honest verdict** — one line vs original (no self-cheer scores)
5. **Separate git commit** — message `rN: <focus>` (NO twenty-in-one dumps)
6. **Visibility** — change spottable in ~3s OR mark `no-visual` with proof why skipped
7. Keep: locked identity, flat no-gradient, real data, job ≤3s obvious

## Workbench
`apps/<slug>/gauntlet/workbench-r4.md` — one section per round:
```
## rN — <focus>
- files: ...
- shot: gauntlet/shots-r4/rN-*.png
- verdict: ...
- commit: <sha>
```

## Status
`/workspace/build-games/gauntlet/status-<slug>-r4.json` with:
`roundsCounted`, `roundShas[]`, `shotCount`, `barShotRounds[]`, `honestNotes`, `demoUrl`

## Do not
- Batch r1–r20 in one commit
- Invent scores like 8.7
- Message Brandon
- Reseed identity unless IDENTITY says RESEED (keep Canary Clipboard / Fridge Magnet / Shop Chalk Map / others locked)

## Apps
youform, snappa, mixo, tody, xmind, zcal, lunatask, supernotes, teleprompter, milanote

## Also required (Brandon 2026-09-14 ~10:03pm PT)

### transitions.dev
Free recipes must be wired into **real product interactions** (not only present in CSS). Prefer: success-check, toast, error-state-shake, skeleton-reveal, texts-reveal, tabs-sliding, number-pop-in, checkbox-check, panel-reveal. No Pro login unless Brandon says. Log which recipes fire on which actions in workbench-r4.

### dream-loop (https://github.com/achimala/dream-loop)
Clone at `/workspace/build-games/dream-loop`. Read `SKILL.md` + Plus or Pro workflow as fits.
Per app:
1. Screenshot live demo core job screen → baseline
2. Generate a **target** UI screenshot (exact product frame, not concept art) into `apps/<slug>/.dream-loop/target.png` (gitignore `.dream-loop` if needed)
3. Spend several counted rN rounds closing live → target (composition, type, contrast, controls, materials)
4. Critic each of those rounds against **target.png** AND live original bar
5. Do not abandon integrity commit/shot rules while dream-looping
