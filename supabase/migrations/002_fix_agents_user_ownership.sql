alter table public.agents
add column if not exists user_id uuid;

alter table public.agents
alter column user_id set default auth.uid();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'agents_user_id_fkey'
      and conrelid = 'public.agents'::regclass
  ) then
    alter table public.agents
    add constraint agents_user_id_fkey
    foreign key (user_id)
    references auth.users(id)
    on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'agents_user_id_required'
      and conrelid = 'public.agents'::regclass
  ) then
    alter table public.agents
    add constraint agents_user_id_required
    check (user_id is not null)
    not valid;
  end if;
end $$;

create index if not exists agents_user_id_created_at_idx
on public.agents(user_id, created_at desc);

alter table public.agents enable row level security;

drop policy if exists "Users can read their own agents" on public.agents;
create policy "Users can read their own agents"
on public.agents
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own agents" on public.agents;
create policy "Users can create their own agents"
on public.agents
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own agents" on public.agents;
create policy "Users can update their own agents"
on public.agents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own agents" on public.agents;
create policy "Users can delete their own agents"
on public.agents
for delete
to authenticated
using (auth.uid() = user_id);
