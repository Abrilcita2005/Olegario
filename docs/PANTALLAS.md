# Inventario de pantallas — Olegario en Movimiento

> Fichas basadas en la página "Alta fidelidad" de Figma. Las capturas están en `docs/referencias/figma/`.
> Los nombres de personas y los datos (Sofía, 42/80 hs, PIN #8492, etc.) son **contenido de ejemplo del diseño**, no datos reales.
> La navegación es **[SUPUESTA]**: las conexiones del prototipo de Figma no se pudieron verificar.

## Resumen

| ID   | Pantalla                      | Frame Figma                  | Sección            | Inspección                  |
| ---- | ----------------------------- | ---------------------------- | ------------------ | --------------------------- |
| P01  | Bienvenida 1 — Consentimiento | BIENVENIDA 1 (3:1948)        | Bienvenida         | Completa                    |
| P02  | Bienvenida 2 — Concepto       | BIENVENIDA 2 (4:2039)        | Bienvenida         | Completa                    |
| P03  | Bienvenida 3 — Servicios      | BIENVENIDA 3 (4:2040)        | Bienvenida         | Completa                    |
| P04  | Acceso                        | INICIO 1 (107:18)            | Acceso             | Completa                    |
| P05  | Registro                      | INICIO 2 (107:300)           | Acceso             | Completa                    |
| P06  | Inicio de sesión              | INICIO 3 (108:726)           | Acceso             | Completa                    |
| P07  | Home                          | HOME (24:267)                | Home               | Completa                    |
| P08  | Espacios                      | ESPACIOS (46:766)            | Espacios           | Captura y textos            |
| P09  | Agenda                        | AGENDA (58:12)               | Agenda             | Solo captura (imagen plana) |
| P10  | Comunidad                     | COMUNIDAD (71:39)            | Comunidad          | Captura y textos            |
| P11  | Perfil profesional (público)  | COMUNIDAD (105:836)          | Comunidad / Perfil | Solo textos y estructura    |
| P12  | Perfil de cuenta              | PERFIL (109:1042)            | Perfil             | Solo textos y estructura    |
| P13  | Novedades                     | NOVEDADES FLOTANTES (77:940) | Novedades          | Captura y textos            |
| P14+ | Pantallas sin diseño          | —                            | Varias             | Ver el final                |

---

## P01 · Bienvenida 1 — Consentimiento

- **Objetivo:** presentar la app y pedir consentimiento para cookies y permisos de rastreo.
- **Elementos visibles:** logo claro · título "¡Queremos ofrecerte la mejor experiencia!" · 3 filas ícono + texto: (1) cookies y rastreo para contenido relevante, (2) "Respetamos y protegemos tu privacidad en todo momento", (3) "Al aceptar, haremos de esta app un lugar genial para ti" · espacio para imagen vacío (151×153) · botón "SIGUIENTE" claro.
- **Jerarquía:** logo → título → lista de beneficios → CTA abajo, centrado.
- **Componentes:** `BotonSiguiente` (claro), lista con ícono.
- **Acciones:** SIGUIENTE → P02.
- **Navegación:** origen: primera apertura de la app · destino: P02.
- **Estados:** único.
- **Datos:** ninguno. Guarda localmente "bienvenida vista" y la decisión de consentimiento.
- **Acceso y privacidad:** pantalla pública. **No ofrece rechazar** el rastreo (P-10).
- **Recursos:** R-01, R-08 (3 íconos), R-09 (falta).
- **Accesibilidad:** los íconos son decorativos (se ocultan al lector de pantalla); el botón con etiqueta "Siguiente".
- **Criterios de aceptación:** se ve igual a la captura (posiciones, tipografía y colores) · SIGUIENTE avanza · no vuelve a mostrarse en la siguiente apertura [SUPUESTO] · si se usa rastreo en iOS, se muestra el aviso del sistema antes de rastrear.
- **Pendiente:** P-10 (qué se rastrea, opción de rechazar, texto "para ti" en tuteo), P-20 (imagen faltante).

## P02 · Bienvenida 2 — Concepto

- **Objetivo:** transmitir el concepto de Olegario ("Donde las ideas encuentran su lugar").
- **Elementos visibles:** fondo claro · logo oscuro · collage de 5 fotos rotadas con esquinas redondeadas (10) · título · texto con cierre destacado "tan interesantes como vos." · SIGUIENTE oscuro.
- **Componentes:** `BotonSiguiente` (oscuro), collage de fotos.
- **Acciones:** SIGUIENTE → P03.
- **Navegación:** P01 → P02 → P03. ¿Gesto de deslizar entre bienvenidas? [PENDIENTE]
- **Estados:** único. **Datos:** ninguno.
- **Recursos:** R-02, R-10.
- **Accesibilidad:** el collage es decorativo; texto legible a 13 px.
- **Criterios de aceptación:** coincide con la captura · SIGUIENTE avanza.
- **Pendiente:** errata "nace para para crear" (P-12) · derechos de las fotos (P-21).

## P03 · Bienvenida 3 — Servicios

- **Objetivo:** contar qué se puede hacer en la app y dar la bienvenida.
- **Elementos visibles:** fondo oscuro · logo claro · foto grande de un evento · "Tu experiencia empieza acá." · texto de servicios (reservar espacios, eventos y capacitaciones, novedades, beneficios) · "Bienvenido a Olegario." · SIGUIENTE claro.
- **Acciones:** SIGUIENTE → P04.
- **Recursos:** R-01, R-11.
- **Criterios de aceptación:** coincide con la captura · SIGUIENTE lleva a Acceso.
- **Pendiente:** "Bienvenido" en masculino; ¿preferís una forma inclusiva? (P-12).

## P04 · Acceso

- **Objetivo:** elegir cómo entrar: iniciar sesión, crear cuenta o entrar como invitado.
- **Elementos visibles:** logo oscuro · "ECOSISTEMA CREATIVO" (CREATIVO con degradado) · cita "Un espacio vivo para conectar personas, crear y expandir tu potencial profesional en el corazón de Mendoza." con barra lateral · botón degradado "INICIAR SESIÓN" (56 px) · botón oscuro "CREAR UNA CUENTA" · divisor "O CONTINÚA CON" · botón "Modo Invitado" · pie "Mendoza · Hub Creativo & Coworking / CAFÉ DE ESPECIALIDAD & CONEXIÓN 24/7".
- **Componentes:** `BotonPrimario` grande, `BotonSecundario`, `BannerCita` (variante con borde), `PieHospitalidad`.
- **Acciones:** INICIAR SESIÓN → P06 · CREAR UNA CUENTA → P05 · Modo Invitado → P07 con permisos de invitado.
- **Estados:** único.
- **Datos:** ninguno.
- **Acceso:** pública.
- **Recursos:** R-02.
- **Accesibilidad:** botones de 56 px de alto (cumple); el blanco sobre el naranja del degradado no alcanza AA (P-14).
- **Criterios de aceptación:** los tres caminos navegan correctamente · coincide con la captura.
- **Pendiente:** P-04 (qué ve el invitado) · "CONTINÚA" vs "CONTINUÁ" (P-12) · el frame contiene secciones ocultas fuera de pantalla que no se implementan.

## P05 · Registro

- **Objetivo:** crear una cuenta de miembro.
- **Elementos visibles:** flecha volver · isotipo · "Creá tu cuenta" · 4 campos en tarjetas oscuras con etiqueta lima: Nombre completo, Correo profesional, Profesión / Área de trabajo, Contraseña (con ojo y 4 barras de fortaleza) · checkbox "Acepto los términos de convivencia y manifiesto de la comunidad Olegario." con subtexto "Cuidamos el silencio productivo, la hospitalidad y la cultura de colaboración abierta." · CTA "CREAR CUENTA Y CONTINUAR" · "¿Ya tenés cuenta? Iniciar sesión" · pie.
- **Componentes:** `Encabezado` (volver), `CampoFormulario` ×4, `Checkbox`, `BotonPrimario`, `PieHospitalidad`.
- **Acciones:** volver → P04 · ver u ocultar contraseña · aceptar términos · crear cuenta → P07 [SUPUESTO] · Iniciar sesión → P06.
- **Estados:** vacío · escribiendo · error de campo · enviando · error del servidor (correo ya registrado) · éxito. **Ninguno de los estados de error está diseñado.**
- **Validaciones [RECOMENDACIÓN]:** nombre obligatorio (2–80 caracteres) · correo con formato válido · profesión obligatoria (máx. 80) · contraseña de 8 caracteres o más · fortaleza en 4 niveles · checkbox obligatorio · botón deshabilitado hasta completar.
- **Datos:** nombre, correo, profesión, contraseña, aceptación con fecha.
- **Privacidad:** el texto completo de los "términos de convivencia y manifiesto" **no existe** (P-23). Falta la política de privacidad.
- **Recursos:** R-03, R-06.
- **Accesibilidad:** cada campo con etiqueta asociada · el checkbox de 13 px necesita un área táctil ampliada a 44 px · errores anunciados por el lector de pantalla.
- **Criterios de aceptación:** no deja enviar con datos inválidos · muestra los errores junto al campo · la contraseña nunca se guarda ni se registra en texto plano · coincide con la captura.
- **Pendiente:** P-23 · ¿"correo profesional" admite cualquier correo? · ¿hace falta verificar el correo?

## P06 · Inicio de sesión

- **Objetivo:** entrar con una cuenta existente.
- **Elementos visibles:** volver · isotipo · "¡Qué bueno verte de nuevo!" · "Ingresá a tu espacio, sincronizá tu jornada y conectá con tu comunidad creativa." · selector "MIEMBRO COWORKER / INVITADO / EVENTO" · tarjeta con "Email o usuario", "Contraseña" + "¿Olvidaste tu contraseña?" (con candado y ojo) · "INICIAR SESIÓN" · "Ingresar con Face ID / Huella digital" · "O CONTINUÁ CON" · Google · Apple ID · "¿Todavía no sos miembro? Registrate y sumate a Olegario" · pie.
- **Componentes:** `SelectorSegmentado`, `CampoFormulario`, `BotonPrimario`, `BotonSecundario` (biometría), `BotonSocial` ×2.
- **Acciones:** volver → P04 · cambiar rol · iniciar sesión → P07 · olvidé contraseña → **pantalla sin diseño** · biometría · Google · Apple · Registrate → P05.
- **Estados:** credenciales incorrectas · cuenta bloqueada por intentos · sin conexión · cargando. **Sin diseño.**
- **Datos:** correo o usuario, contraseña, rol.
- **Seguridad:** límite de intentos en el servidor · biometría solo si ya hubo un inicio de sesión previo en el dispositivo.
- **Recursos:** R-03, R-06, R-18.
- **Accesibilidad:** el selector de rol anuncia la opción elegida · el ojo con etiqueta "Mostrar contraseña".
- **Criterios de aceptación:** login válido entra a Home · login inválido muestra un error comprensible · el botón biométrico solo aparece si el dispositivo lo soporta y está habilitado.
- **Pendiente:** P-04 (diferencia entre roles) · P-05 (Google y Apple: si se ofrece Google en iOS, Apple exige ofrecer también "Iniciar sesión con Apple") · diseño de recuperación de contraseña.

## P07 · Home

- **Objetivo:** resumen del día: reserva actual y acceso rápido a los espacios.
- **Elementos visibles:** encabezado (isotipo, ícono de tres píldoras, avatar) · "¡Buen día, Sofi!" + "¿Cómo querés impulsar tu día hoy en Olegario?" · banner con la frase de marca · "TU RESERVA ACTUAL" + chip "En curso" · tarjeta de reserva (miniatura, "OLE/COWORK · PUESTO INDIVIDUAL", "Mesa con Luz Natural", "Hoy: 10:00 - 14:00 hs", "Sector Jardín · Puesto #14", botón "VER DETALLES Y CHECK-IN" con ícono QR, botón "cómo llegar") · "ESPACIOS OLEGARIO" + "Ver todo >" · 3 tarjetas de servicio (OLE/COWORK "4 Puestos Libres", OLE/STREAM "2 Salas Disponibles", OLE/NETWORK "Mesa Abierta") · botón Novedades "2 nuevas" · barra inferior (Inicio activa).
- **Componentes:** `Encabezado`, `BannerCita`, `Chip`, `TarjetaReserva`, `BotonIcono`, `TarjetaServicio` ×3, `BotonNovedades`, `BarraNavegacion`.
- **Acciones:** avatar → P12 [SUPUESTO] · ícono de tres píldoras → [PENDIENTE] · ver detalles y check-in → **pantalla sin diseño** · cómo llegar → mapa o indicaciones [PENDIENTE] · Ver todo → P08 · tarjeta de servicio → P08 filtrado [SUPUESTO] · Novedades → P13.
- **Estados:** con reserva en curso · con reserva próxima · **sin reserva (sin diseño)** · cargando · invitado (¿qué ve?).
- **Datos:** nombre del usuario, hora local (saludo), reserva actual, disponibilidad por servicio, cantidad de novedades sin leer.
- **Reglas [RECOMENDACIÓN]:** saludo "Buen día" (5–12 h), "Buenas tardes" (12–20 h), "Buenas noches" (20–5 h).
- **Recursos:** R-03, R-04, R-05, R-07, R-12.
- **Accesibilidad:** el texto de 9 px ("4 Puestos Libres") queda bajo el mínimo (ver `GUIA_MAESTRA` §I).
- **Criterios de aceptación:** coincide con la captura · la barra inferior y Novedades quedan fijos al desplazar · cada acción navega donde corresponde.
- **Pendiente:** P-06, P-07, P-24 (función del ícono de tres píldoras) · el frame tiene capas sobrantes (texto "Text", Frame 8 vacío).

## P08 · Espacios

- **Objetivo:** buscar y reservar un espacio por día y horario, con disponibilidad en tiempo real.
- **Elementos visibles:** encabezado · chip "14 PUESTOS LIBRES" · "TU RINCÓN PERFECTO" (PERFECTO con degradado) · selector de semana LUN 19 a DOM 25 (MIÉ 21 activo, puntos de colores bajo algunos días) · buscador "Busca tu mesa en tiempo real" con ícono de cámara · barra "HORARIO SELECCIONADO · Hoy, 10:00 - 14:00 (4 hrs)" + "CONFIRMAR ✓" · tarjetas:
  1. **OLE/COWORK · Rincón Botánico Zen** · "LIBRE" · etiquetas "Luz natural directa", "Silencio alto" · "Ala Oeste · Nivel 1 · Frente a jardín interior" · Tomas USB-C 65W, Herman Miller Sayl, Aire purificado · "Accede siempre que quieras · Gratis" · "RESERVA TU LUGAR".
  2. **OLE/CAFÉ · Mesa Comunitaria Barra Cafetería** · "3 LIBRES" · "COMUNIDAD" · Murmullo alegre, Barra de especialidad · Planta Alta · WiFi 6E Mesh 500Mbps, Espresso bar libre, Pérgola bioclimática · "Acceso ilimitado · Gratis" · "RESERVA TU LUGAR".
  3. **OLE/STREAM · Sala Acústica Focus** · "Ocupado hasta 11:30" · "1H / DÍA INC." · -32dB aislación, Ilum. Broadcast · "Sala Central · Pods de Stream & Calls" · Cámara 4K + Brazo Elgato, Mic Rode PodMic · "Próximo slot libre 11:30 - 12:30" · "AGENDAR SLOT".
  - Novedades · barra inferior (Espacios activa).
- **Componentes:** `SelectorFecha`, buscador, barra de horario, `TarjetaEspacio` (con variantes: libre, cupos, ocupado), `Chip`.
- **Acciones:** elegir día · buscar · cambiar horario (**selector sin diseño**) · confirmar horario · reservar → confirmación **sin diseño** · agendar slot.
- **Estados:** espacio libre / con cupos / ocupado hasta X · sin resultados · cargando · error al reservar · reserva confirmada. Solo los tres primeros están diseñados.
- **Datos:** espacios (marca, nombre, ubicación, atributos, equipamiento, condición de acceso, cupos), disponibilidad por franja, horas incluidas del plan.
- **Reglas de negocio [PENDIENTE P-06]:** duración mínima y máxima de reserva, anticipación, cancelación, consumo de horas ("1H / DÍA INC."), qué significa "Gratis" frente a las horas del plan.
- **Privacidad:** el ícono de cámara del buscador sugiere ¿escanear un QR? (P-25).
- **Criterios de aceptación:** cambiar el día actualiza la disponibilidad · no se puede reservar un espacio ocupado · coincide con la captura.
- **Pendiente:** P-06, P-25 · "Busca/Reserva/Accede" en tuteo frente al voseo del resto (P-12).

## P09 · Agenda

- **Objetivo:** ver reservas, eventos y efemérides, e inscribirse en actividades.
- **Elementos visibles (leídos de la imagen):** encabezado · chip "OLE / AGENDA CREATIVA" · "TU RINCÓN PERFECTO" · "Sincronizá tus espacios, conectá en workshops y activá la chispa del día en Olegario." · filtros "TODO", "MIS RESERVAS (1)", "EFEMÉRIDES" · semana LUN 19 a DOM 25 · tarjeta de reserva: ícono OLE/STREAM, "OLE / STREAM", "En 45 min", "Sala Acustica Focus", HORARIO 10:30 - 12:30 hs, UBICACIÓN Nivel 1 · Bloque B, "PIN ACCESO #8492" (copiable), "MODIFICAR" · tarjeta de efeméride: "OLE / INSPIRACIÓN", "21 DE MAYO", "DÍA MUNDIAL DEL DISEÑO GRÁFICO", cita, "BENEFICIO EN OLE/CAFÉ: Mostrá este pase y pedí tu Flat White de especialidad de regalo.", "CONOCER MANIFIESTO & COMUNIDAD →" · "NOVEDADES · Actividades abiertas de la comunidad Olegario" · eventos: "OLE / EVENTO · Jue 22 · 17:00 hs · Storytelling para Emprendedore[s] · Disertante: Sofía Valenzuela · Sala Principal… · +14 inscriptos · INSCRIPTO" y "OLE / AFTER OFFICE · Vie 23 · 18:30 hs · Sunset Beats & Vinyl Session · Terraza Abierta Olegario · DJ Set en vivo &… · +14 inscriptos · INSCRIPTO" · Novedades · barra inferior (Agenda activa).
- **Acciones:** filtrar · elegir día · copiar PIN · modificar reserva (**sin diseño**) · conocer manifiesto (**sin diseño**) · inscribirse o desinscribirse.
- **Estados:** inscripto / no inscripto (solo se ve "INSCRIPTO") · sin eventos ese día · cargando.
- **Datos:** reservas del usuario, PIN de acceso, efemérides, eventos con cupo e inscriptos.
- **Privacidad:** los avatares de inscriptos muestran a otras personas: ¿quién puede verlos? (P-08).
- **Recursos:** no exportables (imagen plana).
- **Criterios de aceptación:** reproduce la captura con el sistema de diseño · el PIN se copia con confirmación · los filtros funcionan.
- **Pendiente:** **pedir el frame de Agenda con capas** (P-26) · P-07 (PIN) · el título "TU RINCÓN PERFECTO" repite el de Espacios (¿intencional?) · texto truncado "Emprendedore".

## P10 · Comunidad

- **Objetivo:** descubrir oportunidades, talentos e iniciativas, y conectar.
- **Elementos visibles:** encabezado · tarjeta "MODO ACTIVO": selector "Conexión Abierta / Modo Foco", "Visible para matches y charlas" · "OLE/NETWORK • COMUNIDAD" · "COLABORÁ, SUMATE, CONECTÁ" · bajada · "PUBLICAR PROYECTO O BÚSQUEDA" · "FILTRAR OPORTUNIDADES": Todos, Buscan Colaborador, Buscan S… (desplazable) · "3 Convocatorias activas · PROYECTOS & OPORTUNIDADES": EcoTrack (BUSCA: Diseñador/a UI/UX, etiquetas Figma, Design Systems, Mobile UX, "QUIERO APORTAR / POSTULARME", "VER DETALLES DEL PROYECTO"), Estudio Circular (BUSCA: Productor de Contenido y Audio, "ME INTERESA COLABORAR"), Lanzamiento de Marca de Café Sostenible (INICIATIVA COMUNITARIA, "SUMARME AL EQUIPO DE TESTING") · "Coworkers en línea · TALENTOS DISPONIBLES": Clara Méndez (Disponible, OFREZCO / BUSCO, "CONTACTAR") · "Iniciativas de la comunidad · TALLERES ENTRE PARES": Club de Lectura Tech & Diseño ("SUMARSE"), Mesa de Debate No-Code & Automatización ("ULTIMOS CUPOS DISPONIBLES") · Novedades · barra inferior (Comunidad activa).
- **Acciones:** cambiar modo de visibilidad · publicar (**formulario sin diseño**) · filtrar · postularse · ver detalle (**sin diseño**) · contactar (**¿chat? P-08**) · sumarse a un taller.
- **Estados:** sin convocatorias · invitado (¿puede ver o publicar?) · Modo foco (¿se oculta de las listas?).
- **Datos:** proyectos (autor, rol buscado, etiquetas, estado, fecha), talentos (perfil, ofrezco, busco, disponibilidad, en línea), talleres (tipo, día, lugar, cupo).
- **Privacidad:** "Coworkers en línea" expone presencia; "Modo foco" debe ocultarla [RECOMENDACIÓN].
- **Criterios de aceptación:** el modo de visibilidad persiste y afecta lo que ven los demás · los filtros funcionan · coincide con la captura.
- **Pendiente:** P-08 (contacto y moderación de publicaciones) · P-17 (estilos exactos).

## P11 · Perfil profesional (público)

- **Objetivo:** mostrar el perfil profesional de otro miembro.
- **Estructura (sin captura):** contenido desplazable (`ScrollableContent`) · portada (`HeroCover`, 402×373) · encabezado con "Martina Rossi", "Diseñadora UI/UX & Brand Strategy Freelance", "En Ole/Café ahora", "Mesa 12" · sección "SOBRE MI" con texto · el frame mide 850 px, así que hay elementos debajo del contenido desplazable (¿barra de acciones?).
- **Acciones:** [PENDIENTE] probablemente contactar o volver.
- **Datos:** nombre, profesión, portada, ubicación actual, sobre mí.
- **Privacidad:** respeta el modo de visibilidad · la ubicación en tiempo real es opcional (ver `GUIA_MAESTRA` §I).
- **Criterios de aceptación:** se define al obtener la captura.
- **Pendiente:** **captura y diseño** (P-27) · qué campos ve cada rol.

## P12 · Perfil de cuenta

- **Objetivo:** información de la cuenta, membresía, horas y servicios.
- **Estructura (sin captura):** encabezado (101 px) · "Sofía Valenzuela", "Diseñadora UI/UX & Brand Strategist Coworker activa", "Disponible para colaborar" · "MEMBRESÍA ACTUAL", "Suscripción al día", "ACTIVO", "Acceso 24/7 · Puesto Nómade", "42 / 80 hs", "CARGAR HORAS EXTRAS" · "GESTIÓN Y SERVICIOS": Recepción de Paquetes (Listo para retirar en recepción principal) · Beneficios y Descuentos (Cafeterías asociadas y convenios) · Historial y Próximas Reservas (Sala de Directorio mañana a las 10:00 hs) · Valoraciones de la Experiencia (Califica espacios y comparte opiniones) · Libro de Quejas y Sugerencias (Canal directo con el equipo) · Métodos de Pago y Facturación (Visa terminada en •••• 4092).
- **Acciones:** cargar horas extras (**¿pago? P-03**) · abrir cada servicio (**6 pantallas sin diseño**) · editar perfil (sin diseño) · cerrar sesión (no aparece en los textos: P-28).
- **Datos:** perfil, plan, estado de pago, horas usadas y totales, paquetes, beneficios, reservas, medios de pago (solo los últimos 4 dígitos).
- **Privacidad:** pantalla privada del propio usuario.
- **Pendiente:** **captura y diseño** (P-27) · P-03 · P-28 · ¿cómo se llega? (avatar del encabezado, supuesto).

## P13 · Novedades

- **Objetivo:** promociones y eventos destacados ("Pulso de Olegario").
- **Elementos visibles:** encabezado · "● PULSO DE OLEGARIO" (rosa) + "Novedades y eventos" · tarjeta 1: foto de la barra, chip "20% OFF", "PROMO CAFETERIA", "Flat White de especialidad +Cookie casera de avena", "Pedir al barista →" · tarjeta 2: foto de mesa junto al lago, avatares MG, LR, +5, "20% OFF", "COWORKEO ITINERANTE", "Viaja con Olegario y conoce personas y lugares nuevos!", "Ultimos Cupos →" · barra inferior (Inicio activa).
- **Acciones:** "Pedir al barista" (¿pedido real o solo informativo? P-29) · "Últimos cupos" → inscripción o detalle (sin diseño).
- **Navegación:** desde el botón flotante Novedades en cualquier pestaña. ¿Es una pantalla o una hoja superpuesta? En el diseño no aparece el botón flotante ni un "cerrar" (P-30).
- **Estados:** sin novedades · cargando.
- **Datos:** novedades (tipo, imagen, descuento, título, descripción, CTA, participantes, vigencia), marca de "leído" para el contador.
- **Criterios de aceptación:** al abrir, el contador "N nuevas" se actualiza · coincide con la captura.
- **Pendiente:** P-29, P-30 · "CAFETERIA" y "Ultimos" sin tilde, "Viaja/conoce" en tuteo (P-12).

---

## Pantallas necesarias sin diseño en Figma [PENDIENTE P-31]

Se detectaron a partir de botones que llevan a algún lado pero no tienen pantalla:

| Pantalla                                | Disparada desde                                                          |
| --------------------------------------- | ------------------------------------------------------------------------ |
| Recuperar contraseña                    | P06 "¿Olvidaste tu contraseña?"                                          |
| Detalle de reserva y check-in           | P07 "Ver detalles y check-in"                                            |
| Cómo llegar / mapa del coworking        | P07 botón de ubicación                                                   |
| Selector de horario                     | P08 barra de horario                                                     |
| Confirmación de reserva                 | P08 "Reserva tu lugar" / "Agendar slot"                                  |
| Modificar o cancelar reserva            | P09 "Modificar"                                                          |
| Detalle de evento e inscripción         | P09, P13                                                                 |
| Manifiesto y comunidad                  | P09, P05 (términos)                                                      |
| Publicar proyecto o búsqueda            | P10                                                                      |
| Detalle de proyecto / postulación       | P10                                                                      |
| Contacto entre miembros                 | P10 "Contactar"                                                          |
| Editar perfil propio                    | P12                                                                      |
| Servicios de la cuenta (6)              | P12                                                                      |
| Cargar horas extras / pago              | P12                                                                      |
| Ajustes, cerrar sesión, eliminar cuenta | — (la eliminación de cuenta es obligatoria en App Store si hay registro) |
| Administración de contenidos            | —                                                                        |

**[RECOMENDACIÓN]** Para estas pantallas se pueden proponer diseños provisionales con el sistema de diseño existente, marcados como "provisional", y que vos los apruebes antes de darlos por buenos.
