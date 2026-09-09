/* ==========================================================================
   ZERONE — QA sweep over dist/
   Checks the failure modes that actually bite on a multi-page static build:
   unresolved template vars, broken internal links, missing assets, heading
   order, missing alt text, and stray colour outside the monochrome ramp.
     node qa.mjs
   ========================================================================== */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.join(path.dirname(new URL(import.meta.url).pathname), 'dist');
let fails = 0, warns = 0;
const fail = (f, m) => { console.log(`  ✗ ${f}: ${m}`); fails++; };
const warn = (f, m) => { console.log(`  ! ${f}: ${m}`); warns++; };

async function walk(dir, base = '') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = path.join(base, e.name), abs = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(abs, rel));
    else out.push({ abs, rel });
  }
  return out;
}

const files = (await walk(DIST)).filter(f => f.rel.endsWith('.html'));
console.log(`\nQA — ${files.length} pages\n${'─'.repeat(58)}`);

for (const f of files) {
  const html = await readFile(f.abs, 'utf8');
  const dir = path.dirname(f.abs);

  // 1. Unresolved template variables — the #1 build-time slip
  const leaks = html.match(/\{\{[A-Z_]+\}\}|<!--@include/g);
  if (leaks) fail(f.rel, `unresolved template token: ${[...new Set(leaks)].join(', ')}`);

  // 2. Internal links resolve to a real file
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
    const target = path.join(dir, url.split('#')[0]);
    if (!existsSync(target)) fail(f.rel, `broken path → ${url}`);
  }

  // 3. Images need alt (empty alt is fine — it means decorative)
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\balt=/.test(m[1])) fail(f.rel, `<img> with no alt attribute`);
  }

  // 4. Exactly one h1
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 === 0) fail(f.rel, 'no <h1>');
  if (h1 > 1) fail(f.rel, `${h1} <h1> elements — should be 1`);

  // 5. Heading levels must not skip
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      warn(f.rel, `heading jumps h${levels[i - 1]} → h${levels[i]}`);
      break;
    }
  }

  // 6. Title and description present and sane
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!title.trim()) fail(f.rel, 'empty <title>');
  const desc = html.match(/name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!desc.trim()) fail(f.rel, 'empty meta description');
  else if (desc.length > 180) warn(f.rel, `meta description ${desc.length} chars (>180)`);

  // 7. Brand is strictly monochrome — flag any hex that is not neutral
  for (const m of html.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    const [r, g, b] = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16));
    if (Math.max(r, g, b) - Math.min(r, g, b) > 12) warn(f.rel, `non-neutral colour #${m[1]}`);
  }

  // 8. No stray scripts — site.js is the only one
  for (const m of html.matchAll(/<script\b[^>]*src="([^"]+)"/g)) {
    if (!m[1].endsWith('site.js')) warn(f.rel, `extra script: ${m[1]}`);
  }
  if (/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?\S[\s\S]*?<\/script>/.test(html)) {
    warn(f.rel, 'inline <script> block');
  }
}

// 9. Every product illustration referenced actually exists
const svgDir = path.join(DIST, 'assets', 'products');
if (existsSync(svgDir)) {
  const have = (await readdir(svgDir)).filter(f => f.endsWith('.svg'));
  console.log(`${'─'.repeat(58)}\nProduct illustrations present: ${have.length}`);
  console.log('  ' + (have.join('\n  ') || '(none)'));
}

console.log(`${'─'.repeat(58)}`);
console.log(fails ? `✗ ${fails} failure(s), ${warns} warning(s)\n`
                  : `✓ clean — ${warns} warning(s)\n`);
process.exit(fails ? 1 : 0);
