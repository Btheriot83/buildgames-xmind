# Build Games design pipeline (makes sense)

Two phases. Do not blend them into mush.

```
Phase A — Anshu / Lenny (ONCE per app)
  Techniques 1→8 end-to-end
  Lock the design identity
        ↓
Phase B — Shumer Gauntlet (5 rounds)
  Improve execution vs live original
  Do NOT re-roll seed / new aesthetic / new world
```

Why: Anshu’s eight techniques *create* a distinctive design. Gauntlet’s job is to make that design **win a blind A/B against the paid original**. Re-running Discover (seed + new briefs) every gauntlet round would produce five different apps, not five improvements.

---

## Phase A — Anshu foundation (exactly once)

Follow `/workspace/build-games/LENNY_SOP.md` fully:

| # | Technique | Role |
|---|-----------|------|
| 1 | Seed strings | Inject variety |
| 2 | Ambitious + taste | Steer feel; write brief |
| 3 | Fresh screenshot critic | Push to studio bar for *this* aesthetic |
| 4 | Image / Imagine | Real assets into the UI |
| 5 | Video / advanced motion | One craft motion beat for the core job |
| 6 | Cut | First subtractive pass |
| 7 | Remove AI tells | ANTI_SLOP clear |
| 8 | Hand-rewrite copy | Voice locked |

**Exit criteria for Phase A**
- `docs/DISCOVER.md`, `docs/DEFINE.md`, `docs/DELIVER.md` exist
- Aesthetic name + feel statement frozen in `docs/IDENTITY.md` (one page: palette, type, materials, motion rules, copy voice, what we will NOT change)
- Live demo redeployed with Phase A work
- **Visibility:** a human who saw the pre-pass demo can spot the delta in ≤3 seconds (else Phase A fails)
- `techniquesDone: [1,2,3,4,5,6,7,8]` for Phase A only

After Phase A, **do not** generate a new seed or pick a new aesthetic unless Brandon orders a full redesign.

---

## Phase B — Shumer Gauntlet (exactly 5 rounds)

Follow `/workspace/build-games/GAUNTLET_SOP.md`.

Each round:
1. Screenshot live original + our live demo (+ Mobbin comps as moodboard, not a new brand)
2. Lead splits into **smallest execution pieces** under the **locked IDENTITY** (e.g. empty state, core interaction density, hierarchy, AI feature quality, motion timing, anti-slop residue)
3. Builder + **separate** fresh-context critic per piece
4. Critic blind A/B vs original: if original wins, name biggest gap; builder fixes **within identity**
5. Redeploy, smoke, update `gauntlet/workbench.md`

### What may recur inside gauntlet rounds
- **Execution critic** (Anshu Tech 3 *style*: screenshots only, harsh) — yes, every piece
- **Cut** (Tech 6) — yes, when critic says chrome is noise
- **AI-tell kill** (Tech 7) — yes, if a tell reappears
- Light **copy tighten** (Tech 8) — yes, only to fix critic-named gaps; not a full voice rewrite

### What must NOT recur each gauntlet round
- New seed / new direction briefs (Tech 1–2)
- New aesthetic identity or “feel like a different product”
- Regenerating the whole image system from scratch (Tech 4) unless critic names a specific missing asset
- Replacing the motion language wholesale (Tech 5) unless critic names a specific gap

### Round goal
Close the largest remaining gap so a harsh blind critic is *closer* to picking us over the original — without becoming a different app.

**Hard gate:** if a human cannot spot the round’s delta in 3 seconds vs the pre-pass live demo, that Phase B round fails (docs-only / opacity tweaks = fail).

---

## Status shape
```json
{
  "phaseA": { "done": true, "techniquesDone": [1,2,3,4,5,6,7,8], "identityPath": "docs/IDENTITY.md" },
  "phaseB": { "roundsCompleted": 0, "roundsTarget": 5, "workbench": "gauntlet/workbench.md" }
}
```

Write to `/workspace/build-games/gauntlet/status-<slug>.json`.

## Visibility gate (Brandon 2026-09-14)
A Phase A or Phase B pass **fails** if a human who saw the previous live demo cannot spot the change in ~3 seconds.

Docs, IDENTITY.md, hand-copy tables, and +3% CSS do not count.
Required proof: before/after screenshots in `gauntlet/VISIBLE_DELTA.md` with 5 bullets of *visible* deltas (layout, type scale, materials, stage chrome, imagery).

## Phase B2 — ten more gauntlet rounds (Brandon 2026-09-14 ~9:12pm PT)
All ten apps: improved but not there. Visible mistakes remain; product job not super obvious.

Per app, run **10 more** Shumer rounds under locked IDENTITY (no reseed):
1. Fix visible mistakes (layout bugs, overflow, wrong contrast, broken empty states, fake chrome)
2. Make **what the product does** unmistakable in ≤3 seconds (hero verb, primary CTA, sample that demonstrates the job)
3. Replace placeholder / SAMPLE / lorem data with **real-looking** content (believable names, addresses, diesel/AZ/ops flavor where natural — no "Sample Form 1")
4. Keep visibility gate: each round must leave a spottable delta or an explicit "no visual change needed" with proof
5. Workbench: `gauntlet/workbench-r2.md`; status: `/workspace/build-games/gauntlet/status-<slug>-r2.json`

After all ten finish R2: record a walkthrough video per app (core loop, real data, ≤60–90s), then Brandon narrows.

## Identity triage (Brandon 2026-09-14 ~9:14pm PT)
He allowed selective reseed; App Desk decides.

**KEEP (locked identity, R2 clarity + real data only):**
- MileCue / Roadside Dispatch
- Hot Metal Press / Quoin Lock
- Forge Ink / Night Press
- Sundial / Courtyard Meridian
- Tideglass / Harbor Desk
- Draftwall / Atelier Pinwall
- Inkwell / Index Drawer

**RESEED (new Phase A identity, then 10 R2 rounds):**
- Ember Forms — blotter letter fights “form builder”
- Tileboard — bathhouse fights “household chores”
- Copper Synapse — abstract synapse fights “mind map”


## Phase B3 — twenty more gauntlet rounds (Brandon 2026-09-14 ~9:32pm PT)
Getting better, still missing craft details. Fonts bad; colors wash each other out; buttons poorly chosen. Compare closely to live originals — MileCue/teleprompter specifically not close or better.

Per app, **20 more** Shumer rounds under locked identity (keep Fridge Magnet / Shop Chalk Map / Ember’s new identity):
1. Side-by-side vs live original every few rounds (screenshots of original required)
2. Fix type: readable hierarchy, no AI font tells, contrast that holds
3. Fix color: no washed pairs; primary/secondary buttons earn their weight
4. Keep flat no-gradient bar + real data + job ≤3s obvious
5. workbench: `gauntlet/workbench-r3.md`; status: `/workspace/build-games/gauntlet/status-<slug>-r3.json`

Videos after all ten finish B3.

## Phase B4 — integrity re-run ALL ten (Brandon 2026-09-14 ~9:55pm PT)
Prior R3 round counts unverified (batched commits, thin shots, self-scores). Re-run all ten under `gauntlet/INTEGRITY_GATE.md`. Videos paused until B4 holds.
