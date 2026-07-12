const { Client } = require('pg');
const c = new Client({ connectionString: 'postgresql://postgres:postgres@db.tlxgcdsuuzbegwcbknxv.supabase.co:5432/postgres' });
c.connect().then(async () => {
  const t = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
  console.log('Tables:', t.rows.map(r => r.table_name).join(', '));
  const r = await c.query('SELECT id, creditor, debtor, reason, confirmed FROM debts LIMIT 5');
  console.log('Debts:', JSON.stringify(r.rows));
  const red = await c.query('SELECT * FROM reductions LIMIT 5');
  console.log('Reductions:', JSON.stringify(red.rows));
  const p = await c.query('SELECT email, nickname FROM profiles');
  console.log('Profiles:', JSON.stringify(p.rows));
  await c.end();
}).catch(e => { console.error('ERR:', e.message); process.exit(1); });
