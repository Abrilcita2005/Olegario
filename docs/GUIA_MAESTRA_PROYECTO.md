# Guía maestra — Olegario en Movimiento

> **Fuente de referencia del proyecto.** Antes de modificar cualquier funcionalidad, consultá esta guía y los documentos complementarios.
> Basada en la estructura de `docs/referencias/GUIA_INICIO_PROYECTO.md`, adaptada a este proyecto.
>
> Última actualización: 2026-10-28 · Etapa actual: ver `docs/ESTADO_DEL_PROYECTO.md`

## Cómo leer esta guía

Cada dato lleva una etiqueta según su origen:

| Etiqueta            | Significado                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **[CONFIRMADO]**    | Verificado en Figma, en los archivos del repositorio o indicado por la responsable del proyecto. |
| **[DECIDIDO]**      | Decisión ya aprobada (ver `docs/DECISIONES_Y_PENDIENTES.md`).                                    |
| **[SUPUESTO]**      | Suposición de trabajo: se usa provisionalmente y debe confirmarse.                               |
| **[RECOMENDACIÓN]** | Propuesta técnica del equipo, pendiente de aprobación.                                           |
| **[PENDIENTE]**     | Falta información o aprobación. **No se implementa** hasta que se defina.                        |

## Documentos del proyecto

| Archivo                           | Contenido                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `OLEGARIO.md` (raíz)              | Reglas resumidas que Claude lee al iniciar cada sesión (importado desde `CLAUDE.md`).                                  |
| `docs/GUIA_MAESTRA_PROYECTO.md`   | Este archivo: identidad, requisitos, navegación, arquitectura, reglas, calidad, entorno.                               |
| `docs/DISENO.md`                  | Sistema de diseño: colores, tipografías, componentes, inventario de recursos visuales, correspondencia Figma ↔ código. |
| `docs/PANTALLAS.md`               | Ficha de cada pantalla identificada en Figma.                                                                          |
| `docs/DECISIONES_Y_PENDIENTES.md` | Registro de decisiones, preguntas, bloqueos, riesgos y recursos pendientes.                                            |
| `docs/PLAN_DE_TRABAJO.md`         | Etapas, tareas, criterios de aceptación y estado.                                                                      |
| `docs/ESTADO_DEL_PROYECTO.md`     | Seguimiento entre sesiones: etapa actual, autorizaciones, próxima acción permitida.                                    |
| `docs/referencias/`               | Guía de referencia original y capturas exportadas de Figma.                                                            |

---

## 0. Auditoría inicial (2026-10-28)

### 0.1 Estado del repositorio [CONFIRMADO]

| Aspecto                      | Resultado                                                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repositorio                  | `Abrilcita2005/Olegario` (GitHub), rama de trabajo `claude/zen-hawking-g0erc1`. No existe rama `main` en el remoto todavía.                                 |
| Commits                      | 3 commits, solo de configuración (`CLAUDE.md`, `OLEGARIO.md`, `.gitignore`, `.env.example`).                                                                |
| Código fuente                | **No existe.** No hay framework, lenguaje, dependencias, `package.json`, pantallas ni componentes.                                                          |
| Configuración                | `.gitignore` (credenciales, Node, Python, sistema, editores) y `.env.example` con variables genéricas de ejemplo (no corresponden a servicios confirmados). |
| Recursos visuales en el repo | Ninguno (salvo las capturas de referencia agregadas en esta etapa en `docs/referencias/figma/`).                                                            |
| Pruebas / verificaciones     | No hay nada que ejecutar: no existe código ni scripts.                                                                                                      |

**Conclusión:** el proyecto parte de cero. No hay arquitectura previa que respetar ni migrar; la elección de tecnología queda abierta y requiere aprobación (ver §G).

### 0.2 Materiales de referencia

| Material                                                        | Estado                                                                                                                                                                            |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Guía de referencia (`GUIA_INICIO_PROYECTO.md`)                  | **[CONFIRMADO]** Recibida y copiada en `docs/referencias/`. Es una plantilla metodológica genérica (fases 0–8, ciclo de etapas, pruebas de uso, publicación, errores frecuentes). |
| Figma `OLEGARIO EN MOVIMIENTO - APP` (`QCRxB2u4qBf98oDDKhzteQ`) | **[CONFIRMADO]** Accedido mediante la integración autorizada de Figma (solo lectura). Ver alcance real en §0.3.                                                                   |
| Capturas adicionales de la app                                  | **[PENDIENTE]** No se recibieron otras capturas aparte de Figma.                                                                                                                  |
| Brief / requisitos escritos del cliente o de la cátedra         | **[PENDIENTE]** No recibidos.                                                                                                                                                     |

### 0.3 Alcance real de la inspección de Figma

El archivo tiene dos páginas:

- **`Diseño y componentes`**: un único frame `Estetica` con el logo (versión clara y oscura), la paleta de colores y la muestra tipográfica.
- **`Alta fidelidad`**: 13 frames de pantalla de **402 px de ancho** (altura variable).

| Frame (id)                           | Diseño (código + medidas)               | Captura | Textos y estructura           |
| ------------------------------------ | --------------------------------------- | ------- | ----------------------------- |
| Estetica (1:2)                       | ✅                                      | ✅      | ✅                            |
| BIENVENIDA 1 (3:1948)                | ✅                                      | ✅      | ✅                            |
| BIENVENIDA 2 (4:2039)                | ✅                                      | ✅      | ✅                            |
| BIENVENIDA 3 (4:2040)                | ✅                                      | ✅      | ✅                            |
| INICIO 1 (107:18)                    | ✅                                      | ✅      | ✅                            |
| INICIO 2 (107:300)                   | ✅                                      | ✅      | ✅                            |
| INICIO 3 (108:726)                   | ✅                                      | ✅      | ✅                            |
| HOME (24:267)                        | ✅                                      | ✅      | ✅                            |
| NOVEDADES FLOTANTES (77:940)         | ❌                                      | ✅      | ✅                            |
| ESPACIOS (46:766)                    | ❌                                      | ✅      | ✅                            |
| AGENDA (58:12)                       | ❌ **(es una imagen plana, sin capas)** | ✅      | Solo lo legible en la captura |
| COMUNIDAD (71:39)                    | ❌                                      | ✅      | ✅                            |
| COMUNIDAD — perfil público (105:836) | ❌                                      | ❌      | ✅                            |
| PERFIL (109:1042)                    | ❌                                      | ❌      | ✅                            |

**Límites encontrados (no se afirma haber revisado lo que no se pudo consultar):**

1. **Límite de llamadas del plan Starter de Figma.** Se agotó durante la auditoría. Faltan el código de diseño (medidas y colores exactos) de 6 frames y las capturas de 2.
2. **AGENDA no tiene capas.** Es una imagen pegada: no se pueden extraer medidas, estilos, textos exactos ni recursos de esa pantalla.
3. **No hay variables ni estilos con nombre** en el archivo (`get_variable_defs` vuelve vacío). Los colores y las tipografías se toman de los valores sueltos de cada capa.
4. **No se pudieron leer las conexiones del prototipo.** La navegación de §F sale de los textos y de la estructura de las pantallas, no de los vínculos de Figma.
5. **No se descargaron los recursos gráficos.** El entorno de trabajo bloquea `figma.com`, así que las imágenes y los SVG quedan para exportar (ver `docs/DISENO.md` §D).
6. No hay variantes de estado (error, carga, vacío, deshabilitado), ni modo oscuro o claro alternativo, ni versiones para tablet.

---

## A. Identidad y contexto

| Campo                  | Valor                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nombre del proyecto    | **Olegario en Movimiento** [CONFIRMADO: logo y nombre del archivo de Figma]                                                                                              |
| Tipo                   | Aplicación móvil [CONFIRMADO: frames de 402 px, barra de navegación inferior]                                                                                            |
| Organización vinculada | **Olegario Coworking**, Mendoza, Argentina [CONFIRMADO: textos "en el corazón de Mendoza", "Mendoza · Hub Creativo & Coworking", "CAFÉ DE ESPECIALIDAD & CONEXIÓN 24/7"] |
| Idioma                 | Español rioplatense con voseo ("Creá tu cuenta", "Ingresá", "Encontrá") [CONFIRMADO, con inconsistencias: ver `docs/DECISIONES_Y_PENDIENTES.md` P-12]                    |
| Marca de servicios     | Prefijo `OLE/` para cada servicio o espacio: OLE/COWORK, OLE/STREAM, OLE/NETWORK, OLE/CAFÉ, OLE/EVENTO, OLE/AFTER OFFICE, OLE/INSPIRACIÓN [CONFIRMADO]                   |
| Lema visible           | "Impulsamos personas, conectamos oportunidades y expandimos experiencias de trabajo." [CONFIRMADO: Home]                                                                 |

### Descripción general

Aplicación que integra en una experiencia digital los espacios de trabajo de Olegario Coworking, sus actividades y eventos, la comunidad profesional de coworkers, las oportunidades de colaboración y la información de cuenta y membresía de cada persona usuaria.

### Problema o necesidad

**[SUPUESTO, a confirmar]** Hoy la información del coworking (disponibilidad, eventos, novedades, beneficios, contactos entre miembros) está dispersa o depende del contacto presencial. La app busca centralizarla y fomentar la colaboración entre miembros ("Hay lugares donde simplemente vas a trabajar. Y hay lugares que te inspiran a hacerlo de otra manera.").

### Objetivos

- **General:** que cada miembro pueda vivir Olegario "estés donde estés" [CONFIRMADO: Bienvenida 3].
- **Específicos** (según los textos de Bienvenida 3 y las pantallas):
  1. Encontrar y reservar el espacio que mejor se adapte (Espacios).
  2. Descubrir eventos, capacitaciones y efemérides (Agenda).
  3. Conocer las novedades y aprovechar beneficios exclusivos (Novedades, Perfil).
  4. Conectar con otros coworkers y oportunidades profesionales (Comunidad).
  5. Gestionar membresía, horas, reservas, paquetes y pagos (Perfil de cuenta).

### Público destinatario

- **Miembros coworkers** [CONFIRMADO: selector "MIEMBRO COWORKER" en Inicio 3].
- **Invitados / asistentes a eventos** [CONFIRMADO: "INVITADO / EVENTO" y "Modo Invitado"].
- **Equipo de Olegario (administración)** [SUPUESTO: alguien tiene que cargar eventos, novedades y espacios; Figma no muestra pantallas de administración].
- Perfil típico de los ejemplos: profesionales creativos y tecnológicos (diseño UI/UX, desarrollo, branding, contenido, podcast) [CONFIRMADO como contenido de ejemplo, no como dato real].

### Propuesta de valor

Un "ecosistema creativo" [CONFIRMADO: Inicio 1] que suma espacio de trabajo, comunidad, agenda y beneficios en una sola app con identidad propia.

### Funciones principales (según Figma)

Bienvenida y consentimiento de privacidad · registro e inicio de sesión (correo, Google, Apple ID, biometría, invitado) · Home con la reserva actual y accesos a espacios · exploración y reserva de espacios por día y horario · agenda con reservas, eventos y efemérides · comunidad con proyectos, talentos y talleres · perfil profesional público · perfil de cuenta con membresía, horas y servicios · novedades con promociones y eventos.

### Alcance

- **Dentro del alcance [SUPUESTO]:** las 9 secciones de Figma y sus flujos.
- **Fuera de alcance o sin definir [PENDIENTE]:** pagos reales, chat o mensajería entre miembros, panel de administración, notificaciones push, check-in físico con hardware, integración con sistemas existentes de Olegario. Ver P-03 a P-09.

---

## B. Requisitos funcionales y no funcionales

Formato: `RF-xx` = funcional, `RNF-xx` = no funcional. El estado indica el grado de confirmación.

### B.1 Requisitos funcionales

| ID    | Requisito                                                                                                                                                                                                                                                                                                                                                                         | Origen               | Estado                                                                                |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------- |
| RF-01 | Mostrar 3 pantallas de bienvenida con botón "SIGUIENTE".                                                                                                                                                                                                                                                                                                                          | Figma                | CONFIRMADO                                                                            |
| RF-02 | Informar el uso de cookies y permisos de rastreo y pedir aceptación (Bienvenida 1).                                                                                                                                                                                                                                                                                               | Figma                | CONFIRMADO en diseño; **qué se rastrea y con qué herramienta: PENDIENTE (P-10)**      |
| RF-03 | Registro con nombre completo, correo profesional, profesión o área, contraseña (mínimo 8 caracteres, con indicador de fortaleza) y aceptación del manifiesto de convivencia.                                                                                                                                                                                                      | Figma (Inicio 2)     | CONFIRMADO en diseño                                                                  |
| RF-04 | Inicio de sesión con correo o usuario y contraseña, "¿Olvidaste tu contraseña?", y alternar la visibilidad de la contraseña.                                                                                                                                                                                                                                                      | Figma (Inicio 3)     | CONFIRMADO en diseño                                                                  |
| RF-05 | Selector de rol al iniciar sesión: "Miembro coworker" o "Invitado / evento".                                                                                                                                                                                                                                                                                                      | Figma (Inicio 3)     | CONFIRMADO en diseño; **diferencias funcionales: PENDIENTE (P-04)**                   |
| RF-06 | Acceso con Google y Apple ID.                                                                                                                                                                                                                                                                                                                                                     | Figma (Inicio 3)     | CONFIRMADO en diseño; **implementación: PENDIENTE (P-05)**                            |
| RF-07 | Acceso con Face ID o huella digital.                                                                                                                                                                                                                                                                                                                                              | Figma (Inicio 3)     | CONFIRMADO en diseño; PENDIENTE de aprobación                                         |
| RF-08 | "Modo Invitado" sin registro.                                                                                                                                                                                                                                                                                                                                                     | Figma (Inicio 1)     | CONFIRMADO en diseño; **limitaciones del invitado: PENDIENTE (P-04)**                 |
| RF-09 | Home: saludo personalizado según el momento del día, frase de marca, reserva actual con estado ("En curso"), botón "Ver detalles y check-in", botón "cómo llegar", accesos a OLE/COWORK, OLE/STREAM y OLE/NETWORK con disponibilidad, y "Ver todo".                                                                                                                               | Figma                | CONFIRMADO en diseño                                                                  |
| RF-10 | Navegación inferior con Inicio, Espacios, Agenda y Comunidad.                                                                                                                                                                                                                                                                                                                     | Figma                | CONFIRMADO                                                                            |
| RF-11 | Botón flotante persistente "Novedades" con contador ("2 nuevas").                                                                                                                                                                                                                                                                                                                 | Figma                | CONFIRMADO                                                                            |
| RF-12 | Espacios: contador de puestos libres, selector de día (semana), búsqueda "Busca tu mesa en tiempo real", horario seleccionado con "CONFIRMAR", tarjetas de espacio (estado, características, ubicación, precio o condición) y acciones "RESERVA TU LUGAR" o "AGENDAR SLOT".                                                                                                       | Figma                | CONFIRMADO en diseño; **fuente de disponibilidad "en tiempo real": PENDIENTE (P-06)** |
| RF-13 | Agenda: filtros (Todo, Mis reservas con contador, Efemérides), calendario semanal, reserva próxima con horario, ubicación, PIN de acceso copiable y "MODIFICAR", efeméride del día con beneficio asociado, y lista de actividades con inscriptos y estado "INSCRIPTO".                                                                                                            | Figma (imagen plana) | CONFIRMADO en diseño; **origen del PIN de acceso: PENDIENTE (P-07)**                  |
| RF-14 | Comunidad: modo de visibilidad (Conexión abierta o Modo foco, "Visible para matches y charlas"), publicar proyecto o búsqueda, filtros de oportunidades, proyectos y oportunidades con postulación, talentos disponibles (Ofrezco / Busco / Contactar) y talleres entre pares (Sumarse).                                                                                          | Figma                | CONFIRMADO en diseño; **"matches y charlas" (¿hay chat?): PENDIENTE (P-08)**          |
| RF-15 | Perfil profesional público: portada, nombre, profesión, ubicación actual en el coworking ("En Ole/Café ahora · Mesa 12") y "Sobre mí".                                                                                                                                                                                                                                            | Figma (105:836)      | CONFIRMADO en textos; diseño visual no capturado                                      |
| RF-16 | Perfil de cuenta: nombre, profesión, "Disponible para colaborar", membresía actual (estado, plan "Acceso 24/7 · Puesto Nómade", horas usadas de un total, p. ej. 42/80), "CARGAR HORAS EXTRAS" y gestión de servicios: paquetes en recepción, beneficios y descuentos, historial y próximas reservas, valoraciones, libro de quejas y sugerencias, métodos de pago y facturación. | Figma (109:1042)     | CONFIRMADO en textos; diseño visual no capturado; **pagos: PENDIENTE (P-03)**         |
| RF-17 | Novedades: "Pulso de Olegario", tarjetas con imagen, etiqueta de descuento, título, descripción y acción ("Pedir al barista", "Últimos cupos"), y avatares de asistentes.                                                                                                                                                                                                         | Figma                | CONFIRMADO en diseño                                                                  |
| RF-18 | Administración de contenidos (espacios, eventos, novedades, efemérides, beneficios).                                                                                                                                                                                                                                                                                              | Necesidad derivada   | **PENDIENTE (P-09)**: no hay diseño                                                   |
| RF-19 | Notificaciones (contador de novedades; posibles avisos de reservas).                                                                                                                                                                                                                                                                                                              | Figma (contador)     | Push: PENDIENTE                                                                       |
| RF-20 | Reservas reales: crear, modificar y cancelar, con validación de disponibilidad y consumo de horas del plan.                                                                                                                                                                                                                                                                       | Figma (botones)      | Lógica de negocio: PENDIENTE (P-06)                                                   |

### B.2 Requisitos no funcionales

| ID     | Requisito                                                                                                        | Estado                                                            |
| ------ | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| RNF-01 | Funcionar en iOS y Android.                                                                                      | RECOMENDACIÓN, pendiente de confirmar (P-01)                      |
| RNF-02 | Respetar la identidad visual de Figma (colores, tipografías, componentes).                                       | CONFIRMADO                                                        |
| RNF-03 | Adaptarse a distintos anchos de teléfono tomando 402 pt como referencia.                                         | RECOMENDACIÓN                                                     |
| RNF-04 | Accesibilidad: contraste, áreas táctiles mínimas, etiquetas para lectores de pantalla, texto escalable (ver §I). | RECOMENDACIÓN                                                     |
| RNF-05 | Privacidad: consentimiento explícito, visibilidad del perfil controlada por la persona usuaria, datos mínimos.   | CONFIRMADO en diseño (Bienvenida 1, Modo foco); reglas: PENDIENTE |
| RNF-06 | Seguridad: contraseñas nunca en texto plano, sesiones seguras y secretos fuera del repositorio.                  | DECIDIDO (regla del proyecto)                                     |
| RNF-07 | Rendimiento: imágenes optimizadas y listas largas virtualizadas.                                                 | RECOMENDACIÓN                                                     |
| RNF-08 | Comportamiento sin conexión: mostrar el último dato disponible y mensajes claros, nunca errores técnicos.        | RECOMENDACIÓN, pendiente                                          |
| RNF-09 | Adaptación al tema del sistema (claro/oscuro).                                                                   | **PENDIENTE (P-11)**: Figma tiene un solo tema                    |

### B.3 Sobre el backend

No se asume un backend propio. Las alternativas están en §G.6, y la decisión depende de P-02 (¿existe un sistema de gestión del coworking?) y P-03 (¿hay pagos reales?).

---

## C. Identidad visual

Ver **`docs/DISENO.md`**. Resumen:

- **Paleta de marca [CONFIRMADO]:** `#FF0055` rosa · `#F84600` naranja · `#C5FD44` lima · `#5850F5` violeta · `#262020` negro cálido · degradado `#FF0055 → #F84600 → #C5FD44`.
- **Tipografías:** la página de estilo indica **Vástago** para títulos y **San Francisco** para subtítulos y cuerpo, pero **las pantallas usan Poppins, Manrope, Montserrat y DM Sans**. Es una discrepancia importante (P-13).

## D. Inventario de recursos visuales

Ver **`docs/DISENO.md` §D**.

## E. Inventario de pantallas

Ver **`docs/PANTALLAS.md`** (14 fichas).

---

## F. Navegación y experiencia de usuario

### F.1 Mapa de navegación [SUPUESTO a partir de Figma; sin conexiones de prototipo verificadas]

```
Primera apertura
  Bienvenida 1 (consentimiento) → Bienvenida 2 → Bienvenida 3
        ↓
  Inicio 1 — Acceso
    ├─ INICIAR SESIÓN ──────→ Inicio 3 — Login ──┐
    ├─ CREAR UNA CUENTA ────→ Inicio 2 — Registro ┤
    └─ Modo Invitado ───────────────────────────┤
                                                 ↓
                         ┌──────── App principal ────────┐
                         │  Barra inferior (4 pestañas)  │
                         │  Inicio · Espacios · Agenda · Comunidad
                         │  + Botón flotante Novedades   │
                         │  + Encabezado: logo · icono · avatar
                         └───────────────────────────────┘
  Avatar (encabezado) ─→ Perfil de cuenta  [SUPUESTO]
  Tarjeta de talento/proyecto ─→ Perfil profesional público [SUPUESTO]
  Botón Novedades ─→ Novedades (Pulso de Olegario)
```

### F.2 Flujos

| Flujo            | Descripción                                                                                                                | Estado                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Bienvenida       | Se muestra en la primera apertura. "SIGUIENTE" avanza; no hay "Saltar" en el diseño.                                       | Cuándo se vuelve a mostrar: PENDIENTE                                                                                   |
| Consentimiento   | Bienvenida 1 informa cookies y rastreo. El diseño solo muestra "SIGUIENTE", sin opción de rechazar.                        | **PENDIENTE (P-10)**: en iOS, el rastreo exige el aviso del sistema (App Tracking Transparency) y debe poder rechazarse |
| Registro         | Inicio 2: completar campos, aceptar el manifiesto y "CREAR CUENTA Y CONTINUAR". Enlace "¿Ya tenés cuenta? Iniciar sesión". | Validaciones en `PANTALLAS.md`                                                                                          |
| Inicio de sesión | Inicio 3: elegir rol, correo y contraseña, Face ID, Google o Apple. Enlace "Registrate y sumate a Olegario".               | Recuperación de contraseña sin diseño: PENDIENTE                                                                        |
| Invitado         | "Modo Invitado" (Inicio 1) o rol "Invitado / evento" (Inicio 3).                                                           | Qué puede ver y hacer: PENDIENTE (P-04)                                                                                 |
| Reserva          | Espacios: elegir día y horario, "CONFIRMAR", elegir espacio, "RESERVA TU LUGAR" o "AGENDAR SLOT".                          | Confirmación, errores y cancelación sin diseño: PENDIENTE                                                               |
| Novedades        | Botón flotante visible sobre la barra inferior en Home, Espacios, Agenda y Comunidad.                                      | En la pantalla Novedades, la pestaña activa es "Inicio"                                                                 |

### F.3 Comportamientos a definir [PENDIENTE]

- "Volver": el diseño solo muestra la flecha en Inicio 2 y 3. **[RECOMENDACIÓN]** botón y gesto del sistema llevan a la pantalla anterior; las pestañas conservan su posición.
- Qué abren el icono del encabezado (Component 3, el logo de tres píldoras) y el avatar.
- Pantallas de detalle (espacio, evento, proyecto), confirmaciones y modales: no están diseñadas.
- Estados sin conexión, carga, error y vacío: no están diseñados (ver `DISENO.md` §C.10).
- Diferencias entre persona autenticada, invitada y administradora.

---

## G. Arquitectura técnica

> **[DECIDIDO 2026-10-28]** React Native + Expo + TypeScript, para iOS y Android (D-07). El backend sigue pendiente (P-02).

### G.1 Framework y lenguaje — **React Native con Expo SDK 58 + TypeScript** [DECIDIDO]

| Criterio                         | Por qué                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| iOS y Android con un solo código | Requisito probable (RNF-01).                                                                               |
| Probar sin Mac                   | Expo Go permite probar en un teléfono físico; las compilaciones para iOS se pueden hacer en la nube (EAS). |
| Cercanía con Figma               | La integración de Figma devuelve código de referencia en React, más fácil de adaptar a React Native.       |
| Tipografías                      | Expo carga fuentes propias (Poppins, Manrope, etc.) en las dos plataformas.                                |
| Madurez                          | Herramientas estables y mantenidas (regla 4.5 de la guía de referencia).                                   |

**Alternativas consideradas:** Flutter (excelente, pero en Dart y más lejos del código que da Figma), nativo Swift + Kotlin (doble trabajo) y PWA web (sin Face ID ni publicación en tiendas de forma nativa).

### G.2 Estructura de carpetas [CONFIRMADO en la Etapa 3]

Las rutas van en `src/app/`, que es la convención de la plantilla oficial de Expo SDK 58.

```
Olegario/
├── src/
│   ├── app/              Pantallas y rutas (expo-router)
│   │   ├── _layout.tsx   Navegación raíz (pila)
│   │   ├── (tabs)/       index (Inicio), espacios, agenda, comunidad
│   │   ├── (bienvenida)/ [Etapa 5–6]
│   │   └── (acceso)/     [Etapa 5–6]
│   ├── components/       Componentes reutilizables (Boton, Tarjeta, Chip, Campo…)
│   ├── theme/            Tokens: colores, tipografías, espaciados, radios, sombras
│   ├── services/         Acceso a datos (interfaz común: datos de prueba ↔ backend real)
│   ├── models/           Tipos TypeScript (Usuario, Espacio, Reserva, Evento…)
│   ├── hooks/
│   └── utils/            Lógica pura con pruebas (formatos de fecha, horas, validaciones)
├── assets/               fuentes/, imagenes/, iconos/
├── data/mock/            Datos de prueba claramente identificados
├── docs/
└── tests/
```

### G.3 Navegación

`expo-router` [DECIDIDO]: pila raíz para el flujo de bienvenida y acceso, y pestañas con el componente `Tabs` de `expo-router/ui`, que permite una barra 100 % personalizada según el diseño. El botón Novedades va como capa persistente sobre las pestañas.

### G.4 Estado

**[RECOMENDACIÓN]** Estado local con React y un contexto para la sesión. Si hace falta caché de datos remotos, TanStack Query. No se agrega Redux ni similares sin necesidad.

### G.5 Modelos de datos (borrador, sujeto a P-02)

`Usuario` (nombre, correo, profesión, rol, visibilidad) · `PerfilProfesional` (sobre mí, ofrezco, busco, disponibilidad, ubicación actual) · `Membresia` (plan, estado, horas incluidas/usadas) · `Espacio` (marca OLE/…, nombre, ubicación, características, capacidad, condición de acceso) · `Reserva` (espacio, fecha, horario, estado, PIN) · `Evento` (tipo, fecha, lugar, cupo, inscriptos) · `Efemeride` · `Novedad` (promo, beneficio, CTA) · `Proyecto/Oportunidad` (busca, autor, etiquetas, estado) · `Taller`.

### G.6 Backend y datos — alternativas [PENDIENTE P-02]

| Opción                                                        | Ventajas                                                                           | Desventajas                                      |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| **A. Datos de prueba locales primero** (JSON en `data/mock/`) | Avanza con la interfaz sin bloquearse; cero costos.                                | No es funcional para uso real.                   |
| **B. Supabase** (Postgres + autenticación + almacenamiento)   | Autenticación con correo, Google y Apple ya resuelta; plan gratuito; SQL estándar. | Servicio externo (posibles costos al crecer).    |
| **C. Firebase**                                               | Autenticación y push integradas.                                                   | Base NoSQL; dependencia de Google.               |
| **D. Integración con el sistema actual de Olegario**          | Datos reales de membresías y reservas.                                             | Depende de que exista y tenga API (desconocido). |

**[RECOMENDACIÓN]** Arrancar con **A**, detrás de una capa `services/` con interfaz única, y decidir **B, C o D** antes de la etapa de integraciones. Cualquier servicio con costo se consulta antes de usarlo.

### G.7 Autenticación y autorización

Depende de G.6. Reglas fijas: contraseñas con hash en el servidor, tokens en almacenamiento seguro (`expo-secure-store`), biometría solo como desbloqueo de una sesión ya existente y nunca como reemplazo de la contraseña en el servidor.

### G.8 Configuración y entorno

Variables en `.env` (fuera de Git) y `.env.example` actualizado. Las variables públicas de Expo usan el prefijo `EXPO_PUBLIC_` y **nunca** contienen secretos.

### G.9 Errores, registro y diagnóstico

Mensajes para la persona usuaria en lenguaje simple. Errores técnicos solo en el registro de desarrollo. **[PENDIENTE]** Servicio de reporte de fallos (p. ej. Sentry): requiere aprobación.

### G.10 Pruebas

[DECIDIDO] Jest (`jest-expo`) + Testing Library, con `renderRouter` de `expo-router/testing-library` para probar la navegación. TypeScript estricto, ESLint (`eslint-config-expo`) y Prettier. Pruebas visuales: capturas de la versión web con Playwright (en `CI` del entorno en la nube), comparadas con `docs/referencias/figma/`.

### G.11 Construcción y ejecución

Desarrollo con `npx expo start` y Expo Go. Compilaciones con EAS Build. **Publicar en tiendas requiere cuentas de desarrollador (Apple: pago anual; Google: pago único). No se hace nada sin tu aprobación.**

---

## H. Reglas de desarrollo del proyecto (obligatorias)

1. Esta guía y los documentos de `docs/` son la fuente de referencia del proyecto.
2. Antes de modificar una funcionalidad, consultar su ficha en `PANTALLAS.md` y su etapa en el plan.
3. No inventar requisitos, contenido, datos reales ni decisiones de diseño.
4. No alterar la identidad visual sin autorización. **Figma (página "Alta fidelidad") es la fuente de verdad visual**; ante discrepancias con lo escrito, se pregunta.
5. No duplicar componentes que deberían ser reutilizables.
6. Evitar código innecesariamente complejo.
7. Mantener nombres consistentes y código legible: componentes en `PascalCase`, funciones y variables en `camelCase`, archivos de imagen en `kebab-case`.
8. Usar tipado estricto (TypeScript `strict`) y evitar soluciones inseguras.
9. No guardar claves, contraseñas ni secretos en el repositorio.
10. No subir archivos `.env` ni credenciales.
11. No afirmar que una función está terminada sin verificarla.
12. Ejecutar las pruebas y comprobaciones disponibles después de cada cambio relevante.
13. Documentar las limitaciones y los errores conocidos.
14. No eliminar funcionalidades existentes sin justificación y autorización.
15. No introducir dependencias sin explicar por qué son necesarias, y pedir aprobación antes de instalarlas.
16. No usar datos ficticios como si fueran reales. Los nombres de Figma (Sofía Valenzuela, Martina Rossi, Clara Méndez, etc.) son **contenido de ejemplo**.
17. Mientras no haya backend, usar datos de prueba identificados (carpeta `data/mock/` y campo `esDatoDePrueba: true` o similar).
18. Respetar las reglas de privacidad y permisos.
19. Mantener actualizados el plan de trabajo, el estado del proyecto y el registro de decisiones.
20. Consultar antes de decisiones que afecten significativamente el diseño, la arquitectura, el alcance, la seguridad o los costos.
21. **Trabajo por etapas con autorización explícita:** no se empieza una etapa nueva sin un "avanzá" claro de la responsable. Ver el protocolo en `PLAN_DE_TRABAJO.md`.
22. Commits con el formato `Etapa N — Nombre de la etapa` (o `Etapa N — Nombre: detalle`). Se suben solo a la rama de trabajo; nunca a `main` sin autorización.
23. Respetar los cambios manuales: antes de editar un archivo, leer su versión actual.

---

## I. Accesibilidad, privacidad y calidad

| Tema                     | Regla                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contraste                | Mínimo WCAG AA (4,5:1 para texto normal y 3:1 para texto grande). Medido: blanco sobre `#EC6A06` (inicio del degradado de los botones principales) da **3,17:1**; texto `#E11463` sobre fondo `#DCDCDC` (chips "En curso", "Ver todo") da **3,42:1**. Los dos quedan por debajo de AA para texto chico (P-14). Cumplen: `#C5FD44` sobre `#262020` (13,4:1), `#A1A1AA` sobre `#262020` (6,3:1) y blanco sobre `#E11D48` (4,7:1). |
| Tamaño de texto          | El diseño usa textos de 9–10 px (etiquetas de la barra inferior, "4 Puestos Libres"). **[RECOMENDACIÓN]** mínimo 11 pt y respetar el tamaño de texto del sistema.                                                                                                                                                                                                                                                               |
| Áreas táctiles           | Mínimo 44×44 pt (iOS) y 48×48 dp (Android). Los botones de la barra inferior (64×48) cumplen; revisar los chips y enlaces pequeños.                                                                                                                                                                                                                                                                                             |
| Etiquetas accesibles     | Cada icono-botón con `accessibilityLabel` (el diseño ya trae nombres útiles: "Cómo llegar a tu puesto", "Ver u ocultar contraseña").                                                                                                                                                                                                                                                                                            |
| Lectores de pantalla     | Orden lógico de lectura, roles correctos (botón, enlace, encabezado) y estados anunciados (seleccionado, deshabilitado).                                                                                                                                                                                                                                                                                                        |
| Permisos del dispositivo | Se piden solo con necesidad documentada y en el momento de uso: biometría (RF-07), ubicación ("cómo llegar"), cámara (posible check-in por QR, sin confirmar), notificaciones (RF-19), rastreo (P-10).                                                                                                                                                                                                                          |
| Datos personales         | Mínimos necesarios. El correo y los datos de pago nunca se muestran completos ("Visa terminada en •••• 4092" sigue esa regla).                                                                                                                                                                                                                                                                                                  |
| Visibilidad del perfil   | La persona usuaria controla su visibilidad ("Modo foco" vs "Conexión abierta"). Reglas exactas de qué ve cada rol: PENDIENTE (P-08).                                                                                                                                                                                                                                                                                            |
| Ubicación en tiempo real | "En Ole/Café ahora · Mesa 12" expone la ubicación física: **debe ser opcional y estar desactivada por defecto** [RECOMENDACIÓN, P-08].                                                                                                                                                                                                                                                                                          |
| Sesiones                 | Tokens en almacenamiento seguro, cierre de sesión manual y expiración.                                                                                                                                                                                                                                                                                                                                                          |
| Validación de entradas   | En el cliente para dar respuesta inmediata **y** en el servidor como autoridad.                                                                                                                                                                                                                                                                                                                                                 |
| Compatibilidad           | **[RECOMENDACIÓN]** iOS 16+ y Android 8+ (API 26+). PENDIENTE de confirmar.                                                                                                                                                                                                                                                                                                                                                     |

---

## J. Entorno y ejecución

[CONFIRMADO en la Etapa 3] Versiones: Node 22, Expo SDK 58, React Native 0.88, React 19.3, TypeScript 6.0.

| Paso                             | Comando                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| Instalar dependencias            | `npm install`                                                      |
| Servidor de desarrollo           | `npm start` (Expo Go escaneando el QR) · `npm run web` (navegador) |
| Pruebas                          | `npm test`                                                         |
| Tipos                            | `npm run typecheck`                                                |
| Lint                             | `npm run lint`                                                     |
| Formato                          | `npm run format` / `npm run format:check`                          |
| Todo junto                       | `npm run verificar`                                                |
| Compilar paquetes (comprobación) | `npx expo export --platform all`                                   |
| Compilaciones instalables        | EAS Build, Etapa 15, **con aprobación**                            |

**Particularidades del entorno en la nube** (donde trabaja la responsable, P-15):

- `api.expo.dev` y `docs.expo.dev` están bloqueados por la red. Para instalar paquetes se usa `EXPO_OFFLINE=1 npx expo install <paquete>`, que toma las versiones compatibles de la tabla que trae Expo.
- No hay teléfono ni emulador. La app se verifica con la versión web (capturas con Playwright y Chromium) y con `expo export` para iOS y Android. Las pruebas en un teléfono real quedan para cuando haya uno disponible (Etapa 14).
- `npx expo-doctor` no se puede correr (necesita red).

---

## K. Registro de decisiones y pendientes

Ver **`docs/DECISIONES_Y_PENDIENTES.md`**.

---

## L. Adaptación de la guía de referencia

| Apartado de la guía de referencia           | Dónde quedó                      | Adaptación                                                                                                                                   |
| ------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Fase 0: entrevista                          | `DECISIONES_Y_PENDIENTES.md` §2  | Se reemplazó por preguntas concretas derivadas de la auditoría, agrupadas por tema.                                                          |
| Fase 1: ficha                               | §A y `OLEGARIO.md`               | Completada con datos de Figma.                                                                                                               |
| Fase 2: reglas                              | §H y `OLEGARIO.md`               | Se sumaron las 20 reglas del pedido y el protocolo por etapas.                                                                               |
| Fase 3: stack                               | §G                               | El stack de referencia (React + Vite + PHP + MySQL + Docker) es para web y **no aplica** a una app móvil; se propone otro con justificación. |
| Fase 4: identidad visual                    | `DISENO.md`                      | Con tabla de diferencias con el diseño.                                                                                                      |
| Fase 5: pantallas y navegación              | `PANTALLAS.md` y §F              | Incluye la tabla de "qué abre cada botón".                                                                                                   |
| Fase 6: datos, lógica y seguridad           | §G.5–G.7 y §I                    | Las reglas de sesión con cookies HttpOnly son de web; en móvil se usa almacenamiento seguro.                                                 |
| Fase 7: plan                                | `PLAN_DE_TRABAJO.md`             | 15 etapas.                                                                                                                                   |
| Fase 8: carpeta                             | §G.2                             | Adaptada a Expo.                                                                                                                             |
| Ciclo de cada etapa                         | `PLAN_DE_TRABAJO.md` (protocolo) | Integrado con el protocolo de autorización.                                                                                                  |
| Pruebas de uso con personas                 | `PLAN_DE_TRABAJO.md` Etapa 14    | Mínimo 3 personas ajenas al desarrollo y planilla por tarea.                                                                                 |
| Publicación                                 | `PLAN_DE_TRABAJO.md` Etapa 15    | Hosting compartido y kiosco **no aplican**; se reemplazan por EAS y tiendas.                                                                 |
| Errores frecuentes                          | Abajo                            | Se conservan los aplicables a móvil.                                                                                                         |
| Lista de control final                      | `PLAN_DE_TRABAJO.md` final       | Adaptada.                                                                                                                                    |
| Documentación externa sincronizada (Notion) | —                                | No aplica por ahora: no se informó documentación externa (P-16).                                                                             |

### Errores frecuentes aplicables (de la guía de referencia)

| Problema                                                                | Cómo evitarlo aquí                                                      |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Proyecto dentro de una carpeta sincronizada con la nube (Drive, iCloud) | Trabajar en una carpeta local con Git; `node_modules` nunca en la nube. |
| Botones de acción que desaparecen al desplazar                          | Barra inferior y botón Novedades fijos, fuera del área que se desplaza. |
| Capas (teclado, modales) que se mueven con el contenido                 | Usar `KeyboardAvoidingView` y modales del sistema de navegación.        |
| Claves duplicadas en listas                                             | Usar identificadores estables, nunca el índice.                         |
| Toques múltiples que disparan acciones de más                           | Deshabilitar el botón mientras se procesa una reserva o un envío.       |
| Valores "a ojo"                                                         | Medir en Figma y comparar con las capturas de referencia.               |
| Datos de prueba que quedan mezclados                                    | Datos de prueba solo en `data/mock/` e identificados.                   |
