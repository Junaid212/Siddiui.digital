// Generates the prerendered, crawler-ready HTML page for every PUBLIC blog article:  <dist>/blogs/<slug>/index.html
//
// Every tag (title, description, canonical, Open Graph, Twitter) comes from scripts/lib/blogPrerenderCore.cjs, the
// same renderer the admin server uses to refresh a single page right after an article is saved.
//
//  - The image is the one SAVED on the article row: social_image_url -> image_url -> website default.
//    Nothing is ever built from a slug or a guessed file name.
//  - "Public" means exactly what the website means: published, or scheduled with a date that has passed.
//  - Real image sizes are read from the image files (og:image:width/height).
//  - Every file is read back and verified after it is written; the script exits non-zero if any page failed.
//
// Usage:
//   node scripts/prerender-blogs.mjs                         # normal build step: writes into ./dist
//   node scripts/prerender-blogs.mjs --dist /var/www/frontend --prune   # regenerate the LIVE folder without a rebuild
//   node scripts/prerender-blogs.mjs --dry-run               # show what would change, write nothing
//   node scripts/prerender-blogs.mjs --slug my-article       # one article only
//   (--dist can also be set with PRERENDER_DIST_DIR)

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const core = require('./lib/blogPrerenderCore.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ── arguments ───────────────────────────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const distDir = path.resolve(option('--dist') || process.env.PRERENDER_DIST_DIR || path.join(projectRoot, 'dist'));
const DRY_RUN = flag('--dry-run');
const PRUNE = flag('--prune');
const ONLY_SLUG = option('--slug');

// Helper to safely load env variables without exposing secrets
function loadEnv() {
    const envVars = {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    };

    const envFiles = ['.env.production', '.env.local', '.env'];
    for (const file of envFiles) {
        const fullPath = path.join(projectRoot, file);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            content.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                    const idx = trimmed.indexOf('=');
                    const key = trimmed.substring(0, idx).trim();
                    const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
                    if (!envVars[key]) {
                        envVars[key] = val;
                    }
                }
            });
        }
    }

    return envVars;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: Missing required VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment or .env files.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
});

const FIELDS = 'id, title, slug, summary, standfirst, seo_title, seo_description, published_date, status, scheduled_for, image_url, social_image_url';

function writeVerified(file, html, article, opts) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, html, 'utf8');
    fs.renameSync(tmp, file);
    const back = fs.readFileSync(file, 'utf8');
    if (back !== html) throw new Error('file on disk does not match what was written');
    const problems = core.verifyRendered(back, article, opts);
    if (problems.length) throw new Error(`written page failed verification (${problems.join(', ')})`);
}

async function mapPool(items, limit, fn) {
    const out = new Array(items.length); let next = 0;
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
    }));
    return out;
}

async function prerenderBlogs() {
    console.log('=== PRERENDERING BLOG ARTICLE PAGES (metadata for crawlers) ===\n');
    console.log(`Target folder: ${distDir}${DRY_RUN ? '   [DRY RUN - nothing will be written]' : ''}`);

    const templatePath = path.join(distDir, 'index.html');
    if (!fs.existsSync(templatePath)) {
        console.error(`ERROR: ${templatePath} not found! Please run "npm run build" first (or pass --dist <folder containing index.html>).`);
        process.exit(1);
    }
    const template = fs.readFileSync(templatePath, 'utf8');
    console.log(`Loaded page template: ${templatePath} (${template.length} bytes)`);

    console.log('Querying Supabase for articles...');
    const { data: rows, error } = await supabase.from('blogs').select(FIELDS).order('published_date', { ascending: false }).limit(5000);
    if (error) {
        console.error('Failed to fetch articles from Supabase:', error.message);
        if (/social_image_url/i.test(error.message || '')) console.error('The blogs.social_image_url column is missing: apply supabase/migrations/add_social_image_to_blogs.sql first.');
        process.exit(1);
    }

    const now = new Date();
    const all = rows || [];
    const publicArticles = all.filter((a) => core.isPubliclyVisible(a, now)).filter((a) => !ONLY_SLUG || a.slug === ONLY_SLUG);
    console.log(`Found ${all.length} articles; ${publicArticles.length} are public (published, or scheduled and due). Rendering...\n`);

    const allowHosts = [new URL(supabaseUrl).hostname];
    const dimsCache = new Map();
    const stats = { written: 0, unchanged: 0, failed: [], skipped: [], sources: { social: 0, cover: 0, default: 0 }, sizesRead: 0 };
    const visibleSlugs = new Set();

    await mapPool(publicArticles, 4, async (art) => {
        if (!core.isValidSlug(art.slug)) { stats.skipped.push({ slug: art.slug, reason: 'invalid slug' }); return; }
        visibleSlugs.add(art.slug);
        try {
            const image = core.pickImage(art);
            stats.sources[image.source]++;
            const dims = image.source === 'default' ? null : await core.probeImageDimensions(image.url, { allowHosts, cache: dimsCache });
            if (dims) stats.sizesRead++;
            const opts = dims ? { dims } : {};
            const html = core.renderArticleHtml(template, art, opts);
            const problems = core.verifyRendered(html, art, opts);
            if (problems.length) throw new Error(`rendered page failed verification (${problems.join(', ')})`);
            const file = path.join(distDir, 'blogs', art.slug, 'index.html');
            const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
            if (existing === html) { stats.unchanged++; return; }
            if (!DRY_RUN) writeVerified(file, html, art, opts);
            stats.written++;
        } catch (err) {
            stats.failed.push({ slug: art.slug, error: err.message });
        }
    });

    // Optional: remove generated pages of articles that are no longer public (only generated pages; only if the read looked complete)
    const pruned = [];
    if (PRUNE && !ONLY_SLUG && all.length > 0) {
        const blogsDir = path.join(distDir, 'blogs');
        const names = fs.existsSync(blogsDir) ? fs.readdirSync(blogsDir) : [];
        for (const name of names) {
            if (visibleSlugs.has(name) || !core.isValidSlug(name)) continue;
            const file = path.join(blogsDir, name, 'index.html');
            if (!fs.existsSync(file)) continue;
            const html = fs.readFileSync(file, 'utf8');
            if (!core.looksGenerated(html) || core.isRedirectStub(html)) continue;
            if (!DRY_RUN) { fs.unlinkSync(file); try { fs.rmdirSync(path.dirname(file)); } catch (_) { /* not empty: leave */ } }
            pruned.push(name);
        }
    }

    console.log('================================================================');
    console.log(`${stats.failed.length ? '✗ FINISHED WITH ERRORS' : '✓ SUCCESS'}: ${publicArticles.length} public articles processed in ${path.join(distDir, 'blogs')}${path.sep}<slug>${path.sep}index.html`);
    console.log(`  - ${DRY_RUN ? 'would be written' : 'written'}: ${stats.written}    already up to date: ${stats.unchanged}    failed: ${stats.failed.length}    skipped: ${stats.skipped.length}${PRUNE ? `    ${DRY_RUN ? 'would be pruned' : 'pruned'}: ${pruned.length}` : ''}`);
    console.log(`  - og:image / twitter:image source:  social image ${stats.sources.social},  cover ${stats.sources.cover},  website default ${stats.sources.default}`);
    console.log(`  - real image sizes read: ${stats.sizesRead} of ${stats.sources.social + stats.sources.cover}`);
    console.log(`  - not public (draft / unpublished / scheduled for later): ${all.length - all.filter((a) => core.isPubliclyVisible(a, now)).length}  (never prerendered)`);
    console.log('  - React SPA shell (<div id="root">) preserved on every page.');
    for (const f of stats.failed) console.log(`  ✗ ${f.slug}: ${f.error}`);
    for (const s of stats.skipped) console.log(`  ! skipped ${s.slug}: ${s.reason}`);
    console.log('================================================================\n');

    if (stats.failed.length) process.exit(1);
}

prerenderBlogs().catch(err => {
    console.error('Prerender error:', err);
    process.exit(1);
});
