
-- ユーザーごとの目標設定を保存するテーブル
create table public.daily_targets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_target integer not null default 8,
  updated_at timestamp with time zone not null default now()
);

-- RLS有効化
alter table public.daily_targets enable row level security;

-- データの取得許可（自身のみ）
create policy "Users can select their own target" on public.daily_targets
  for select
  using (auth.uid() = user_id);

-- 自身の設定のみ更新可能
create policy "Users can update their own target" on public.daily_targets
  for update
  using (auth.uid() = user_id);

-- 自身の設定のみinsert可
create policy "Users can insert their own target" on public.daily_targets
  for insert
  with check (auth.uid() = user_id);

