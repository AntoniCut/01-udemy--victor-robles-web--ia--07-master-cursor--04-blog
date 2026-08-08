-- Privilegios de la tabla de artículos para los roles de la API
grant usage on schema public to anon, authenticated;
grant select on public.articles to anon;
grant select, insert, update, delete on public.articles to authenticated;
