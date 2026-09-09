# ZerOne — website

Static catalogue site for ZerOne (zerone.com.my), Malaysian performance
suspension. **No runtime dependencies, no framework, no build-time npm
packages.** Plain HTML, CSS and vanilla JS, assembled by a ~140-line Node
script so the nav and footer live in exactly one place.

---

## Run it

```bash
npm run dev      # build + watch + serve → http://localhost:4321
npm run build    # one-off build into dist/
npm run watch    # build + watch, no server
```

Node 18+ is the only requirement. `npm install` is optional — it installs
Playwright, which is used for screenshot checks during development, and the
Fontsource packages the web fonts were originally copied from. Neither is
needed to build or to run the site; the fonts are committed under
`src/assets/fonts/`.

## Deploy

`dist/` is a plain static folder. Drop it on Netlify, Vercel, Cloudflare
Pages, GitHub Pages, or any web host.

- Build command: `npm run build`
- Publish directory: `dist`

---

## Layout

```
src/
├─ pages/            one file per page — body content only
│  └─ products/      product detail pages
├─ partials/         shell.html, nav.html, footer.html
├─ styles/
│  ├─ tokens.css     design tokens — start here
│  ├─ fonts.css      self-hosted @font-face
│  ├─ base.css       reset, typography, grid, furniture
│  ├─ components.css nav, cards, tables, buttons…
│  ├─ motion.css     the reveal / blur system
│  └─ pages/         per-page stylesheets
├─ scripts/site.js   the entire runtime, ~250 lines
└─ assets/           logo, fonts, product illustrations
build.mjs            the build
DESIGN-SYSTEM.md     read this before editing anything
```

### Adding a page

Create `src/pages/whatever.html`:

```html
<!--@meta
{ "title": "Title | ZerOne", "desc": "…", "nav": "products", "css": "whatever.css" }
-->
<section class="section">…</section>
```

Body content only — the build wraps it. Use `{{BASE}}` on every internal link
and asset path so pages nested in `products/` resolve correctly.

---

## Things the client still needs to supply

1. **Product photography.** Everything in `src/assets/products/` is a
   placeholder SVG technical render. Swap the files, keep the filenames, and
   nothing else needs to change. Shoot against a dark graduated sweep to match
   the layouts.
2. **A contact form endpoint.** `contact.html` has no backend — the form posts
   to `#`. Wire Formspree, Netlify Forms, or a mail handler on deployment.
3. **A real company email.** The site currently shows `ftzerone@gmail.com`
   because that is what the live site publishes. `@zerone.com.my` would be
   better.
4. **Fitment data**, if it ever exists. There is deliberately no vehicle
   selector — every product route ends at "ask a dealer" instead.
5. **Decisions on the sister brand.** `zeronesafetybar.com` is a separate
   domain splitting the same brand's search presence. Safety Bar is listed
   here as a product line; consolidating or clearly linking the two is a
   business decision, not a build one.

## Known gaps

- Copy is written from the live site's verified content plus published
  product specifications. Anything unverifiable is marked "confirm with
  dealer" rather than invented — those should be filled in by ZerOne.
- The logo masterfile's PNG export (`ZERONE 260909 Logo Masterfile/PNG/`)
  shipped blank — a solid white raster with no artwork. A corrected export
  sits at `src/assets/logo/zerone-lockup-white@4x.png`. The source `.ai`,
  `.svg` and `.eps` are fine.
- Only the white lockup exists. A mark-only, stacked, and black version will
  be needed for real-world use.
