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

## Hostinger (servidor definitivo)

Decisión de la responsable (2026-11-04, D-69): el servidor final va a estar en **Hostinger**, con la base
de datos **`U275204779_Olegario`**. Por ahora se trabaja en local con Docker.

Para cuando se suba (todavía no se hizo):

- Hostinger no usa Docker: se suben los archivos de `servidor/api/` y la carpeta `public/` va dentro de
  `public_html` (el resto del código queda fuera, sin acceso desde internet).
- Las tablas se cargan desde el phpMyAdmin de Hostinger (pestaña Importar): primero
  `01_esquema.sql` y después `02_contenido_inicial.sql`. El contenido inicial funciona con MySQL y con
  MariaDB.
- Confirmar en hPanel el nombre exacto de la base con mayúsculas y minúsculas (en Hostinger suelen
  verse en minúsculas, por ejemplo `u275204779_olegario`), el usuario y si el motor es MySQL o MariaDB.
- La contraseña de la base **no va en el chat ni en GitHub**: va en un archivo de configuración del
  servidor fuera de `public_html` (falta definir cómo; hoy la API la lee de las variables de Docker).
- La app de producción apunta a la dirección de Hostinger con `EXPO_PUBLIC_API_URL` (con `https://`).

## Estado

- [x] Docker (MySQL 8.4, PHP 8.3 con Apache, phpMyAdmin 5.2) escrito.
- [x] Esquema MySQL **aprobado por la responsable (2026-11-04)**. Esquema y contenido inicial cargan
      sin errores (también dos veces seguidas) en un MySQL 8.0 de la nube.
- [x] API de cuentas, reservas, agenda y contenido: 36 de 36 comprobaciones correctas en la nube.
- [x] Supabase eliminado (archivos y paquete `@supabase/supabase-js`), con aprobación (2026-11-04).
- [x] Cuentas de la app conectadas a la API (`src/services/api.ts` y `cuentaServidor.ts`): registro,
      ingreso, invitado, salir, editar perfil y eliminar cuenta. Probado contra la API real
      (`tests/api.test.tsx` con `OLEGARIO_API_PRUEBA`) y en la versión web (registro → Home → cuenta
      en MySQL).
- [ ] Probar `docker compose up` en la computadora de la responsable (en la nube Docker Hub rechazó
      la descarga de imágenes por exceso de pedidos).
- [ ] Reservas y agenda de la app desde la API (la API ya está; falta la app).
- [ ] Comunidad y servicios del Perfil en la API y en la app.
- [ ] Subir a Hostinger (ver arriba).
