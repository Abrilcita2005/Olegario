# Decisiones y pendientes — Olegario en Movimiento

## 1. Registro de decisiones

| ID | Decisión | Motivo | Alternativas consideradas | Fecha | Impacto | Estado |
|---|---|---|---|---|---|---|
| D-01 | Las reglas del proyecto viven en `OLEGARIO.md`; `CLAUDE.md` solo lo importa con `@OLEGARIO.md`. | La responsable pidió el nombre `OLEGARIO.md`; Claude solo lee `CLAUDE.md` automáticamente. | Renombrar sin importar (Claude dejaría de leer las reglas). | 2026-10-28 | Bajo | **Aprobada** |
| D-02 | Las credenciales reales van solo en `.env` (ignorado por Git); `.env.example` es la plantilla pública. | Seguridad. | — | 2026-10-07 | Bajo | **Aprobada** |
| D-03 | La documentación vive en `docs/`, con la guía maestra y documentos complementarios. | Pedido de la responsable. | Un único archivo grande. | 2026-10-28 | Bajo | **Aprobada** |
| D-04 | Figma, página "Alta fidelidad", es la referencia visual principal. Ante discrepancias con lo escrito, se consulta. | Pedido de la responsable. | — | 2026-10-28 | Alto | **Aprobada** |
| D-05 | Trabajo por etapas: no se empieza una etapa sin autorización explícita. | Pedido de la responsable (protocolo obligatorio). | — | 2026-10-28 | Alto | **Aprobada** |
| D-06 | Commits con el formato `Etapa N — Nombre` y push solo a la rama de trabajo. | Guía de referencia; regla de no tocar `main`. | Mensajes libres. | 2026-10-28 | Bajo | Propuesta |
| D-07 | Stack: React Native + Expo + TypeScript. | Ver `GUIA_MAESTRA` §G.1. | Flutter, nativo, PWA. | 2026-10-28 | Alto | **Propuesta: requiere aprobación (P-01)** |
| D-08 | Primero datos de prueba locales detrás de una capa `services/`; el backend se decide antes de la Etapa 13. | No bloquear la interfaz; cero costos iniciales. | Backend desde el inicio. | 2026-10-28 | Medio | **Propuesta: requiere aprobación (P-02)** |
| D-09 | Tipografías: Poppins (títulos) + Manrope (cuerpo) en toda la app. | Son las más usadas en las pantallas; licencia libre; iguales en iOS y Android. | Vástago + fuente del sistema; las 4 familias. | 2026-10-28 | Alto | **Propuesta: requiere aprobación (P-13)** |
| D-10 | Colores de interfaz: los de las pantallas (`#E11D48`, `#F97316`, `#EC6A06`…); los de la paleta quedan para el logo y la marca. | Es lo que se ve en el diseño de alta fidelidad. | Reemplazar por la paleta pura. | 2026-10-28 | Medio | **Propuesta: requiere aprobación (P-14)** |
| D-11 | Tema visual único, como en Figma, sin seguir el modo oscuro del sistema en la v1. | No hay diseño para el modo oscuro. | Diseñar un tema oscuro. | 2026-10-28 | Medio | **Propuesta: requiere aprobación (P-11)** |

---

## 2. Preguntas para la responsable (agrupadas)

### Grupo 1 — Proyecto y entrega (bloquea el plan general)
- **P-16** ¿Es un trabajo académico, un cliente real o un proyecto propio? ¿Hay **fecha de entrega**, consigna o rúbrica? ¿Qué se entrega: app instalable, prototipo funcional, publicación en tiendas, documentación o presentación? ¿Hay documentación externa (Notion, Docs) que deba mantenerse sincronizada?
- **P-01** ¿La app es para **iOS y Android**? ¿Aprobás **Expo + React Native + TypeScript** (D-07)?
- **P-15** ¿En qué computadora desarrollás (Mac, Windows o Linux)? ¿Con qué teléfonos vas a probar?

### Grupo 2 — Datos y backend (bloquea las Etapas 11 y 13)
- **P-02** ¿Olegario Coworking ya usa algún sistema para membresías y reservas (p. ej. Nexudus, OfficeRnD, Cobot, una planilla)? ¿La app debe conectarse a él? Si no hay nada, ¿aprobás empezar con datos de prueba (D-08)?
- **P-03** ¿"Cargar horas extras" y "Métodos de pago" implican **pagos reales** o, por ahora, solo informativos o simulados?
- **P-06** Reglas de reserva: duración mínima y máxima, anticipación, cancelación, cómo se descuentan las horas del plan, y qué significan "Gratis" y "1H / DÍA INC.".
- **P-07** El **PIN de acceso** y el **check-in**, ¿se conectan con un sistema físico (cerraduras, recepción) o son solo visuales?
- **P-09** ¿Quién carga espacios, eventos, novedades y efemérides? ¿Hace falta un panel de administración dentro del alcance?

### Grupo 3 — Usuarios, privacidad y comunidad
- **P-04** ¿Qué puede ver y hacer un **invitado**? ¿"Modo Invitado" (Acceso) y el rol "Invitado / evento" (Login) son lo mismo?
- **P-05** ¿Se implementan de verdad los ingresos con Google, Apple y Face ID/huella en la primera versión? (Nota: si se ofrece Google en iOS, Apple exige ofrecer también Apple.)
- **P-08** "Contactar", "matches y charlas": ¿hay **chat** dentro de la app o se abre WhatsApp o correo? ¿Quién modera las publicaciones? ¿La ubicación en tiempo real ("En Ole/Café ahora · Mesa 12") es opcional?
- **P-10** Bienvenida 1 habla de **cookies y rastreo**: ¿qué se va a medir y con qué herramienta? ¿Se agrega la opción de rechazar? (En iOS es obligatorio pedir permiso con el aviso del sistema.)
- **P-23** ¿Existen los textos de **términos de convivencia, manifiesto y política de privacidad**?

### Grupo 4 — Diseño (bloquea la Etapa 4)
- **P-13** **Tipografías:** las pantallas usan Poppins, Manrope, Montserrat y DM Sans, pero la guía de estilo dice Vástago y San Francisco. ¿Cuál vale? ¿Tenés el archivo y la licencia de **Vástago**? Recomendación: D-09.
- **P-14** **Colores:** el rosa y el naranja de la paleta (`#FF0055`, `#F84600`) no coinciden con los de las pantallas (`#E11D48`, `#F97316`), y el violeta `#5850F5` no se usa. ¿Cuáles valen? Recomendación: D-10. Además, tres combinaciones no alcanzan el contraste mínimo de accesibilidad: ¿se ajustan?
- **P-11** ¿La app debe tener **modo oscuro** según el teléfono, o un tema único como en Figma? Recomendación: D-11.
- **P-12** **Textos:** hay mezcla de voseo y tuteo ("Busca tu mesa", "Reserva tu lugar", "Accede", "Viaja… conoce", "Califica", "para ti", "O CONTINÚA CON"), erratas ("nace para para crear", "CAFETERIA", "Ultimos", "Emprendedore") y "Bienvenido" en masculino. ¿Unificamos todo en voseo y corregimos? ¿Querés lenguaje inclusivo?
- **P-24** ¿Qué hace el **ícono de tres píldoras** del encabezado, junto al avatar?
- **P-25** ¿Para qué es el ícono de cámara del buscador de Espacios (¿escanear un QR?)?
- **P-29** "Pedir al barista": ¿hace un pedido real o es informativo?
- **P-30** Novedades, ¿es una pantalla completa o un panel que se abre encima? ¿Cómo se cierra?
- **P-31** Para las ~16 pantallas que no están diseñadas (recuperar contraseña, detalle de reserva, confirmaciones, publicar proyecto, editar perfil, ajustes, etc.), ¿las diseñás vos en Figma o aprobás diseños provisionales con el sistema existente?
- **P-28** ¿Dónde van cerrar sesión, ajustes y eliminar cuenta? (Eliminar cuenta es obligatorio en App Store si hay registro.)

### Grupo 5 — Recursos que faltan
- **P-26** El frame **AGENDA** es una imagen plana: ¿podés reemplazarlo por la versión con capas?
- **P-27 / P-17** Se agotó el **límite de llamadas del plan Starter de Figma**. Faltan las capturas de **Perfil** y **Perfil público**, y las medidas exactas de Espacios, Agenda, Comunidad, Novedades y los dos perfiles. Opciones: (a) esperar a que se renueve el límite y seguir en otra sesión; (b) que exportes esos frames como PNG y los subas; (c) mejorar el plan de Figma (**tiene costo; decisión tuya**).
- **P-19** El **logo en SVG** (vectorial).
- **P-20** La imagen que falta en Bienvenida 1 (hay un espacio de 151×153 vacío).
- **P-21** **Fotos:** ¿son de Olegario y se pueden usar en la app? ¿Hay más fotos de los espacios reales?
- **P-22** **Ícono de la app** (1024×1024) y pantalla de carga: no existen en Figma.
- **P-18** Los íconos, ¿vienen de alguna librería (Lucide, Material, Phosphor) o son propios?

---

## 3. Bloqueos actuales

| ID | Bloqueo | Afecta | Qué destraba |
|---|---|---|---|
| B-01 | No hay stack aprobado. | Etapa 3 en adelante | P-01 |
| B-02 | Tipografías y colores sin definir. | Etapa 4 | P-13, P-14 |
| B-03 | Límite de Figma alcanzado. | Fichas P11/P12, medidas de 6 pantallas | P-27 |
| B-04 | Agenda sin capas. | Etapa 9 (medidas exactas) | P-26 |
| B-05 | Sin decisión de backend. | Etapas 11 y 13 | P-02, P-03 |
| B-06 | Recursos no exportados. | Etapas 4 a 12 | P-19 a P-22 y exportación (entorno sin acceso a `figma.com`) |

## 4. Riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R-1 | Licencia de Vástago no disponible o con costo. | Media | Alto | Opción A de tipografías (Google Fonts). |
| R-2 | SF Pro no puede usarse en Android. | Alta | Medio | Fuente libre equivalente o la del sistema en cada plataforma. |
| R-3 | Rastreo sin consentimiento real: rechazo de Apple o incumplimiento legal. | Media | Alto | Aviso del sistema y opción de rechazar (P-10). |
| R-4 | Mostrar la ubicación física de las personas expone su privacidad. | Media | Alto | Opcional y desactivada por defecto. |
| R-5 | Muchas pantallas sin diseño hacen crecer el alcance. | Alta | Alto | Priorizar los flujos esenciales y usar diseños provisionales aprobados. |
| R-6 | Contraste insuficiente en los CTA y chips. | Alta | Medio | Ajustar los tonos con aprobación. |
| R-7 | Los datos de ejemplo de Figma se confunden con datos reales. | Media | Medio | Datos de prueba solo en `data/mock/` e identificados. |
| R-8 | Publicar en tiendas tiene costos (Apple anual, Google pago único). | — | Medio | Consultar antes; para entregas se puede usar Expo Go o APK. |
| R-9 | Login social y biometría suman complejidad y requisitos de tienda. | Media | Medio | Decidir en P-05; implementar por etapas. |

## 5. Recursos pendientes
Ver el Grupo 5 y `docs/DISENO.md` §D.
