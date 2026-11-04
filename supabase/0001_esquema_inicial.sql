-- Olegario en Movimiento · Esquema inicial de Supabase (Etapa 13).
-- PENDIENTE DE APROBACIÓN de la responsable. No se ejecuta hasta que lo apruebe.
-- Cómo se usa: Supabase → SQL Editor → New query → pegar este archivo → Run.
--
-- Principios:
--  * Cada persona solo ve y cambia SUS datos (reservas, inscripciones, solicitudes, opiniones).
--  * El contenido (espacios, eventos, novedades, efemérides, talleres) lo leen todos los usuarios con
--    sesión y lo carga el equipo de Olegario desde el panel de Supabase (Table Editor).
--  * Las reglas de negocio se validan también en el servidor (no solo en la app).
--  * No se guardan datos de tarjetas ni contraseñas (las contraseñas las maneja Supabase Auth).

-- ───────────── Perfiles (uno por usuario de Supabase Auth) ─────────────
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 2 and 60),
  profesion text not null default '' check (char_length(profesion) <= 80),
  foto_url text,
  rol text not null default 'miembro' check (rol in ('miembro', 'invitado', 'equipo')),
  modo_comunidad text not null default 'abierta' check (modo_comunidad in ('abierta', 'foco')),
  sobre_mi text check (char_length(sobre_mi) <= 600),
  ofrezco text check (char_length(ofrezco) <= 300),
  busco text check (char_length(busco) <= 300),
  disponible boolean not null default false,
  creado_en timestamptz not null default now()
);

-- Crea el perfil al registrarse (nombre y profesión vienen del formulario de registro).
create function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- El "Modo invitado" usa el ingreso anónimo de Supabase: queda con rol invitado (D-34).
  insert into public.perfiles (id, nombre, profesion, rol)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'nombre', case when new.is_anonymous then 'Invitado' else 'Miembro' end),
          coalesce(new.raw_user_meta_data ->> 'profesion', ''),
          case when new.is_anonymous then 'invitado' else 'miembro' end);
  return new;
end $$;
create trigger al_registrarse after insert on auth.users
  for each row execute function public.crear_perfil();

create function public.es_equipo() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfiles where id = auth.uid() and rol = 'equipo')
$$;

-- ───────────── Membresía y horas ─────────────
create table public.membresias (
  usuario_id uuid primary key references public.perfiles (id) on delete cascade,
  plan text not null default 'Plan Pro Creativo',
  acceso text not null default 'Acceso 24/7 · Puesto Nómade',
  horas_mensuales int not null default 80 check (horas_mensuales >= 0),
  horas_extra numeric not null default 0 check (horas_extra >= 0),
  vence date,
  renovacion_automatica boolean not null default true
);

-- ───────────── Espacios y reservas ─────────────
create table public.espacios (
  id text primary key,
  servicio text not null check (servicio in ('cowork', 'stream', 'network', 'cafe')),
  nombre text not null,
  tipo text not null,
  ubicacion text not null,
  ambiente text[] not null default '{}',
  equipamiento text[] not null default '{}',
  etiqueta text,
  foto_url text,
  capacidad int not null default 1 check (capacidad > 0),
  activo boolean not null default true
);

create table public.reservas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  espacio_id text not null references public.espacios (id),
  inicio timestamptz not null,
  fin timestamptz not null,
  cancelada boolean not null default false,
  creada_en timestamptz not null default now(),
  check (fin > inicio),
  -- Pasos de 30 minutos (regla de la responsable, 2026-11-04).
  check (extract(epoch from inicio)::int % 1800 = 0 and extract(epoch from fin)::int % 1800 = 0)
);
create index on public.reservas (espacio_id, inicio, fin) where not cancelada;

-- Reglas de reserva en el servidor: no en el pasado, hasta 3 días de anticipación, con lugar libre y
-- con horas suficientes en el plan. Cancelar solo hasta 30 minutos antes.
create function public.validar_reserva() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  ocupados int; capacidad_espacio int; horas_disp numeric;
begin
  if tg_op = 'UPDATE' then
    if new.cancelada and not old.cancelada and old.inicio - now() < interval '30 minutes' then
      raise exception 'Las reservas se cancelan hasta 30 minutos antes.';
    end if;
    if new.inicio <> old.inicio or new.fin <> old.fin or new.espacio_id <> old.espacio_id then
      raise exception 'Para cambiar el horario, cancelá y reservá de nuevo.';
    end if;
    return new;
  end if;
  if new.inicio < now() then raise exception 'El horario ya empezó.'; end if;
  if new.inicio >= date_trunc('day', now()) + interval '4 days' then
    raise exception 'Se reserva con hasta 3 días de anticipación.';
  end if;
  select capacidad into capacidad_espacio from espacios where id = new.espacio_id and activo;
  select count(*) into ocupados from reservas
    where espacio_id = new.espacio_id and not cancelada and inicio < new.fin and new.inicio < fin;
  if ocupados >= capacidad_espacio then raise exception 'El espacio no tiene lugar en ese horario.'; end if;
  select horas_disponibles into horas_disp from public.horas_del_plan(new.usuario_id);
  if extract(epoch from (new.fin - new.inicio)) / 3600 > horas_disp then
    raise exception 'No te alcanzan las horas del plan.';
  end if;
  return new;
end $$;

-- Horas: mensuales + extras − reservas no canceladas del mes en curso.
create function public.horas_del_plan(usuario uuid)
returns table (horas_totales numeric, horas_usadas numeric, horas_disponibles numeric)
language sql stable security definer set search_path = public as $$
  -- Solo las horas propias (o el equipo): nadie puede consultar las de otra persona.
  with m as (select horas_mensuales + horas_extra as total from membresias
             where usuario_id = usuario and (usuario = auth.uid() or public.es_equipo())),
       u as (select coalesce(sum(extract(epoch from (fin - inicio)) / 3600), 0) as usadas
             from reservas where usuario_id = usuario and not cancelada
               and inicio >= date_trunc('month', now()))
  select m.total, u.usadas, greatest(m.total - u.usadas, 0) from m, u
$$;

create trigger validar_reserva before insert or update on public.reservas
  for each row execute function public.validar_reserva();

-- Ocupación de los espacios sin exponer quién reservó (para mostrar "Libre / Ocupado hasta").
create function public.ocupacion(desde timestamptz, hasta timestamptz)
returns table (espacio_id text, inicio timestamptz, fin timestamptz)
language sql stable security definer set search_path = public as $$
  select espacio_id, inicio, fin from reservas
  where not cancelada and inicio < hasta and desde < fin
$$;

-- ───────────── Agenda, novedades y comunidad (contenido del equipo) ─────────────
create table public.eventos (
  id text primary key,
  submarca text not null check (submarca in ('evento', 'afterOffice', 'itinerante')),
  titulo text not null,
  detalle text not null default '',
  inicio timestamptz not null,
  foto_url text,
  cupo int check (cupo > 0),
  activo boolean not null default true
);

create table public.efemerides (
  id text primary key,
  mes int not null check (mes between 1 and 12),
  dia int not null check (dia between 1 and 31),
  titulo text not null,
  texto text not null,
  beneficio text
);

create table public.novedades (
  id text primary key,
  titulo text not null,
  texto text not null,
  descuento text,
  foto_url text,
  accion text not null check (accion in ('carta', 'inscripcion')),
  evento_id text references public.eventos (id),
  orden int not null default 0,
  vigente_hasta date
);

create table public.talleres (
  id text primary key,
  tipo text not null,
  cuando text not null,
  titulo text not null,
  descripcion text not null,
  accion text not null default 'Sumarse'
);

create table public.inscripciones (
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  evento_id text not null references public.eventos (id) on delete cascade,
  creada_en timestamptz not null default now(),
  primary key (usuario_id, evento_id)
);

-- Cantidad de inscriptos sin exponer quiénes son.
create function public.cantidad_inscriptos(evento text) returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from inscripciones where evento_id = evento
$$;

create table public.publicaciones (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null references public.perfiles (id) on delete cascade,
  tipo text not null check (tipo in ('colaborador', 'iniciativa')),
  busca text check (char_length(busca) <= 50),
  titulo text not null check (char_length(titulo) between 5 and 80),
  descripcion text not null check (char_length(descripcion) between 20 and 400),
  etiquetas text[] not null default '{}',
  creada_en timestamptz not null default now()
);

-- Solicitudes de contacto/postulación: las ve quien la envía y quien la recibe.
create table public.solicitudes (
  id uuid primary key default gen_random_uuid(),
  de_id uuid not null references public.perfiles (id) on delete cascade,
  para_perfil uuid references public.perfiles (id) on delete cascade,
  publicacion_id uuid references public.publicaciones (id) on delete cascade,
  taller_id text references public.talleres (id) on delete cascade,
  mensaje text not null default '' check (char_length(mensaje) <= 300),
  creada_en timestamptz not null default now(),
  check (num_nonnulls(para_perfil, publicacion_id, taller_id) = 1)
);

-- ───────────── Perfil de cuenta: servicios ─────────────
create table public.paquetes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  descripcion text not null,
  estado text not null default 'Listo para retirar en recepción principal',
  retirado boolean not null default false
);

create table public.beneficios (
  id text primary key,
  titulo text not null,
  detalle text not null,
  lugar text not null
);

create table public.valoraciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  espacio_id text not null references public.espacios (id),
  estrellas int not null check (estrellas between 1 and 5),
  comentario text not null default '' check (char_length(comentario) <= 300),
  creada_en timestamptz not null default now()
);

create table public.mensajes_equipo (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  tipo text not null check (tipo in ('queja', 'sugerencia')),
  texto text not null check (char_length(texto) between 10 and 600),
  creado_en timestamptz not null default now()
);

-- ───────────── Reglas de acceso (RLS) ─────────────
alter table public.perfiles enable row level security;
alter table public.membresias enable row level security;
alter table public.espacios enable row level security;
alter table public.reservas enable row level security;
alter table public.eventos enable row level security;
alter table public.efemerides enable row level security;
alter table public.novedades enable row level security;
alter table public.talleres enable row level security;
alter table public.inscripciones enable row level security;
alter table public.publicaciones enable row level security;
alter table public.solicitudes enable row level security;
alter table public.paquetes enable row level security;
alter table public.beneficios enable row level security;
alter table public.valoraciones enable row level security;
alter table public.mensajes_equipo enable row level security;

-- Perfiles: cada uno edita el suyo; los demás solo ven a quienes están en "Conexión abierta"
-- (Modo Foco oculta a la persona, D-59). El rol no se puede autoasignar.
create policy "ver perfiles visibles" on public.perfiles for select to authenticated
  using (id = auth.uid() or modo_comunidad = 'abierta' or public.es_equipo());
create policy "editar mi perfil" on public.perfiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and rol = (select rol from public.perfiles where id = auth.uid()));

create policy "ver mi membresía" on public.membresias for select to authenticated
  using (usuario_id = auth.uid() or public.es_equipo());

-- Contenido: lo leen todos con sesión; lo escribe solo el equipo (o el panel de Supabase).
create policy "leer espacios" on public.espacios for select to authenticated using (true);
create policy "leer eventos" on public.eventos for select to authenticated using (true);
create policy "leer efemérides" on public.efemerides for select to authenticated using (true);
create policy "leer novedades" on public.novedades for select to authenticated using (true);
create policy "leer talleres" on public.talleres for select to authenticated using (true);
create policy "leer beneficios" on public.beneficios for select to authenticated using (true);

-- Reservas: cada uno ve, crea y cancela las suyas (las validaciones están en el trigger).
create policy "mis reservas" on public.reservas for select to authenticated
  using (usuario_id = auth.uid() or public.es_equipo());
create policy "reservar" on public.reservas for insert to authenticated
  with check (usuario_id = auth.uid()
    and (select rol from public.perfiles where id = auth.uid()) <> 'invitado');
create policy "cancelar mi reserva" on public.reservas for update to authenticated
  using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

create policy "mis inscripciones" on public.inscripciones for all to authenticated
  using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

create policy "leer publicaciones" on public.publicaciones for select to authenticated using (true);
create policy "publicar" on public.publicaciones for insert to authenticated
  with check (autor_id = auth.uid());
create policy "borrar mi publicación" on public.publicaciones for delete to authenticated
  using (autor_id = auth.uid() or public.es_equipo());

create policy "mis solicitudes" on public.solicitudes for select to authenticated
  using (de_id = auth.uid() or para_perfil = auth.uid()
    or publicacion_id in (select id from public.publicaciones where autor_id = auth.uid())
    or public.es_equipo());
create policy "enviar solicitud" on public.solicitudes for insert to authenticated
  with check (de_id = auth.uid());

create policy "mis paquetes" on public.paquetes for select to authenticated
  using (usuario_id = auth.uid() or public.es_equipo());

create policy "mis valoraciones" on public.valoraciones for all to authenticated
  using (usuario_id = auth.uid() or public.es_equipo()) with check (usuario_id = auth.uid());
create policy "mis mensajes" on public.mensajes_equipo for all to authenticated
  using (usuario_id = auth.uid() or public.es_equipo()) with check (usuario_id = auth.uid());

-- Al crear un perfil se crea su membresía con el plan por defecto (la ajusta el equipo).
create function public.crear_membresia() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.rol = 'miembro' then
    insert into public.membresias (usuario_id, vence)
    values (new.id, (date_trunc('month', now()) + interval '1 month - 1 day')::date);
  end if;
  return new;
end $$;
create trigger al_crear_perfil after insert on public.perfiles
  for each row execute function public.crear_membresia();

-- Eliminar cuenta (obligatorio en App Store): borra el usuario y, en cascada, todos sus datos.
create function public.eliminar_mi_cuenta() returns void
language sql security definer set search_path = public, auth as $$
  delete from auth.users where id = auth.uid()
$$;
revoke all on function public.eliminar_mi_cuenta() from public, anon;
grant execute on function public.eliminar_mi_cuenta() to authenticated;

-- Las funciones solo las usan personas con sesión.
revoke all on function public.horas_del_plan(uuid), public.ocupacion(timestamptz, timestamptz),
  public.cantidad_inscriptos(text), public.es_equipo() from public, anon;
grant execute on function public.horas_del_plan(uuid), public.ocupacion(timestamptz, timestamptz),
  public.cantidad_inscriptos(text), public.es_equipo() to authenticated;
