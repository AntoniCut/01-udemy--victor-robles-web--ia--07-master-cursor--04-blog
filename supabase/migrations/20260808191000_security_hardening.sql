-- Endurecimiento de seguridad (avisos de los advisors de Supabase)
alter function public.set_updated_at() set search_path = '';
revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
