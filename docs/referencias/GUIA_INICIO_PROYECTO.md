# Guía para iniciar un proyecto con un agente de IA

> **Para el agente (Claude u otro):** este archivo es tu punto de partida. No describe ningún proyecto en particular: es un método de trabajo y una plantilla. Tu tarea es **entender el proyecto nuevo haciendo preguntas**, completar todo lo que está marcado como `{{…}}` con la información real y, a partir de eso, **armar la carpeta del proyecto** (archivo de reglas, plan de trabajo, documentación, README, configuración) antes de escribir código.
>
> **Para la persona:** pasale este archivo al agente al empezar y decile algo como: *"Leé GUIA_INICIO_PROYECTO.md y arrancá por la Fase 0"*. Podés sumar todo lo que ya tengas (diseño, documento, brief, imágenes, enlaces). Nada de lo que está acá es obligatorio: lo que no aplique se descarta y lo que falte se agrega.

---

## Índice

1. [Cómo usar esta guía](#1-cómo-usar-esta-guía)
2. [Fase 0: entrevista inicial (preguntas)](#2-fase-0-entrevista-inicial)
3. [Fase 1: ficha del proyecto](#3-fase-1-ficha-del-proyecto)
4. [Fase 2: reglas de trabajo](#4-fase-2-reglas-de-trabajo)
5. [Fase 3: elección del stack](#5-fase-3-elección-del-stack)
6. [Fase 4: identidad visual y diseño](#6-fase-4-identidad-visual-y-diseño)
7. [Fase 5: pantallas, flujo y navegación](#7-fase-5-pantallas-flujo-y-navegación)
8. [Fase 6: datos, lógica y seguridad](#8-fase-6-datos-lógica-y-seguridad)
9. [Fase 7: plan de trabajo por etapas](#9-fase-7-plan-de-trabajo-por-etapas)
10. [Fase 8: armar la carpeta del proyecto](#10-fase-8-armar-la-carpeta-del-proyecto)
11. [Durante el desarrollo: ciclo de cada etapa](#11-durante-el-desarrollo-ciclo-de-cada-etapa)
12. [Pruebas de uso con personas](#12-pruebas-de-uso-con-personas)
13. [Publicación y entrega](#13-publicación-y-entrega)
14. [Errores frecuentes y cómo evitarlos](#14-errores-frecuentes-y-cómo-evitarlos)
15. [Plantillas de archivos](#15-plantillas-de-archivos)
16. [Lista de control final](#16-lista-de-control-final)

---

## 1. Cómo usar esta guía

**Orden de trabajo:**

```
Fase 0  Entrevista        → el agente pregunta, la persona responde
Fase 1–6 Definiciones      → se completa cada sección con lo respondido
Fase 7  Plan de trabajo   → etapas cortas, cada una con su prueba
Fase 8  Carpeta           → se crean los archivos base (sin código todavía)
          ↓ la persona aprueba
Etapas  Desarrollo        → una etapa por vez: hacer → probar → aprobar → commit
Final   Pruebas de uso, publicación y documentación
```

**Reglas para el agente al usar esta guía:**

- No asumir. Si algo no está claro, **preguntar**. Si hay que elegir, **proponer opciones con una recomendación** y esperar la respuesta.
- Preguntar en tandas cortas (3 a 6 preguntas por vez), agrupadas por tema, no todo junto.
- Todo lo que quede sin definir se anota como **"Pendiente a confirmar"** y **no se implementa** hasta que se defina.
- Las secciones de esta guía son una base: se adaptan, se agregan o se quitan según el proyecto (por ejemplo, un proyecto sin login no necesita la parte de sesiones; uno sin pagos no necesita checkout).
- El resultado de las fases 0 a 7 se guarda en archivos del proyecto (ver Fase 8), no solo en la conversación.

**Convención de esta guía:** `{{…}}` = dato a completar. Los ejemplos entre paréntesis son solo orientativos.

---

## 2. Fase 0: entrevista inicial

El agente arranca por acá. Usar estas preguntas como banco: elegir las que apliquen y repreguntar cuando una respuesta abra temas nuevos.

### 2.1 El proyecto
1. ¿Qué es el proyecto en una o dos oraciones? ¿Qué problema resuelve?
2. ¿Para quién es? ¿Quiénes lo van a usar y en qué situación (apurados, de pie, en la calle, en una oficina…)?
3. ¿Es un trabajo académico, un cliente real, un proyecto propio? ¿Hay consignas, rúbrica o requisitos obligatorios (de la cátedra, del cliente)?
4. ¿Cuál es la fecha de entrega y qué se entrega exactamente (app funcionando, prototipo, documentación, presentación)?
5. ¿Existe algo previo en lo que se basa (otra app, una marca, un sistema)?

### 2.2 Plataforma y dispositivo
6. ¿Dónde corre? (web en navegador, app mobile, escritorio, pantalla táctil/kiosco, TV, otro)
7. ¿Tamaño o resolución fija o tiene que adaptarse a varias pantallas (responsive)?
8. ¿Tiene que funcionar sin internet?
9. ¿En qué computadora se desarrolla (Mac, Windows, Linux) y en cuál se va a usar o publicar?
10. ¿Hay que publicarlo en algún lado (hosting, tienda de apps, dispositivo físico)? ¿Ya hay hosting o dominio?

### 2.3 Usuarios y contenido
11. ¿Qué tipos de usuario hay? ¿Alguno necesita iniciar sesión? ¿Con qué (usuario y contraseña, PIN, cuenta de Google…)?
12. ¿Qué puede hacer cada tipo de usuario?
13. ¿Qué contenido muestra (textos, imágenes, listas, mapas, horarios, productos…)? ¿Quién lo carga y quién lo puede editar?
14. ¿Hay compras, pagos, reservas, formularios? ¿Pago real o simulado?
15. ¿Qué datos personales se piden? ¿Cuáles se guardan y por cuánto tiempo?
16. ¿En qué idioma o idiomas? ¿Con qué variante (voseo, tuteo, usted)?

### 2.4 Diseño
17. ¿Hay diseño hecho? ¿Dónde (Figma, imágenes, PDF, boceto en papel)? ¿Cuál es la página o versión definitiva?
18. ¿Hay identidad visual: colores, tipografías, logo, íconos? ¿Están los archivos (fuentes, SVG, imágenes)?
19. Si el diseño y lo que se pide no coinciden, ¿qué manda? (recomendado: el diseño, y ante dudas se pregunta)
20. ¿Hay estados que el diseño no muestra (errores, vacío, cargando, agotado, confirmaciones)? ¿Los propone el agente?

### 2.5 Técnica y herramientas
21. ¿Hay tecnologías obligatorias o preferidas (lenguaje, framework, base de datos)?
22. ¿Qué tenés instalado? (Docker, Node, PHP, Git, editor) ¿Querés que todo corra en contenedores?
23. ¿Usás Git? ¿Hay repositorio remoto (GitHub, GitLab)? ¿Cuándo se sube (push)?
24. ¿Dónde se documenta además del código (Notion, Google Docs, ninguno)? ¿Hay que mantenerlo sincronizado?
25. ¿Dónde está la carpeta del proyecto (disco local, Google Drive, iCloud)? *(importante: ver Errores frecuentes)*

### 2.6 Forma de trabajo
26. ¿Querés aprobar cada etapa antes de pasar a la siguiente?
27. ¿Cómo querés que se llamen los commits?
28. ¿Hay cosas que querés decidir vos sí o sí (por ejemplo, instalar dependencias, borrar archivos, cambiar datos)?
29. ¿Vas a hacer cambios a mano en el código o en los archivos? (si es así, el agente los respeta)
30. ¿Hay pruebas con usuarios reales previstas?

> Al terminar la entrevista, el agente devuelve un **resumen de lo entendido** y la lista de **pendientes a confirmar**, y pide aprobación antes de seguir.

---

## 3. Fase 1: ficha del proyecto

Completar y guardar como primera sección del archivo de reglas (ver Fase 8).

```
Nombre del proyecto:      {{nombre}}
Descripción:              {{qué es y qué resuelve, en 2-3 líneas}}
Público:                  {{quiénes lo usan y en qué contexto}}
Plataforma:               {{web / mobile / escritorio / kiosco / …}}
Dispositivo y pantalla:   {{resolución fija o responsive; orientación}}
Funciona sin conexión:    {{sí / no / parcialmente}}
Idioma:                   {{idioma y variante}}
Tipos de usuario:         {{usuario A: qué hace · usuario B: qué hace (y cómo inicia sesión)}}
Partes / pantallas:       {{lista numerada}}
Diseño de referencia:     {{enlace y página/versión exacta}}
Documentación externa:    {{Notion / Docs / ninguna}}
Repositorio:              {{URL o "solo local"}}
Entrega:                  {{fecha y qué se entrega}}
Requisitos obligatorios:  {{consignas de cátedra o cliente}}
```

---

## 4. Fase 2: reglas de trabajo

Estas reglas salieron de un proyecto real y funcionaron. Proponerlas como base y ajustarlas con la persona.

### 4.1 Método
- Antes de programar: leer todo el material (archivo de reglas, diseño, documentación) y **presentar primero el plan de trabajo**.
- Trabajar en **etapas cortas y probadas**: cada etapa se prueba antes de pasar a la siguiente.
- Construir en ciclos pequeños: estructura → pantalla → revisión → datos → prueba → corrección.
- Implementar de forma modular (componentes y funciones reutilizables, una responsabilidad cada uno).
- El agente **registra lo que hace** y **pide aprobación antes de**: instalar dependencias, borrar archivos o cambiar la estructura de datos.
- **Respetar los cambios manuales** de la persona: antes de editar un archivo, leer su versión actual; nunca revertir algo que la persona cambió sin preguntar.
- **El diseño es la fuente de verdad** (indicar la página o versión exacta). Si el diseño y las reglas no coinciden, **preguntar antes de decidir**.
- **No implementar lo marcado como "pendiente" o "a confirmar"** hasta que se defina.
- Indicar **qué abre cada botón** (tabla de navegación, ver Fase 5).

### 4.2 Versionado
- Git desde el primer día, con `.gitignore` que deje fuera: dependencias, compilados, variables y contraseñas (`.env`), datos locales de la base, logs y archivos del sistema/editor.
- Nombre de commits: `{{formato}}` (recomendado: `Etapa N — Nombre de la etapa`, y si una etapa necesita más de un commit, `Etapa N — Nombre: detalle`).
- Los commits quedan en local; **el push al repositorio remoto se hace solo cuando la persona lo pide**.

### 4.3 Documentación sincronizada
- Si hay documentación externa (Notion u otra), **el archivo de reglas y esa documentación se mantienen iguales**: cada cambio de reglas se hace en los dos lugares.
- Si no se puede actualizar en el momento (por ejemplo, el conector no tiene acceso), el agente deja anotado qué falta y lo sincroniza apenas pueda.

### 4.4 Seguridad y datos sensibles
- Contraseñas, claves y PIN viven en un archivo de entorno (`.env`) **fuera de Git**; en Git va un `.env.ejemplo` con valores de muestra.
- El agente **no escribe contraseñas ni PIN en el chat**: indica en qué archivo y en qué línea están.
- No guardar datos personales que no hagan falta (ej. de un documento, solo los últimos dígitos).
- Si hay pagos y no son reales, se aclara que son **simulados** y no se guarda ningún dato del medio de pago.

### 4.5 Calidad
- Herramientas **estables y mantenidas**: nada experimental, beta o abandonado.
- Probar cada etapa de verdad (en el navegador, dispositivo o emulador), no solo "compila".
- Comparar con el diseño: posiciones, tamaños, colores y tipografías.
- Imágenes y recursos optimizados (formato liviano, tamaño exacto al que se muestran).
- Nomenclatura única y consistente (ej. `PascalCase` para componentes, `camelCase` para funciones, `kebab-case` para archivos de imagen).

### 4.6 Reglas específicas del proyecto
`{{reglas propias: tamaños mínimos táctiles, accesibilidad, tiempos de inactividad, límites de caracteres, formatos de precio/fecha/hora, etc.}}`

---

## 5. Fase 3: elección del stack

No hay stack fijo: se elige según el proyecto. El agente propone con una recomendación y la persona decide.

### 5.1 Preguntas que definen el stack
| Pregunta | Si la respuesta es… | Considerar… |
|---|---|---|
| ¿Necesita guardar datos o tener usuarios? | No | Sitio estático (HTML/CSS/JS o un framework que compile a estático) |
| | Sí | Backend + base de datos |
| ¿Funciona sin internet? | Sí | Backend local en el mismo equipo, o almacenamiento local + sincronización |
| ¿Hay consignas técnicas de la cátedra/cliente? | Sí | Respetarlas aunque haya opciones "mejores" |
| ¿Dónde se publica? | Hosting compartido (ej. Hostinger) | PHP + MySQL, interfaz compilada a estáticos |
| | Servidor/VPS o la propia máquina | Docker, cualquier lenguaje |
| | Tienda de apps | Framework mobile (nativo o multiplataforma) |
| ¿Qué tiene instalado la persona? | Docker | Todo en contenedores: igual en cualquier sistema |

### 5.2 Stack de referencia (probado en un proyecto real)
Sirve como punto de partida para una app web con backend y base de datos:

| Capa | Herramienta | Por qué |
|---|---|---|
| Entorno | Docker + Docker Compose | Mismo entorno en Mac y Windows; no hace falta instalar PHP, Node ni MySQL |
| Interfaz | React + Vite | Componentes reutilizables, recarga instantánea, compilación liviana |
| API | PHP 8 sin framework + PDO (sobre Apache) | Simple, compatible con cualquier hosting compartido |
| Base de datos | MariaDB / MySQL + phpMyAdmin | Estándar, fácil de inspeccionar |
| Pruebas de lógica | `node:test` (incluido en Node) | Sin dependencias extra |
| Publicación | Compilación de la interfaz + API PHP en el hosting, o contenedor de producción | Ver Fase 13 |

### 5.3 Decisiones a registrar
```
Interfaz:           {{…}}
Backend / API:      {{…}}
Base de datos:      {{…}}
Entorno de trabajo: {{Docker / instalación local}}
Pruebas:            {{…}}
Publicación:        {{dónde y cómo}}
Versiones exactas:  {{se fijan al instalar y se anotan en la documentación}}
```

---

## 6. Fase 4: identidad visual y diseño

### 6.1 Colores (completar con el diseño)
| Uso | Color |
|---|---|
| Fondo principal | `{{#hex}}` |
| Superficie / tarjetas | `{{#hex}}` (texto encima: `{{#hex}}`) |
| Acento / elementos activos | `{{#hex}}` |
| Botones de acción | `{{#hex}}` |
| Error / alerta | `{{#hex}}` |
| Texto sobre fondo oscuro / claro | `{{#hex}}` / `{{#hex}}` |
| Otros (categorías, estados, gráficos) | `{{…}}` |

> En código, los colores se definen **una sola vez** como variables (tokens), por ejemplo en CSS `--color-fondo`, y nunca se repiten sueltos.

### 6.2 Tipografías
| Estilo | Fuente y peso | Tamaño | Dónde se usa |
|---|---|---|---|
| Título principal | `{{…}}` | `{{px}}` | `{{…}}` |
| Subtítulo | `{{…}}` | `{{px}}` | `{{…}}` |
| Texto | `{{…}}` | `{{px}}` | `{{…}}` |
| Botón | `{{…}}` | `{{px}}` | `{{…}}` |
| Datos / etiquetas | `{{…}}` | `{{px}}` | `{{…}}` |

- Si el diseño tiene estilos de texto con nombre, usar esos mismos nombres en el código.
- Las fuentes se incluyen en el proyecto (no depender de internet si debe funcionar sin conexión).
- Si hay una versión mobile o anterior, aclarar qué escala manda.

### 6.3 Componentes y formas
`{{forma de tarjetas y botones (bordes, esquinas, sombras), íconos, logo, imágenes}}`

### 6.4 Diferencias con el diseño
Registrar en una tabla todo lo que se haga distinto del diseño o que el diseño no muestre, con la decisión tomada:

| Tema | Decisión | Aprobado por |
|---|---|---|
| `{{ej. estado de error de un formulario}}` | `{{…}}` | `{{persona / fecha}}` |

---

## 7. Fase 5: pantallas, flujo y navegación

### 7.1 Qué contiene cada pantalla
Para cada pantalla:

```
### {{Nombre de la pantalla}}
- Objetivo: {{para qué sirve}}
- Contenido: {{qué se ve}}
- Acciones: {{qué se puede hacer}}
- Estados: {{vacío, cargando, error, éxito, sin conexión…}}
- Reglas: {{validaciones, límites, tiempos}}
```

### 7.2 Navegación (qué abre cada botón)
| Pantalla | Botón o elemento | Qué hace |
|---|---|---|
| `{{…}}` | `{{…}}` | `{{va a… / abre… / no navega}}` |

**Decisiones que conviene tomar temprano:**
- ¿Qué hace "volver": va a la pantalla anterior o siempre al inicio?
- ¿Hay accesos ocultos (ej. para el personal o administración)? ¿Cómo se abren?
- ¿Los botones de acción principales quedan **fijos** en pantalla o se desplazan con el contenido? (recomendado: fijos y siempre visibles)
- ¿Qué pasa por inactividad (volver al inicio, cerrar sesión, aviso previo)?
- ¿Hay que confirmar antes de borrar o salir con cambios sin guardar?

### 7.3 Flujos principales
Describir paso a paso los recorridos clave (ej. "comprar", "registrarse", "editar contenido"), con lo que pasa si algo falla en cada paso.

---

## 8. Fase 6: datos, lógica y seguridad

### 8.1 Datos iniciales
- El contenido inicial va en **archivos separados del código** (ej. JSON en `data/`), nunca escrito a mano dentro de los componentes.
- Si hay base de datos, esos archivos son la **carga inicial**: se vuelcan la primera vez y después se lee y escribe en la base.
- Crear un **script de validación** que revise los datos (campos obligatorios, formatos, imágenes que existan, límites).

```
data/
  {{config.json}}     configuración general (fechas, tiempos, límites, textos fijos)
  {{entidad.json}}    una por cada tipo de contenido
```

### 8.2 Modelo de datos
| Tabla / colección | Campos | Notas |
|---|---|---|
| `{{…}}` | `{{…}}` | `{{…}}` |

- Cambiar la estructura de datos **requiere aprobación**.
- Si la base ya tiene datos, los cambios se hacen con **migraciones** que no borren información.

### 8.3 Reglas de negocio
`{{cálculos (impuestos, cargos), formatos (moneda, fecha, hora, zona horaria), límites de caracteres, stock, estados, horarios, reglas por fecha…}}`

- La lógica importante (cálculos, estados, validaciones) va en **funciones puras con pruebas automáticas**.
- Si hay precios o montos, el servidor **siempre recalcula** con sus propios datos (nunca confiar en lo que manda la interfaz).
- Si dos usuarios pueden comprar o modificar lo mismo a la vez, usar **transacciones con bloqueo**.

### 8.4 Usuarios, sesiones y seguridad
- Contraseñas o PIN: guardados **cifrados** (hash), nunca en texto plano.
- Límite de intentos fallidos con bloqueo temporal, contado **en el servidor**.
- Sesión del lado del servidor, con cookie `HttpOnly` y `SameSite`, y `Secure` con HTTPS.
- Cierre de sesión por inactividad, con aviso previo.
- Archivos internos del backend bloqueados para el navegador.
- Puertos de desarrollo solo en `127.0.0.1` (no expuestos a la red).

### 8.5 Sin conexión y sincronización (si aplica)
- La app sigue funcionando sin internet y **nunca muestra errores técnicos** al usuario final.
- Cada cambio local se anota en una **cola** con un ID único; un proceso la envía cuando hay conexión y reintenta si falla, sin generar duplicados.

---

## 9. Fase 7: plan de trabajo por etapas

Plantilla de etapas. **Se adapta al proyecto**: se agregan, quitan, dividen o reordenan. Cada etapa tiene **objetivo, tareas, prueba y nombre de commit**.

| # | Etapa | Objetivo | Prueba antes de seguir |
|---|---|---|---|
| 0 | Definiciones previas | Entrevista, ficha, reglas, stack, plan, pendientes | La persona aprueba el plan |
| 1 | Esqueleto del proyecto | Carpetas, entorno (Docker/instalación), Git, `.gitignore`, `.env.ejemplo`, README inicial | El proyecto arranca vacío con un comando |
| 2 | Componentes base | Estilos globales, colores, tipografías, componentes reutilizables | Página de muestra con todos los componentes comparada con el diseño |
| 3 | Datos y recursos | Archivos de datos, imágenes optimizadas, validación de datos | El validador pasa; las imágenes pesan poco |
| 4 | Backend (lectura) | Base de datos, carga inicial, endpoints de lectura | Cada endpoint responde con los datos correctos |
| 5…N | Una etapa por pantalla o funcionalidad | `{{pantalla / flujo}}` | `{{qué se prueba}}` |
| N+1 | Escritura y transacciones | Formularios, compras, edición | Casos correctos, errores y concurrencia |
| N+2 | Usuarios y sesiones | Login, roles, bloqueo, inactividad | Correcto, incorrecto, bloqueo, cierre automático |
| N+3 | Administración | Pantallas de edición de contenido | Lo editado se ve del lado del usuario |
| N+4 | Sincronización / integraciones | Si aplica | Sin conexión → reconectar → llega todo sin duplicados |
| N+5 | Producción y publicación | Compilación, servidor, kiosco o tienda | Arranca solo y funciona en el destino real |
| N+6 | Pruebas de uso | Al menos 3 personas ajenas al desarrollo | Planilla completa y correcciones hechas |
| N+7 | Documentación final | README, docs, entrega | Alguien nuevo puede levantar el proyecto con el README |

**Formato de cada etapa en el plan:**

```markdown
## Etapa N — {{Nombre}}
- {{tarea 1}}
- {{tarea 2}}
- **Prueba:** {{cómo se verifica}}
- **Commit:** `Etapa N — {{Nombre}}`
```

**Al final del plan:** sección **"Pendientes a confirmar"**, numerada. Cuando algo se define, se tacha y se escribe la decisión: `~~Tema~~ **Definido:** …`.

---

## 10. Fase 8: armar la carpeta del proyecto

Con las fases anteriores aprobadas, el agente crea la estructura base. Nombres de referencia (adaptables):

```
{{proyecto}}/
├── {{REGLAS}}.md            Reglas y contexto del proyecto (ficha, reglas, diseño, pantallas, navegación, datos)
├── PLAN_DE_TRABAJO.md       Etapas + pendientes a confirmar
├── README.md                Cómo correr el proyecto desde cero (requisitos, instalación, comandos, publicación)
├── .gitignore
├── .env.ejemplo             Variables de ejemplo (el .env real no va a Git)
├── docs/
│   ├── DESARROLLO.md        Técnico: stack, estructura, convenciones, base de datos, API, registro de etapas
│   ├── DISENO.md            Para diseño: colores, tipografías, componentes, diferencias con el diseño
│   ├── LOGICA.md            Reglas de negocio, validaciones, estados, cálculos
│   └── LOOP_PROCESOS.md     Ciclo de vida: arranque, flujos, tiempos, procesos en segundo plano
├── data/                    Datos iniciales (JSON)
├── {{client/}}              Interfaz
├── {{api/}}                 Backend
├── {{sql/}}                 Esquema y migraciones
└── {{docker/}}              Configuración de contenedores (si aplica)
```

**Qué va en el archivo de reglas (`{{REGLAS}}.md`):**
1. Descripción del proyecto (ficha de la Fase 1)
2. Partes del proyecto (lista de pantallas)
3. Reglas del proyecto (Fase 2), agrupadas: método de trabajo, stack y herramientas, dispositivo e interfaz, datos y sesión
4. Tipografías y colores (Fase 4)
5. Pantallas: qué contiene cada una (Fase 5)
6. Datos estáticos y contenido (Fase 6)
7. Navegación de botones (Fase 5)

> Este archivo es lo que el agente relee al empezar cada sesión. Tiene que estar siempre actualizado: **cada decisión nueva se escribe ahí** (y en la documentación externa si existe).

---

## 11. Durante el desarrollo: ciclo de cada etapa

```
1. Releer el archivo de reglas y la etapa del plan.
2. Revisar el diseño de esa parte (medidas, colores, textos).
3. Si algo no está definido → preguntar (no inventar).
4. Implementar en piezas chicas.
5. Probar de verdad: navegador/dispositivo, casos correctos, errores, bordes.
6. Comparar con el diseño (capturas, posiciones).
7. Limpiar datos de prueba que hayan quedado en la base.
8. Actualizar documentación (docs/ y plan) y, si cambió una regla, el archivo de reglas + la documentación externa.
9. Informar a la persona: qué se hizo, qué se probó, qué quedó pendiente, decisiones tomadas.
10. Esperar aprobación → commit con el nombre de la etapa (sin push salvo pedido).
```

**Cómo informar al terminar una etapa:**
- Qué se hizo, en lenguaje simple.
- Qué se probó y el resultado (si algo no se pudo probar, decirlo).
- Decisiones que tomó el agente y por qué.
- Preguntas abiertas.
- Qué sigue.

---

## 12. Pruebas de uso con personas

- Al menos **3 personas ajenas al desarrollo**.
- Preparar un **guion** (qué se les dice, sin explicar la interfaz) y **5 a 7 tareas** concretas y medibles.
- Registrar por persona y tarea: si pudo empezar, dónde dudó, qué entendió mal, cuánto tardó, si completó la tarea y si el resultado le sirvió.
- El observador no ayuda ni sugiere; si la persona se traba más de `{{tiempo}}`, se anota y se pasa a la siguiente tarea.
- Consolidar en una tabla y **corregir en este orden: comprensión → flujo → errores → estética**.

Planilla por tarea:

| Tarea | ¿Empezó sola? | Dudas | Malentendidos | Tiempo | ¿Completó? | ¿Le sirvió? |
|---|---|---|---|---|---|---|
| `{{…}}` | | | | | | |

---

## 13. Publicación y entrega

Elegir lo que aplique y documentarlo paso a paso en el README.

### 13.1 Hosting compartido (ej. Hostinger, sin Docker)
- Compilar la interfaz (genera la carpeta de estáticos, ej. `dist`).
- Si la app va en una **subcarpeta** (ej. `public_html/proyecto`), usar **rutas relativas** en la interfaz y la API (base relativa en el compilador) para que funcione igual en la raíz y en subcarpetas.
- Configuración (credenciales de la base) en un archivo **fuera del alcance del navegador** o en una carpeta bloqueada con `.htaccess`.
- Carpetas internas del backend bloqueadas con `.htaccess`.
- Como no hay consola, preparar un **instalador protegido con clave** que cree las tablas y cargue los datos, y desactivarlo después de usarlo.
- Un script que **arme el paquete listo para subir** (compilado + API + configuración + `.htaccess`).
- Pasos en el panel: versión de PHP y extensiones, crear base y usuario, subir archivos (un .zip y "Extraer" conserva los `.htaccess` ocultos), correr el instalador, comprobar.

### 13.2 Servidor propio / Docker
- Archivo de composición de producción separado del de desarrollo; reinicio automático de servicios.
- Imagen de producción que compile la interfaz y la sirva junto con la API.

### 13.3 Dispositivo físico / kiosco (si aplica)
- Navegador en modo kiosco (pantalla completa, sin barras, sin poder salir) que se reabre solo si se cierra.
- Arranque automático al iniciar sesión (macOS: LaunchAgent; Windows: tarea programada), esperando a que la API responda antes de abrir la app.
- Evitar suspensión y apagado de pantalla.
- Inicio de sesión automático y orientación de pantalla configurados.
- Proyecto en una **carpeta local** (no en carpetas de nube).
- Documentar cómo salir del modo kiosco con teclado y cómo desinstalar.

### 13.4 Entrega
- README probado "desde cero" (como si fuera otra persona en otra computadora).
- Documentación de `docs/` completa.
- Lista de pendientes y decisiones finales.
- Push al repositorio cuando la persona lo pida.

---

## 14. Errores frecuentes y cómo evitarlos

Aprendizajes de un proyecto real; revisarlos al planificar.

| Problema | Cómo evitarlo |
|---|---|
| Proyecto dentro de Google Drive/iCloud + Docker: los cambios no se detectan y `node_modules` se sincroniza con la nube | Dependencias y datos de la base en **volúmenes de Docker**; servidor de desarrollo con *polling* activado. Para producción, copiar el proyecto a una carpeta local |
| Procesos automáticos (arranque del sistema) no pueden leer carpetas de la nube | Instalar la versión de producción en una carpeta local |
| Rutas absolutas (`/api`, `/img`) se rompen al publicar en una subcarpeta | Rutas relativas desde el principio y base relativa en el compilador |
| Cookie de sesión con ruta fija | Calcular la ruta a partir de dónde está la API |
| Botones de acción que desaparecen al desplazar | Botones principales **fijos** fuera del área que se desplaza |
| Capas (avisos, teclados, modales) que se mueven con el contenido | Renderizarlas fuera del contenedor que se desplaza |
| Temporizadores que se reinician en cada render | Guardar las funciones de callback en referencias |
| Claves duplicadas en listas (React) | Claves únicas y estables, nunca el índice si hay elementos especiales |
| Toques múltiples que disparan acciones de más | Ventana de tiempo que ignora toques extra tras la acción |
| Contenido que se ve por debajo de formas recortadas o con transparencias | Revisar el apilado y dejar márgenes donde haga falta |
| Edición de documentación externa (ej. Notion) que pierde líneas por la indentación de bloques anidados | Después de editar, **volver a leer la página completa** y verificar |
| Conectores a servicios externos que cambian de espacio de trabajo y dejan de tener acceso | Dejar anotado qué falta sincronizar y retomarlo al reconectar |
| Datos de prueba que quedan en la base | Limpiar después de cada prueba o reiniciar la base de desarrollo |
| Scripts de shell con variables y expresiones regulares que se interpretan mal | Escribir el contenido en archivos temporales o usar el editor, y verificar el resultado |
| Valores "a ojo" en el diseño | Medir en el diseño (coordenadas y tamaños) y comparar con capturas |
| Diferencias entre MySQL y MariaDB (ej. `IF NOT EXISTS` en columnas) | Confirmar qué motor usa el hosting y probar el esquema ahí |

---

## 15. Plantillas de archivos

### 15.1 Archivo de reglas (`{{REGLAS}}.md`)
```markdown
#descripción del proyecto
- {{qué es}}
- {{para quién}}
- Tipos de usuario:
  - {{usuario}}: {{qué hace}}
- Idioma: {{…}}
- Diseño de referencia: {{enlace + página}}
- Documentación externa: {{enlace}} (se mantiene igual a este archivo)

#partes del proyecto
1. {{pantalla}}

#reglas del proyecto

Método de trabajo
- {{reglas de la Fase 2}}

Stack y herramientas
- {{stack de la Fase 3}}

Dispositivo e interfaz
- {{resolución, tamaños mínimos, botones fijos, nomenclatura, optimización}}

Datos y sesión
- {{datos iniciales, validaciones, sesiones, formatos}}

#tipografías
- {{…}}

#colores
- {{uso}}: {{#hex}}

#pantallas (qué contiene cada una)
{{Pantalla}}
- {{contenido}}

#datos estáticos (carga inicial)
- {{…}}

#navegación de botones
**{{Pantalla}}**
- {{Botón}} → {{destino}}
```

### 15.2 README
```markdown
# {{Nombre}}
{{Descripción corta}}

## Requisitos
| Programa | Para qué | Dónde se consigue |

## Correr el proyecto desde cero
1. Instalar {{…}}
2. Descargar el código
3. Crear `.env` a partir de `.env.ejemplo`
4. Levantar: `{{comando}}`
5. Abrir: {{direcciones y puertos}}

## Publicar
{{pasos de la Fase 13}}

## Comandos útiles
| Comando | Qué hace |

## Estructura
{{árbol de carpetas}}
```

### 15.3 `.gitignore` base
```
node_modules/
dist/
.env
.env.*
!.env.ejemplo
*.log
.DS_Store
Thumbs.db
.vscode/
.idea/
{{datos locales de la base}}
{{paquetes de publicación con credenciales}}
```

### 15.4 `.env.ejemplo`
```
# Base de datos
DB_NAME={{…}}
DB_USER={{…}}
DB_PASSWORD=cambiar
DB_ROOT_PASSWORD=cambiar

# Puertos (solo en 127.0.0.1)
WEB_PORT={{…}}

# Accesos iniciales (se usan solo la primera vez y se guardan cifrados)
{{…}}
```

### 15.5 Registro de etapas (en `docs/DESARROLLO.md`)
| Etapa | Estado | Qué se hizo |
|---|---|---|
| 0 — Definiciones | {{Hecha / En curso / Pendiente}} | {{…}} |

---

## 16. Lista de control final

**Antes de empezar a programar**
- [ ] Entrevista hecha y resumen aprobado
- [ ] Ficha del proyecto completa
- [ ] Reglas de trabajo acordadas
- [ ] Stack elegido y justificado
- [ ] Colores y tipografías tomados del diseño
- [ ] Pantallas, flujos y navegación descritos
- [ ] Modelo de datos aprobado
- [ ] Plan por etapas aprobado, con pendientes listados
- [ ] Carpeta base creada (reglas, plan, README, docs, `.gitignore`, `.env.ejemplo`)
- [ ] Documentación externa sincronizada (si existe)

**En cada etapa**
- [ ] Probada de verdad y comparada con el diseño
- [ ] Datos de prueba limpios
- [ ] Documentación y plan actualizados
- [ ] Aprobada por la persona
- [ ] Commit con el nombre de la etapa

**Antes de entregar**
- [ ] Pruebas de uso con al menos 3 personas y correcciones hechas
- [ ] Publicado y probado en el destino real
- [ ] README probado desde cero
- [ ] Sin contraseñas en Git; `.env.ejemplo` actualizado
- [ ] Pendientes resueltos o documentados
- [ ] Push al repositorio (cuando la persona lo pida)
