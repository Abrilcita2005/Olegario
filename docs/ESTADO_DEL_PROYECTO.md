# Estado del proyecto — Olegario en Movimiento

> Leer este archivo al retomar una sesión. **Solo se trabaja dentro de la etapa autorizada.** Si hay dudas sobre el estado o la autorización, se consulta antes de avanzar.

| Campo                    | Valor                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Última actualización     | 2026-11-04                                                                                                                       |
| Rama de trabajo          | `claude/zen-hawking-g0erc1`                                                                                                      |
| Etapa actual             | **Etapa 8 — Espacios**                                                                                                           |
| Estado                   | Completada, pendiente de autorización para continuar                                                                             |
| Autorización de avance   | Etapa 8: concedida ("avanza", 2026-11-04). **Etapa 9: NO concedida.**                                                            |
| Próxima acción permitida | Correcciones dentro de la Etapa 8 si la responsable las pide. **No** empezar la Etapa 9 (Agenda) sin una autorización explícita. |

## Historial de autorizaciones

| Fecha      | Mensaje de la responsable                                                                                  | Qué autorizó                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-10-28 | "Avanza"                                                                                                   | Cerrar la Etapa 2 con pendientes abiertos y empezar la Etapa 3                                                                                   |
| 2026-10-28 | Respuestas al cuestionario                                                                                 | Stack Expo + React Native, iOS y Android, trabajo en la nube, dependencias base                                                                  |
| 2026-10-28 | "Sí, avanzá a la Etapa 4"                                                                                  | Empezar la Etapa 4 con colores de los SVG, Vástago + Inter y sin modo oscuro                                                                     |
| 2026-10-28 | "Sí, instalá las 4"                                                                                        | `expo-font`, `@expo-google-fonts/inter`, `react-native-svg`, `expo-linear-gradient`                                                              |
| 2026-10-28 | "Primero corregir la Etapa 4" · "Usar otra fuente" → "Poppins" · "Sí, como en Figma" · "Dejarlo como está" | Corregir la Etapa 4 (no avanzar todavía): Poppins en lugar de Vástago, aro en íconos de servicio, contraste aceptado                             |
| 2026-11-03 | "avanza" (tras la revisión del collage)                                                                    | Etapa 7: Home                                                                                                                                    |
| 2026-11-04 | "avanza" (tras "perfecto") + respuestas                                                                    | Etapa 8: horario libre 24 hs, 3 días de anticipación, cancelar hasta 30 min antes, toda reserva descuenta horas, Espacios filtrado desde el Home |
| 2026-11-03 | "avancemos la etapa 6" + respuestas                                                                        | Etapa 6: invitado mira e inscribe a eventos, sin Google/Apple/Face ID, Bienvenida 1 como Figma, términos provisorios, collage interactivo        |
| 2026-10-28 | "avanza" (Etapa 5) y "avanza" tras la pausa                                                                | Hacer y luego retomar la Etapa 5                                                                                                                 |

## Decisiones de la Etapa 5 (2026-10-28)

- Encabezado: isotipo → Home · ícono OLE/CAFÉ → carta del café · avatar → perfil de cuenta (no el de comunidad).
- Novedades: panel que sube desde abajo.
- Bienvenida: solo la primera vez.
- Dependencias aprobadas: `@react-native-async-storage/async-storage`, `expo-image-picker`.
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
- Etapa 8: Espacios con semana, buscador, filtro por servicio, horario, tarjetas con estado, reserva y cancelación simuladas; 75 pruebas. Capturas en `docs/capturas-app/etapa-8/`. Revisión 1: fotos reales de los espacios (Drive); "CAMBIAR" y el pie con horas aprobados.

## Pendientes abiertos

- Resto de preguntas abiertas en `DECISIONES_Y_PENDIENTES.md`.
- Prueba en un teléfono real (L-04).

## Preguntas abiertas para la responsable

- P-41: ¿la cookie de la promo es de avena o de chocolate?
- P-42: ¿"CREATIVO" con degradado (requiere una dependencia)?
- P-43: ¿aprueba las correcciones de texto de D-42?
- P-44: ¿hay foto de la Mesa con Luz Natural?
- P-45: ¿qué indican los puntos de color bajo los días?

## Último informe de cierre

2026-11-04: Etapa 8 (con la revisión 1), entregado en la conversación.
