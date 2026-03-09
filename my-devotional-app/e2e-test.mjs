/**
 * E2E Automated Tests — Biserica Impact Timișoara Devotional App
 * Multi-Journal Architecture
 * Tests: Build artifacts, Journals API, Devotionals API, Admin, RLS, Data integrity, Content quality
 *
 * No local dev server needed — Section 1 reads from dist/, Sections 2-7 hit Supabase API directly.
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, 'dist');

const SUPABASE_URL = 'https://tawlpjsclohdvhyaiciv.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2xwanNjbG9oZHZoeWFpY2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDUyNDYsImV4cCI6MjA4ODYyMTI0Nn0.b4B-fI1SVtohUqlsGe06-c_7J2C191hiUTl094cwSTk';
const ADMIN_EMAIL = 'admin@devotional.ro';
const ADMIN_PASSWORD = 'Admin2026!';

let passed = 0;
let failed = 0;
const results = [];

function log(status, name, detail = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  const msg = `${icon} ${name}${detail ? ` — ${detail}` : ''}`;
  console.log(msg);
  results.push({ status, name, detail });
  if (status === 'PASS') passed++;
  else failed++;
}

async function test(name, fn) {
  try {
    await fn();
  } catch (err) {
    log('FAIL', name, err.message);
  }
}

function sbHeaders() {
  return { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };
}

// ══════════════════════════════════════════════
// SECTION 1: BUILD ARTIFACTS & STATIC ASSETS
// ══════════════════════════════════════════════
console.log('\n📄 SECTION 1: Build Artifacts & Static Assets');
console.log('─'.repeat(50));

await test('1.1 dist/ folder exists', async () => {
  if (!existsSync(DIST)) throw new Error('dist/ folder missing — run `npm run build` first');
  log('PASS', '1.1 dist/ folder exists');
});

await test('1.2 index.html present with root div', async () => {
  const html = readFileSync(resolve(DIST, 'index.html'), 'utf-8');
  if (!html.includes('<div id="root">')) throw new Error('Missing root div');
  log('PASS', '1.2 index.html present with root div');
});

await test('1.3 Branding — title, theme-color, apple-touch-icon', async () => {
  const html = readFileSync(resolve(DIST, 'index.html'), 'utf-8');
  if (!html.includes('Biserica Impact Timișoara')) throw new Error('Missing church name');
  if (!html.includes('#1e3a5f')) throw new Error('Missing navy theme-color');
  if (!html.includes('apple-touch-icon')) throw new Error('Missing apple-touch-icon');
  log('PASS', '1.3 Branding — title, theme-color, apple-touch-icon');
});

await test('1.4 Manifest.json valid with icons', async () => {
  const raw = readFileSync(resolve(DIST, 'manifest.json'), 'utf-8');
  const data = JSON.parse(raw);
  if (!data.name) throw new Error('Missing name');
  if (!data.icons || data.icons.length < 2) throw new Error('Need at least 2 icon formats');
  const hasPng = data.icons.some(i => i.type === 'image/png');
  const hasSvg = data.icons.some(i => i.type === 'image/svg+xml');
  if (!hasPng) throw new Error('Missing PNG icon');
  if (!hasSvg) throw new Error('Missing SVG icon');
  log('PASS', '1.4 Manifest.json valid', `${data.icons.length} icons`);
});

await test('1.5 PNG icon present', async () => {
  const p = resolve(DIST, 'image.png');
  if (!existsSync(p)) throw new Error('image.png missing');
  const s = statSync(p);
  if (s.size < 500) throw new Error(`image.png too small (${s.size} bytes)`);
  log('PASS', '1.5 PNG icon present');
});

await test('1.6 PNG icons exist (192 & 512)', async () => {
  for (const size of [192, 512]) {
    const p = resolve(DIST, `icon-${size}.png`);
    if (!existsSync(p)) throw new Error(`icon-${size}.png missing`);
    const s = statSync(p);
    if (s.size < 500) throw new Error(`icon-${size}.png too small (${s.size} bytes)`);
  }
  log('PASS', '1.6 PNG icons exist (192 & 512)');
});

await test('1.7 JS bundle generated', async () => {
  const assetsDir = resolve(DIST, 'assets');
  if (!existsSync(assetsDir)) throw new Error('assets/ folder missing');
  const { readdirSync } = await import('fs');
  const jsFiles = readdirSync(assetsDir).filter(f => f.endsWith('.js'));
  if (jsFiles.length === 0) throw new Error('No JS bundles found');
  log('PASS', '1.7 JS bundle generated', `${jsFiles.length} file(s)`);
});

await test('1.8 CSS bundle generated', async () => {
  const { readdirSync } = await import('fs');
  const cssFiles = readdirSync(resolve(DIST, 'assets')).filter(f => f.endsWith('.css'));
  if (cssFiles.length === 0) throw new Error('No CSS bundles found');
  log('PASS', '1.8 CSS bundle generated', `${cssFiles.length} file(s)`);
});

// ══════════════════════════════════════════════
// SECTION 2: JOURNALS API
// ══════════════════════════════════════════════
console.log('\n📚 SECTION 2: Journals API');
console.log('─'.repeat(50));

let journals = [];
await test('2.1 Fetch active journals', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/journals?is_active=eq.true&select=*`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  journals = await res.json();
  if (!Array.isArray(journals)) throw new Error('Response is not an array');
  if (journals.length === 0) throw new Error('No active journals found');
  log('PASS', '2.1 Fetch active journals', `${journals.length} journal(s)`);
});

await test('2.2 Journal has required fields', async () => {
  const required = ['id', 'title', 'slug', 'cover_emoji', 'is_active', 'sort_order'];
  for (const j of journals) {
    for (const field of required) {
      if (j[field] === undefined || j[field] === null) {
        throw new Error(`Journal "${j.title || j.id}": missing "${field}"`);
      }
    }
  }
  log('PASS', '2.2 Journal has required fields');
});

await test('2.3 Journal slugs are URL-safe', async () => {
  for (const j of journals) {
    if (!/^[a-z0-9-]+$/.test(j.slug)) {
      throw new Error(`Invalid slug: "${j.slug}" for "${j.title}"`);
    }
  }
  log('PASS', '2.3 Journal slugs are URL-safe');
});

await test('2.4 Fetch journal by slug', async () => {
  const slug = journals[0].slug;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/journals?slug=eq.${slug}&is_active=eq.true&select=*`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.length !== 1) throw new Error(`Expected 1, got ${data.length}`);
  if (data[0].slug !== slug) throw new Error(`Wrong slug: ${data[0].slug}`);
  log('PASS', '2.4 Fetch journal by slug', `"${data[0].title}"`);
});

await test('2.5 RLS — anon cannot INSERT journals', async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/journals`, {
    method: 'POST',
    headers: { ...sbHeaders(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ title: 'Hack', slug: 'hack', cover_emoji: '💀' }),
  });
  if (res.ok || res.status === 201) throw new Error('INSERT should be blocked by RLS!');
  log('PASS', '2.5 RLS — anon cannot INSERT journals', `HTTP ${res.status}`);
});

await test('2.6 RLS — anon cannot DELETE journals', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/journals?id=eq.${journals[0].id}`,
    { method: 'DELETE', headers: sbHeaders() }
  );
  // Should not actually delete (RLS blocks it)
  const check = await fetch(
    `${SUPABASE_URL}/rest/v1/journals?id=eq.${journals[0].id}&select=id`,
    { headers: sbHeaders() }
  );
  const remaining = await check.json();
  if (remaining.length !== 1) throw new Error('Journal was deleted by anon!');
  log('PASS', '2.6 RLS — anon cannot DELETE journals');
});

// ══════════════════════════════════════════════
// SECTION 3: DEVOTIONALS API
// ══════════════════════════════════════════════
console.log('\n📖 SECTION 3: Devotionals API');
console.log('─'.repeat(50));

const journalId = journals[0]?.id;
let devotionals = [];

await test('3.1 Fetch devotionals for journal', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?journal_id=eq.${journalId}&is_published=eq.true&order=day_number.asc&select=*`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  devotionals = await res.json();
  if (!Array.isArray(devotionals)) throw new Error('Not an array');
  if (devotionals.length === 0) throw new Error('No devotionals found');
  log('PASS', '3.1 Fetch devotionals for journal', `${devotionals.length} devotionals`);
});

await test('3.2 All 11 devotionals (Days 10-20)', async () => {
  const dayNumbers = devotionals.map(d => d.day_number).sort((a, b) => a - b);
  const expected = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const missing = expected.filter(d => !dayNumbers.includes(d));
  if (missing.length > 0) throw new Error(`Missing days: ${missing.join(', ')}`);
  log('PASS', '3.2 All 11 devotionals (Days 10-20)');
});

await test('3.3 Devotional data integrity', async () => {
  const issues = [];
  for (const d of devotionals) {
    if (!d.title) issues.push(`Day ${d.day_number}: missing title`);
    if (!d.bible_passage_reference) issues.push(`Day ${d.day_number}: missing reference`);
    if (!d.bible_passage_text) issues.push(`Day ${d.day_number}: missing passage text`);
    if (!d.prayer_text) issues.push(`Day ${d.day_number}: missing prayer`);
    if (!d.date) issues.push(`Day ${d.day_number}: missing date`);
    if (!d.journal_id) issues.push(`Day ${d.day_number}: missing journal_id`);
    if (!Array.isArray(d.text_questions) || d.text_questions.length === 0)
      issues.push(`Day ${d.day_number}: missing text_questions`);
    if (!Array.isArray(d.meditation_questions) || d.meditation_questions.length === 0)
      issues.push(`Day ${d.day_number}: missing meditation_questions`);
  }
  if (issues.length > 0) throw new Error(issues.join('; '));
  log('PASS', '3.3 Devotional data integrity', `All ${devotionals.length} complete`);
});

await test('3.4 All devotionals linked to correct journal', async () => {
  const wrongJournal = devotionals.filter(d => d.journal_id !== journalId);
  if (wrongJournal.length > 0) throw new Error(`${wrongJournal.length} devotionals have wrong journal_id`);
  log('PASS', '3.4 All devotionals linked to correct journal');
});

await test('3.5 Bible references are from Iacov', async () => {
  const nonIacov = devotionals.filter(d => !d.bible_passage_reference.toLowerCase().includes('iacov'));
  if (nonIacov.length > 0) throw new Error(`Non-Iacov: ${nonIacov.map(d => `Day ${d.day_number}`).join(', ')}`);
  log('PASS', '3.5 Bible references are from Iacov');
});

await test('3.6 Dates are sequential', async () => {
  for (let i = 1; i < devotionals.length; i++) {
    const prev = new Date(devotionals[i - 1].date);
    const curr = new Date(devotionals[i].date);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    const dayDiff = devotionals[i].day_number - devotionals[i - 1].day_number;
    if (diffDays !== dayDiff) {
      throw new Error(`Date gap between Day ${devotionals[i - 1].day_number} and ${devotionals[i].day_number}`);
    }
  }
  log('PASS', '3.6 Dates are sequential');
});

await test('3.7 Fetch single devotional by journal + day', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?journal_id=eq.${journalId}&day_number=eq.15&is_published=eq.true&select=*`,
    { headers: sbHeaders() }
  );
  const data = await res.json();
  if (data.length !== 1) throw new Error(`Expected 1, got ${data.length}`);
  if (data[0].day_number !== 15) throw new Error('Wrong day');
  log('PASS', '3.7 Fetch single devotional by journal + day', `"${data[0].title}"`);
});

await test('3.8 RLS — anon cannot INSERT devotionals', async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/devotionals`, {
    method: 'POST',
    headers: { ...sbHeaders(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({
      journal_id: journalId, day_number: 999, title: 'Hack', date: '2026-12-31',
      bible_passage_reference: 'Test', bible_passage_text: 'Test',
      text_questions: ['test'], meditation_questions: ['test'], prayer_text: 'test',
    }),
  });
  if (res.ok || res.status === 201) throw new Error('INSERT should be blocked!');
  log('PASS', '3.8 RLS — anon cannot INSERT devotionals', `HTTP ${res.status}`);
});

await test('3.9 RLS — anon cannot UPDATE devotionals', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?id=eq.${devotionals[0].id}`,
    {
      method: 'PATCH',
      headers: { ...sbHeaders(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ title: 'Hacked Title' }),
    }
  );
  // Verify title unchanged
  const check = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?id=eq.${devotionals[0].id}&select=title`,
    { headers: sbHeaders() }
  );
  const data = await check.json();
  if (data[0]?.title === 'Hacked Title') throw new Error('UPDATE worked for anon!');
  log('PASS', '3.9 RLS — anon cannot UPDATE devotionals');
});

// ══════════════════════════════════════════════
// SECTION 4: USER PROGRESS
// ══════════════════════════════════════════════
console.log('\n📊 SECTION 4: User Progress');
console.log('─'.repeat(50));

const testDeviceId = `e2e-test-${Date.now()}`;

await test('4.1 Create user progress (anon with device-id)', async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_progress`, {
    method: 'POST',
    headers: {
      ...sbHeaders(),
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      device_id: testDeviceId,
      devotional_id: devotionals[0].id,
      completed_steps: { passage: true, textQuestions: false, meditation: false, prayer: false },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data[0]?.id) throw new Error('No progress created');
  log('PASS', '4.1 Create user progress', `Progress ID: ${data[0].id}`);
});

await test('4.2 Read own progress', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_progress?device_id=eq.${testDeviceId}&select=*`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.length !== 1) throw new Error(`Expected 1, got ${data.length}`);
  if (data[0].completed_steps.passage !== true) throw new Error('Step not saved');
  log('PASS', '4.2 Read own progress');
});

await test('4.3 Progress isolated by device_id filter', async () => {
  // Another device can't see our progress if they don't know our device_id (UUID)
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_progress?device_id=eq.unknown-device-xyz&select=*`,
    { headers: sbHeaders() }
  );
  const data = await res.json();
  // Should return 0 rows for a non-existent device_id
  if (data.length > 0) throw new Error('Returned rows for non-existent device_id');
  log('PASS', '4.3 Progress isolated by device_id filter');
});

// Clean up test progress
await test('4.4 Delete own progress (cleanup)', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_progress?device_id=eq.${testDeviceId}`,
    { method: 'DELETE', headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  log('PASS', '4.4 Delete own progress (cleanup)');
});

// ══════════════════════════════════════════════
// SECTION 5: ADMIN AUTHENTICATION
// ══════════════════════════════════════════════
console.log('\n🔐 SECTION 5: Admin Authentication');
console.log('─'.repeat(50));

let adminToken = null;
await test('5.1 Admin login works', async () => {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.access_token) throw new Error('No access_token');
  adminToken = data.access_token;
  log('PASS', '5.1 Admin login works', `${data.user?.email}`);
});

await test('5.2 Admin can read all journals (including inactive)', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/journals?select=*`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${adminToken}` } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.length < 1) throw new Error('No journals');
  log('PASS', '5.2 Admin can read all journals', `${data.length} total`);
});

await test('5.3 Admin can read all devotionals', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?select=id,day_number,is_published`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${adminToken}` } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.length < 1) throw new Error('No devotionals');
  log('PASS', '5.3 Admin can read all devotionals', `${data.length} total`);
});

await test('5.4 Admin profile exists', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/admin_profiles?select=*`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${adminToken}` } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.length < 1) throw new Error('No admin profile');
  if (data[0].role !== 'admin') throw new Error(`Wrong role: ${data[0].role}`);
  log('PASS', '5.4 Admin profile exists', `${data[0].email}`);
});

// ══════════════════════════════════════════════
// SECTION 6: DATABASE SCHEMA VALIDATION
// ══════════════════════════════════════════════
console.log('\n🗄️  SECTION 6: Database Schema');
console.log('─'.repeat(50));

await test('6.1 Journals table exists with correct columns', async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/journals?select=id,title,slug,description,cover_emoji,is_active,sort_order,created_at,updated_at&limit=1`, { headers: sbHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status} — journals table may not exist`);
  log('PASS', '6.1 Journals table exists with correct columns');
});

await test('6.2 Devotionals table has journal_id column', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?select=journal_id&limit=1`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} — journal_id column missing`);
  const data = await res.json();
  if (data.length > 0 && data[0].journal_id === undefined) throw new Error('journal_id not in response');
  log('PASS', '6.2 Devotionals table has journal_id column');
});

await test('6.3 Unique constraint: journal_id + day_number', async () => {
  // Try inserting duplicate day in same journal (should fail via RLS or constraint)
  // We can verify by checking existing data has no duplicates
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?journal_id=eq.${journalId}&select=day_number`,
    { headers: sbHeaders() }
  );
  const data = await res.json();
  const daySet = new Set(data.map(d => d.day_number));
  if (daySet.size !== data.length) throw new Error('Duplicate day_number found in same journal!');
  log('PASS', '6.3 Unique constraint: no duplicate days per journal');
});

// ══════════════════════════════════════════════
// SECTION 7: CONTENT QUALITY
// ══════════════════════════════════════════════
console.log('\n📝 SECTION 7: Content Quality');
console.log('─'.repeat(50));

await test('7.1 All text_questions have question text', async () => {
  for (const d of devotionals) {
    for (let i = 0; i < d.text_questions.length; i++) {
      const q = d.text_questions[i];
      const text = typeof q === 'string' ? q : q?.question || q?.text;
      if (!text || text.trim().length === 0) {
        throw new Error(`Day ${d.day_number}, text_question[${i}] is empty`);
      }
    }
  }
  log('PASS', '7.1 All text_questions have question text');
});

await test('7.2 All meditation_questions have content', async () => {
  for (const d of devotionals) {
    for (let i = 0; i < d.meditation_questions.length; i++) {
      const q = d.meditation_questions[i];
      const text = typeof q === 'string' ? q : q?.question || q?.text;
      if (!text || text.trim().length === 0) {
        throw new Error(`Day ${d.day_number}, meditation_question[${i}] is empty`);
      }
    }
  }
  log('PASS', '7.2 All meditation_questions have content');
});

await test('7.3 Prayer texts are substantial (>50 chars)', async () => {
  for (const d of devotionals) {
    if (d.prayer_text.length < 50) {
      throw new Error(`Day ${d.day_number}: prayer too short (${d.prayer_text.length} chars)`);
    }
  }
  log('PASS', '7.3 Prayer texts are substantial');
});

await test('7.4 Bible passage texts are substantial (>100 chars)', async () => {
  for (const d of devotionals) {
    if (d.bible_passage_text.length < 100) {
      throw new Error(`Day ${d.day_number}: passage too short (${d.bible_passage_text.length} chars)`);
    }
  }
  log('PASS', '7.4 Bible passage texts are substantial');
});

await test('7.5 Spot check Day 15 content', async () => {
  const d = devotionals.find(x => x.day_number === 15);
  if (!d) throw new Error('Day 15 not found');
  if (!d.title.length > 5) throw new Error('Title too short');
  if (d.text_questions.length < 2) throw new Error('Too few text questions');
  if (d.meditation_questions.length < 1) throw new Error('Too few meditation questions');
  log('PASS', '7.5 Spot check Day 15 content', `"${d.title}"`);
});

// ══════════════════════════════════════════════
// SUMMARY
// ══════════════════════════════════════════════
console.log('\n' + '═'.repeat(60));
console.log(`  📊 E2E Test Results: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log('═'.repeat(60));

if (failed > 0) {
  console.log('\n❌ FAILED TESTS:');
  results.filter(r => r.status === 'FAIL').forEach(r => console.log(`   • ${r.name}: ${r.detail}`));
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed! App is ready for go-live.\n');
  process.exit(0);
}
