-- Tabla de artículos del blog de videojuegos
create table public.articles (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    excerpt text,
    content text not null,
    image_url text,
    published boolean not null default false,
    author_id uuid not null references auth.users (id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
create index articles_published_created_at_idx on public.articles (published, created_at desc);
create index articles_author_id_idx on public.articles (author_id);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now();
return new;
end;
$$;
create trigger articles_set_updated_at before
update on public.articles for each row execute function public.set_updated_at();
alter table public.articles enable row level security;
create policy "Artículos publicados visibles para todos" on public.articles for
select using (published = true);
create policy "Usuarios autenticados ven todos los artículos" on public.articles for
select to authenticated using (true);
create policy "Usuarios autenticados crean artículos" on public.articles for
insert to authenticated with check (auth.uid() = author_id);
create policy "Autores editan sus artículos" on public.articles for
update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Autores eliminan sus artículos" on public.articles for delete to authenticated using (auth.uid() = author_id);