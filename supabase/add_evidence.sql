-- ============================================================
--  证据截图功能：Storage 策略 + DB 列
--  在 Supabase Dashboard > SQL Editor 中整段粘贴运行
-- ============================================================

-- 1. debts 表增加 evidence 列（存 Storage 文件路径，可选）
alter table public.debts add column if not exists evidence text;

-- 2. repayments 表增加 evidence 列
alter table public.repayments add column if not exists evidence text;

-- 3. Storage RLS 策略（evidence bucket 已创建，此处添加读写策略）
--    已认证用户可上传
drop policy if exists "evidence upload for authenticated" on storage.objects;
create policy "evidence upload for authenticated"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'evidence' );

--    所有人可读（bucket 是 public 的）
drop policy if exists "evidence read public" on storage.objects;
create policy "evidence read public"
  on storage.objects for select
  using ( bucket_id = 'evidence' );

--    已认证用户可删除自己上传的
drop policy if exists "evidence delete for authenticated" on storage.objects;
create policy "evidence delete for authenticated"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'evidence' and owner = auth.uid() );

-- 4. 刷新 PostgREST schema cache（让新列生效）
--    通常 Supabase 会自动刷新，如未生效可手动通知
