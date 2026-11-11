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
- **Resultado:** ✅ sesión simulada con almacenamiento local (`src/estado/sesion.tsx`, `src/services/almacenamiento.ts`) · ✅ rutas protegidas: bienvenida (solo la primera vez) → acceso → app · ✅ encabezado (isotipo → Home, OLE/CAFÉ → carta del café, avatar → perfil) · ✅ barra inferior de Figma, fija · ✅ botón flotante Novedades con contador (datos de prueba) que abre el panel · ✅ pantallas provisionales: bienvenida, acceso, iniciar sesión, registro, 4 pestañas, perfil, carta del café, novedades · ✅ pantalla de ruta inexistente · ✅ "volver" con la flecha y con el botón del sistema. · ✅ Revisiones de la responsable aplicadas: foto de perfil con un botón "Cambiar foto" y menú de opciones; carta del café provisional con fotos de productos y promo (provistas por la responsable), precio en recuadro claro, etiquetas, sin aviso de ejemplo y márgenes verificados en 402, 360 y 320 px.
- **Archivos:** `src/app/_layout.tsx`, `src/app/(tabs)/`, `src/app/(acceso)/`, `src/app/(bienvenida)/`, `src/app/perfil.tsx`, `src/app/carta-cafe.tsx`, `src/app/novedades.tsx`, `src/app/+not-found.tsx`, `src/components/navegacion/`, `src/components/marca/Isotipo.tsx`, `src/estado/`, `src/services/`, `data/mock/novedades.ts`, `tests/navegacion.test.tsx`, `jest.setup.js`.
- **Criterios de aceptación:** ✅ la tabla de navegación funciona entera (11 pruebas automáticas + recorrido en el navegador) · ✅ la barra y Novedades quedan fijos al desplazar · ✅ la sesión y la bienvenida se recuerdan al recargar · ⚠️ el panel deslizante de Novedades solo se ve en iOS/Android (L-07).
- **Pruebas:** 33 pruebas automáticas; recorrido web con capturas en `docs/capturas-app/etapa-5/`.

## Etapa 6 — Bienvenida y acceso

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-03
- **Objetivo:** P01 a P06 funcionales con autenticación simulada.
- **Resultado:** ✅ Bienvenidas 1–3 como en Figma (la 2 con collage interactivo: al arrastrar, todas las fotos se desordenan como cartas) · ✅ Acceso con "Modo Invitado" · ✅ Registro con validaciones, indicador de fortaleza, aceptación de términos y guardado del perfil básico (sin contraseña) · ✅ Inicio de sesión con selector de rol y validaciones · ✅ sin Google, Apple ni Face ID (D-35) · ✅ términos de convivencia y recuperar contraseña provisorios · ✅ permisos del invitado (D-34) aplicados en el perfil · ✅ botón atrás de Android entre bienvenidas.
- **Archivos:** `src/app/(bienvenida)/bienvenida.tsx`, `src/app/(acceso)/*`, `src/app/terminos.tsx`, `src/app/perfil.tsx`, `src/components/bienvenida/MazoFotos.tsx`, `src/components/acceso/`, `src/components/ui/EnlaceTexto.tsx`, `src/utils/validaciones.ts`, `src/utils/permisos.ts`, `data/bienvenida.ts`, `assets/imagenes/bienvenida/`, `tests/logica.test.tsx`.
- **Criterios de aceptación:** ✅ validaciones con mensajes junto al campo · ✅ la contraseña nunca se guarda · ✅ coincide con las capturas de Figma (diferencias: D-41, D-42) · ✅ recorrido completo en el navegador sin errores · ⚠️ falta probar en teléfono (arrastre táctil real, teclado).
- **Pruebas:** 45 pruebas automáticas (validaciones, permisos, collage, registro, inicio de sesión, invitado) y recorrido web con capturas en `docs/capturas-app/etapa-6/`.

## Etapa 7 — Home

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-03
- **Objetivo:** P07 con datos de prueba.
- **Resultado:** ✅ saludo según la hora con el nombre del registro · ✅ banner de marca · ✅ "Tu reserva actual" con estado (en curso / próxima) y horario · ✅ miniatura con degradado como en Figma · ✅ estado sin reserva (miembro) y para invitado · ✅ "Espacios Olegario" con OLE/COWORK, STREAM y NETWORK y "Ver todo" · ✅ detalle de reserva provisorio.
- **Archivos:** `src/app/(tabs)/index.tsx`, `src/app/reserva/[id].tsx`, `src/components/home/`, `src/hooks/useAhora.ts`, `src/utils/saludo.ts`, `src/utils/reservas.ts`, `src/models/reserva.ts`, `data/mock/reservas.ts`, `data/mock/espacios.ts`, `tests/home.test.tsx`.
- **Criterios de aceptación:** ✅ coincide con la captura de Figma (comparación en `docs/capturas-app/etapa-7/comparacion-figma.png`) · ✅ estados con y sin reserva · ✅ cada acción navega · ✅ la barra y Novedades quedan fijos.
- **Pruebas:** 60 pruebas automáticas (saludo, estado de reservas, horario, Home a las 9, 11 y 16 hs, invitado, navegación).

## Etapa 8 — Espacios

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-04
- **Objetivo:** P08: explorar y reservar (simulado).
- **Resultado:** ✅ chip "N PUESTOS LIBRES" y "TU RINCÓN PERFECTO" · ✅ selector de semana (solo hoy y 3 días más) · ✅ buscador (sin importar tildes) · ✅ filtro por servicio; desde el Home se abre filtrado · ✅ horario libre las 24 hs en pasos de 30 min · ✅ tarjetas con estado (libre / N libres / ocupado hasta) · ✅ "Usar ese horario" en espacios ocupados · ✅ confirmación con horas del plan · ✅ reservas guardadas en el teléfono, visibles en el Home · ✅ cancelar hasta 30 min antes · ✅ el invitado mira pero no reserva. · ✅ Revisión 1: fotos reales de los espacios provistas por la responsable.
- **Archivos:** `src/app/(tabs)/espacios.tsx`, `src/app/reserva/[id].tsx`, `src/components/espacios/`, `src/components/ui/PanelInferior.tsx`, `src/estado/reservas.tsx`, `src/models/espacio.ts`, `src/utils/fechas.ts`, `src/utils/disponibilidad.ts`, `src/utils/espacios.ts`, `data/mock/espaciosOlegario.ts`, `assets/imagenes/espacios/`, `tests/espacios.test.tsx`.
- **Criterios de aceptación:** ✅ no se puede reservar algo ocupado · ✅ la reserva aparece en el Home (en la Agenda, Etapa 9) · ✅ coincide con la captura salvo D-47 a D-50.
- **Pruebas:** 75 pruebas automáticas (fechas, disponibilidad, reglas, filtro, reserva, filtro desde el Home, invitado, cancelación) y recorrido web con capturas en `docs/capturas-app/etapa-8/`.

## Etapa 9 — Agenda

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-04
- **Objetivo:** P09: reservas, eventos y efemérides.
- **Resultado:** ✅ encabezado "OLE / AGENDA CREATIVA" y título con degradado · ✅ filtros TODO / MIS RESERVAS (cantidad) / EFEMÉRIDES · ✅ semana con puntos de actividad (reserva naranja, evento lima, after office rosa) y flechas para cambiar de semana · ✅ al tocar un día se ve lo de ese día · ✅ tarjeta de reserva con "En 45 min", horario, ubicación, PIN de prueba copiable con aviso y "MODIFICAR" (abre el detalle) · ✅ calendario de efemérides reales (solo aparecen en su día) con enlace a Comunidad; beneficio en OLE/CAFÉ opcional · ✅ eventos con foto, personas inscriptas e inscripción que se guarda en el teléfono · ✅ íconos OLE/EVENTO y OLE/AFTER OFFICE de la marca · ✅ el invitado no ve reservas pero se inscribe a eventos.
- **Archivos:** `src/app/(tabs)/agenda.tsx`, `src/components/agenda/`, `src/components/espacios/SelectorSemana.tsx`, `src/components/marca/SubmarcaEvento.tsx`, `src/components/marca/SubmarcaAfterOffice.tsx`, `src/estado/agenda.tsx`, `src/models/agenda.ts`, `src/utils/agenda.ts`, `data/mock/agenda.ts`, `data/efemerides.ts`, `assets/imagenes/eventos/`, `assets/imagenes/personas/`, `assets/marca/ole-evento.svg`, `assets/marca/ole-after-office.svg`, `tests/agenda.test.tsx`.
- **Criterios de aceptación:** ✅ los filtros funcionan · ✅ copiar el PIN confirma ("PIN copiado") · ✅ inscribirse cambia el estado y la cantidad · ✅ coincide con la captura (comparación en `docs/capturas-app/etapa-9/comparacion-figma.png`) salvo D-52 a D-56.
- **Pruebas:** 88 pruebas automáticas (calendario de efemérides, PIN, tiempo restante, fechas, puntos, filtros, días, semanas, inscripción, invitado, "Modificar") y recorrido web con capturas en `docs/capturas-app/etapa-9/`.

## Etapa 10 — Comunidad y perfil profesional

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-04
- **Objetivo:** P10 y P11.
- **Resultado:** ✅ "MODO ACTIVO": Conexión Abierta / Modo Foco (se guarda; en Foco no aparecés en Talentos ni se muestra dónde estás) · ✅ "COLABORÁ, SUMATE, CONECTÁ" · ✅ publicar proyecto o búsqueda con formulario provisorio y validaciones (aparece primera en la lista, se puede eliminar) · ✅ filtros Todos / Buscan colaborador / Iniciativas con la cantidad de convocatorias · ✅ proyectos, talentos y talleres de Figma · ✅ contactar, postularse y sumarse con solicitud simulada ("Solicitud enviada") · ✅ "Ver detalles del proyecto" en un panel · ✅ perfil público provisorio (portada, foto, profesión, dónde está, Sobre mí, Ofrezco, Busco, Contactar) · ✅ tu tarjeta en Talentos con la ubicación de tu reserva en curso · ✅ el invitado no usa Comunidad.
- **Archivos:** `src/app/(tabs)/comunidad.tsx`, `src/app/publicar.tsx`, `src/app/persona/[id].tsx`, `src/components/comunidad/`, `src/estado/comunidad.tsx`, `src/models/comunidad.ts`, `src/utils/comunidad.ts`, `data/mock/comunidad.ts`, `tests/comunidad.test.tsx`.
- **Criterios de aceptación:** ✅ "Modo foco" oculta a la persona de las listas · ✅ respeta la privacidad (sin ubicación en Foco; solo datos de Figma) · ✅ coincide con la captura (comparación en `docs/capturas-app/etapa-10/`) salvo D-57 a D-60.
- **Pruebas:** 99 pruebas automáticas (validación, etiquetas, Modo Foco, filtros, solicitud, publicar, perfil público, invitado) y recorrido web con capturas en `docs/capturas-app/etapa-10/`.

## Etapa 11 — Perfil de cuenta y membresías

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-04
- **Objetivo:** P12 y sus servicios.
- **Resultado:** ✅ Perfil según la captura de Figma que pasó la responsable (`docs/referencias/figma/12-perfil.png`): foto con aro (tocarla la cambia), "Disponible para colaborar" (o "Modo Foco"), nombre y profesión · ✅ membresía actual con vencimiento, renovación y factura · ✅ "Administrar plan" (detalle) y "Ver planes" (aviso) · ✅ bolsa de horas con anillo "53% LIBRE" y "42 / 80 hs" que reflejan las reservas · ✅ cargar horas extras SIMULADO (sin cobrar) · ✅ 6 servicios provisorios: paquetes, beneficios (promo de la carta), historial y próximas reservas (reales), valoraciones y quejas/sugerencias (se guardan), pagos (tarjeta enmascarada) · ✅ editar perfil, cerrar sesión y eliminar cuenta (con confirmación; borra los datos del teléfono).
- **Archivos:** `src/app/perfil.tsx`, `src/app/servicio/[id].tsx`, `src/app/editar-perfil.tsx`, `src/components/perfil/`, `src/utils/perfil.ts`, `src/estado/sesion.tsx`, `src/estado/reservas.tsx`, `src/services/almacenamiento.ts`, `data/mock/membresia.ts`, `tests/perfil.test.tsx`.
- **Criterios de aceptación:** ✅ las horas reflejan las reservas (y las extras) · ✅ los datos de pago solo se muestran enmascarados y nunca se guardan datos de tarjeta · ✅ coincide con la captura (comparación en `docs/capturas-app/etapa-11/comparacion-figma.png`) salvo D-61 a D-64.
- **Pruebas:** 108 pruebas automáticas (porcentaje, fechas, próxima reserva, membresía, horas extras, editar perfil, eliminar cuenta, historial, valoraciones, pagos) y recorrido web.

## Etapa 12 — Novedades

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-04
- **Objetivo:** P13 y el contador.
- **Resultado:** ✅ panel "● PULSO DE OLEGARIO · Novedades y eventos" que sube desde abajo · ✅ tarjetas de Figma con las fotos de la responsable: Promo cafetería y Coworkeo itinerante, con "20% OFF" · ✅ "Pedir al barista" abre la carta del café · ✅ "Últimos cupos" inscribe (simulado) y suma tu foto a los circulitos · ✅ el contador del botón flotante muestra siempre cuántas novedades hay · ✅ textos corregidos (cookie de chocolate, tildes y voseo).
- **Archivos:** `src/app/novedades.tsx`, `src/components/novedades/TarjetaNovedad.tsx`, `src/components/navegacion/BotonNovedades.tsx`, `data/mock/novedades.ts`, `assets/imagenes/novedades/`, `tests/novedades.test.tsx`.
- **Criterios de aceptación:** ✅ el contador sigue la decisión de la responsable (siempre activo) · ✅ las acciones de las tarjetas funcionan según lo decidido · ✅ coincide con la captura (comparación en `docs/capturas-app/etapa-12/comparacion-figma.png`) salvo D-66.
- **Pruebas:** 112 pruebas automáticas (textos, "Pedir al barista", inscripción, contador) y recorrido web.

## Etapa 13 — Integraciones, persistencia y backend

- **Estado:** `Completada (pendiente de autorización)`, 2026-11-11. Servidor Docker + PHP + MySQL (D-68);
  pendientes de la responsable: probar Docker en su computadora y subir a Hostinger (D-69).
- **Objetivo:** reemplazar los datos de prueba por datos reales según D-08 / P-02.
- **Tareas:** crear el servicio elegido (con aprobación de costos) · autenticación real · esquema de datos (requiere aprobación) · reglas de acceso · migración de `services/` · notificaciones si se aprueban · carga inicial de contenido real.
- **Criterios de aceptación:** cada flujo funciona con datos reales · la seguridad está verificada (sin secretos en el cliente, reglas por rol).
- **Riesgos:** costos de servicios (consultar).

## Etapa 14 — Pruebas funcionales, visuales, de accesibilidad y de uso

- **Estado:** `Completada` (2026-11-11)
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
