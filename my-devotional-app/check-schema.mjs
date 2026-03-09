import pg from 'pg';

const DATABASE_URL = process.env.SUPABASE_DB_URL;
if (!DATABASE_URL) {
  throw new Error('Missing SUPABASE_DB_URL. Add it in your local environment.');
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
await client.connect();
const r = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='devotionals' ORDER BY ordinal_position");
console.log(r.rows);
await client.end();
