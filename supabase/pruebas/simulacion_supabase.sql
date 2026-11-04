-- Simulación mínima de Supabase (roles anon/authenticated, auth.users y auth.uid()) para probar el
-- esquema en un PostgreSQL local. NO se ejecuta en Supabase.
create role anon nologin; create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key default gen_random_uuid(), raw_user_meta_data jsonb default '{}', is_anonymous boolean default false);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema public, auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
