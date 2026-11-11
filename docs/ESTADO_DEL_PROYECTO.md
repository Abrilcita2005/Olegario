# Estado del proyecto — Olegario en Movimiento

> Leer este archivo al retomar una sesión. **Solo se trabaja dentro de la etapa autorizada.** Si hay dudas sobre el estado o la autorización, se consulta antes de avanzar.

| Campo                    | Valor                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Última actualización     | 2026-11-11                                                                                                   |
| Rama de trabajo          | `claude/gallant-fermi-66n1rh`                                                                                |
| Etapa actual             | **Etapa 14 — Pruebas funcionales, visuales, de accesibilidad y de uso**                                      |
| Estado                   | En curso (desde 2026-11-11). Etapa 13 completada (servidor Docker + PHP + MySQL; Hostinger pendiente)        |
| Autorización de avance   | Etapa 14: concedida ("Avancemos a la siguiente etapa", 2026-11-11). **Etapa 15: NO concedida.**              |
| Próxima acción permitida | Trabajar en la Etapa 14 (pruebas y correcciones). **No** empezar la Etapa 15 sin una autorización explícita. |

## Historial de autorizaciones

| Fecha         | Mensaje de la responsable                                                                                  | Qué autorizó                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-11    | "Bueno eso dsp lo vemos. Avancemos a la siguiente etapa"                                                   | Etapa 14: Pruebas funcionales, visuales, de accesibilidad y de uso (Hostinger queda para después)                                                                                |
| 2026-11-11    | "Es MySQL"                                                                                                 | Hostinger usa MySQL (base `U275204779_Olegario`; falta confirmar mayúsculas/minúsculas)                                                                                          |
| 2026-11-11    | "Quiero unir los dos sistemas" + respuestas                                                                | Plano de Vercel al servidor (deja Firebase), los 21 espacios del plano, entrada directa con código (tabla `codigos_acceso` aprobada) (D-73)                                      |
| 2026-11-11    | "Antes de avanzar… incorporar 2 cosas" + respuestas                                                        | "Conocé Olegario" y el plano de Vercel con poco protagonismo (D-72); instalar `expo-web-browser`; reservas del plano aparte "por ahora"                                          |
| 2026-11-11    | "No entendí esto, solucionalo vos" (P-47)                                                                  | Corrección de la Etapa 13: foto de perfil en el servidor y sobre mí/ofrezco/busco en Editar perfil (D-71)                                                                        |
| 2026-11-10/11 | "Continuamos?" · "Avancemos así terminamos"                                                                | Terminar la Etapa 13 (reservas, agenda, Comunidad y servicios del Perfil con la API); no autoriza la Etapa 14                                                                    |
| 2026-11-04    | "SI" (esquema) · "SI" (Supabase) · Hostinger                                                               | Esquema MySQL aprobado; borrar Supabase y desinstalar `@supabase/supabase-js`; servidor final en Hostinger (base `U275204779_Olegario`), por ahora en local                      |
| 2026-11-04    | "Olvida supabase, vamos a utilizar Docker… php, mysql, phpmyadmin"                                         | Cambiar el servidor a Docker + PHP + MySQL + phpMyAdmin (D-68). El esquema MySQL queda pendiente de aprobación                                                                   |
| 2026-10-28    | "Avanza"                                                                                                   | Cerrar la Etapa 2 con pendientes abiertos y empezar la Etapa 3                                                                                                                   |
| 2026-10-28    | Respuestas al cuestionario                                                                                 | Stack Expo + React Native, iOS y Android, trabajo en la nube, dependencias base                                                                                                  |
| 2026-10-28    | "Sí, avanzá a la Etapa 4"                                                                                  | Empezar la Etapa 4 con colores de los SVG, Vástago + Inter y sin modo oscuro                                                                                                     |
| 2026-10-28    | "Sí, instalá las 4"                                                                                        | `expo-font`, `@expo-google-fonts/inter`, `react-native-svg`, `expo-linear-gradient`                                                                                              |
| 2026-10-28    | "Primero corregir la Etapa 4" · "Usar otra fuente" → "Poppins" · "Sí, como en Figma" · "Dejarlo como está" | Corregir la Etapa 4 (no avanzar todavía): Poppins en lugar de Vástago, aro en íconos de servicio, contraste aceptado                                                             |
| 2026-11-03    | "avanza" (tras la revisión del collage)                                                                    | Etapa 7: Home                                                                                                                                                                    |
| 2026-11-04    | Respuestas y "aprobado"                                                                                    | Supabase, pagos simulados, contenido desde el panel, sin sistema previo; instalar `@supabase/supabase-js` y `expo-secure-store`; esquema aprobado                                |
| 2026-11-04    | "avancemos" (tras la Etapa 12)                                                                             | Etapa 13: Integraciones, persistencia y backend                                                                                                                                  |
| 2026-11-04    | Respuestas de la Etapa 12                                                                                  | Fotos por Drive, "Pedir al barista" abre la carta, "Últimos cupos" inscribe, contador siempre activo                                                                             |
| 2026-11-04    | "avancemos a la etapa 12"                                                                                  | Etapa 12: Novedades                                                                                                                                                              |
| 2026-11-04    | "revisemos" + referencia del perfil de Comunidad                                                           | Rehacer el perfil público como en Figma con la foto de Martina Rossi                                                                                                             |
| 2026-11-04    | Respuestas + captura del Perfil                                                                            | Pagos y horas extras simulados, 6 servicios provisorios, editar perfil/cerrar sesión/eliminar cuenta al final; captura de PERFIL por Drive                                       |
| 2026-11-04    | "avanza" (tras la Etapa 10)                                                                                | Etapa 11: Perfil de cuenta y membresías                                                                                                                                          |
| 2026-11-04    | "Avancemos" + respuestas                                                                                   | Etapa 10: solicitudes simuladas para contactar/postularse/sumarse, formulario provisorio para publicar, Modo Foco oculta de las listas y la ubicación, perfil público provisorio |
| 2026-11-04    | Revisión 2 de la Etapa 9                                                                                   | Sumar fechas de Mendoza a las efemérides                                                                                                                                         |
| 2026-11-04    | Revisión de la Etapa 9                                                                                     | Puntos por color aprobados; calendario de efemérides reales (solo en su día)                                                                                                     |
| 2026-11-04    | "si avancemos" + respuestas                                                                                | Etapa 9: PIN de prueba copiable (instalar `expo-clipboard`), "MODIFICAR" abre el detalle, tocar un día muestra lo de ese día, fotos de eventos y personas (Drive)                |
| 2026-11-04    | Respuestas a P-41 a P-45                                                                                   | Cookie de chocolate, puntos = reserva o evento, instalar `@react-native-masked-view/masked-view` para el degradado, aprobar textos de D-42                                       |
| 2026-11-04    | "avanza" (tras "perfecto") + respuestas                                                                    | Etapa 8: horario libre 24 hs, 3 días de anticipación, cancelar hasta 30 min antes, toda reserva descuenta horas, Espacios filtrado desde el Home                                 |
| 2026-11-03    | "avancemos la etapa 6" + respuestas                                                                        | Etapa 6: invitado mira e inscribe a eventos, sin Google/Apple/Face ID, Bienvenida 1 como Figma, términos provisorios, collage interactivo                                        |
| 2026-10-28    | "avanza" (Etapa 5) y "avanza" tras la pausa                                                                | Hacer y luego retomar la Etapa 5                                                                                                                                                 |

## Decisiones de la Etapa 5 (2026-10-28)

- Encabezado: isotipo → Home · ícono OLE/CAFÉ → carta del café · avatar → perfil de cuenta (no el de comunidad).
- Novedades: panel que sube desde abajo.
- Bienvenida: solo la primera vez.
- Dependencias aprobadas: `@react-native-async-storage/async-storage`, `expo-image-picker`. Etapa 8: `@react-native-masked-view/masked-view`. Etapa 9: `expo-clipboard`. Etapa 13: `expo-secure-store`, `expo-web-browser` (`@supabase/supabase-js` se desinstaló al dejar Supabase, D-68).
- Revisión 1: avatar con foto personal (galería o cámara) · carta del café con diseño provisional propio.
- Revisión 2: un solo botón "Cambiar foto" con menú · carta con foto y etiquetas, sin aviso de ejemplo, márgenes corregidos.
- Revisión 3: ilustraciones de productos y promo en la carta · tarjeta con el precio en recuadro claro y texto negro.
- Revisión 4: fotos reales de productos y promo (Drive de la responsable) en lugar de ilustraciones.

## Tareas completadas

- Etapas 1 y 2: auditoría y documentación.
- Etapa 3: proyecto Expo + Expo Router con 4 pestañas provisionales.
- Etapa 4: tokens (`src/theme/`), fuentes Poppins e Inter, logos y submarcas vectoriales, componentes base (`src/components/`), catálogo `/catalogo`, 20 pruebas. Revisión aplicada: Poppins, aro en íconos, contraste aceptado. Capturas en `docs/capturas-app/etapa-4/`.

- Etapa 5: navegación completa con sesión simulada, rutas protegidas, encabezado, barra inferior, Novedades y pantallas provisionales; 27 pruebas. Cuatro revisiones aplicadas; 33 pruebas. Capturas en `docs/capturas-app/etapa-5/`.

- Etapa 6: bienvenidas (collage interactivo), acceso, registro e inicio de sesión con validaciones; 45 pruebas. Capturas en `docs/capturas-app/etapa-6/`.
- Etapa 7: Home con saludo, banner, reserva actual (en curso / próxima / sin reserva / invitado) y servicios; 60 pruebas. Capturas en `docs/capturas-app/etapa-7/`.
- Etapa 13: servidor Docker + PHP + MySQL + phpMyAdmin (`servidor/`); cuentas, reservas, horas, agenda, Comunidad y servicios del Perfil con la API (sin servidor, datos de prueba); 139 pruebas de la app y 83 comprobaciones de la API. Detalle en `docs/BACKEND.md`.
- Etapa 12: Novedades con las tarjetas de Figma, carta del café, inscripción simulada y contador siempre activo; 112 pruebas. Capturas en `docs/capturas-app/etapa-12/`.
- Etapa 11: Perfil de cuenta según la captura de Figma: membresía, bolsa de horas, horas extras simuladas, 6 servicios provisorios, editar perfil y eliminar cuenta; 108 pruebas. Capturas en `docs/capturas-app/etapa-11/`.
- Etapa 10: Comunidad con Modo Foco, publicar (provisorio), filtros, solicitudes simuladas y perfil público provisorio; 99 pruebas. Capturas en `docs/capturas-app/etapa-10/`.
- Etapa 9: Agenda con filtros, semana con puntos de actividad, reserva con PIN de prueba copiable, calendario de efemérides reales, eventos con inscripción; 88 pruebas. Revisiones 1 y 2: efemérides reales por fecha, con fechas de Mendoza. Capturas en `docs/capturas-app/etapa-9/`.
- Etapa 8: Espacios con semana, buscador, filtro por servicio, horario, tarjetas con estado, reserva y cancelación simuladas; 75 pruebas. Capturas en `docs/capturas-app/etapa-8/`. Revisiones 1 a 3: fotos reales de los cuatro espacios (Drive), puntos de actividad bajo los días, cookie de chocolate, degradado en "CREATIVO" y "PERFECTO", textos de D-42 aprobados; "CAMBIAR" y el pie con horas aprobados.

## Pendientes abiertos

- Resto de preguntas abiertas en `DECISIONES_Y_PENDIENTES.md`.
- Prueba en un teléfono real (L-04).

## Cómo retomar (para la próxima sesión)

1. Etapa 14 en curso. Hecho (2026-11-11): recorrido automático y correcciones, comparación con Figma,
   kit de pruebas de uso. Informe: `docs/PRUEBAS_ETAPA_14.md`; kit: `docs/PRUEBAS_DE_USO.md`.
2. Falta (con la responsable): pruebas en teléfono real, VoiceOver/TalkBack, texto grande y las pruebas
   de uso con 3 personas; después, corregir en orden comprensión → flujo → errores → estética.
3. Servidor para probar en la nube: `docs/BACKEND.md` (MySQL con apt y `php -S ... -t servidor/api/public`).
4. Plano de reservas: `Abrilcita2005/olegario-reservas`, rama `claude/gallant-fermi-66n1rh` (D-73).
5. No empezar la Etapa 15 sin autorización explícita.

## Preguntas abiertas para la responsable

- P-48: ¿sumamos "Recuperar contraseña" (envío de correos desde Hostinger)?
- P-49: ¿subimos a 11 px los textos de 9–10 px de Figma?
- Pruebas de uso y en teléfono real: ¿cómo acceden las 3 personas a la app (tu compu con Expo Go o una versión web de prueba)?

- ¿Me pasás el enlace definitivo de "Conocé Olegario"? El actual es de prueba de Vercel y puede vencer.
- Hostinger: ¿el nombre exacto de la base es `U275204779_Olegario` o en minúsculas (`u275204779_olegario`)? Confirmarlo en hPanel → Bases de datos. (Motor: MySQL, confirmado 2026-11-11.)

- ¿Alguna efeméride lleva beneficio en OLE/CAFÉ? ¿Aprobás los textos de `data/efemerides.ts`?
- P-46: ¿sumamos la Vendimia (fecha variable)?
- ¿Cuál es el tercer filtro de Comunidad ("Buscan S…" en Figma)?

## Último informe de cierre

2026-11-11: Etapa 13, entregado en la conversación.
