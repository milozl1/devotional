import { readFile } from 'node:fs/promises';
import pg from 'pg';

const DATABASE_URL = process.env.SUPABASE_DB_URL;
const SCHEMA_PATH = new URL('./supabase-schema.sql', import.meta.url);

if (!DATABASE_URL) {
  throw new Error('Missing SUPABASE_DB_URL. Add it in your local environment.');
}

if (process.env.CONFIRM_DB_SETUP !== 'yes') {
  throw new Error('Refusing to run. Set CONFIRM_DB_SETUP=yes to apply supabase-schema.sql.');
}

async function run() {
  const sql = await readFile(SCHEMA_PATH, 'utf8');

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log('Database schema applied successfully.');
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error('Failed to apply schema:', error.message);
  process.exit(1);
});
