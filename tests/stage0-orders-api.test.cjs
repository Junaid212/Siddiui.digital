/**
 * Stage 0 tests for the public site's order API helpers.  Run from the repository root:
 *     node --test tests/*.test.cjs
 *
 * The real src/api.js is bundled with esbuild (already a dependency of Vite) against a stubbed Supabase session and a
 * stubbed fetch, so no network is used. MyOrders is additionally checked at source level, and in a real browser by the
 * review scripts that accompany the patch.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');

async function loadApi() {
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, 'src', 'api.js')],
    bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'silent',
    // VITE_API_URL is set to the host with the invalid certificate on purpose: the code must ignore it and stay same-origin
    define: { 'import.meta.env': '{"VITE_API_URL":"https://api.siddiqui.digital/api","VITE_ADMIN_API_URL":"http://localhost:5001"}' },
    plugins: [{
      name: 'stub-supabase',
      setup(build) {
        build.onResolve({ filter: /supabaseClient$/ }, () => ({ path: 'supabase-stub', namespace: 'stub' }));
        build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const supabase = { auth: { getSession: async () => globalThis.__session } };', loader: 'js' }));
      },
    }],
  });
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', result.outputFiles[0].text)(mod, mod.exports, require);
  return mod.exports.api;
}

let api;
const fetchCalls = [];
// replies: queue of { ok, status, json } consumed in order; falls back to a default 200 once the queue is empty
const reply = (status, json) => ({ ok: status >= 200 && status < 300, status, json });
test.before(async () => { api = await loadApi(); });
test.beforeEach(() => {
  fetchCalls.length = 0;
  globalThis.__replies = [];
  globalThis.__session = { data: { session: { access_token: 'SESSION-TOKEN' } } };
  // reinstall the default stub every time, so a test that swaps fetch cannot affect the next one
  globalThis.fetch = async (url, opts = {}) => {
    fetchCalls.push({ url: String(url), method: opts.method || 'GET', headers: opts.headers || {}, body: opts.body });
    const r = globalThis.__replies.length ? globalThis.__replies.shift() : reply(200, { orders: [{ id: 'o1' }], ownsOnline: true, owned: true, edition: 'online' });
    const res = { ok: r.ok, status: r.status, json: async () => { if (r.json === undefined) throw new Error('no json body'); return r.json; } };
    res.clone = () => res;
    return res;
  };
});

test('checkOwnership: signed in -> sends the session token and NO e-mail address', async () => {
  const r = await api.checkOwnership('someone@example.com');
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].url, '/api/payment/check-ownership');
  assert.equal(fetchCalls[0].headers.Authorization, 'Bearer SESSION-TOKEN');
  assert.equal(r.ownsOnline, true);
});

test('checkOwnership: signed out -> no request at all, safe default', async () => {
  globalThis.__session = { data: { session: null } };
  const r = await api.checkOwnership('someone@example.com');
  assert.equal(fetchCalls.length, 0);
  assert.deepEqual(r, { owned: false, edition: null, canUpgrade: false });
});

test('checkOwnership: server refusal or network error -> safe default (checkout keeps working)', async () => {
  globalThis.__replies = [reply(401, { error: 'Please sign in' })];
  assert.deepEqual(await api.checkOwnership(), { owned: false, edition: null, canUpgrade: false });
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.deepEqual(await api.checkOwnership(), { owned: false, edition: null, canUpgrade: false });
});

test('getCustomerOrders / listMyOrders: signed in -> token header, no e-mail in the URL; signed out -> no request', async () => {
  const r = await api.getCustomerOrders('victim@example.com');
  assert.equal(fetchCalls[0].url, '/api/payment/my-orders');
  assert.equal(fetchCalls[0].headers.Authorization, 'Bearer SESSION-TOKEN');
  assert.deepEqual(r.orders, [{ id: 'o1' }]);
  fetchCalls.length = 0;
  const l = await api.listMyOrders('victim@example.com');
  assert.equal(l.ok, true); assert.equal(l.status, 200); assert.equal(fetchCalls.length, 1);
  fetchCalls.length = 0; globalThis.__session = { data: { session: null } };
  const out = await api.getCustomerOrders('victim@example.com');
  assert.equal(fetchCalls.length, 0); assert.match(out.error, /sign in/i);
  assert.equal((await api.listMyOrders('x@example.com')).status, 401);
});

test('PREVIOUS backend compatibility: a 400 "email required" is retried ONCE with the user\'s own address', async () => {
  globalThis.__replies = [reply(400, { error: 'Email address is required.' }), reply(200, { orders: [{ id: 'legacy' }] })];
  const l = await api.listMyOrders('me@example.com');
  assert.equal(l.ok, true); assert.deepEqual(l.data.orders, [{ id: 'legacy' }]);
  assert.equal(fetchCalls.length, 2);
  assert.equal(fetchCalls[0].url, '/api/payment/my-orders', 'first attempt carries no e-mail');
  assert.equal(fetchCalls[1].url, '/api/payment/my-orders?email=me%40example.com');
  assert.ok(fetchCalls.every((c) => c.headers.Authorization === 'Bearer SESSION-TOKEN'));
  // an unrelated 400 is NOT retried; neither is a 401 (the current backend refusing)
  fetchCalls.length = 0; globalThis.__replies = [reply(400, { error: 'Something else is wrong' })];
  await api.listMyOrders('me@example.com'); assert.equal(fetchCalls.length, 1);
  fetchCalls.length = 0; globalThis.__replies = [reply(401, { error: 'Please sign in' })];
  await api.listMyOrders('me@example.com'); assert.equal(fetchCalls.length, 1);
  // and the ownership check behaves the same way
  fetchCalls.length = 0; globalThis.__replies = [reply(400, { error: 'Email address is required.' }), reply(200, { owned: true, ownsCompanion: true })];
  assert.equal((await api.checkOwnership('me@example.com')).ownsCompanion, true);
  assert.equal(fetchCalls[1].url, '/api/payment/check-ownership?email=me%40example.com');
});

test('createAccessLink: POSTs the purpose with the session token; reports success, refusal, missing endpoint and network errors', async () => {
  globalThis.__replies = [reply(200, { path: '/payment/access/abc.def', expiresIn: 120 })];
  const ok = await api.createAccessLink('11111111-1111-4111-8111-111111111111', 'download');
  assert.deepEqual(ok, { ok: true, path: '/payment/access/abc.def' });
  assert.equal(fetchCalls[0].method, 'POST');
  assert.equal(fetchCalls[0].url, '/api/payment/orders/11111111-1111-4111-8111-111111111111/access-link');
  assert.equal(fetchCalls[0].headers.Authorization, 'Bearer SESSION-TOKEN');
  assert.deepEqual(JSON.parse(fetchCalls[0].body), { purpose: 'download' });
  globalThis.__replies = [reply(403, { error: 'This order has been refunded. Access is revoked.' })];
  const refused = await api.createAccessLink('x', 'read');
  assert.equal(refused.ok, false); assert.equal(refused.status, 403); assert.match(refused.error, /refunded/);
  globalThis.__replies = [reply(404, undefined)]; // an older server: generic 404, no JSON
  const missing = await api.createAccessLink('x', 'read');
  assert.equal(missing.ok, false); assert.equal(missing.status, 404); assert.ok(!missing.error, 'no error text => the page treats it as "endpoint missing"');
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.equal((await api.createAccessLink('x', 'read')).status, 0);
  globalThis.__session = { data: { session: null } }; fetchCalls.length = 0;
  assert.equal((await api.createAccessLink('x', 'read')).status, 401);
});

test('API base: same-origin "/api" in production builds; the VITE_API_URL override (invalid-certificate host) is ignored', () => {
  for (const rel of ['src/api.js', 'src/Components/OrderSuccess/index.jsx', 'src/utils/booking.js']) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.ok(!/import\.meta\.env\.VITE_API_URL/.test(src), `${rel} must not read VITE_API_URL`);
    assert.ok(/"http:\/\/localhost:5000\/api" : "\/api"/.test(src), `${rel} keeps localhost for development and "/api" otherwise`);
  }
});

test('API base: every helper in the bundle really calls the same-origin path (override set to the bad host in this test)', async () => {
  await api.checkOwnership('a@example.com'); await api.listMyOrders('a@example.com'); await api.createAccessLink('o', 'read');
  assert.ok(fetchCalls.length >= 3);
  assert.ok(fetchCalls.every((c) => c.url.startsWith('/api/')), fetchCalls.map((c) => c.url).join(' | '));
  assert.ok(!fetchCalls.some((c) => /siddiqui\.digital/.test(c.url)));
});

test('MyOrders page (source): no e-mail lookup UI, uses the shared helpers and short-lived links, legacy credential only as the old-backend fallback', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'Page', 'MyOrders', 'index.jsx'), 'utf8');
  assert.ok(!/my-orders\?email=/.test(src), 'no e-mail query string call remains in the page');
  assert.ok(!/look up by email|handleGuestLookup|guestEmail|lookupEmail/i.test(src), 'guest e-mail lookup is gone');
  assert.match(src, /api\.listMyOrders\(/); assert.match(src, /api\.createAccessLink\(/);
  assert.match(src, /src=\{readerUrl\}/, 'the reader iframe uses the short-lived URL');
  assert.equal((src.match(/download_token/g) || []).length, 1, 'download_token appears only in the old-backend fallback');
  assert.match(src, /endpointMissing/, 'the fallback is limited to a backend that lacks the endpoint');
  assert.match(src, /Sign In with Email &amp; Password/, 'the e-mail + password sign-in link is still offered');
  assert.match(src, /handleGoogleSignIn/, 'Google sign-in is untouched');
});
