/* ==========================================================================
   ZERONE — BUILD
   Zero dependencies. Assembles src/pages/**.html into dist/ using a shared
   shell + partials, so nav and footer live in exactly one place.

     node build.mjs          build once
     node build.mjs --watch  rebuild on change
     node build.mjs --serve  build, watch, and serve dist/ on :4321
   ========================================================================== */
import { readFile, writeFile, mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT   = path.dirname(new URL(import.meta.url).pathname);
const SRC    = path.join(ROOT, 'src');
const PAGES  = path.join(SRC, 'pages');
const PARTS  = path.join(SRC, 'partials');
const DIST   = path.join(ROOT, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.json': 'application/json',
};

async function walk(dir, base = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(abs, rel));
    else out.push({ abs, rel });
  }
  return out;
}

/* Recursively resolve <!--@include partials/x.html--> */
async function resolveIncludes(html, depth = 0) {
  if (depth > 6) throw new Error('Include depth exceeded — circular include?');
  const re = /<!--@include\s+([^\s>]+?)\s*-->/g;
  const hits = [...html.matchAll(re)];
  for (const hit of hits) {
    const file = path.join(SRC, hit[1]);
    if (!existsSync(file)) throw new Error(`Missing include: ${hit[1]}`);
    const frag = await resolveIncludes(await readFile(file, 'utf8'), depth + 1);
    html = html.replace(hit[0], frag);
  }
  return html;
}

function parseMeta(raw) {
  const m = raw.match(/<!--@meta([\s\S]*?)-->/);
  if (!m) return { meta: {}, body: raw };
  let meta;
  try { meta = JSON.parse(m[1].trim()); }
  catch (e) { throw new Error(`Bad @meta JSON: ${e.message}`); }
  return { meta, body: raw.replace(m[0], '').trim() };
}

function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ''));
}

async function buildPages() {
  const shell = await readFile(path.join(PARTS, 'shell.html'), 'utf8');
  const files = (await walk(PAGES)).filter(f => f.rel.endsWith('.html'));
  let count = 0;

  for (const f of files) {
    const raw = await readFile(f.abs, 'utf8');
    const { meta, body } = parseMeta(raw);
    const depth = f.rel.split(path.sep).length - 1;
    const base = depth ? '../'.repeat(depth) : './';

    let html = fill(shell, {
      TITLE:   meta.title || 'ZerOne — Performance Adjustable',
      DESC:    meta.desc  || 'ZerOne — automobile performance suspension. Adjustable coilovers, sport absorbers, sport springs.',
      BODY:    body,
      BASE:    base,
      PAGECSS: meta.css ? `<link rel="stylesheet" href="${base}styles/pages/${meta.css}">` : '',
      BODYCLASS: meta.bodyClass || '',
    });

    html = await resolveIncludes(html);
    html = fill(html, { BASE: base });                     // includes may use {{BASE}}

    // Mark the active nav item
    if (meta.nav) {
      html = html.replace(
        new RegExp(`(<a\\b[^>]*data-nav="${meta.nav}")`, 'g'),
        '$1 aria-current="page"'
      );
    }

    const outPath = path.join(DIST, f.rel);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, 'utf8');
    count++;
  }
  return count;
}

async function copyStatic() {
  for (const dir of ['styles', 'scripts', 'assets']) {
    const from = path.join(SRC, dir);
    if (!existsSync(from)) continue;
    for (const f of await walk(from)) {
      const to = path.join(DIST, dir, f.rel);
      await mkdir(path.dirname(to), { recursive: true });
      await copyFile(f.abs, to);
    }
  }
}

async function build() {
  const t0 = Date.now();
  await mkdir(DIST, { recursive: true });
  const n = await buildPages();
  await copyStatic();
  console.log(`✓ built ${n} page${n === 1 ? '' : 's'} → dist/  (${Date.now() - t0}ms)`);
}

async function serve(port = 4321) {
  createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      if (!path.extname(p)) p += '.html';
      const file = path.join(DIST, p);
      if (!file.startsWith(DIST)) { res.writeHead(403).end('Forbidden'); return; }
      const buf = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html' }).end('<h1>404</h1>');
    }
  }).listen(port, () => console.log(`→ http://localhost:${port}`));
}

const args = process.argv.slice(2);
await build();

if (args.includes('--watch') || args.includes('--serve')) {
  let timer = null;
  watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch(e => console.error('✗', e.message)), 90);
  });
  console.log('… watching src/');
  if (args.includes('--serve')) await serve();
}
