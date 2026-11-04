-- Pruebas de las reglas del esquema (reservas, privacidad, invitado, eliminar cuenta) en un
-- PostgreSQL local con simulacion_supabase.sql. NO se ejecuta en Supabase.
\set QUIET on
-- Como en Supabase: los roles tienen permisos sobre las tablas; RLS decide qué filas.
grant select, insert, update, delete on all tables in schema public to authenticated;
insert into auth.users (id, raw_user_meta_data) values
 ('00000000-0000-0000-0000-00000000000a', '{"nombre":"Ana","profesion":"Diseño"}'),
 ('00000000-0000-0000-0000-00000000000b', '{"nombre":"Beto","profesion":"Dev"}');
insert into auth.users (id, is_anonymous) values ('00000000-0000-0000-0000-00000000000c', true);
insert into public.espacios (id, servicio, nombre, tipo, ubicacion, capacidad) values
 ('rincon', 'cowork', 'Rincón', 'Puesto', 'Ala Oeste', 1);
select 'perfiles creados: ' || string_agg(nombre || '/' || rol, ', ' order by nombre) from public.perfiles;
select 'membresías: ' || count(*) from public.membresias;

create function pg_temp.como(usuario text) returns void language plpgsql as $$
begin perform set_config('request.jwt.claim.sub', usuario, false); end $$;
create function pg_temp.probar(nombre text, sentencia text) returns text language plpgsql as $$
begin execute sentencia; return '✔ ' || nombre || ': OK';
exception when others then return '✘ ' || nombre || ': ' || sqlerrm; end $$;

select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select pg_temp.probar('Ana reserva dentro de 2 h', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values (auth.uid(), 'rincon', %L, %L)$q$, date_trunc('hour', now()) + interval '2 hours', date_trunc('hour', now()) + interval '4 hours'));
select pg_temp.probar('reserva en el pasado (debe fallar)', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values (auth.uid(), 'rincon', %L, %L)$q$, date_trunc('hour', now()) - interval '2 hours', date_trunc('hour', now()) - interval '1 hours'));
select pg_temp.probar('reserva a 5 días (debe fallar)', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values (auth.uid(), 'rincon', %L, %L)$q$, date_trunc('day', now()) + interval '5 days 10 hours', date_trunc('day', now()) + interval '5 days 11 hours'));
select pg_temp.probar('reserva de 15 min (debe fallar)', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values (auth.uid(), 'rincon', %L, %L)$q$, date_trunc('hour', now()) + interval '30 hours', date_trunc('hour', now()) + interval '30 hours 15 minutes'));
select pg_temp.probar('reserva de 90 hs (debe fallar: horas)', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values (auth.uid(), 'rincon', %L, %L)$q$, date_trunc('hour', now()) + interval '5 hours', date_trunc('hour', now()) + interval '95 hours'));
select pg_temp.probar('Ana se pone rol equipo (debe fallar)', $q$update perfiles set rol = 'equipo' where id = auth.uid()$q$);
select 'rol de Ana: ' || rol from perfiles where id = auth.uid();
select 'horas de Ana: ' || horas_totales || ' / usadas ' || horas_usadas || ' / disponibles ' || horas_disponibles from horas_del_plan(auth.uid());
reset role;

select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set role authenticated;
select pg_temp.probar('Beto reserva el mismo horario (debe fallar: sin lugar)', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values (auth.uid(), 'rincon', %L, %L)$q$, date_trunc('hour', now()) + interval '3 hours', date_trunc('hour', now()) + interval '5 hours'));
select pg_temp.probar('Beto reserva a nombre de Ana (debe fallar)', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values ('00000000-0000-0000-0000-00000000000a', 'rincon', %L, %L)$q$, date_trunc('hour', now()) + interval '6 hours', date_trunc('hour', now()) + interval '7 hours'));
select 'reservas que ve Beto: ' || count(*) from reservas;
select 'ocupación que ve Beto: ' || count(*) || ' (sin saber de quién)' from ocupacion(now(), now() + interval '1 day');
select 'horas de Ana vistas por Beto: ' || count(*) from horas_del_plan('00000000-0000-0000-0000-00000000000a');
update perfiles set modo_comunidad = 'foco' where id = auth.uid();
reset role;

select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select 'perfiles que ve Ana (Beto en Modo Foco, invitado oculto): ' || string_agg(nombre, ', ') from perfiles;
reset role;

select pg_temp.como('00000000-0000-0000-0000-00000000000c');
set role authenticated;
select 'rol del invitado: ' || rol from perfiles where id = auth.uid();
select pg_temp.probar('invitado reserva (debe fallar)', format($q$insert into reservas (usuario_id, espacio_id, inicio, fin) values (auth.uid(), 'rincon', %L, %L)$q$, date_trunc('hour', now()) + interval '8 hours', date_trunc('hour', now()) + interval '9 hours'));
reset role;

-- Cancelar a menos de 30 min: se simula una reserva que empieza en 10 min (insertada como admin).
alter table reservas disable trigger validar_reserva;
insert into reservas (id, usuario_id, espacio_id, inicio, fin) values ('00000000-0000-0000-0000-0000000000ff', '00000000-0000-0000-0000-00000000000a', 'rincon', date_trunc('hour', now()) + interval '30 hours', date_trunc('hour', now()) + interval '31 hours');
update reservas set inicio = to_timestamp(ceil(extract(epoch from now()) / 1800) * 1800), fin = to_timestamp(ceil(extract(epoch from now()) / 1800) * 1800) + interval '1 hour' where id = '00000000-0000-0000-0000-0000000000ff';
select 'la reserva de prueba empieza en ' || round(extract(epoch from (inicio - now())) / 60) || ' min' from reservas where id = '00000000-0000-0000-0000-0000000000ff';
alter table reservas enable trigger validar_reserva;
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select pg_temp.probar('cancelar a menos de 30 min (debe fallar)', $q$update reservas set cancelada = true where id = '00000000-0000-0000-0000-0000000000ff'$q$);
select pg_temp.probar('Ana elimina su cuenta', $q$select eliminar_mi_cuenta()$q$);
reset role;
select 'después de eliminar: usuarios ' || (select count(*) from auth.users) || ', perfiles ' || (select count(*) from perfiles) || ', reservas ' || (select count(*) from reservas);
