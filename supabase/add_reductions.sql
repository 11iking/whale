-- ============================================================
--  ???? + settings ?????????????
--  ? Supabase SQL Editor ????
-- ============================================================

-- 1. ?????????????????
create table if not exists public.reductions (
  id          uuid primary key default gen_random_uuid(),
  debt_id     uuid not null references public.debts(id) on delete cascade,
  count       integer not null,           -- ???????
  reason      text,                        -- ????
  date        date not null,
  created_by  text not null,              -- ????????????
  created_at  timestamptz not null default now()
);

-- 2. ??????????????
create table if not exists public.settings (
  id          text primary key default 'default',
  daily_rate  integer not null default 1,  -- ???? %
  updated_at  timestamptz not null default now()
);

-- ??????
insert into public.settings (id, daily_rate) values ('default', 1)
  on conflict (id) do nothing;

-- 3. ?? RLS
alter table public.reductions enable row level security;
alter table public.settings enable row level security;

-- 4. reductions ?????????????????
create policy "reductions read for participants"
  on public.reductions for select
  using ( exists ( select 1 from public.debts d where d.id = debt_id and ( d.creditor = auth.email() or d.debtor = auth.email() ) ) );

create policy "reductions insert by creditor"
  on public.reductions for insert
  with check ( exists ( select 1 from public.debts d where d.id = debt_id and d.creditor = auth.email() ) and created_by = auth.email() );

create policy "reductions delete by creditor"
  on public.reductions for delete
  using ( exists ( select 1 from public.debts d where d.id = debt_id and d.creditor = auth.email() ) );

-- 5. settings ?????????????????
create policy "settings read for authenticated"
  on public.settings for select
  using ( auth.role() = 'authenticated' );

create policy "settings update for authenticated"
  on public.settings for update
  using ( auth.role() = 'authenticated' );

-- 6. Realtime
alter publication supabase_realtime add table public.reductions;
alter publication supabase_realtime add table public.settings;
