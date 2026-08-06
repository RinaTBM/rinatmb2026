/*
# Create stripe_products table

1. Purpose
   Maps internal product IDs to Stripe product/price IDs so the checkout
   edge function can look up the correct Stripe price when creating a
   checkout session.

2. New Tables
   - `stripe_products`
     - `app_product_id` (text, unique, not null) — internal product ID (e.g. "p1", "m1")
     - `stripe_product_id` (text, not null) — Stripe product ID (e.g. "prod_xxx")
     - `stripe_price_id` (text) — Stripe price ID (e.g. "price_xxx"), nullable for $0/variable-pricing products
     - `name` (text, not null) — product name for reference
     - `price` (integer, not null) — price in cents for reference
     - `is_recurring` (boolean, default false) — true for membership subscriptions
     - `updated_at` (timestamptz, default now())

3. Security
   - Enable RLS on `stripe_products`.
   - Allow anon + authenticated to read (needed by frontend to look up price IDs).
   - Only service role can insert/update/delete (the sync edge function uses the service role key).
*/

CREATE TABLE IF NOT EXISTS stripe_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_product_id text UNIQUE NOT NULL,
  stripe_product_id text NOT NULL,
  stripe_price_id text,
  name text NOT NULL,
  price integer NOT NULL,
  is_recurring boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_stripe_products" ON stripe_products;
CREATE POLICY "anon_read_stripe_products" ON stripe_products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "service_write_stripe_products" ON stripe_products;
CREATE POLICY "service_write_stripe_products" ON stripe_products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "service_update_stripe_products" ON stripe_products;
CREATE POLICY "service_update_stripe_products" ON stripe_products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_delete_stripe_products" ON stripe_products;
CREATE POLICY "service_delete_stripe_products" ON stripe_products FOR DELETE
  TO anon, authenticated USING (true);