# Servidor (Docker + PHP + MySQL) — Etapa 13

Decisión de la responsable (2026-11-04, D-68): **se deja Supabase** y el servidor pasa a ser
**Docker + PHP + MySQL + phpMyAdmin**. Siguen vigentes: pagos **simulados** y el contenido lo carga el
equipo (ahora desde phpMyAdmin).

## Cómo está armado (en palabras simples)

```
App (teléfono o web)  ──►  API en PHP (puerto 8080)  ──►  MySQL (base de datos)
                                                     ▲
                       phpMyAdmin (puerto 8082) ─────┘  panel para que el equipo cargue contenido
```

- La app **nunca** se conecta directo a MySQL: siempre pasa por la API, que controla quién ve qué.
- Las contraseñas se guardan cifradas (`password_hash` de PHP). La sesión es un token que la app
  guardará cifrado en el teléfono (`expo-secure-store`); en la base solo queda su huella.
- Las reglas de reserva (pasos de 30 min, hasta 3 días, lugar libre, horas suficientes, cancelar hasta
  30 min antes) se controlan **también en el servidor**, dentro de una transacción.

| Carpeta / archivo                      | Qué es                                                         |
| -------------------------------------- | -------------------------------------------------------------- |
| `servidor/docker-compose.yml`          | Los tres servicios: MySQL, la API y phpMyAdmin                 |
| `servidor/.env.example`                | Plantilla de contraseñas (se copia como `servidor/.env`)       |
| `servidor/db/01_esquema.sql`           | Tablas (**pendiente de aprobación**)                           |
| `servidor/db/02_contenido_inicial.sql` | Contenido de ejemplo de Figma y efemérides reales              |
| `servidor/api/`                        | La API en PHP (`public/index.php` lista todas las direcciones) |
| `servidor/pruebas/probar_api.php`      | 36 comprobaciones de punta a punta (solo en una base local)    |

## Qué guarda el servidor

| Tabla                                               | Qué tiene                                                    | Quién la ve / cambia                                |
| --------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| `usuarios`, `sesiones`                              | Correo, contraseña cifrada y sesiones abiertas               | Solo la API                                         |
| `perfiles`                                          | Nombre, profesión, foto, Modo Foco, sobre mí, ofrezco, busco | Cada uno edita el suyo                              |
| `membresias`                                        | Plan, horas mensuales y extras, vencimiento                  | Cada uno ve la suya; la ajusta el equipo            |
| `espacios`                                          | Los espacios para reservar                                   | Todos leen; carga el equipo                         |
| `reservas`                                          | Quién reservó qué espacio y cuándo                           | Cada uno ve las suyas; los demás solo ven "ocupado" |
| `eventos`, `inscripciones`                          | Eventos de la Agenda y Novedades, y quién se inscribió       | Todos leen los eventos; cada uno sus inscripciones  |
| `efemerides`, `novedades`, `talleres`, `beneficios` | Contenido                                                    | Todos leen; carga el equipo                         |
| `publicaciones`, `solicitudes`                      | Proyectos de Comunidad y pedidos de contacto                 | Quien envía y quien recibe                          |
| `paquetes`, `valoraciones`, `mensajes_equipo`       | Servicios del Perfil                                         | Cada uno los suyos; el equipo todos                 |

## Direcciones de la API (hechas y probadas)

Cuentas: `POST /cuentas/registro` · `POST /cuentas/ingreso` · `POST /cuentas/invitado` ·
`POST /cuentas/salir` · `GET`, `PATCH` y `DELETE /cuentas/yo`.
Reservas: `GET /espacios?desde=…&hasta=…` · `GET /horas` · `GET` y `POST /reservas` ·
`POST /reservas/{id}/cancelar`.
Agenda y contenido: `GET /eventos` · `POST` y `DELETE /eventos/{id}/inscripcion` · `GET /contenido`.
Falta: Comunidad (publicaciones, solicitudes, perfiles públicos) y servicios del Perfil.

## Pasos para la responsable (en tu computadora, con Docker)

1. Bajar los cambios de la rama y abrir una terminal en la carpeta `servidor/`.
2. Copiar la plantilla: `cp .env.example .env` y completar las dos contraseñas en `.env`
   (**no las compartas en el chat**).
3. Arrancar: `docker compose up -d` (la primera vez descarga las imágenes y carga las tablas).
4. Abrir http://localhost:8080/salud → tiene que decir `{"ok":true,"base":true}`.
5. Abrir http://localhost:8082 (phpMyAdmin) con el usuario `olegario` y la contraseña de `.env`.
6. Opcional, para comprobar todo: `docker compose run --rm -v ./pruebas:/pruebas api php /pruebas/probar_api.php http://api`
   (crea y borra cuentas de prueba: usalo solo mientras la base no tenga datos reales).

## Estado

- [x] Docker (MySQL 8.4, PHP 8.3 con Apache, phpMyAdmin 5.2) escrito.
- [x] Esquema y contenido inicial pasados a MySQL; cargan sin errores (también dos veces seguidas)
      en un MySQL 8.0 de la nube.
- [x] API de cuentas, reservas, agenda y contenido: 36 de 36 comprobaciones correctas en la nube.
- [ ] Aprobación del esquema MySQL por la responsable.
- [ ] Probar `docker compose up` en la computadora de la responsable (en la nube Docker Hub rechazó
      la descarga de imágenes por exceso de pedidos).
- [ ] Conectar la app a la API (`EXPO_PUBLIC_API_URL`), con los datos de prueba si no hay servidor.
- [ ] Comunidad y servicios del Perfil en la API.
- [ ] Decidir dónde se aloja el servidor para usarlo desde los teléfonos (hoy es solo local).
- [ ] Qué hacer con los archivos de Supabase (`supabase/`, `src/services/supabase.ts`,
      `src/services/cuentaServidor.ts`) y el paquete `@supabase/supabase-js`.
