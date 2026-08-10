-- Tabla de categorías del blog
create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    created_at timestamptz not null default now()
);

-- Relación artículo → categoría (opcional)
alter table public.articles
    add column category_id uuid references public.categories (id) on delete set null;

create index articles_category_id_idx on public.articles (category_id);
create index categories_slug_idx on public.categories (slug);

-- RLS categorías: lectura pública, gestión solo autenticados
alter table public.categories enable row level security;

create policy "Categorías visibles para todos"
    on public.categories
    for select
    using (true);

create policy "Usuarios autenticados crean categorías"
    on public.categories
    for insert
    to authenticated
    with check (true);

create policy "Usuarios autenticados editan categorías"
    on public.categories
    for update
    to authenticated
    using (true)
    with check (true);

create policy "Usuarios autenticados eliminan categorías"
    on public.categories
    for delete
    to authenticated
    using (true);

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;

-- Categorías iniciales (diseño del editor)
insert into public.categories (name, slug) values
    ('Hardware & Periféricos', 'hardware'),
    ('eSports Competitivo', 'esports'),
    ('Reviews de Juegos', 'reviews'),
    ('Noticias de la Industria', 'news');
