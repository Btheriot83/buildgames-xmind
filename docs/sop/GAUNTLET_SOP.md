# Build Games — Matt Shumer Gauntlet Loop SOP

> **Read `/workspace/build-games/PIPELINE.md` first.**  
> Phase A = full Anshu eight techniques **once**.  
> Phase B = this gauntlet file = **5 rounds** improving execution vs the live original **without** reseeding the design.


Sources:
- https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md
- https://somethingbig.ai/gauntlet-loop

## Brandon order (2026-09-14)
- Prior critic scores (~8.8) are nonsense → treat as **~3.8**
- Goal is to **win**, not ship fast
- Run **5 gauntlet loops** on each of the 10 apps
- Obsess UI/UX, one thing done excellently
- Infuse AI / agent via OAuth or API where it strengthens the product
- Use Grok Images / Imagine for real assets
- Use Mobbin MCP for comps
- Real anti-slop from design-slop-cop + designer tells

## Method (non-negotiable)
1. Goal + concrete bar (live original product screenshots / Mobbin category comps)
2. Lead agent decomposes into smallest independently improvable pieces
3. Each piece: **builder** + **separate fresh-context critic**
4. Critic inspects **real pixels** (screenshots of live demo), blind A/B vs bar when possible
5. If original wins → name biggest gap → builder fixes → loop again
6. Builder never grades itself; no “9/10 ready” from implementer
7. Maintain `gauntlet/workbench.md` with screenshots + verdicts each round
8. After each major wave: one smoothing agent for coherence

## Brandon-mandated loop count
Run **exactly 5 full gauntlet rounds** per app (round = decompose → build pieces → harsh critics → merge → redeploy → smoke). More if still losing blind A/B after 5 and compute remains.

## AI / agent infusion
Each app must gain one *real* AI or agent capability that serves the core job, preferably via API key in `.env` (document `.env.example`). Prefer xAI/Grok if available, else OpenAI-compatible. OAuth only when it unlocks a real calendar/docs/etc. Do not fake AI with canned strings.

## Tools
- Mobbin MCP: `search_screens`, `search_flows`, `search_sections`
- GenerateImage / Grok Imagine for hero, empty states, textures, icons
- Live original URL as primary bar
- `design-slop-cop` patterns in ANTI_SLOP.md

## Status
Write `/workspace/build-games/gauntlet/status-<slug>.json` after each round and final.

## Anshu enforcement
Every gauntlet round must include real Discover feel briefs, fresh-context screenshot critic, GenerateImage assets, and Deliver cuts. See LENNY_SOP.md rebuilt 2026-09-14.

## Anshu eight techniques
Every gauntlet must complete Techniques 1–8 in LENNY_SOP.md (Lenny lists eight). Technique 5 (video/motion) and 7–8 (AI tells + hand copy) are mandatory, not optional.

## Phase B only (do not re-Anshu)
Gauntlet rounds improve a **locked** identity from Phase A. Never re-run Techniques 1–2 as a full Discover. See PIPELINE.md.
