# Estado del proyecto — Olegario en Movimiento

> Leer este archivo al retomar una sesión. **Solo se trabaja dentro de la etapa autorizada.** Si hay dudas sobre el estado o la autorización, se consulta antes de avanzar.

| Campo                    | Valor                                                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Última actualización     | 2026-10-28                                                                                                                                            |
| Rama de trabajo          | `claude/zen-hawking-g0erc1`                                                                                                                           |
| Etapa actual             | **Etapa 5 — Navegación y estructura general**                                                                                                         |
| Estado                   | Completada, pendiente de autorización para continuar                                                                                                  |
| Autorización de avance   | Etapa 5: concedida ("avanza", 2026-10-28). **Etapa 6: NO concedida.**                                                                                 |
| Próxima acción permitida | Correcciones dentro de la Etapa 5 si la responsable las pide (dos revisiones ya aplicadas). **No** empezar la Etapa 6 sin una autorización explícita. |

## Historial de autorizaciones

| Fecha      | Mensaje de la responsable                                                                                  | Qué autorizó                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 2026-10-28 | "Avanza"                                                                                                   | Cerrar la Etapa 2 con pendientes abiertos y empezar la Etapa 3                                                       |
| 2026-10-28 | Respuestas al cuestionario                                                                                 | Stack Expo + React Native, iOS y Android, trabajo en la nube, dependencias base                                      |
| 2026-10-28 | "Sí, avanzá a la Etapa 4"                                                                                  | Empezar la Etapa 4 con colores de los SVG, Vástago + Inter y sin modo oscuro                                         |
| 2026-10-28 | "Sí, instalá las 4"                                                                                        | `expo-font`, `@expo-google-fonts/inter`, `react-native-svg`, `expo-linear-gradient`                                  |
| 2026-10-28 | "Primero corregir la Etapa 4" · "Usar otra fuente" → "Poppins" · "Sí, como en Figma" · "Dejarlo como está" | Corregir la Etapa 4 (no avanzar todavía): Poppins en lugar de Vástago, aro en íconos de servicio, contraste aceptado |
| 2026-10-28 | "avanza" (Etapa 5) y "avanza" tras la pausa                                                                | Hacer y luego retomar la Etapa 5                                                                                     |

## Decisiones de la Etapa 5 (2026-10-28)

- Encabezado: isotipo → Home · ícono OLE/CAFÉ → carta del café · avatar → perfil de cuenta (no el de comunidad).
- Novedades: panel que sube desde abajo.
- Bienvenida: solo la primera vez.
- Dependencias aprobadas: `@react-native-async-storage/async-storage`, `expo-image-picker`.
- Revisión 1: avatar con foto personal (galería o cámara) · carta del café con diseño provisional propio.
- Revisión 2: un solo botón "Cambiar foto" con menú · carta con foto y etiquetas, sin aviso de ejemplo, márgenes corregidos.

## Tareas completadas

- Etapas 1 y 2: auditoría y documentación.
- Etapa 3: proyecto Expo + Expo Router con 4 pestañas provisionales.
- Etapa 4: tokens (`src/theme/`), fuentes Poppins e Inter, logos y submarcas vectoriales, componentes base (`src/components/`), catálogo `/catalogo`, 20 pruebas. Revisión aplicada: Poppins, aro en íconos, contraste aceptado. Capturas en `docs/capturas-app/etapa-4/`.

- Etapa 5: navegación completa con sesión simulada, rutas protegidas, encabezado, barra inferior, Novedades y pantallas provisionales; 27 pruebas. Dos revisiones aplicadas; 33 pruebas. Capturas en `docs/capturas-app/etapa-5/`.

## Pendientes abiertos

- Resto de preguntas abiertas en `DECISIONES_Y_PENDIENTES.md`.
- Prueba en un teléfono real (L-04).

## Último informe de cierre

2026-10-28: Etapa 5 (con la segunda revisión aplicada), entregado en la conversación.
