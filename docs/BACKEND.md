# Servidor (Supabase) — Etapa 13

Decisiones de la responsable (2026-11-04): Olegario no usa otro sistema · servidor **Supabase** ·
pagos **simulados** por ahora · el contenido lo carga el equipo desde el panel de Supabase.

## Qué guarda el servidor (en palabras simples)

| Tabla                                               | Qué tiene                                                    | Quién la ve / cambia                                 |
| --------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| `perfiles`                                          | Nombre, profesión, foto, Modo Foco, sobre mí, ofrezco, busco | Cada uno edita el suyo; en Modo Foco nadie más lo ve |
| `membresias`                                        | Plan, horas mensuales y extras, vencimiento                  | Cada uno ve la suya; la ajusta el equipo             |
| `espacios`                                          | Los espacios para reservar                                   | Todos leen; carga el equipo                          |
| `reservas`                                          | Quién reservó qué espacio y cuándo                           | Cada uno ve las suyas; los demás solo ven "ocupado"  |
| `eventos`, `inscripciones`                          | Eventos de la Agenda y Novedades, y quién se inscribió       | Todos leen los eventos; cada uno sus inscripciones   |
| `efemerides`, `novedades`, `talleres`, `beneficios` | Contenido                                                    | Todos leen; carga el equipo                          |
| `publicaciones`, `solicitudes`                      | Proyectos de Comunidad y pedidos de contacto                 | Las solicitudes las ven quien envía y quien recibe   |
| `paquetes`, `valoraciones`, `mensajes_equipo`       | Servicios del Perfil                                         | Cada uno los suyos; el equipo todos                  |

Las reglas de reserva (pasos de 30 min, hasta 3 días, lugar libre, horas suficientes, cancelar hasta
30 min antes) se controlan **también en el servidor**. No se guardan datos de tarjetas ni contraseñas
(las contraseñas las maneja Supabase). Detalle técnico: `supabase/0001_esquema_inicial.sql`.

## Pasos para la responsable

1. Crear una cuenta gratis en https://supabase.com (con el correo de Olegario) y un proyecto nuevo
   llamado "olegario-en-movimiento", región **São Paulo** (la más cercana a Mendoza). Guardar la
   contraseña de la base de datos en un lugar seguro: **no la compartas en el chat**.
2. En Authentication → Sign In / Providers: dejar **Email** activado y activar **Anonymous sign-ins**
   (para el Modo invitado).
3. Cuando el esquema esté aprobado: SQL Editor → New query → pegar `supabase/0001_esquema_inicial.sql`
   → Run.
   3b. Cargar el contenido inicial: SQL Editor → New query → pegar `supabase/0002_contenido_inicial.sql`
   → Run (espacios, efemérides, eventos, novedades, talleres y beneficios que hoy usa la app; se
   pueden editar después desde Table Editor).
4. En Project Settings → API copiar **Project URL** y la clave **anon public** (nunca la
   `service_role`). Cargarlas en la configuración del entorno de la sesión de Claude (menú del entorno
   en la barra del título → Edit → variables de entorno) con estos nombres:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
5. En la misma configuración, en Network access, permitir los dominios `supabase.co` y `supabase.com`
   (para poder probar la conexión desde la sesión).
6. Abrir una sesión nueva (toma la configuración nueva) y avisar.

## Estado

- [x] Herramientas instaladas (aprobadas): `@supabase/supabase-js`, `expo-secure-store`.
- [x] Conexión preparada (`src/services/supabase.ts`): se activa sola con las dos variables.
- [x] Esquema escrito (`supabase/0001_esquema_inicial.sql`) — **aprobado por la responsable (2026-11-04)** y probado en un PostgreSQL local con `supabase/pruebas/` (19 comprobaciones: reservas, horas, privacidad, Modo Foco, invitado, cancelación y eliminar cuenta).
- [x] Proyecto de Supabase creado por la responsable (región West US).
- [x] Esquema ejecutado en Supabase por la responsable (Paso 2, 2026-11-04).
- [x] Contenido inicial escrito (`supabase/0002_contenido_inicial.sql`) y probado; se puede ejecutar más de una vez.
- [ ] Contenido inicial cargado y datos de conexión en la configuración del entorno (responsable).
- [ ] Pasar cada pantalla de los datos de prueba al servidor y cargar el contenido inicial.
