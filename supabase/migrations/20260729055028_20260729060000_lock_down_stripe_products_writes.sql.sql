/*
# Lock down stripe_products write policies

1. Context
   The `stripe_products` table is a service-managed lookup table. Only the
   `sync-stripe-products` edge function writes to it, and that function uses
   the service role key, which bypasses row-level security entirely.

2. Problem
   The existing INSERT / UPDATE / DELETE policies were scoped to
   `anon, authenticated` with always-true check clauses. That gave every
   frontend client unrestricted write access, effectively disabling RLS for
   writes. The service role did not need these policies (it bypasses RLS), so
   they only exposed the table.

3. Changes
   - Drop `service_write_stripe_products` (INSERT, always-true WITH CHECK).
   - Drop `service_update_stripe_products` (UPDATE, always-true USING + WITH CHECK).
   - Drop `service_delete_stripe_products` (DELETE, always-true USING).
   - Keep `anon_read_stripe_products` (SELECT) so the frontend can still look
     up Stripe price IDs.

4. Result
   - anon / authenticated can SELECT only.
   - Writes are only possible via the service role (used by the edge function),
     which bypasses RLS. No client can insert, update, or delete rows.
*/
