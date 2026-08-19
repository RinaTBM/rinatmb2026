-- =============================================================================
-- Membership combo recurring shipping fields (Option C / owner-approved)
-- Additive only. SEM/TIRZ monthly_amount_cents becomes membership+shipping combo.
-- Base membership display amounts remain 14900 / 24900.
-- =============================================================================

alter table public.customer_memberships
  add column if not exists base_membership_amount_cents integer,
  add column if not exists shipping_cents integer not null default 0,
  add column if not exists selected_shipping_method text;

comment on column public.customer_memberships.base_membership_amount_cents is
  'Customer-facing base membership amount (SEM 14900 / TIRZ 24900). Not the Tagada combo rebill.';

comment on column public.customer_memberships.shipping_cents is
  'Selected enrollment shipping included in Tagada combo rebill (3000 or 5000).';

comment on column public.customer_memberships.selected_shipping_method is
  'two_day or next_day — determines which Tagada combo recurring priceId is used.';

comment on column public.customer_memberships.monthly_amount_cents is
  'Authoritative Tagada rebill amount = base membership + selected shipping (combo price).';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'customer_memberships_shipping_method_check'
  ) then
    alter table public.customer_memberships
      add constraint customer_memberships_shipping_method_check
      check (
        selected_shipping_method is null
        or selected_shipping_method in ('two_day', 'next_day')
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'customer_memberships_shipping_cents_check'
  ) then
    alter table public.customer_memberships
      add constraint customer_memberships_shipping_cents_check
      check (shipping_cents in (0, 3000, 5000));
  end if;
end $$;
