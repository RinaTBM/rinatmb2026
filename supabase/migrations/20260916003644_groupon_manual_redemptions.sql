-- Additive, pending deployment. No payment, catalog, shipping or clinical writes.
begin;
create table public.groupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  redemption_code text not null unique check (length(redemption_code) between 1 and 128 and redemption_code = btrim(redemption_code)),
  groupon_package_id text not null check (groupon_package_id in ('GROUPON-ESTRADIOL','GROUPON-TESTOSTERONE','GROUPON-SCREAM','GROUPON-COMPLETE')),
  groupon_package_name text not null,
  customer_id uuid not null references auth.users(id),
  customer_name text not null,
  customer_email text not null,
  order_id uuid references public.orders(id),
  source text not null default 'groupon' check (source = 'groupon'),
  status text not null default 'Pending Verification' check (status in ('Pending Verification','Verified','Redeemed','Rejected','Cancelled')),
  submitted_at timestamptz not null default now(),
  verified_at timestamptz,
  redeemed_at timestamptz,
  internal_notes text not null default '',
  version integer not null default 1,
  reference_components jsonb not null default '{}'::jsonb
);
create index groupon_customer_idx on public.groupon_redemptions(customer_id, submitted_at desc);
create index groupon_order_idx on public.groupon_redemptions(order_id);
create table public.groupon_redemption_events (
  id uuid primary key default gen_random_uuid(),
  redemption_id uuid not null references public.groupon_redemptions(id),
  actor_id uuid not null references auth.users(id),
  previous_status text,
  status text not null,
  event_name text not null,
  internal_note text not null default '',
  created_at timestamptz not null default now()
);
alter table public.groupon_redemptions enable row level security;
alter table public.groupon_redemption_events enable row level security;
-- Full codes/notes never exposed through the browser Data API, even to owners.
revoke all on public.groupon_redemptions, public.groupon_redemption_events from public, anon, authenticated;
grant select, insert, update on public.groupon_redemptions to service_role;
grant select, insert on public.groupon_redemption_events to service_role;

-- Invoker functions: only service_role can execute, after Edge verifies the caller.
create function public.submit_groupon_redemption(p_code text, p_package text, p_name text, p_customer uuid, p_customer_name text, p_email text, p_components jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare r public.groupon_redemptions;
begin
  insert into public.groupon_redemptions(redemption_code,groupon_package_id,groupon_package_name,customer_id,customer_name,customer_email,reference_components)
  values(btrim(p_code),p_package,p_name,p_customer,p_customer_name,p_email,p_components)
  on conflict(redemption_code) do nothing returning * into r;
  if r.id is null then
    select * into r from public.groupon_redemptions where redemption_code=btrim(p_code);
    if r.customer_id is distinct from p_customer or r.status <> 'Pending Verification' then
      return jsonb_build_object('error','duplicate');
    end if;
    -- Same owner retry returns original package/order, never silently reassigns it.
    return jsonb_build_object('redemption',to_jsonb(r),'existing',true);
  end if;
  insert into public.groupon_redemption_events(redemption_id,actor_id,status,event_name) values(r.id,p_customer,r.status,'groupon_redemption_submitted');
  return jsonb_build_object('redemption',to_jsonb(r),'existing',false);
end $$;

create function public.update_groupon_redemption(p_id uuid,p_status text,p_note text,p_version integer,p_confirm boolean,p_actor uuid,p_order uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare r public.groupon_redemptions; old_status text;
begin
  select * into r from public.groupon_redemptions where id=p_id for update;
  if not found then return jsonb_build_object('error','not_found'); end if;
  if r.version <> p_version then return jsonb_build_object('error','stale'); end if;
  if not (r.status=p_status or (r.status='Pending Verification' and p_status in ('Verified','Rejected','Cancelled')) or (r.status='Verified' and p_status in ('Redeemed','Rejected','Cancelled'))) then
    return jsonb_build_object('error','transition');
  end if;
  if p_status='Redeemed' and r.status<>'Redeemed' and p_confirm is distinct from true then return jsonb_build_object('error','confirmation'); end if;
  if p_order is not null and not exists(select 1 from public.orders where id=p_order and customer_user_id=r.customer_id) then
    return jsonb_build_object('error','order');
  end if;
  if r.order_id is not null and p_order is distinct from r.order_id then return jsonb_build_object('error','order'); end if;
  old_status := r.status;
  update public.groupon_redemptions set status=p_status,internal_notes=p_note,order_id=p_order,
    verified_at=case when p_status='Verified' then coalesce(verified_at,now()) else verified_at end,
    redeemed_at=case when p_status='Redeemed' then coalesce(redeemed_at,now()) else redeemed_at end,
    version=version+1 where id=p_id returning * into r;
  insert into public.groupon_redemption_events(redemption_id,actor_id,previous_status,status,internal_note,event_name)
    values(r.id,p_actor,old_status,r.status,p_note,case when old_status=r.status then 'groupon_redemption_review_updated' else 'groupon_redemption_' || lower(r.status) end);
  return jsonb_build_object('redemption',to_jsonb(r));
end $$;
revoke all on function public.submit_groupon_redemption(text,text,text,uuid,text,text,jsonb) from public,anon,authenticated;
revoke all on function public.update_groupon_redemption(uuid,text,text,integer,boolean,uuid,uuid) from public,anon,authenticated;
grant execute on function public.submit_groupon_redemption(text,text,text,uuid,text,text,jsonb) to service_role;
grant execute on function public.update_groupon_redemption(uuid,text,text,integer,boolean,uuid,uuid) to service_role;
commit;
