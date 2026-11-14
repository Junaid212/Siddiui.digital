// Prerenders crawler-ready <head> metadata for the main static pages.
// No network / Supabase access: all copy comes from src/Data/pageSeo.js, the same
// module the React pages use at runtime. Does NOT modify dist/index.html (the Home
// page already carries the approved metadata from /index.html, and scripts/prerender-blogs.mjs
// uses dist/index.html as its template).
//
// Usage: node scripts/prerender-pages.mjs [distDir]   (default: ./dist)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGE_SEO, SITE_URL, DEFAULT_OG_IMAGE } from '../src/Data/pageSeo.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(process.argv[2] || path.join(projectRoot, 'dist'));
const baseFile = path.join(distDir, 'index.html');

if (!fs.existsSync(baseFile)) {
    console.error(`ERROR: ${baseFile} not found. Run "vite build" first.`);
    process.exit(1);
}

const baseHtml = fs.readFileSync(baseFile, 'utf8');

const esc = (str) => String(str)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Replace a tag that must already exist in the template (fail loudly otherwise).
function replaceTag(html, regex, replacement, label) {
    if (!regex.test(html)) throw new Error(`Template is missing ${label}`);
    return html.replace(regex, () => replacement);
}

function applyMeta(html, { title, description, url, image, ogType }) {
    const t = esc(title), d = esc(description), u = esc(url), i = esc(image);
    html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`, '<title>');
    html = replaceTag(html, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${d}" />`, 'meta description');
    html = replaceTag(html, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${u}" />`, 'canonical');
    html = replaceTag(html, /<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${ogType}" />`, 'og:type');
    html = replaceTag(html, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${u}" />`, 'og:url');
    html = replaceTag(html, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${t}" />`, 'og:title');
    html = replaceTag(html, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${d}" />`, 'og:description');
    html = replaceTag(html, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${i}" />`, 'og:image');
    html = replaceTag(html, /<meta\s+name=["']twitter:url["'][^>]*>/i, `<meta name="twitter:url" content="${u}" />`, 'twitter:url');
    html = replaceTag(html, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${t}" />`, 'twitter:title');
    html = replaceTag(html, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${d}" />`, 'twitter:description');
    html = replaceTag(html, /<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${i}" />`, 'twitter:image');
    return html;
}

const metaFor = (page) => ({
    title: page.title,
    description: page.description,
    url: `${SITE_URL}${page.path}`,
    image: page.image || DEFAULT_OG_IMAGE,
    ogType: page.ogType || 'website',
});

const written = [];   // every route folder this script creates (used by the safety check at the end)

function writePage(routePath, html) {
    written.push(routePath);
    const dir = path.join(distDir, ...routePath.split('/').filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

// 0. Sanity check: Home metadata in the built index.html must match the approved copy.
const home = PAGE_SEO.home;
if (!baseHtml.includes(`<title>${esc(home.title)}</title>`) || !baseHtml.includes(esc(home.description))) {
    console.error('ERROR: dist/index.html does not contain the approved Home title/description. Update /index.html.');
    process.exit(1);
}

// 1. The eight non-home main pages.
let count = 0;
for (const [key, page] of Object.entries(PAGE_SEO)) {
    if (key === 'home') continue;
    writePage(page.path, applyMeta(baseHtml, metaFor(page)));
    count++;
    console.log(`  ✓ ${page.path}`);
}

// 1b. Real app routes that are PARENTS of a prerendered page. Writing /publications/marketing-reclassified/
//     creates a /publications/ folder; nginx (try_files $uri $uri/ ...) answers a folder that has no
//     index.html with 403 instead of falling back to the app. So the parent route gets the normal app
//     shell too: React then renders the existing Publications page exactly as before.
//     Title/description mirror <HeadTitle> in src/Page/Book/index.jsx so the initial HTML equals what
//     React sets after load (no flicker, no drift). Not listed in sitemap.xml (unchanged scope).
const SHELL_ROUTES = [
    { path: '/publications', title: 'Siddiqui.Digital', description: PAGE_SEO.home.description },
];
for (const page of SHELL_ROUTES) {
    writePage(page.path, applyMeta(baseHtml, metaFor(page)));
    console.log(`  ✓ ${page.path} (app shell for an existing route)`);
}

// 2. Duplicate routes: static redirect stubs pointing to the preferred canonical page.
//    (The SPA also redirects client-side via <Navigate/>.) noindex avoids duplicate indexing.
const REDIRECTS = { '/framework': 'frameworks', '/blog': 'blog' };
for (const [from, key] of Object.entries(REDIRECTS)) {
    const target = PAGE_SEO[key];
    let html = applyMeta(baseHtml, metaFor(target));
    html = replaceTag(html, /<meta\s+name=["']robots["'][^>]*>/i,
        `<meta name="robots" content="noindex, follow" />\n        <meta http-equiv="refresh" content="0; url=${esc(target.path)}" />`, 'meta robots');
    writePage(from, html);
    console.log(`  ✓ ${from} -> ${target.path} (redirect stub)`);
}

// 3. SPA fallback for hosts that serve 404.html on unknown paths (e.g. GitHub Pages on a
//    custom domain). Serves the app shell so client-side routes still work; never indexed.
let notFound = baseHtml;
notFound = replaceTag(notFound, /<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex" />', 'meta robots');
notFound = notFound.replace(/\s*<link\s+rel=["']canonical["'][^>]*>/i, '');
fs.writeFileSync(path.join(distDir, '404.html'), notFound, 'utf8');
console.log('  ✓ 404.html (SPA fallback, noindex)');

// 4. Safety net: no folder created above may lack its own index.html (that is the nginx 403 trap).
const orphans = new Set();
for (const route of written) {
    const segs = route.split('/').filter(Boolean);
    for (let i = 1; i < segs.length; i++) {
        if (!fs.existsSync(path.join(distDir, ...segs.slice(0, i), 'index.html'))) orphans.add('/' + segs.slice(0, i).join('/'));
    }
}
if (orphans.size) {
    console.error(`ERROR: parent folder(s) without index.html would return 403 on nginx: ${[...orphans].join(', ')}. Add them to SHELL_ROUTES.`);
    process.exit(1);
}

console.log(`\nPrerendered ${count} static page metadata files (+ ${Object.keys(REDIRECTS).length} redirect stubs) in ${distDir}`);
