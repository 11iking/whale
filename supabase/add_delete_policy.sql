-- ? profiles ?? delete ??
create policy "profiles delete self"
  on public.profiles for delete
  using ( auth.email() = email );
