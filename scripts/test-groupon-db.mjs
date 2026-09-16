// Isolated PostgreSQL WASM test. Never connects to Supabase or real customer data.
// npm install --prefix /tmp/mbm-groupon-qa @electric-sql/pglite@0.3.14
// node scripts/test-groupon-db.mjs /tmp/mbm-groupon-qa/node_modules/@electric-sql/pglite/dist/index.js
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : '@electric-sql/pglite');
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create table auth.users(id uuid primary key);
create table public.orders(id uuid primary key,customer_user_id uuid references auth.users(id),total_cents integer default 12900,discount_cents integer default 0,payment_status text default 'pending');
grant usage on schema public,auth to service_role; grant select on auth.users,public.orders to service_role;
insert into auth.users values('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
insert into public.orders(id,customer_user_id) values('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001'),('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002');`);
await db.exec(readFileSync(new URL('../supabase/migrations/20260916003644_groupon_manual_redemptions.sql', import.meta.url), 'utf8'));
const user1 = '00000000-0000-0000-0000-000000000001';
const user2 = '00000000-0000-0000-0000-000000000002';
const ordersBefore = (await db.query('select * from orders order by id')).rows;
await db.exec('set role service_role');
async function submit(code, user = user1) {
  return (await db.query('select public.submit_groupon_redemption($1,$2,$3,$4,$5,$6,$7) as r', [code,'GROUPON-ESTRADIOL','Estradiol Hormone Wellness Package',user,'QA customer','qa@example.com',{}])).rows[0].r;
}
const first = await submit(' qa-4821 ');
assert.equal(first.redemption.status,'Pending Verification');
assert.equal(first.redemption.redemption_code,'qa-4821');
assert.equal(first.redemption.source,'groupon');
assert.equal((await submit('qa-4821')).redemption.id,first.redemption.id);
assert.equal((await submit('qa-4821',user2)).error,'duplicate');
assert.equal((await db.query('select count(*)::int as n from groupon_redemptions')).rows[0].n,1);
async function update(status, version, confirm = false, order = null) {
  return (await db.query('select public.update_groupon_redemption($1,$2,$3,$4,$5,$6,$7) as r',[first.redemption.id,status,'Reviewed in Merchant',version,confirm,user1,order])).rows[0].r;
}
assert.equal((await update('Redeemed',1,true)).error,'transition');
assert.equal((await update('Verified',1,false,'10000000-0000-0000-0000-000000000002')).error,'order');
const verified = await update('Verified',1,false,'10000000-0000-0000-0000-000000000001');
assert.ok(verified.redemption.verified_at);
assert.equal((await submit('qa-4821')).error,'duplicate');
assert.equal((await update('Rejected',1)).error,'stale');
assert.equal((await update('Redeemed',2,false,'10000000-0000-0000-0000-000000000001')).error,'confirmation');
assert.equal((await update('Redeemed',2,true)).error,'order');
const redeemed = await update('Redeemed',2,true,'10000000-0000-0000-0000-000000000001');
assert.ok(redeemed.redemption.redeemed_at);
assert.equal((await submit('qa-4821',user2)).error,'duplicate');
assert.equal((await update('Verified',3)).error,'transition');
assert.equal((await db.query('select count(*)::int as n from groupon_redemption_events')).rows[0].n,3);
assert.deepEqual((await db.query('select * from orders order by id')).rows,ordersBefore);
await db.exec('reset role');
for (const role of ['anon','authenticated']) {
  await db.exec(`set role ${role}`);
  for (const query of ['select * from groupon_redemptions','select * from groupon_redemption_events',"update groupon_redemptions set status='Verified'",'delete from groupon_redemptions']) {
    await assert.rejects(() => db.query(query), /permission denied/);
  }
  await assert.rejects(() => submit('another-code'), /permission denied/);
  await assert.rejects(() => update('Verified',1), /permission denied/);
  await db.exec('reset role');
}
console.log('PASS: migration, pending retry, cross-customer duplicate privacy, verification, explicit redemption confirmation, stale updates, order ownership, immutable order linkage, terminal status, timestamps, audit events, unchanged payment totals, anonymous/customer access denial.');
await db.close();
