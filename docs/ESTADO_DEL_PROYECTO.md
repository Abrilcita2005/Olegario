# Estado del proyecto — Olegario en Movimiento

> Leer este archivo al retomar una sesión. **Solo se trabaja dentro de la etapa autorizada.** Si hay dudas sobre el estado o la autorización, se consulta antes de avanzar.

| Campo                    | Valor                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Última actualización     | 2026-11-04                                                                                                                |
| Rama de trabajo          | `claude/zen-hawking-g0erc1`                                                                                               |
| Etapa actual             | **Etapa 11 — Perfil de cuenta y membresías**                                                                              |
| Estado                   | En pausa: esperando las respuestas de la responsable (diseño, pagos, servicios, cuenta)                                   |
| Autorización de avance   | Etapa 11: concedida ("avanza", 2026-11-04). **Etapa 12: NO concedida.**                                                   |
| Próxima acción permitida | Retomar la Etapa 11 con las respuestas pendientes (ver abajo). **No** empezar la Etapa 12 sin una autorización explícita. |

## Historial de autorizaciones

| Fecha      | Mensaje de la responsable                                                                                  | Qué autorizó                                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-28 | "Avanza"                                                                                                   | Cerrar la Etapa 2 con pendientes abiertos y empezar la Etapa 3                                                                                                                   |
| 2026-10-28 | Respuestas al cuestionario                                                                                 | Stack Expo + React Native, iOS y Android, trabajo en la nube, dependencias base                                                                                                  |
| 2026-10-28 | "Sí, avanzá a la Etapa 4"                                                                                  | Empezar la Etapa 4 con colores de los SVG, Vástago + Inter y sin modo oscuro                                                                                                     |
| 2026-10-28 | "Sí, instalá las 4"                                                                                        | `expo-font`, `@expo-google-fonts/inter`, `react-native-svg`, `expo-linear-gradient`                                                                                              |
| 2026-10-28 | "Primero corregir la Etapa 4" · "Usar otra fuente" → "Poppins" · "Sí, como en Figma" · "Dejarlo como está" | Corregir la Etapa 4 (no avanzar todavía): Poppins en lugar de Vástago, aro en íconos de servicio, contraste aceptado                                                             |
| 2026-11-03 | "avanza" (tras la revisión del collage)                                                                    | Etapa 7: Home                                                                                                                                                                    |
| 2026-11-04 | "avanza" (tras la Etapa 10)                                                                                | Etapa 11: Perfil de cuenta y membresías                                                                                                                                          |
| 2026-11-04 | "Avancemos" + respuestas                                                                                   | Etapa 10: solicitudes simuladas para contactar/postularse/sumarse, formulario provisorio para publicar, Modo Foco oculta de las listas y la ubicación, perfil público provisorio |
| 2026-11-04 | Revisión 2 de la Etapa 9                                                                                   | Sumar fechas de Mendoza a las efemérides                                                                                                                                         |
| 2026-11-04 | Revisión de la Etapa 9                                                                                     | Puntos por color aprobados; calendario de efemérides reales (solo en su día)                                                                                                     |
| 2026-11-04 | "si avancemos" + respuestas                                                                                | Etapa 9: PIN de prueba copiable (instalar `expo-clipboard`), "MODIFICAR" abre el detalle, tocar un día muestra lo de ese día, fotos de eventos y personas (Drive)                |
| 2026-11-04 | Respuestas a P-41 a P-45                                                                                   | Cookie de chocolate, puntos = reserva o evento, instalar `@react-native-masked-view/masked-view` para el degradado, aprobar textos de D-42                                       |
| 2026-11-04 | "avanza" (tras "perfecto") + respuestas                                                                    | Etapa 8: horario libre 24 hs, 3 días de anticipación, cancelar hasta 30 min antes, toda reserva descuenta horas, Espacios filtrado desde el Home                                 |
| 2026-11-03 | "avancemos la etapa 6" + respuestas                                                                        | Etapa 6: invitado mira e inscribe a eventos, sin Google/Apple/Face ID, Bienvenida 1 como Figma, términos provisorios, collage interactivo                                        |
| 2026-10-28 | "avanza" (Etapa 5) y "avanza" tras la pausa                                                                | Hacer y luego retomar la Etapa 5                                                                                                                                                 |

## Decisiones de la Etapa 5 (2026-10-28)

- Encabezado: isotipo → Home · ícono OLE/CAFÉ → carta del café · avatar → perfil de cuenta (no el de comunidad).
- Novedades: panel que sube desde abajo.
- Bienvenida: solo la primera vez.
- Dependencias aprobadas: `@react-native-async-storage/async-storage`, `expo-image-picker`. Etapa 8: `@react-native-masked-view/masked-view`. Etapa 9: `expo-clipboard`.
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
- Etapa 10: Comunidad con Modo Foco, publicar (provisorio), filtros, solicitudes simuladas y perfil público provisorio; 99 pruebas. Capturas en `docs/capturas-app/etapa-10/`.
- Etapa 9: Agenda con filtros, semana con puntos de actividad, reserva con PIN de prueba copiable, calendario de efemérides reales, eventos con inscripción; 88 pruebas. Revisiones 1 y 2: efemérides reales por fecha, con fechas de Mendoza. Capturas en `docs/capturas-app/etapa-9/`.
- Etapa 8: Espacios con semana, buscador, filtro por servicio, horario, tarjetas con estado, reserva y cancelación simuladas; 75 pruebas. Capturas en `docs/capturas-app/etapa-8/`. Revisiones 1 a 3: fotos reales de los cuatro espacios (Drive), puntos de actividad bajo los días, cookie de chocolate, degradado en "CREATIVO" y "PERFECTO", textos de D-42 aprobados; "CAMBIAR" y el pie con horas aprobados.

## Pendientes abiertos

- Resto de preguntas abiertas en `DECISIONES_Y_PENDIENTES.md`.
- Prueba en un teléfono real (L-04).

## Preguntas abiertas para la responsable

- Etapa 11 (sin responder): 1) diseño del Perfil provisorio con la estructura de Figma o captura por Drive; 2) horas extras y pagos simulados o solo informativos; 3) los 6 servicios provisorios o solo historial; 4) editar perfil, cerrar sesión y eliminar cuenta al final del perfil o en ajustes.

- ¿Alguna efeméride lleva beneficio en OLE/CAFÉ? ¿Aprobás los textos de `data/efemerides.ts`?
- P-46: ¿sumamos la Vendimia (fecha variable)?
- ¿Cuál es el tercer filtro de Comunidad ("Buscan S…" en Figma)?

## Último informe de cierre

2026-11-04: Etapa 10, entregado en la conversación.
