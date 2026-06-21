-- Run this in Supabase SQL Editor

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  language text not null default 'Python',
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Project files table
create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  content text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table projects enable row level security;
alter table project_files enable row level security;

-- Projects policies
create policy "Users manage own projects" on projects
  for all using (auth.uid() = user_id);

-- Project files policies (access via project ownership)
create policy "Users manage own project files" on project_files
  for all using (
    exists (
      select 1 from projects where projects.id = project_files.project_id and projects.user_id = auth.uid()
    )
  );

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();

create trigger project_files_updated_at before update on project_files
  for each row execute function update_updated_at();
