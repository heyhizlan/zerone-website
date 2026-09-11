# zerone-website

First-pass landing page for ZerOne Malaysia — "White Lab" direction. Frontend only (Vite, plain HTML/CSS/JS).

```bash
npm install
npm run dev      # local preview
npm run build    # production build → dist/
```

- `index.html` — page markup; brand logo symbols are inlined from `ZERONE 260909 Logo Masterfile/SVG`.
- `src/styles.css`, `src/main.js` — styles and interactions (scroll reveals, card spread, Signal Rail / Index Dial controls).
- `public/images/crops/` — **temporary** product imagery cropped from zerone.com.my banners (marked `data-temp` in the HTML). Replace with final renders.
- `public/brand/`, `public/favicon.svg` — optimised logo SVGs.
- `assets-source/` — original downloads the crops were made from (not served).
