/*
# HighLevel Event Log — dedup table for contact-tag events

## Purpose
Stores a durable record of each HighLevel contact-tag event (checkout_started,
purchase_completed) keyed by the MBM order/event ID. This prevents duplicate
HighLevel API calls across edge function instances and webhook retries.

## New Tables
- `highlevel_event_log`
  - `id` (uuid, primary key)
  - `event_id` (text, unique, not null) — MBM order ID or composite event ID used for dedup
  - `event_type` (text, not null) — "checkout_started" or "purchase_completed"
  - `contact_id` (text, nullable) — HighLevel contact ID returned from upsert
  - `processed_at` (timestamptz, default now())
  - `created_at` (timestamptz, default now())

## Security
- RLS enabled. No public access. Only the service role (edge functions) can
  read/write — the service role bypasses RLS, so no policies are needed for
  browser access. This table is purely server-side infrastructure.
- No VITE_* or browser code references this table.

## Notes
1. The unique constraint on `event_id` ensures idempotent inserts — the Edge
   Function uses `Prefer: resolution=ignore-duplicates` so re-inserts are safe.
2. No customer PII (email, phone, medical data) is stored in this table — only
   the event ID, event type, and HighLevel contact ID.
3. This table is safe to re-apply (idempotent).
*/

CREATE TABLE IF NOT EXISTS highlevel_event_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  contact_id text,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE highlevel_event_log ENABLE ROW LEVEL SECURITY;

-- No policies needed: only the service role (edge functions) accesses this table,
-- and the service role bypasses RLS. The anon/authenticated roles get nothing.

CREATE INDEX IF NOT EXISTS idx_highlevel_event_log_event_id
  ON highlevel_event_log (event_id);
