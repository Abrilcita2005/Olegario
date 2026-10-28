# Plan de trabajo — Olegario en Movimiento

> Etapas secuenciales. **No se inicia ninguna etapa sin la autorización explícita de la responsable.**
> Estados posibles: `Pendiente` · `En curso` · `Bloqueada` · `Completada (pendiente de autorización)` · `Completada y aprobada`.
> No hay fechas ni duraciones: faltan datos (P-16).
> Referencias `P-xx`, `D-xx` y `B-xx`: ver `DECISIONES_Y_PENDIENTES.md`.

## Protocolo de trabajo por etapas (obligatorio)

1. **Al empezar una etapa:** releer `OLEGARIO.md`, esta etapa y la guía maestra; listar tareas, dependencias y criterios; pedir lo que falte (preguntas agrupadas). Si no falta nada, avisarlo y empezar.
2. **Durante la etapa:** trabajar solo dentro de su alcance. Las tareas independientes pueden avanzar mientras otras esperan respuesta, si eso no genera trabajo descartable.
3. **Al terminar:** verificar, comparar con los criterios de aceptación, actualizar la guía, este plan, `ESTADO_DEL_PROYECTO.md` y las decisiones; presentar el **informe de cierre** y **detenerse**.
4. **Informe de cierre:** Etapa completada · Trabajo realizado · Verificaciones · Criterios de aceptación · Decisiones tomadas · Pendientes y limitaciones · Necesito de vos · Próxima etapa (solo el nombre, el objetivo y los requisitos) · Estado. Termina con: _"¿Querés que avance a la siguiente etapa o preferís que revisemos o corrijamos algo de esta etapa antes de continuar?"_
5. **Avance:** solo con una frase explícita ("Avanzá a la siguiente etapa", "Podés comenzar la etapa N", "Aprobado, continuá"…). Una corrección, un comentario positivo o el silencio **no** autorizan.
6. **Bloqueos:** explicar, contar qué se intentó, proponer alternativas y esperar. Una etapa con criterios sin cumplir no se declara completada.
7. **Ciclo interno de cada tarea:** releer → revisar el diseño → preguntar si falta algo → implementar en piezas chicas → probar de verdad → comparar con Figma → limpiar datos de prueba → documentar.
8. **Commits:** `Etapa N — Nombre` (o `Etapa N — Nombre: detalle`), solo en la rama de trabajo.

---

## Etapa 1 — Auditoría y relevamiento

- **Estado:** `Completada y aprobada`
- **Objetivo:** conocer el estado del repositorio, los materiales y el diseño.
- **Tareas:** ✅ inspeccionar el repositorio · ✅ leer la guía de referencia · ✅ inspeccionar Figma (parcial: límite del plan) · ✅ guardar capturas de referencia · ✅ registrar riesgos y pendientes.
- **Dependencias:** ninguna.
- **Archivos:** `docs/referencias/`, `docs/GUIA_MAESTRA_PROYECTO.md` §0.
- **Entregables:** informe de auditoría (guía §0) y capturas de 12 frames.
- **Criterios de aceptación:** ✅ estado del repo documentado · ✅ alcance real de la inspección de Figma declarado · ⚠️ 2 pantallas sin captura y 6 sin medidas exactas (B-03).
- **Pruebas:** no aplica (no hay código).
- **Riesgos:** decisiones tomadas con información parcial de Figma.
- **Pendiente:** P-26, P-27.

## Etapa 2 — Documentación y definición de requisitos

- **Estado:** `Completada con pendientes aceptados`: la responsable autorizó avanzar ("Avanza", 2026-10-28) con preguntas todavía abiertas. Las respuestas se incorporan cuando llegan.
- **Objetivo:** guía maestra, diseño, pantallas, decisiones y plan aprobados.
- **Tareas:** ✅ guía maestra · ✅ sistema de diseño e inventario de recursos · ✅ fichas de pantallas · ✅ registro de decisiones y preguntas · ✅ plan · ✅ estado del proyecto · ⏳ incorporar las respuestas · ⏳ completar las fichas P11 y P12 cuando haya capturas · ⏳ aprobar D-06 a D-11.
- **Dependencias:** respuestas a P-01 a P-16 (prioritarias).
- **Archivos:** `docs/*.md`, `OLEGARIO.md`.
- **Entregables:** documentación aprobada.
- **Criterios de aceptación:** stack, tipografías, colores, tema, alcance de invitado y backend decididos o con una opción provisional aprobada · fichas de las 13 pantallas completas.
- **Pruebas:** revisión de la documentación por la responsable.
- **Riesgos:** alcance creciente por pantallas sin diseño (R-5).

## Etapa 3 — Arquitectura y preparación del entorno

- **Estado:** `Completada y aprobada` (2026-10-28; la responsable autorizó la Etapa 4)
- **Objetivo:** proyecto vacío que arranca con un comando en el teléfono.
- **Resultado:** ✅ proyecto Expo SDK 58 creado en la carpeta actual · ✅ `expo-router` con 4 pestañas · ✅ TypeScript estricto, ESLint, Prettier y Jest · ✅ estructura de carpetas · ✅ README · ✅ guía §J · ✅ `.env.example` actualizado · ⚠️ no se probó en un teléfono (no hay dispositivo en la nube; D-13).
- **Tareas:** crear el proyecto Expo con TypeScript estricto en la carpeta actual (sin borrar `docs/`, `OLEGARIO.md` ni la configuración) · configurar `expo-router` · ESLint, Prettier y Jest · estructura de carpetas (guía §G.2) · actualizar `.env.example` con las variables reales · README con instrucciones · completar la guía §J con los comandos reales.
- **Dependencias:** aprobación del stack y de las dependencias a instalar (se listan antes de instalar).
- **Archivos:** `package.json`, `app.json`, `tsconfig.json`, `jest.config.js`, `eslint.config.js`, `.prettierrc.json`, `src/app/`, `src/components/PantallaEnConstruccion.tsx`, `tests/navegacion.test.tsx`, `README.md`, `.env.example`.
- **Entregables:** app "hola mundo" con las 4 pestañas vacías.
- **Criterios de aceptación:** ✅ `npx expo start` levanta · ⚠️ Expo Go no verificable en la nube (D-13) · ✅ `tsc`, lint, formato y pruebas pasan · ✅ `expo export` compila iOS, Android y web · ⚠️ README verificado solo en este entorno.
- **Pruebas:** ejecución en un teléfono o emulador, typecheck, lint y una prueba de ejemplo.
- **Riesgos:** diferencias de entorno (Windows, Mac).

## Etapa 4 — Sistema de diseño y componentes base

- **Estado:** `Completada (pendiente de autorización)`, 2026-10-28
- **Objetivo:** tokens y componentes reutilizables fieles a Figma.
- **Resultado:** ✅ tokens de color (SVG de marca), tipografía (Poppins + Inter), espaciado, radios y sombras en `src/theme/` · ✅ fuentes cargadas al iniciar · ✅ logos y 4 submarcas vectoriales · ✅ componentes base (`DISENO.md`, sección vigente) · ✅ estados provisionales · ✅ catálogo en `/catalogo` · ✅ correcciones de la revisión: Poppins en lugar de Vástago, aro en los íconos de servicio, contraste aceptado · ⏭️ barra de navegación, Novedades y encabezado pasan a la Etapa 5.
- **Tareas:** tokens (colores, tipografía, espaciado, radios, sombras) · cargar fuentes · exportar e incorporar logo, isotipo e íconos de servicio · componentes de `DISENO.md` §C.6 · estados de carga, vacío, error y deshabilitado (provisionales, para aprobar) · pantalla de muestra con todos los componentes.
- **Dependencias:** Etapa 3 y decisiones de diseño.
- **Archivos:** `src/theme/`, `src/components/`, `assets/`.
- **Entregables:** catálogo de componentes.
- **Criterios de aceptación:** ✅ componentes comparados con las capturas de Figma (catálogo en `docs/capturas-app/etapa-4/`) con las diferencias aprobadas (colores y fuentes) · ✅ sin colores sueltos fuera de los tokens · ✅ áreas táctiles ≥ 44 pt · ✅ etiquetas accesibles · ✅ contraste del texto blanco sobre degradado aceptado por la responsable (L-05, D-23).
- **Pruebas:** pruebas de renderizado y comparación visual manual.
- **Riesgos:** R-1, R-2, R-6.

## Etapa 5 — Navegación y estructura general

- **Estado:** `Completada (pendiente de autorización)`, 2026-10-28
- **Objetivo:** el esqueleto navegable completo.
- **Resultado:** ✅ sesión simulada con almacenamiento local (`src/estado/sesion.tsx`, `src/services/almacenamiento.ts`) · ✅ rutas protegidas: bienvenida (solo la primera vez) → acceso → app · ✅ encabezado (isotipo → Home, OLE/CAFÉ → carta del café, avatar → perfil) · ✅ barra inferior de Figma, fija · ✅ botón flotante Novedades con contador (datos de prueba) que abre el panel · ✅ pantallas provisionales: bienvenida, acceso, iniciar sesión, registro, 4 pestañas, perfil, carta del café, novedades · ✅ pantalla de ruta inexistente · ✅ "volver" con la flecha y con el botón del sistema. · ✅ Revisiones de la responsable aplicadas: foto de perfil con un botón "Cambiar foto" y menú de opciones; carta del café provisional con foto (espacio reservado), etiquetas, sin aviso de ejemplo y márgenes verificados en 402, 360 y 320 px.
- **Archivos:** `src/app/_layout.tsx`, `src/app/(tabs)/`, `src/app/(acceso)/`, `src/app/(bienvenida)/`, `src/app/perfil.tsx`, `src/app/carta-cafe.tsx`, `src/app/novedades.tsx`, `src/app/+not-found.tsx`, `src/components/navegacion/`, `src/components/marca/Isotipo.tsx`, `src/estado/`, `src/services/`, `data/mock/novedades.ts`, `tests/navegacion.test.tsx`, `jest.setup.js`.
- **Criterios de aceptación:** ✅ la tabla de navegación funciona entera (11 pruebas automáticas + recorrido en el navegador) · ✅ la barra y Novedades quedan fijos al desplazar · ✅ la sesión y la bienvenida se recuerdan al recargar · ⚠️ el panel deslizante de Novedades solo se ve en iOS/Android (L-07).
- **Pruebas:** 33 pruebas automáticas; recorrido web con capturas en `docs/capturas-app/etapa-5/`.

## Etapa 6 — Bienvenida y acceso

- **Estado:** `Pendiente`
- **Objetivo:** P01 a P06 funcionales con autenticación simulada.
- **Tareas:** 3 bienvenidas con persistencia de "vista" · consentimiento (según P-10) · Acceso · Registro con validaciones e indicador de fortaleza · Login con selector de rol y mostrar/ocultar contraseña · modo invitado · biometría y login social según P-05.
- **Dependencias:** Etapa 5 · P-04, P-05, P-10, P-12, P-23.
- **Criterios de aceptación:** validaciones de `PANTALLAS.md` P05/P06 · errores comprensibles · nada sensible en registros · coincide con las capturas.
- **Pruebas:** unitarias de validaciones · recorrido manual · lector de pantalla.

## Etapa 7 — Home

- **Estado:** `Pendiente`
- **Objetivo:** P07 con datos de prueba.
- **Tareas:** saludo por hora · banner · tarjeta de reserva (con reserva / sin reserva) · servicios con disponibilidad · contador de novedades.
- **Dependencias:** Etapa 6 · modelos de datos de prueba.
- **Criterios de aceptación:** coincide con la captura · estados con y sin reserva · navegación de cada acción.
- **Pruebas:** unitarias del saludo · renderizado.

## Etapa 8 — Espacios

- **Estado:** `Pendiente`
- **Objetivo:** P08: explorar y reservar (simulado).
- **Tareas:** selector de semana · buscador · selector de horario (provisional) · tarjetas con variantes · flujo de reserva con confirmación (provisional) · validación de disponibilidad.
- **Dependencias:** Etapa 7 · P-06 (reglas), P-25, P-31.
- **Criterios de aceptación:** no se puede reservar algo ocupado · la reserva aparece en Home y Agenda · coincide con la captura.
- **Pruebas:** unitarias de las reglas de reserva (funciones puras).

## Etapa 9 — Agenda

- **Estado:** `Pendiente` (medidas exactas bloqueadas por B-04)
- **Objetivo:** P09: reservas, eventos y efemérides.
- **Tareas:** filtros · calendario · tarjeta de reserva con PIN copiable · efeméride con beneficio · lista de eventos con inscripción.
- **Dependencias:** Etapa 8 · P-07, P-26.
- **Criterios de aceptación:** los filtros funcionan · copiar PIN confirma · inscribirse cambia el estado.

## Etapa 10 — Comunidad y perfil profesional

- **Estado:** `Pendiente`
- **Objetivo:** P10 y P11.
- **Tareas:** modo de visibilidad · listados de proyectos, talentos y talleres · filtros · perfil público · acciones de contacto según P-08 · publicar proyecto (provisional).
- **Dependencias:** Etapa 9 · P-08, P-27.
- **Criterios de aceptación:** "Modo foco" oculta a la persona de las listas · respeta la privacidad · coincide con las capturas.

## Etapa 11 — Perfil de cuenta y membresías

- **Estado:** `Pendiente`
- **Objetivo:** P12 y sus servicios.
- **Tareas:** datos de la membresía y barra de horas · listado de servicios · historial de reservas · edición de perfil · cerrar sesión y eliminar cuenta · carga de horas según P-03.
- **Dependencias:** Etapa 10 · P-03, P-27, P-28.
- **Criterios de aceptación:** las horas reflejan las reservas · los datos de pago solo se muestran enmascarados.

## Etapa 12 — Novedades

- **Estado:** `Pendiente`
- **Objetivo:** P13 y el contador de no leídas.
- **Dependencias:** Etapa 5 · P-29, P-30.
- **Criterios de aceptación:** el contador se actualiza al verlas · las acciones de las tarjetas funcionan según lo decidido.

## Etapa 13 — Integraciones, persistencia y backend

- **Estado:** `Pendiente` (B-05)
- **Objetivo:** reemplazar los datos de prueba por datos reales según D-08 / P-02.
- **Tareas:** crear el servicio elegido (con aprobación de costos) · autenticación real · esquema de datos (requiere aprobación) · reglas de acceso · migración de `services/` · notificaciones si se aprueban · carga inicial de contenido real.
- **Criterios de aceptación:** cada flujo funciona con datos reales · la seguridad está verificada (sin secretos en el cliente, reglas por rol).
- **Riesgos:** costos de servicios (consultar).

## Etapa 14 — Pruebas funcionales, visuales, de accesibilidad y de uso

- **Estado:** `Pendiente`
- **Tareas:** recorrido completo en iOS y Android · comparación con Figma pantalla por pantalla · VoiceOver/TalkBack · texto grande · sin conexión · **pruebas de uso con al menos 3 personas ajenas al desarrollo** (guion, 5 a 7 tareas, planilla: ¿empezó sola?, dudas, malentendidos, tiempo, ¿completó?, ¿le sirvió?) · correcciones en orden: comprensión → flujo → errores → estética.
- **Criterios de aceptación:** sin errores bloqueantes · planilla completa y correcciones hechas.

## Etapa 15 — Optimización, documentación final y entrega

- **Estado:** `Pendiente`
- **Tareas:** optimizar imágenes y tamaño · README probado desde cero · documentación final · compilaciones (EAS, APK o tiendas **según lo que apruebes y con aviso de costos**) · lista de pendientes final.
- **Criterios de aceptación:** lista de control final cumplida.

---

## Lista de control final (adaptada de la guía de referencia)

**Antes de programar**

- [x] Auditoría del repositorio y del diseño
- [x] Ficha del proyecto (borrador)
- [x] Reglas de trabajo
- [x] Stack elegido y aprobado
- [x] Colores y tipografías aprobados
- [x] Pantallas y navegación descritas (borrador; faltan P11 y P12)
- [ ] Modelo de datos aprobado
- [ ] Plan aprobado
- [x] Carpeta base creada (README, código)

**En cada etapa**

- [ ] Probada de verdad y comparada con el diseño
- [ ] Datos de prueba identificados o limpiados
- [ ] Documentación y plan actualizados
- [ ] Aprobada por la responsable
- [ ] Commit con el nombre de la etapa

**Antes de entregar**

- [ ] Pruebas de uso con al menos 3 personas y correcciones hechas
- [ ] Probada en el destino real (iOS y/o Android)
- [ ] README probado desde cero
- [ ] Sin contraseñas en Git; `.env.example` actualizado
- [ ] Reemplazar los datos de ejemplo de la carta del café (sin aviso en pantalla, D-31)
- [ ] Pendientes resueltos o documentados
