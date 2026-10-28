# Estado del proyecto — Olegario en Movimiento

> Leer este archivo al retomar una sesión. **Solo se trabaja dentro de la etapa autorizada.** Si hay dudas sobre el estado o la autorización, se consulta antes de avanzar.

| Campo                    | Valor                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Última actualización     | 2026-10-28                                                                                                                           |
| Rama de trabajo          | `claude/zen-hawking-g0erc1`                                                                                                          |
| Etapa actual             | **Etapa 4 — Sistema de diseño y componentes base**                                                                                   |
| Estado                   | Completada, pendiente de autorización para continuar                                                                                 |
| Autorización de avance   | Etapa 4: concedida (2026-10-28). **Etapa 5: NO concedida.**                                                                          |
| Próxima acción permitida | Correcciones dentro de la Etapa 4 si la responsable las pide. **No** empezar la Etapa 5 (navegación) sin una autorización explícita. |

## Historial de autorizaciones

| Fecha      | Mensaje de la responsable  | Qué autorizó                                                                        |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------- |
| 2026-10-28 | "Avanza"                   | Cerrar la Etapa 2 con pendientes abiertos y empezar la Etapa 3                      |
| 2026-10-28 | Respuestas al cuestionario | Stack Expo + React Native, iOS y Android, trabajo en la nube, dependencias base     |
| 2026-10-28 | "Sí, avanzá a la Etapa 4"  | Empezar la Etapa 4 con colores de los SVG, Vástago + Inter y sin modo oscuro        |
| 2026-10-28 | "Sí, instalá las 4"        | `expo-font`, `@expo-google-fonts/inter`, `react-native-svg`, `expo-linear-gradient` |

## Tareas completadas

- Etapas 1 y 2: auditoría y documentación.
- Etapa 3: proyecto Expo + Expo Router con 4 pestañas provisionales.
- Etapa 4: tokens (`src/theme/`), fuentes Vástago e Inter, logos y submarcas vectoriales, componentes base (`src/components/`), catálogo `/catalogo`, 19 pruebas. Capturas en `docs/capturas-app/etapa-4/`.

## Pendientes abiertos

- **P-34: licencia de Vástago y repositorio público** (las fuentes están fuera de Git; L-06).
- P-35 aro de los íconos de servicio · L-05 contraste del blanco sobre degradado.
- Resto de preguntas abiertas en `DECISIONES_Y_PENDIENTES.md`.
- Prueba en un teléfono real (L-04).

## Para retomar en una sesión nueva

Las fuentes Vástago no están en Git: hay que bajarlas de la carpeta de Drive de la responsable ("TIPOGRAFIAS/VASTAGO GROTESK FONT") a `assets/fuentes/` antes de compilar (pesos Medium, SemiBold, Bold, Heavy y Black).

## Último informe de cierre

2026-10-28: Etapa 4, entregado en la conversación.
