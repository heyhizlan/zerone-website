# ZERONE — DESIGN SYSTEM

Read this before writing any markup. Everything below is already implemented in
`src/styles/`. **Do not invent new tokens, new colours, or new components** —
compose from what is here. If something genuinely does not exist, add it to your
own page stylesheet in `src/styles/pages/`, never to the shared files.

---

## 1. THE RULE THAT GOVERNS EVERYTHING

**Strictly monochrome.** Black, white, and the neutral grey ramp between them.
No colour anywhere in the UI — no accent hue, no tinted grey, no coloured
state. Colour enters the page **only** through product photography.

The second rule: **blur is a transition, never a resting state.** Everything
arrives out of a directional blur and settles razor-sharp. Nothing sits blurred.

---

## 2. THE LOOK — "instrument panel"

The site should read as a **technical readout of an object**, not as a styled
marketing page. Five devices carry that read. Use them constantly:

1. **Extreme type-scale contrast.** Enormous display type against 10–11px
   micro-caps. Deliberately little in between.
2. **Hairline grid + registration marks.** 1px rules, corner brackets,
   crosshairs, measurement ticks as page furniture.
3. **Micro-label rails.** Mono small-caps parked in corners, running up the
   page edge, tagged along section heads: `SEC-02 / RANGE`, `FIG. 03`,
   timestamps, serials, barcodes. Decorative data — it is what makes the page
   read *engineered* rather than *styled*.
4. **Numbered sections.** Every major section gets `01`, `02`, `03`…
5. **Isolated object on a graduated field.** Product on a radial sweep, never
   on a busy background.

---

## 3. TYPE

| Role | Family | Rules |
|---|---|---|
| Hero display, section numerals | **Michroma** (`--ff-display`) | ONE weight, no italic. Never below 24px. Never in a paragraph — it is very wide and very slow to read. |
| Working display / headings | **Saira** (`--ff-head`) | Variable 100–900 + true italic. The italic at 900 is the brand's signature gesture (it echoes the oblique ZERONE wordmark) — use it sparingly, for emphasis. |
| Body | **Figtree** (`--ff-body`) | All running copy. |
| Data, micro-labels, spec tables | **IBM Plex Mono** (`--ff-mono`) | Every label, serial, number, table. Always uppercase, always tracked. |

Classes: `.t-mega .t-display .t-h1 .t-h2 .t-h3 .t-lead .t-body .t-sm .t-label
.t-micro .t-mono .t-oblique`

**Michroma is extremely wide.** A long word in Michroma will overflow. Pair a
short word in Michroma with a long word in Saira oblique — that contrast is the
lockup. Test every display line at 360px viewport width.

---

## 4. COLOUR TOKENS

Surfaces darkest→lightest: `--c-black --c-void --c-carbon --c-graphite --c-steel --c-iron`
Ink: `--c-white --c-text --c-dim --c-mute --c-ghost`
Lines: `--c-line-faint --c-line-soft --c-line --c-line-hard`

Never hard-code a hex. Never introduce a hue.

---

## 5. GLASS — the HUD layer

`.glass` gives a frosted panel with a 1px specular top edge.

> **Critical:** glass only ever sits **over imagery or a gradient**. Frosted
> glass on flat black is just a grey box. If there is nothing behind it, use
> `.panel` instead.

Correct uses: the nav bar, a readout strip over the hero field, spec cards
floating over a product shot. Wrong use: a plain content card in the middle of a
black section.

---

## 6. MOTION

Add `data-anim="…"` to any element; an IntersectionObserver flips it to
visible. Add `data-stagger="80"` to a **parent** to cascade delays onto its
direct `[data-anim]` children.

| Value | Use |
|---|---|
| `rise` | default — up, out of blur |
| `slide-l` / `slide-r` | lateral entry |
| `velocity` | heavy horizontal smear. **Signature move — hero display type and the flagship plate only.** |
| `focus` | pure blur-to-sharp, no travel. Imagery. |
| `wipe` | hairline rules drawing themselves |
| `mask` | type revealed behind a moving edge |

Load-time (hero only, not scroll-driven): `.anim-hero .anim-smear .anim-plate`,
offset with inline `style="animation-delay:320ms"`.

Other hooks: `.blur-on-scroll` (blur scales with scroll velocity, media only —
never text), `data-parallax="0.06"`, `data-count-to="32"`, `.anim-drift`,
`.sweep`, `.hover-lift`.

Everything degrades: `prefers-reduced-motion` and no-JS both fall back to a
static, fully readable page. Never break that.

---

## 7. COMPONENTS AVAILABLE

`.nav .btn .btn--solid .btn--ghost .btn--sm .link-u .tag .tag--fill .tag--dot
.pcard .spec .stat .callout .dealer .marquee .footer .glass .panel`

Furniture: `.gridlines .rule .sec-head .marks .crosshair .side-rail .ticks
.barcode .grain`

**Section head pattern** — use on every major section:

```html
<div class="sec-head">
  <span class="sec-head__num">02</span>
  <div class="sec-head__meta">
    <h2 class="sec-head__title" id="s02">The range</h2>
    <p class="t-sm sec-head__sub">One line of context.</p>
  </div>
  <span class="t-micro sec-head__tag">SEC-02 / RANGE</span>
</div>
```

Layout: `.shell` (max-width + gutter), `.grid` (12 col → 6 at 860px → 4 at
560px), `.section .section--carbon .section--black`, `.stack .row .between .wrap`.

---

## 8. PAGE FILE FORMAT

Pages live in `src/pages/`. Each starts with a `@meta` block, then **body
content only** — no `<html>`, `<head>`, `<nav>` or `<footer>`; the build wraps
it.

```html
<!--@meta
{
  "title": "Page title | ZerOne",
  "desc":  "Meta description, ~155 chars.",
  "nav":   "products",
  "css":   "products.css"
}
-->
<section class="section">…</section>
```

- `nav` matches `data-nav="…"` in `src/partials/nav.html` and sets the active
  state automatically. Valid: `home products technology about dealers contact`.
- `css` is optional, resolves to `src/styles/pages/<file>`.
- Use `{{BASE}}` for **every** internal href and asset src — it resolves to
  `./` at the root and `../` inside `products/`. A hard-coded path will break
  the product pages.

Build: `node build.mjs` · Dev server: `npm run dev` → http://localhost:4321

---

## 9. CONTENT RULES

This is a **catalogue**, not a shop. There is no cart, no price, no stock, no
"add to basket", and **no vehicle fitment selector** — the client does not have
fitment data. Every product path ends the same way: **talk to a dealer.**

Use `Ask a dealer` / `Confirm fitment with your dealer` as the standing CTA.

Voice: technical, terse, confident. Engineering facts, not adjectives. Never
"unleash", "elevate", "revolutionary", "cutting-edge", "game-changing".
Write like a spec sheet that happens to have paragraphs.

**Only use verified facts** (below). Do not invent specifications, prices,
dates, awards, staff names, warranty terms, or customer numbers.

---

## 10. VERIFIED FACTS — the only content you may state

**Company:** ZerOne, operating as FT Innovative Sdn Bhd (636002-T). Established
automobile performance parts company based in Kuala Lumpur. Large office,
warehouse and distribution facility. Supplies only performance parts of the
highest quality; refuses second-hand, inferior or low-standard parts.

**Head office:** 2, Jalan PJS 11/18, Bandar Sunway, 46150 Petaling Jaya,
Selangor. +60 16-210 8271 · ftzerone@gmail.com · MON–SAT 09:30–19:00.

**SSR700 / SSR700 PLUS** — mono-tube; Hi/Lo height adjustable with body-shift;
32-step compression *and* rebound; larger piston diameter; carbon thread
casing; cold-coiled SAE9254 chromium alloy spring; ADFL. For aggressive
handling on street and track, sporty yet comfortable.

**ADFL (Active Damping Force Levelling)** — automatic variable valve control;
varies the valve using hydraulic oil pressure; automatically increases or
reduces damping force according to road conditions and driving style; improves
steering response, roadability and traction across any damping force range.
Engineered by Mr. Kichiro, technical engineer, Japan; tuned for Malaysian road
conditions.

**SSR550** — twin-tube; Hi/Lo height adjustable with body-shift; 24-step
damping; cold-coiled SAE9254 chromium alloy spring. Daily driving and
occasional track use.

**SSR500 PLUS** — adjustable rebound and compression; adjustable to driver
preference, vehicle setup, track and external conditions.

**Sport Absorber** — improves ride quality and handling without changing ride
height; compatible with stock / original / sport / lowering springs.

**Sport springs (Type S / Premium by TS)** — precision CNC-wound from high
tensile SAE9254 steel; Anti-Corrosion Coating (ACC).

**Accessories** — Pillow Ball Upper Mount, Suspension Mounting Kit.

**Safety Bar** — front strut bars and lower bars; improves handling and
stability; reduces body roll up to 40%; plug and play; lifetime warranty.

**Known applications** — Perodua Myvi, Axia, Kelisa · Proton Saga, Wira, Waja,
Gen2, Persona, Satria Neo, Inspira, Perdana · Toyota Vios · Honda Jazz GD, City
· Nissan Almera N17, Cefiro A32 · Kia Forte · Mitsubishi Lancer Evo 4/5/6 ·
BMW E60, E90.

**Dealer network (exact — do not alter):**

| State | Address | Phone |
|---|---|---|
| Selangor | 49, Jalan PJS 11/7, Bandar Sunway, 47500 Petaling Jaya | +603-5635 7762 · +6012-671 7121 |
| Kuala Lumpur | 142, Jalan Jejaka, Taman Maluri, 55100 Cheras | +603-9283 7121 · +6016-216 2047 |
| Perak | 3, Jalan Menglembu Jaya 2, Industri Menglembu Jaya, 31450 Ipoh | +605-555 2588 · +6016-555 2588 |
| Johor | 54, Jalan Bendehara 12, 81300 Skudai | +6018-299 4500 |
| Melaka | No. 75 & 77, Jalan Satu Krubong, Taman Satu Krubong, 75260 Melaka | +60111-942 7925 |
| Negeri Sembilan | Lot No. 8029, Jalan BBN 5/3A, Desa Jasmin, Bandar Baru Nilai, 71800 Nilai | +6017-692 7121 |

---

## 11. PRODUCT IMAGERY

Placeholder SVG technical renders live in `src/assets/products/`:
`coilover-ssr700.svg`, `coilover-ssr700-plus.svg`, `coilover-ssr550.svg`,
`coilover-ssr500-plus.svg`, `sport-absorber.svg`, `sport-spring.svg`,
`pillow-ball-mount.svg`, `safety-bar.svg`

Reference them with `<img src="{{BASE}}assets/products/…" alt="…" width="400"
height="900" loading="lazy">`. These are stand-ins for the client's real
photography and will be swapped later — so never depend on their internal
markup, only on the file path.

---

## 12. ACCESSIBILITY — non-negotiable

- One `<h1>` per page; heading levels never skip.
- Every section labelled: `aria-labelledby` pointing at its heading id.
- Decorative furniture (crosshairs, ticks, barcodes, gridlines, grain, the
  hero plate) gets `aria-hidden="true"`.
- `alt=""` on decorative images; real descriptions on product images.
- Body copy stays at `--c-text` or lighter on dark grounds. `--c-ghost` is for
  1px furniture only — never for text a user needs to read.
- Keyboard focus is visible everywhere (handled globally, do not override).
