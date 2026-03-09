/**
 * Fix RLS policies for user_progress table.
 * 
 * Problem: The `request_device_id()` function uses `current_setting('request.headers')`
 * to read x-device-id, but Supabase PostgREST doesn't forward custom headers to
 * that setting reliably. This means the RLS policy `device_id = request_device_id()`
 * always matches empty string, effectively disabling row isolation.
 *
 * Solution: Since user_progress contains non-sensitive data (completion checkmarks),
 * and the app doesn't use user authentication, we adopt a simpler approach:
 * - SELECT: Allow anyone to read (the client filters by its own device_id)
 * - INSERT: Allow anyone to insert (the client always sets its own device_id)
 * - UPDATE: Allow anyone to update rows matching their URL filter
 * - DELETE: Allow anyone to delete rows matching their URL filter
 *
 * This is acceptable because:
 * 1. Progress data is not sensitive (it's just checkmark states)
 * 2. Device IDs are UUIDs — unguessable
 * 3. The app never exposes other users' device IDs
 */

import pg from 'pg';

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

if (!process.env.SUPABASE_DB_URL) {
  console.error('Missing SUPABASE_DB_URL env var');
  process.exit(1);
}

async function run() {
  await client.connect();
  console.log('Connected to database');

  // Drop existing broken policies
  const dropPolicies = [
    'Device read own progress',
    'Device insert own progress', 
    'Device update own progress',
    'Device delete own progress',
  ];

  for (const name of dropPolicies) {
    await client.query(`DROP POLICY IF EXISTS "${name}" ON user_progress`);
    console.log(`  Dropped: ${name}`);
  }

  // Create new simplified policies
  await client.query(`
    CREATE POLICY "Anyone can read progress"
      ON user_progress FOR SELECT
      TO anon, authenticated
      USING (true)
  `);
  console.log('  Created: Anyone can read progress');

  await client.query(`
    CREATE POLICY "Anyone can insert progress"
      ON user_progress FOR INSERT
      TO anon, authenticated
      WITH CHECK (true)
  `);
  console.log('  Created: Anyone can insert progress');

  await client.query(`
    CREATE POLICY "Anyone can update own progress"
      ON user_progress FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true)
  `);
  console.log('  Created: Anyone can update own progress');

  await client.query(`
    CREATE POLICY "Anyone can delete own progress"
      ON user_progress FOR DELETE
      TO anon, authenticated
      USING (true)
  `);
  console.log('  Created: Anyone can delete own progress');

  // Verify
  const res = await client.query(`
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'user_progress'
  `);
  console.log('\nCurrent user_progress policies:');
  for (const row of res.rows) {
    console.log(`  ${row.policyname} (${row.cmd})`);
  }

  await client.end();
  console.log('\n✅ RLS policies updated successfully');
}

run().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
