# Sistema de diseño — Olegario en Movimiento

> Fuente: Figma `OLEGARIO EN MOVIMIENTO - APP` (`QCRxB2u4qBf98oDDKhzteQ`), páginas "Diseño y componentes" y "Alta fidelidad".
> Las etiquetas [CONFIRMADO], [PENDIENTE], etc. siguen la convención de `GUIA_MAESTRA_PROYECTO.md`.
> El archivo de Figma **no tiene variables ni estilos con nombre**: los valores se tomaron de cada capa.
> Medidas y colores exactos solo de los frames con código de diseño (Estética, Bienvenida 1–3, Inicio 1–3 y Home). Del resto, solo la captura.

---

## Sistema de diseño vigente (Etapa 4, 2026-10-28)

> **Esta sección manda.** Las secciones C.1 a C.11 que siguen son el relevamiento original de Figma y quedan como referencia histórica.
> Código: `src/theme/` (tokens) y `src/components/` (componentes). Catálogo visual: ruta `/catalogo` y capturas en `docs/capturas-app/etapa-4/`.

### Colores [DECIDIDO]

Fuente: los SVG originales de la marca (carpeta de Drive "LOGOS"), elegidos por la responsable por sobre Figma.

| Token                                     | HEX                                                                         | Uso                                          |
| ----------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------- |
| `marca.rosa` / `colores.acento`           | `#FE016D`                                                                   | Acento principal, chips de estado, errores   |
| `marca.naranja` / `colores.acentoNaranja` | `#F83B11`                                                                   | Categorías, descuentos, advertencias         |
| `marca.lima` / `colores.acentoLima`       | `#CAF22C`                                                                   | Etiquetas de campo, disponibilidad, éxito    |
| `marca.negro` / `colores.superficie`      | `#262020`                                                                   | Tarjetas, botones oscuros, texto sobre claro |
| `marca.grisLogo`                          | `#E6E6E6`                                                                   | Texto del logo sobre fondo oscuro            |
| `colores.fondo`                           | `#DCDCDC`                                                                   | Fondo de pantalla (Figma)                    |
| Neutros de interfaz                       | `#353439`, `#272732`, `#D4D4D8`, `#A1A1AA`, `#E4E1E7`, `#FFFAF9`, `#D9D9D9` | Tomados de las pantallas de Figma            |

Degradados: **marca** `#FE016D → #F83B11 (52 %) → #CAF22C` · **acción** (botones principales) `#F83B11 → #FE016D` · **acento** `#FE016D → #F83B11`.
Muestra del degradado de la marca: `docs/referencias/marca/degradado-marca.png`.

**Tema único, sin modo oscuro** [DECIDIDO por la responsable]: `app.json` fija `userInterfaceStyle: "light"`.

### Tipografías [DECIDIDO]

| Uso                  | Familia                                                 | Pesos cargados                                    | Licencia                         |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------- | -------------------------------- |
| Títulos y destacados | **Poppins** (la misma de las pantallas de Figma)        | Bold, ExtraBold, Black, Black Italic              | SIL Open Font License (gratuita) |
| Texto continuo       | **Inter** (en lugar de San Francisco, en iOS y Android) | Regular, Medium, SemiBold, Bold, ExtraBold, Black | SIL Open Font License (gratuita) |

Historial: primero se eligió Vástago Grotesk para títulos, pero es una fuente comercial de Sudtipos ("All rights reserved") y el repositorio es público, así que la responsable eligió reemplazarla por Poppins (2026-10-28). Comparación usada para decidir: `docs/referencias/marca/comparacion-fuentes-titulos.png`.

Regla de conversión desde Figma: **Poppins se mantiene** y **Manrope / Montserrat / DM Sans → Inter**, con el mismo peso. Para destacar se usan los pesos de la familia que corresponda en ese lugar, guiándose siempre por Figma.
La escala completa está en `src/theme/tipografia.ts` (variantes `display`, `tituloPantalla`, `tituloAcceso`, `tituloSeccion`, `tituloTarjeta`, `tituloDestacado`, `categoria`, `cita`, `cuerpo`, `chip`, `etiquetaCampo`, `input`, `boton`, `pestana`, `micro`, etc.).

San Francisco: la carpeta de Drive solo tenía archivos de metadatos de macOS (`._*`), no las fuentes. Igualmente su licencia no permite usarla en Android.

### Componentes base (Etapa 4)

| Componente           | Archivo                       | Variantes / notas                                                                                                                      |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Texto`              | `src/components/ui/Texto.tsx` | Todas las variantes tipográficas; respeta el tamaño de letra del sistema                                                               |
| `Boton`              | `ui/Boton.tsx`                | primario (degradado acción), secundario, contorno, siguienteClaro, siguienteOscuro · tamaños grande/mediano · cargando · deshabilitado |
| `BotonIcono`         | `ui/BotonIcono.tsx`           | 44×44, etiqueta accesible obligatoria                                                                                                  |
| `Chip`               | `ui/Chip.tsx`                 | estado (con punto), enlace, descuento, destacado                                                                                       |
| `CampoFormulario`    | `ui/CampoFormulario.tsx`      | texto, correo, contraseña con mostrar/ocultar, error                                                                                   |
| `IndicadorFortaleza` | `ui/IndicadorFortaleza.tsx`   | 4 barras (criterio en `utils/fortalezaContrasena.ts`, provisional)                                                                     |
| `Casilla`            | `ui/Casilla.tsx`              | aceptación de términos, área táctil de toda la fila                                                                                    |
| `SelectorSegmentado` | `ui/SelectorSegmentado.tsx`   | opción activa con degradado                                                                                                            |
| `Tarjeta`            | `ui/Tarjeta.tsx`              | superficie oscura, opcional elevada                                                                                                    |
| Estados              | `ui/Estados.tsx`              | cargando, esqueleto, vacío, error (**provisionales**)                                                                                  |
| `Logo`               | `marca/Logo.tsx`              | horizontal negro (sobre claro) y blanco (sobre oscuro), vectoriales                                                                    |
| `IconoSubmarca`      | `marca/IconoSubmarca.tsx`     | OLE/COWORK, STREAM, NETWORK, CAFÉ (sin el texto; el nombre va aparte)                                                                  |
| Íconos genéricos     | `iconos/Iconos.tsx`           | ojo, ojo tachado, flecha volver (dibujados, sin librería)                                                                              |

Quedan para la Etapa 5: barra de navegación, botón flotante Novedades y encabezado. Las tarjetas compuestas (reserva, espacio, evento, proyecto) se arman en la etapa de cada pantalla.

### Diferencias con Figma aplicadas en esta etapa

| Tema               | Figma                                      | App                                               | Aprobado por            |
| ------------------ | ------------------------------------------ | ------------------------------------------------- | ----------------------- |
| Colores de acento  | `#E11D48`, `#F97316`, `#EC6A06`, `#C5FD44` | `#FE016D`, `#F83B11`, `#CAF22C` (SVG de marca)    | Responsable, 2026-10-28 |
| Títulos            | Poppins                                    | Vástago Grotesk                                   | Responsable, 2026-10-28 |
| Texto continuo     | Manrope / Montserrat / DM Sans             | Inter                                             | Responsable, 2026-10-28 |
| Íconos de servicio | PNG con aro de degradado (Recurso 13)      | SVG de la marca (círculo oscuro + marca, sin aro) | Pendiente de revisión   |

### Contraste con los colores aprobados (WCAG)

| Combinación                       | Ratio | Texto chico (4,5) | Texto grande (3) |
| --------------------------------- | ----- | ----------------- | ---------------- |
| Blanco sobre `#FE016D`            | 3,86  | ❌                | ✅               |
| Blanco sobre `#F83B11`            | 3,73  | ❌                | ✅               |
| `#FE016D` sobre `#DCDCDC` (chips) | 2,82  | ❌                | ❌               |
| `#FE016D` sobre `#262020`         | 4,15  | ❌                | ✅               |
| `#CAF22C` sobre `#262020`         | 12,40 | ✅                | ✅               |

La responsable decidió **mantener los colores de marca** tal cual (2026-10-28): queda como limitación aceptada (L-05).

---

## C.1 Paleta de marca [CONFIRMADO: página "Diseño y componentes"]

| Nombre propuesto (token) | HEX                                  | RGB          | Uso observado                                                                                              |
| ------------------------ | ------------------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `marca.rosa`             | `#FF0055`                            | 255, 0, 85   | Paleta de marca, logo (píldoras). **No aparece como relleno en las pantallas inspeccionadas.**             |
| `marca.naranja`          | `#F84600`                            | 248, 70, 0   | Paleta de marca, logo.                                                                                     |
| `marca.lima`             | `#C5FD44`                            | 197, 253, 68 | Etiquetas de formulario, disponibilidad ("4 Puestos Libres"), selector de rol inactivo, "2 nuevas".        |
| `marca.violeta`          | `#5850F5`                            | 88, 80, 245  | Paleta de marca. **No aparece en ninguna pantalla inspeccionada.**                                         |
| `marca.negro`            | `#262020`                            | 38, 32, 32   | Tarjetas, barra inferior, botones secundarios, fondos oscuros (Bienvenida 1 y 3), texto sobre fondo claro. |
| `marca.degradado`        | `#FF0055 → #F84600 (50 %) → #C5FD44` | —            | Paleta de marca (vertical) y aros de los íconos de servicios.                                              |

## C.2 Colores usados en las pantallas [CONFIRMADO: código de diseño]

| Rol                           | HEX                                           | Dónde                                                                    |
| ----------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| Fondo de pantalla claro       | `#DCDCDC`                                     | Home, Bienvenida 2, Inicio 1–3                                           |
| Fondo de pantalla oscuro      | `#262020`                                     | Bienvenida 1 y 3                                                         |
| Superficie / tarjeta          | `#262020`                                     | Tarjetas, barra inferior, campos de formulario (contenedor)              |
| Superficie elevada / campo    | `#353439`                                     | Fondo de los inputs, botón biométrico, barras de fortaleza de contraseña |
| Superficie de imagen          | `#272732` (borde `#353439`)                   | Miniatura de la reserva                                                  |
| Botón claro                   | `#D9D9D9` aprox. (SVG)                        | Botón "SIGUIENTE" sobre fondo oscuro                                     |
| Acento principal (rosa)       | `#E11D48`                                     | Indicador "En curso", "O CONTINÚA CON", fin del degradado CTA            |
| Acento rosa texto             | `#E11463`                                     | Texto de chips "En curso" y "Ver todo >"                                 |
| Chip rosa (fondo / borde)     | `rgba(225,29,72,0.2)` / `rgba(225,29,72,0.4)` | Chips de estado                                                          |
| Acento naranja                | `#F97316`                                     | Categoría "OLE/COWORK · PUESTO INDIVIDUAL", punto de notificación        |
| Inicio del degradado CTA      | `#EC6A06`                                     | Botones principales (Iniciar sesión, Crear cuenta)                       |
| Degradado CTA                 | `#EC6A06 → #E11D48` (horizontal)              | Botones principales, selector de rol activo                              |
| Degradado pestaña activa      | `#E11D48 → #E11463` (36,9°)                   | Pestaña activa de la barra inferior                                      |
| Degradado ícono Novedades     | `#E11D48 → #F97316` (45°)                     | Círculo del botón Novedades, palabra "CREATIVO"                          |
| Degradado banner              | `#262020 → #262020 (50 %) → #1B1219`          | Banner de la frase de marca (Home)                                       |
| Texto sobre oscuro            | `#FFFFFF`, `#FFFAF9`, `#E4E1E7`, `#DCDCDC`    | Títulos, botones, cuerpo                                                 |
| Texto secundario sobre oscuro | `#D4D4D8`                                     | Horario de la reserva, descripciones                                     |
| Texto terciario / inactivo    | `#A1A1AA`                                     | Pestañas inactivas, ubicación, metadatos                                 |
| Texto sobre claro             | `#262020`                                     | Títulos y cuerpo en fondo `#DCDCDC`                                      |
| Divisor sobre oscuro          | `rgba(255,255,255,0.1)`                       | Separadores en tarjetas, borde del botón secundario                      |
| Checkbox                      | fondo `#FFFFFF`, borde `#767676`              | Aceptación del manifiesto (estilo del sistema)                           |

### Colores de secciones no finales (descartes ocultos dentro de Inicio 1–3)

Los frames de Inicio contienen **secciones ocultas fuera del área visible** (tarjetas de "Talentos disponibles" y "Talleres") con otra paleta: `#1B1B22`, `#14141A`, `#23232E`, `#2E2E3C`, `#282836`, verdes `#34D399`/`#6EE7B7`, `#FB923C`, `#FB7185` y `#22D3EE`. **[SUPUESTO]** Son restos de una versión anterior de Comunidad. Solo se usan si la pantalla Comunidad final (cuyo código no se pudo leer) los confirma (P-17).

### Discrepancias de color [PENDIENTE P-14]

1. El rosa de marca `#FF0055` y el rosa de las pantallas `#E11D48`/`#E11463` no coinciden.
2. El naranja de marca `#F84600` y el de las pantallas `#F97316`/`#EC6A06` no coinciden.
3. El violeta `#5850F5` no se usa en ninguna pantalla.

**[RECOMENDACIÓN]** Tomar los valores de las pantallas de alta fidelidad como los de uso en la interfaz y mantener los de la paleta para el logo y las piezas de marca. Lo decidís vos.

### Estados semánticos [PENDIENTE]

No hay diseño de error, éxito ni advertencia. **[RECOMENDACIÓN provisional]**: error `#E11D48` (ya presente), éxito `#C5FD44` sobre oscuro (ya usado como "disponible"), advertencia `#F97316`. Requiere aprobación.

### Contraste medido (WCAG)

| Combinación               | Ratio | AA texto chico (4,5)   |
| ------------------------- | ----- | ---------------------- |
| `#FFFFFF` sobre `#262020` | 16,03 | ✅                     |
| `#C5FD44` sobre `#262020` | 13,37 | ✅                     |
| `#D4D4D8` sobre `#262020` | 10,85 | ✅                     |
| `#A1A1AA` sobre `#262020` | 6,26  | ✅                     |
| `#F97316` sobre `#262020` | 5,72  | ✅                     |
| `#262020` sobre `#DCDCDC` | 11,69 | ✅                     |
| `#FFFFFF` sobre `#E11D48` | 4,70  | ✅                     |
| `#FFFFFF` sobre `#FF0055` | 3,90  | ❌ (solo texto grande) |
| `#FFFFFF` sobre `#F84600` | 3,58  | ❌ (solo texto grande) |
| `#E11463` sobre `#DCDCDC` | 3,42  | ❌                     |
| `#FFFFFF` sobre `#EC6A06` | 3,17  | ❌ (solo texto grande) |

---

## C.3 Tipografías

### Lo que indica la página de estilo [CONFIRMADO]

| Uso                 | Fuente indicada            |
| ------------------- | -------------------------- |
| Títulos             | **Vástago**                |
| Subtítulos / cuerpo | **San Francisco** (SF Pro) |

> Detalle técnico: en Figma, la palabra "Vastago" está escrita con **Anonymous Pro**, una fuente de reemplazo. Eso indica que **el archivo de la fuente Vástago no está instalado ni disponible en Figma**.

### Lo que usan realmente las pantallas [CONFIRMADO: código de diseño]

| Familia        | Pesos                                      | Uso                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Poppins**    | Black, Black Italic, ExtraBold, Bold       | Títulos de pantalla ("¡Buen día, Sofi!" 26 px Black), encabezados de sección (16 px ExtraBold, mayúsculas), botón "SIGUIENTE" (30 px Black), títulos de tarjeta (16 px Bold), "ECOSISTEMA CREATIVO" (25 px Black Italic) |
| **Manrope**    | ExtraBold, Bold, SemiBold, Medium, Regular | Cuerpo (13–14 px), banner (18 px ExtraBold), etiquetas de la barra inferior (10 px), chips (11 px Bold)                                                                                                                  |
| **Montserrat** | Black, ExtraBold, Bold, Regular            | Pantallas de acceso: títulos (22–28 px ExtraBold), botones CTA (12–18 px Bold/ExtraBold, mayúsculas), etiquetas de campo (12 px ExtraBold), "VER DETALLES Y CHECK-IN" (13 px Black)                                      |
| **DM Sans**    | Medium, Regular                            | Pantallas de acceso: inputs (15 px), textos de apoyo, pie "Mendoza · Hub Creativo & Coworking" (13 px)                                                                                                                   |

### Discrepancia [PENDIENTE P-13, bloqueante para la Etapa 4]

Las pantallas no usan ninguna de las dos fuentes de la guía de estilo, y entre secciones conviven dos sistemas (Poppins + Manrope en Home y Bienvenida; Montserrat + DM Sans en Acceso).

| Fuente                                | Licencia y disponibilidad                                                                                                                                |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vástago                               | **Desconocida.** Hace falta el archivo (.otf/.ttf) y la licencia que permita incluirla en una app.                                                       |
| San Francisco (SF Pro)                | Licencia de Apple: solo para interfaces en plataformas Apple. **No se puede incluir en Android.** En iOS se usa automáticamente como fuente del sistema. |
| Poppins, Manrope, Montserrat, DM Sans | Google Fonts, licencia SIL Open Font License: se pueden incluir en la app sin costo.                                                                     |

**Opciones:**

- **A.** Usar las fuentes de las pantallas, unificadas: Poppins para títulos y Manrope para cuerpo en toda la app. **[RECOMENDACIÓN]** Es lo que más se ve en las pantallas principales, tiene licencia libre y se ve igual en iOS y Android.
- **B.** Usar Vástago para títulos y la fuente del sistema para cuerpo (SF en iOS, Roboto en Android), como dice la guía de estilo. Requiere el archivo y la licencia de Vástago, y rediseñar la apariencia de todas las pantallas.
- **C.** Respetar cada sección tal cual está (cuatro familias).

### Escala tipográfica observada [CONFIRMADO; tokens propuestos]

| Token propuesto     | Fuente                         | Tamaño / interlineado | Tracking     | Ejemplo                                           |
| ------------------- | ------------------------------ | --------------------- | ------------ | ------------------------------------------------- |
| `display`           | Poppins Black                  | 30 / normal           | 0            | SIGUIENTE                                         |
| `titulo.pantalla`   | Poppins Black                  | 26 / 32,5             | −0,65        | ¡Buen día, Sofi!                                  |
| `titulo.acceso`     | Montserrat ExtraBold           | 28 / 34               | −0,28        | Creá tu cuenta                                    |
| `titulo.seccion`    | Poppins ExtraBold, mayúsculas  | 16 / 24               | −0,4         | TU RESERVA ACTUAL                                 |
| `titulo.tarjeta`    | Poppins Bold                   | 16 / 24               | 0            | Mesa con Luz Natural                              |
| `titulo.bienvenida` | Poppins Bold                   | 17 / normal           | 0            | Tu experiencia empieza acá.                       |
| `cita`              | Manrope ExtraBold              | 18 / 22,5             | −0,45        | Frase de marca                                    |
| `cuerpo`            | Manrope Regular                | 14 / 21               | 0            | ¿Cómo querés impulsar tu día…?                    |
| `cuerpo.chico`      | Manrope Regular                | 13 / normal           | 0            | Textos de bienvenida                              |
| `meta`              | Manrope Regular                | 12–13 / 18–19,5       | 0            | Sector Jardín · Puesto #14                        |
| `categoria`         | Poppins ExtraBold, mayúsculas  | 11 / 16,5             | +0,55        | OLE/COWORK · PUESTO INDIVIDUAL                    |
| `chip`              | Manrope Bold                   | 11 / 16,5             | 0            | En curso                                          |
| `etiqueta.campo`    | Montserrat ExtraBold           | 12 / 16               | +0,96        | Nombre completo                                   |
| `input`             | DM Sans Regular                | 15 / normal           | 0            | ej. Sofía Valenzuela                              |
| `boton`             | Montserrat Bold, mayúsculas    | 13–18 / 26            | +0,45 a +0,9 | INICIAR SESIÓN                                    |
| `tab`               | Manrope Bold (activa) / Medium | 10 / 15               | −0,25        | Inicio                                            |
| `micro`             | Manrope Regular                | 9 / 18                | 0            | 4 Puestos Libres (**bajo el mínimo recomendado**) |

---

## C.4 Espaciado, márgenes y layout [CONFIRMADO en frames con código]

- **Ancho de referencia:** 402 pt (iPhone 16 Pro / 15 Pro).
- **Margen lateral de pantalla:** 30–32 px.
- **Encabezado:** 101 px de alto; logo circular de 49 px a 30 px del borde izquierdo y 31 px del borde superior; ícono y avatar de 49–52 px a la derecha.
- **Barra inferior:** contenedor a 14 px de los lados (con padding interno de 16 px), 30 px sobre el borde inferior, 52 px de alto y 7 px de padding; pestañas de 64×48.
- **Separaciones:** 10 px entre el título de sección y la tarjeta; 8 px entre botones; 12 px entre CTAs en Acceso; 14 px entre la miniatura y el texto.
- **Padding de tarjetas:** 16–17 px; formularios 16 px; tarjeta de login 24 px.
- **Escala propuesta (token `espacio`):** 2 · 4 · 6 · 8 · 10 · 12 · 14 · 16 · 24 · 30 · 32.

## C.5 Radios, bordes y sombras [CONFIRMADO]

| Token propuesto  | Valor                                                            | Uso                                                                  |
| ---------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| `radio.xs`       | 4                                                                | Botón de visibilidad de contraseña                                   |
| `radio.sm`       | 6                                                                | Botón Modo invitado, segmento de rol                                 |
| `radio.md`       | 8                                                                | CTAs de acceso, inputs                                               |
| `radio.lg`       | 12                                                               | Botones de tarjeta, campos de formulario, miniaturas, pestaña activa |
| `radio.xl`       | 14                                                               | Tarjetas de servicios del Home                                       |
| `radio.2xl`      | 16                                                               | Tarjetas principales, barra inferior, banner                         |
| `radio.pill`     | 9999                                                             | Chips, botón Novedades, barras de fortaleza                          |
| `sombra.cta`     | `0 10 15 -3 rgba(225,29,72,.25)`, `0 4 6 -4 rgba(225,29,72,.25)` | Botón Iniciar sesión (Inicio 1)                                      |
| `sombra.tarjeta` | `0 20 25 -5 rgba(0,0,0,.1)`, `0 8 10 -6 rgba(0,0,0,.1)`          | Tarjeta de login, CTA de registro                                    |
| `sombra.sutil`   | `0 1 2 0 rgba(0,0,0,.05)`                                        | Inputs                                                               |
| `borde.sutil`    | 1 px `rgba(255,255,255,.1)`                                      | Botón secundario en tarjeta                                          |
| `borde.acento`   | 1 px `rgba(225,29,72,.39)`                                       | Botón "Ver detalles y check-in"                                      |

## C.6 Componentes identificados

| Componente (código)                                    | Variantes vistas                                                                  | Pantallas                                                 | Nodo Figma de referencia                  |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| `Encabezado`                                           | logo + ícono + avatar · flecha volver + logo                                      | Home, Espacios, Agenda, Comunidad, Novedades · Inicio 2/3 | 29:15 · 108:809                           |
| `BarraNavegacion`                                      | 4 pestañas, una activa con degradado                                              | Home, Espacios, Agenda, Comunidad, Novedades              | 37:319                                    |
| `BotonNovedades` (flotante)                            | con contador                                                                      | Home, Espacios, Agenda, Comunidad                         | 77:1128 / 37:342                          |
| `BotonSiguiente`                                       | claro sobre oscuro · oscuro sobre claro                                           | Bienvenida 1–3                                            | Component 1 (13:53) · Component 2 (13:56) |
| `BotonPrimario` (degradado)                            | grande (56 px) · mediano · chico                                                  | Acceso, Agenda, Espacios, Comunidad                       | 107:224 · 109:951 · 108:687               |
| `BotonSecundario` (oscuro)                             | lleno · contorno con acento                                                       | Acceso, Home, Espacios                                    | 107:230 · 36:131                          |
| `BotonIcono`                                           | 44×44                                                                             | Home ("cómo llegar")                                      | 36:136                                    |
| `BotonSocial`                                          | Google · Apple ID                                                                 | Inicio 3                                                  | 109:973 · 109:979                         |
| `Chip` / `Etiqueta`                                    | estado rosa · categoría OLE/ · descuento naranja · disponibilidad                 | todas                                                     | 36:106 · 37:201                           |
| `CampoFormulario`                                      | texto · correo · contraseña con ojo e indicador de fortaleza                      | Inicio 2/3                                                | 108:584 · 108:654 · 109:936               |
| `Checkbox` con texto legal                             | —                                                                                 | Inicio 2                                                  | 108:678                                   |
| `SelectorSegmentado`                                   | 2 opciones (rol) · 2 opciones (Conexión abierta / Modo foco) · 3 filtros (Agenda) | Inicio 3, Comunidad, Agenda                               | 109:911                                   |
| `SelectorFecha` (semana)                               | día seleccionado con degradado y punto de evento                                  | Espacios, Agenda                                          | sin código (captura)                      |
| `TarjetaReserva`                                       | actual (Home) · próxima con PIN (Agenda)                                          | Home, Agenda                                              | 36:109                                    |
| `TarjetaServicio` (OLE/…)                              | 3 en fila                                                                         | Home                                                      | 37:210–212                                |
| `TarjetaEspacio`                                       | con foto, estado, características y CTA                                           | Espacios                                                  | sin código                                |
| `TarjetaEvento` / `TarjetaNovedad`                     | promoción · evento con avatares                                                   | Novedades, Agenda                                         | sin código                                |
| `TarjetaProyecto` / `TarjetaTalento` / `TarjetaTaller` | —                                                                                 | Comunidad                                                 | sin código                                |
| `BannerCita`                                           | frase con degradado oscuro                                                        | Home, Inicio 1 (variante con borde lateral)               | 36:72 · 107:218                           |
| `PieHospitalidad`                                      | ubicación + "Café de especialidad"                                                | Inicio 1–3                                                | 107:279                                   |
| `IconoServicio`                                        | aro con degradado de marca y pictograma                                           | Home, Espacios, Agenda                                    | "Recurso 13@3x"                           |
| `GrupoAvatares`                                        | iniciales + "+5"                                                                  | Novedades, Agenda                                         | sin código                                |

## C.7 Iconografía

- Íconos lineales de un solo color (blanco o gris `#A1A1AA` sobre oscuro), de 12 a 18 px, exportados por Figma como SVG.
- No se identificó una librería con nombre. **[PENDIENTE P-18]** ¿Vienen de una librería (Lucide, Material Symbols, Phosphor…) o son propios? **[RECOMENDACIÓN]** Usar una librería libre equivalente para los genéricos (calendario, ubicación, ojo, reloj) y exportar de Figma solo los propios de la marca.

## C.8 Barra de navegación y botón Novedades [CONFIRMADO]

- Barra flotante de esquinas redondeadas (16), fondo `#262020` y 4 pestañas. La activa tiene un degradado rosa, texto blanco Bold; las inactivas, gris `#A1A1AA` Medium.
- Botón Novedades: cápsula `#262020` de 178×45, a 32 px del borde derecho y sobre la barra; ícono megáfono en un círculo con degradado rosa-naranja, punto naranja de notificación, texto "Novedades" (Manrope ExtraBold 12) y contador "2 nuevas" (Montserrat 10, `#C5FD44`).

## C.9 Adaptación a tamaños de pantalla [RECOMENDACIÓN]

- El diseño usa posiciones absolutas; en código se reemplazan por layout flexible con márgenes de 30 px.
- Las tarjetas de servicios (3 por fila) se ajustan al ancho disponible.
- Respetar el área segura (notch, isla dinámica, barra de gestos).
- Pantallas angostas (≤ 360 pt): permitir que los títulos largos ("TALENTOS DISPONIBLES PARA SINERGIAS") pasen a dos líneas.
- Tablet: fuera de alcance salvo que se indique lo contrario.

## C.10 Estados de interfaz [PENDIENTE: sin diseño]

| Estado          | Propuesta provisional (requiere aprobación)                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Carga           | Esqueletos con la forma de las tarjetas, en `#353439` sobre `#262020`                                        |
| Vacío           | Ilustración o ícono de marca con un texto guía y una acción ("Todavía no tenés reservas · Reservá tu lugar") |
| Error           | Mensaje en lenguaje simple con reintento, acento `#E11D48`                                                   |
| Éxito           | Confirmación breve (toast)                                                                                   |
| Deshabilitado   | Opacidad 40 % y sin sombra                                                                                   |
| Sin conexión    | Banner superior y datos guardados                                                                            |
| Campo con error | Borde y texto de ayuda en rosa bajo el campo                                                                 |

## C.11 Tema claro / oscuro [PENDIENTE P-11]

El diseño combina fondo claro (`#DCDCDC`) con tarjetas oscuras, y fondos oscuros en Bienvenida 1 y 3. **No existe una variante para el modo oscuro del sistema.** Opciones: (a) tema único como en Figma, sin seguir al sistema; (b) diseñar un tema oscuro (fondo `#262020` o más oscuro). **[RECOMENDACIÓN]** (a) para la primera versión.

---

## D. Inventario de recursos visuales

Estado: **todos están en Figma y faltan exportar** (el entorno no pudo descargarlos). Formato y dimensiones según la capa en Figma.

| #    | Nombre en Figma                                  | Uso                                                                         | Pantallas                                               | Formato / tamaño en diseño | Estado                                                                  | Observaciones                                                                           |
| ---- | ------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| R-01 | Recurso 3@3x (versión clara)                     | Logo "OLEGARIO EN MOVIMIENTO" + píldoras                                    | Bienvenida 1 y 3, Estética                              | PNG @3x, 223×46            | Pendiente de exportar                                                   | **Pedir el SVG original** (P-19)                                                        |
| R-02 | Recurso 3@3x (versión oscura)                    | Logo sobre fondo claro                                                      | Bienvenida 2, Inicio 1, Estética                        | PNG @3x, 223×46            | Pendiente de exportar                                                   | Ídem                                                                                    |
| R-03 | Recurso 9@3x                                     | Isotipo circular (píldoras sobre `#262020` con aro de degradado)            | Encabezado de todas las pantallas internas e Inicio 2/3 | PNG @3x, 49×49             | Pendiente de exportar                                                   | —                                                                                       |
| R-04 | Recurso 10@3x (Component 3)                      | Ícono circular de tres píldoras apiladas                                    | Encabezado (junto al avatar)                            | PNG @3x, 51×52             | Pendiente de exportar                                                   | Función del botón: PENDIENTE                                                            |
| R-05 | Recurso 13@3x (3 variantes)                      | Íconos de servicio OLE/COWORK, OLE/STREAM y OLE/NETWORK (aro con degradado) | Home, Espacios, Agenda                                  | PNG @3x, 73×73             | Pendiente de exportar                                                   | ¿Hay ícono de OLE/CAFÉ? (aparece en Espacios)                                           |
| R-06 | Recurso 2@3x                                     | Flecha "volver" en círculo                                                  | Inicio 2, Inicio 3                                      | PNG @3x, 35×35             | Pendiente de exportar                                                   | **[RECOMENDACIÓN]** reemplazar por un ícono vectorial equivalente (requiere aprobación) |
| R-07 | Ellipse 1                                        | Avatar de la persona usuaria (círculo vacío `#262020`)                      | Encabezado                                              | SVG, 49×49                 | Marcador                                                                | Foto real del usuario: dato dinámico                                                    |
| R-08 | Capa_1 (×3)                                      | Íconos de lupa con estrella, candado y mano con corazón                     | Bienvenida 1                                            | SVG, 25–29 px              | Pendiente de exportar                                                   | —                                                                                       |
| R-09 | image 1                                          | Espacio para una imagen de 151×153                                          | Bienvenida 1                                            | **Vacío en Figma**         | **Falta el recurso**                                                    | ¿Va una ilustración o el logo? (P-20)                                                   |
| R-10 | Rectangle 11–15                                  | 5 fotografías del coworking (collage rotado)                                | Bienvenida 2                                            | PNG, 149×193 c/u           | Pendiente de exportar                                                   | **Procedencia y derechos: P-21**                                                        |
| R-11 | Rectangle 14                                     | Fotografía de evento (gente en el patio)                                    | Bienvenida 3                                            | PNG, 341×375 recortada     | Pendiente de exportar                                                   | Ídem                                                                                    |
| R-12 | AB6AXuBX… / Recurso 13@3x 1                      | Miniatura de la reserva actual                                              | Home                                                    | PNG, 80×80                 | Pendiente de exportar                                                   | El nombre parece de una imagen generada por herramienta; probablemente provisional      |
| R-13 | Fotos de Novedades (barista, mesa junto al lago) | Tarjetas de novedades                                                       | Novedades                                               | Imagen                     | Pendiente de exportar                                                   | Contenido dinámico; procedencia P-21                                                    |
| R-14 | Fotos de Espacios (3)                            | Tarjetas de espacio                                                         | Espacios                                                | Imagen                     | Pendiente de exportar                                                   | Contenido dinámico; procedencia P-21                                                    |
| R-15 | Fotos y avatares de Agenda                       | Eventos e inscriptos                                                        | Agenda                                                  | Dentro de la imagen plana  | **No exportable por separado**                                          | —                                                                                       |
| R-16 | Portada (HeroCover)                              | Portada del perfil público                                                  | Perfil público                                          | 402×373                    | No inspeccionado                                                        | —                                                                                       |
| R-17 | Íconos de la barra inferior (×4) y de tarjetas   | Inicio, Espacios, Agenda, Comunidad, reloj, QR, ubicación, ojo, megáfono    | Varias                                                  | SVG 12–18 px               | Pendiente de exportar                                                   | Ver C.7                                                                                 |
| R-18 | Logos de Google y Apple                          | Botones sociales                                                            | Inicio 3                                                | SVG 16×16                  | Usar los recursos oficiales                                             | Sujetos a las guías de marca de Google y Apple                                          |
| R-19 | Fuentes                                          | Poppins, Manrope, Montserrat, DM Sans · Vástago · SF Pro                    | Todas                                                   | —                          | Google Fonts: disponibles · **Vástago: falta el archivo y la licencia** | Ver C.3                                                                                 |
| R-20 | Ícono de la app y pantalla de carga (splash)     | Lanzador del teléfono                                                       | —                                                       | 1024×1024                  | **No existe en Figma**                                                  | P-22                                                                                    |

**Regla:** las imágenes de marca no se reemplazan por imágenes genéricas sin autorización.

**Cómo exportar (para la responsable o para una sesión con acceso a Figma):** seleccionar cada capa → panel "Export" → PNG @3x para fotos e isotipos, SVG para íconos y logo. Guardar en `assets/imagenes/` o `assets/iconos/` con nombres en `kebab-case` (p. ej. `logo-olegario-claro.svg`, `servicio-ole-cowork.png`).

---

## Correspondencia Figma ↔ código (se completa durante la implementación)

| Figma                                   | Código                                  | Estado    |
| --------------------------------------- | --------------------------------------- | --------- |
| Component 1 / Component 2 ("SIGUIENTE") | `src/components/BotonSiguiente.tsx`     | Pendiente |
| Bottom Navigation Bar (37:319)          | `src/components/BarraNavegacion.tsx`    | Pendiente |
| Button - Ver novedades (37:342)         | `src/components/BotonNovedades.tsx`     | Pendiente |
| Overlay+Border (chips)                  | `src/components/Chip.tsx`               | Pendiente |
| Field: … (108:584)                      | `src/components/CampoFormulario.tsx`    | Pendiente |
| Role Segmented Selector (109:911)       | `src/components/SelectorSegmentado.tsx` | Pendiente |
| Primary Action CTA (109:951)            | `src/components/BotonPrimario.tsx`      | Pendiente |

## Diferencias con el diseño (decisiones tomadas)

| Tema | Decisión                            | Aprobado por |
| ---- | ----------------------------------- | ------------ |
| —    | Todavía no hay decisiones aprobadas | —            |
