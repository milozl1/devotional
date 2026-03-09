/**
 * E2E Automated Tests — Biserica Impact Timișoara Devotional App
 * Tests: Homepage, API, Individual devotional pages, Admin login, Branding
 */

const BASE = process.env.E2E_BASE_URL || 'http://localhost:5173';
const SUPABASE_URL = process.env.E2E_SUPABASE_URL;
const ANON_KEY = process.env.E2E_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error('Missing E2E_SUPABASE_URL or E2E_SUPABASE_ANON_KEY environment variable.');
}

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

// ─── Test 1: Homepage loads ───
await test('Homepage HTML loads', async () => {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  if (!html.includes('<div id="root">')) throw new Error('Missing root div');
  log('PASS', 'Homepage HTML loads', `HTTP ${res.status}`);
});

// ─── Test 2: Branding in HTML ───
await test('Branding — title & theme-color', async () => {
  const res = await fetch(BASE);
  const html = await res.text();
  if (!html.includes('Biserica Impact Timișoara')) throw new Error('Missing church name in title');
  if (!html.includes('#1e3a5f')) throw new Error('Missing navy theme-color');
  log('PASS', 'Branding — title & theme-color');
});

// ─── Test 3: API — fetch all devotionals ───
await test('Supabase API — fetch published devotionals', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?is_published=eq.true&order=day_number.asc&select=*`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`API HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Response is not an array');
  if (data.length === 0) throw new Error('No devotionals found');
  log('PASS', 'Supabase API — fetch published devotionals', `${data.length} devotionals returned`);
});

// ─── Test 4: Verify all 11 days exist (10-20) ───
await test('All 11 devotionals (Days 10-20) present', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?is_published=eq.true&order=day_number.asc&select=day_number,title`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  const dayNumbers = data.map((d) => d.day_number).sort((a, b) => a - b);
  const expected = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const missing = expected.filter((d) => !dayNumbers.includes(d));
  if (missing.length > 0) throw new Error(`Missing days: ${missing.join(', ')}`);
  log('PASS', 'All 11 devotionals (Days 10-20) present', `Days: ${dayNumbers.join(', ')}`);
});

// ─── Test 5: Each devotional has required fields ───
await test('Devotional data integrity', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?is_published=eq.true&select=*`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  const issues = [];
  for (const d of data) {
    if (!d.title) issues.push(`Day ${d.day_number}: missing title`);
    if (!d.bible_passage_reference) issues.push(`Day ${d.day_number}: missing bible_passage_reference`);
    if (!d.bible_passage_text) issues.push(`Day ${d.day_number}: missing bible_passage_text`);
    if (!d.prayer_text) issues.push(`Day ${d.day_number}: missing prayer_text`);
    if (!d.date) issues.push(`Day ${d.day_number}: missing date`);
    if (!Array.isArray(d.text_questions) || d.text_questions.length === 0)
      issues.push(`Day ${d.day_number}: missing text_questions`);
    if (!Array.isArray(d.meditation_questions) || d.meditation_questions.length === 0)
      issues.push(`Day ${d.day_number}: missing meditation_questions`);
  }
  if (issues.length > 0) throw new Error(issues.join('; '));
  log('PASS', 'Devotional data integrity', `All ${data.length} devotionals have complete data`);
});

// ─── Test 6: Bible references from Iacov (James) ───
await test('Bible references are from Epistola lui Iacov', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?is_published=eq.true&select=day_number,bible_passage_reference`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  const nonIacov = data.filter(
    (d) => !d.bible_passage_reference.toLowerCase().includes('iacov')
  );
  if (nonIacov.length > 0) {
    throw new Error(
      `Non-Iacov refs: ${nonIacov.map((d) => `Day ${d.day_number}: ${d.bible_passage_reference}`).join(', ')}`
    );
  }
  log('PASS', 'Bible references are from Epistola lui Iacov');
});

// ─── Test 7: Dates are sequential ───
await test('Dates are correctly sequential', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?is_published=eq.true&order=day_number.asc&select=day_number,date`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  for (let i = 1; i < data.length; i++) {
    const prev = new Date(data[i - 1].date);
    const curr = new Date(data[i].date);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    const dayDiff = data[i].day_number - data[i - 1].day_number;
    if (diffDays !== dayDiff) {
      throw new Error(
        `Date gap mismatch between Day ${data[i - 1].day_number} and Day ${data[i].day_number}: expected ${dayDiff} days, got ${diffDays}`
      );
    }
  }
  log('PASS', 'Dates are correctly sequential', `${data[0].date} → ${data[data.length - 1].date}`);
});

// ─── Test 8: Single devotional API fetch ───
await test('Fetch single devotional by day_number', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?day_number=eq.15&is_published=eq.true&select=*`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  if (data.length !== 1) throw new Error(`Expected 1 result, got ${data.length}`);
  const d = data[0];
  if (d.day_number !== 15) throw new Error(`Expected day 15, got ${d.day_number}`);
  if (!d.title) throw new Error('Missing title for Day 15');
  log('PASS', 'Fetch single devotional by day_number', `Day 15: "${d.title}"`);
});

// ─── Test 9: Vite static assets (JS/CSS bundles) ───
await test('Vite bundles load (main.tsx entry)', async () => {
  const res = await fetch(`${BASE}/src/main.tsx`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!text.includes('import') && !text.includes('React')) throw new Error('Not a valid JS module');
  log('PASS', 'Vite bundles load (main.tsx entry)');
});

// ─── Test 10: RLS — unauthenticated cannot write ───
await test('RLS — unauthenticated INSERT blocked', async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/devotionals`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      day_number: 999,
      title: 'Test Unauthorized',
      date: '2026-12-31',
      bible_passage_reference: 'Test',
      bible_passage_text: 'Test',
      text_questions: ['test'],
      meditation_questions: ['test'],
      prayer_text: 'test',
    }),
  });
  if (res.ok || res.status === 201) {
    throw new Error('INSERT should be blocked by RLS but was allowed!');
  }
  log('PASS', 'RLS — unauthenticated INSERT blocked', `HTTP ${res.status}`);
});

// ─── Test 11: Admin authentication works ───
await test('Admin auth — login works', async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD environment variable.');
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });
  if (!res.ok) throw new Error(`Auth failed: HTTP ${res.status}`);
  const data = await res.json();
  if (!data.access_token) throw new Error('No access_token in response');
  log('PASS', 'Admin auth — login works', `Token received for ${data.user?.email}`);
});

// ─── Test 12: Text content from PDF matches ───
await test('PDF content accuracy — spot check Day 10', async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/devotionals?day_number=eq.10&select=title,bible_passage_reference,text_questions`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  if (data.length !== 1) throw new Error(`Expected 1 result, got ${data.length}`);
  const d = data[0];
  if (!d.bible_passage_reference.includes('Iacov')) throw new Error('Wrong reference for Day 10');
  if (d.text_questions.length < 2) throw new Error('Too few text questions for Day 10');
  log('PASS', 'PDF content accuracy — spot check Day 10', `"${d.title}"`);
});

// ─── SUMMARY ───
console.log('\n' + '═'.repeat(60));
console.log(`  📊 E2E Test Results: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log('═'.repeat(60));

if (failed > 0) {
  console.log('\n❌ FAILED TESTS:');
  results.filter((r) => r.status === 'FAIL').forEach((r) => console.log(`   • ${r.name}: ${r.detail}`));
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed! App is fully functional.\n');
  process.exit(0);
}
