# Lenny / Anshu process — Build Games SOP (Phase A)

> This file is **Phase A** of `/workspace/build-games/PIPELINE.md`.  
> Run **once** per app to lock identity. Then run five Shumer gauntlets (Phase B).  
> Do **not** re-execute all eight techniques at the start of every gauntlet round.

# Lenny / Anshu process — Build Games SOP

Source: https://www.lennysnewsletter.com/p/how-to-turn-your-ai-into-a-world (Anshu Chimala via Lenny)

Lenny’s published technique list is **eight** (not optional asides). Every Build Games app must execute **all eight** and prove it with artifacts. Prior thin `LENNY.md` files do not count.

**Brandon:** lessons must encompass every technique — no skipping video, AI-tell removal, or hand copy.

---

## Honest baseline
If you only generated a hex seed, named three aesthetics, and self-scored — you did **not** follow the guide. Restart.

---

## Discover — explore beyond average slop

### Technique 1 — Seed strings (required)
1. `openssl rand -hex 32` (or equivalent shell random string).
2. Derive color, layout, type, motion from subpatterns in the string.
3. Never reveal the seed in the UI.
4. Produce **2–3 bold direction briefs**; pick the ambitious one that still serves the core job.

### Technique 2 — Ambitious prompts + human taste (required)
1. Ask AI for a *broad* list of short, high-level design-language ideas (inspire imagination only).
2. **You (the lead) visualize favorites** and write sensory feel notes — what is tacky, what to avoid, what texture/material lands.
3. Sharpen one direction with taste; then write the build brief.
4. Prefer ideas that feel slightly “this might not work.”
5. Save discarded directions + why.

**Discover artifact:** `docs/DISCOVER.md`  
Must include: seed, idea list, feel notes, 2–3 briefs, pick + why.

---

## Define — give the design an identity

### Technique 3 — Critic subagent loops (required)
- Builder implements; **separate fresh-context critic** sees **screenshots only** (no code, no builder history).
- Critic prompt every round:
  - Name the aesthetic
  - Imagine how a top design studio would execute it
  - Outline the biggest gaps (composition + fine detail)
  - Penalize overdone / obviously AI-generated patterns
  - Score /10 vs that studio bar (do not tell critic the stop threshold)
- Prefer objective ranking: Mobbin/professional comps + our shot, unlabeled when possible.
- Loop until critic independently hits ≥9/10 or two tight iterations stop converging — **builder never self-grades**.

### Technique 4 — Image generation (required)
- Use GenerateImage / Grok Imagine / image API for personality: empty states, textures, marks, hero art, materials.
- Combine with shaders/3D when it helps.
- **CSS blobs / gradients alone = fail Technique 4.**
- Verify in the browser frame-by-frame.
- Do not commit API keys; use box secret / `.env` gitignored.

### Technique 5 — Video generation / advanced motion (required)
- Add at least one real motion craft beat that elevates the core job:
  - Looping generated clip with solid/matted background layered in UI, **or**
  - Keyframe→video transitions between product states (play on action or scrub on gesture)
- Prefer fal.ai / available video tooling when keyed; otherwise use strongest available path (generated still sequences + CSS/WebGL interpolation is a degraded fallback — document it).
- `transitions.dev` free recipes are a **supplement**, not a substitute for Technique 5 imagery/video craft.

**Also required:** Mobbin comps for the category opened and cited in Define.

**Define artifact:** `docs/DEFINE.md`  
Must include: critic round log + screenshot paths, image asset list, video/motion asset + how it’s used, Mobbin links.

---

## Deliver — polish into something users love

### Technique 6 — Cut elements that don’t add value (required)
AI adds; Apple restraint subtracts. Explicitly remove:
- Glows, gradients-as-decoration, unnecessary containers
- Extra labels when the visual already communicates
- Custom controls that look worse than simple/native
- Anything that doesn’t serve the **one** core job

### Technique 7 — Remove AI tells (required)
Run `/workspace/build-games/ANTI_SLOP.md` (design-slop-cop + fingerprint guides) as a kill list:
- Vibe purple, Inter/Geist defaults, glassmorphism cluster, fake stats, 3-card grids, headline badges, emoji nav, Fraunces-everywhere, shadcn fingerprint, etc.
- Zero instant-fail cluster remaining before calling Deliver done.

### Technique 8 — Rewrite important copy by hand (required)
- Do **not** ship first-pass LLM marketing voice.
- Lead agent (or a fresh copy pass) rewrites: product name line, empty states, primary CTA, error copy, onboarding one-liners.
- Voice must match the chosen aesthetic; short, specific, human.
- Log before→after in Deliver artifact.

**Deliver artifact:** `docs/DELIVER.md`  
Must include: cut list, anti-slop checklist cleared, copy before/after for key strings.

---

## Stage checklist (all must be true)
| # | Technique | Stage | Done when |
|---|-----------|-------|-----------|
| 1 | Seed strings | Discover | Seed + briefs in DISCOVER.md |
| 2 | Ambitious + taste | Discover | Feel notes + steered brief |
| 3 | Critic subagents | Define | Fresh screenshot critic ≥9 or converged; screenshots saved |
| 4 | Image generation | Define | Real generated images in UI (not CSS-only) |
| 5 | Video / advanced motion | Define | Video or documented keyframe motion craft in core job |
| 6 | Cut | Deliver | Explicit removals listed |
| 7 | Remove AI tells | Deliver | ANTI_SLOP cleared |
| 8 | Hand-rewritten copy | Deliver | Key strings rewritten + logged |

---

## Contest plumbing
- Public demo Vercel + public GitHub `Btheriot83`
- Commits inside Build Games window
- 5 Shumer gauntlet rounds (`GAUNTLET_SOP.md`) on top of this process
- Review gate: live URL, smoke, harsh critic vs **live original**, real AI API when keyed

## Status JSON fields
`techniquesDone: [1,2,3,4,5,6,7,8]`, `lennyDiscoverPath`, `lennyDefinePath`, `lennyDeliverPath`, `imagesGenerated`, `videoOrMotionPath`, `criticFreshContext: true`, `copyHandRewritten: true`
