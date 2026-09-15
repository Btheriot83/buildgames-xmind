# Anti-slop guardrails (rebuilt 2026-09-14)

Prior version was a recycled checklist. This one is derived from:
- [AdrianKrebs/design-slop-cop](https://github.com/AdrianKrebs/design-slop-cop) (14 deterministic patterns + Show HN gallery)
- Sailop / Developers Digest / Booplex writeups on AI design fingerprints (2025–2026)
- Brandon: if you had read real X/designer tells, you would have seen the slop we shipped

**Starting score for every current Build Games app: ~3.8/10** until a harsh blind critic vs the live original says otherwise.

## Brandon hard fail (2026-09-14, Inkwell review — applies to ALL apps)
Gradients alone can fail an otherwise improved app. Soft body washes, radial vignettes, mesh fades, gradient-clipped headlines, and “premium” fade chrome read as AI slop even when data and UX are better. Prefer flat paper/ink fills and real photo textures. Same for glass blur and colored glow.

## Instant-fail cluster (any 4+ = heavy slop)
From design-slop-cop + 2026 fingerprint guides:

1. **Vibe purple** — indigo/violet CTAs, links, chips (`#6366f1`–`#8b5cf6` band)
2. **Gradients** — hero gradients, gradient-clipped headline text, blue→indigo
3. **Glassmorphism** — `backdrop-blur` frosted nav/cards (`bg-white/10` cluster)
4. **Colored glow** — saturated box-shadow glows on buttons/cards
5. **Inter / Geist / Space Grotesk default** — or the AI font duo (Space Grotesk + Instrument Serif)
6. **Templated display fonts as page default** — Space Grotesk, Instrument Serif, Geist, Syne, **Fraunces-as-everywhere** (Fraunces is fine as a *mark*, not the whole UI)
7. **Hero font gimmick** — one italic/colored word in an otherwise generic H1
8. **Centered Inter hero** — badge pill above H1 → subhead → dual CTAs
9. **3 identical icon cards** — emoji or lucide icons in a neat row
10. **Numbered 1·2·3 steps** marketing strip
11. **Fake stat banner** — “10K+ users · 99.9% · 4.9★”
12. **Headline badge** — floating pill above H1
13. **Emoji nav** — sidebar/nav prefixed with emoji
14. **Perma-dark + grey body** — dark theme with muted grey copy, all-caps labels
15. **Accent stripe cards** — 3–4px colored left border on every card
16. **shadcn fingerprint** — untouched default tokens, rounded-2xl everything
17. **FAQ accordion filler** on a tool that doesn’t need marketing FAQ
18. **Empty illustration blobs** — CSS blob / mesh gradient with no meaning

## Craft requirements (positive)
- One sharp core job done excellently (not feature soup)
- Real imagery (Grok Imagine / GenerateImage / photos) — not CSS blobs alone
- Type pairing with intent; hue outside the 200–290° AI band for accents
- Motion that serves the job (transitions.dev free recipes OK if not decorative spam)
- Mobbin comps opened for the category before claiming UI polish
- Blind A/B critic vs **live original** screenshots — builder never grades itself

## Scoring honesty
- Soft self-critique that lands 8–9/10 while the product looks “vibe-coded” is a fireable offense
- Critic starts every app at **3.8** baseline; must earn every tenth against the live original

## Brandon callout — 2026-09-14 (Inkwell / Supernotes)

**Gradients alone can fail an otherwise improved app.**

Even when job clarity, data, and craft get better, decorative chrome gradients (body washes, card washes, skeleton shimmer bands, tilt radial sheen) still read as AI-made. Hard rule for Build Games app chrome:

- Remove **all** decorative gradients from chrome
- Flat paper / solid fills / real photo textures only
- Keep functional hairlines (borders, focus rings)
- Instant-fail #2 (Gradients) is not optional polish — it can veto a ship by itself

