-- ============================================================
--  鲸鱼还账器 Supabase 数据库初始化脚本
--  在 Supabase Dashboard > SQL Editor 中整段粘贴运行即可
-- ============================================================

-- 1. 账单表
create table if not exists public.debts (
  id          uuid primary key default gen_random_uuid(),
  creditor    text not null,
  debtor      text not null,
  reason      text not null,
  count       integer not null,
  part        text not null,
  tool        text not null,
  date        date not null,
  ddl         date not null,
  confirmed   boolean not null default false,
  confirmed_at date,
  created_at  timestamptz not null default now()
);

-- 2. 还账记录表
create table if not exists public.repayments (
  id          uuid primary key default gen_random_uuid(),
  debt_id     uuid not null references public.debts(id) on delete cascade,
  count       integer not null,
  part        text,
  tool        text,
  date        date not null,
  created_at  timestamptz not null default now()
);

-- 3. 开启 RLS
alter table public.debts      enable row level security;
alter table public.repayments enable row level security;

-- 4. RLS 策略
-- debts 读
create policy "debts read for participants"
  on public.debts for select
  using ( auth.email() = creditor or auth.email() = debtor );

-- debts 插入
create policy "debts insert for participants"
  on public.debts for insert
  with check ( auth.email() = creditor or auth.email() = debtor );

-- debts 更新
create policy "debts update for participants"
  on public.debts for update
  using ( auth.email() = creditor or auth.email() = debtor );

-- debts 删除
create policy "debts delete for participants"
  on public.debts for delete
  using ( auth.email() = creditor or auth.email() = debtor );

-- repayments 读
create policy "repayments read for participants"
  on public.repayments for select
  using (
    exists (
      select 1 from public.debts d
      where d.id = debt_id
        and ( d.creditor = auth.email() or d.debtor = auth.email() )
    )
  );

-- repayments 插入
create policy "repayments insert for participants"
  on public.repayments for insert
  with check (
    exists (
      select 1 from public.debts d
      where d.id = debt_id
        and ( d.creditor = auth.email() or d.debtor = auth.email() )
    )
  );

-- repayments 删除
create policy "repayments delete for participants"
  on public.repayments for delete
  using (
    exists (
      select 1 from public.debts d
      where d.id = debt_id
        and ( d.creditor = auth.email() or d.debtor = auth.email() )
    )
  );

-- 5. 启用 Realtime
alter publication supabase_realtime add table public.debts;
alter publication supabase_realtime add table public.repayments;

-- ============================================================
--  说明：auth.email() 返回当前登录用户邮箱。
--  两用户各注册账号，记账时选对方为债主/欠账人即可。
--  RLS 保证只有账单当事人能看到和操作账单。
-- ============================================================
