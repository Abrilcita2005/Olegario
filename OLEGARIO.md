# Proyecto Olegario

Reglas e instrucciones del proyecto. Claude las lee a través de `CLAUDE.md`, que importa este archivo.

## Reglas generales

- Responde siempre en español.
- Explica de forma sencilla qué vas a hacer antes de hacer cambios grandes.
- No hagas commits ni pushes a `main` sin preguntar.
- Si algo no está claro, pregunta antes de suponer.

## Sobre el proyecto

- Nombre: **Olegario en Movimiento**, app móvil de Olegario Coworking (Mendoza).
- Descripción: integra espacios de trabajo, agenda de eventos, comunidad profesional, novedades y cuenta/membresía de cada miembro.
- Secciones: Bienvenida (3) · Acceso (acceso, registro, login, invitado) · Home · Espacios · Agenda · Comunidad · Perfil profesional · Perfil de cuenta · Novedades (botón flotante).
- Diseño de referencia: Figma `OLEGARIO EN MOVIMIENTO - APP` (https://www.figma.com/design/QCRxB2u4qBf98oDDKhzteQ), página **"Alta fidelidad"**. Capturas en `docs/referencias/figma/`.
- Idioma: español rioplatense con voseo.
- Tecnologías: **React Native + Expo SDK 58 + TypeScript (estricto) + Expo Router**, para iOS y Android (aprobado 2026-10-28). Pruebas con Jest y Testing Library.
- Diseño vigente: colores de los SVG de marca (`#FE016D`, `#F83B11`, `#CAF22C`, `#262020`), títulos en **Poppins** (como en Figma), texto en **Inter**, íconos de servicio con aro de degradado, sin modo oscuro. Todo color y tipografía sale de `src/theme/`; nunca valores sueltos. Componentes base en `src/components/ui/` y catálogo en la ruta `/catalogo`.
- Entorno: la responsable trabaja solo en la nube (sesiones de Claude); la verificación visual se hace con la versión web y capturas.

## Documentación (fuente de referencia)

Antes de trabajar, leé:

1. `docs/ESTADO_DEL_PROYECTO.md`: etapa actual y qué está autorizado.
2. `docs/PLAN_DE_TRABAJO.md`: etapas y protocolo.
3. `docs/GUIA_MAESTRA_PROYECTO.md`, `docs/DISENO.md`, `docs/PANTALLAS.md`, `docs/DECISIONES_Y_PENDIENTES.md`.

## Protocolo por etapas (obligatorio)

- Trabajá solo dentro de la etapa autorizada. **Nunca empieces la siguiente sin una autorización explícita** ("Avanzá a la siguiente etapa", "Podés comenzar la etapa N"…).
- Al terminar una etapa: verificá, actualizá la documentación, presentá el informe de cierre y detenete.
- No registres autorizaciones que no se dieron.

## Comandos

- Instalar: `npm install`
- Ejecutar: `npm start` (Expo) · `npm run web` (navegador)
- Verificar todo antes de un commit: `npm run verificar` (tipos, lint, formato y pruebas)
- Instalar paquetes nuevos (con aprobación): `npx expo install <paquete>`; en este entorno en la nube hace falta `EXPO_OFFLINE=1` porque `api.expo.dev` está bloqueado.
- Las rutas viven en `src/app/`: cada archivo es una pantalla. El código que no es pantalla va fuera de `src/app/`.
- No crear ni editar a mano las carpetas `ios/` y `android/` (se generan solas).

## Credenciales

- Las credenciales reales van solo en `.env` (ignorado por Git).
- `.env.example` es la plantilla pública: lleva los nombres de las variables, nunca valores reales.
- Al añadir una variable nueva, agrégala también a `.env.example` sin valor.
- Nunca escribas contraseñas, tokens ni claves directamente en el código.

## Reglas clave de desarrollo (completas en la guía maestra §H)

- Figma es la fuente de verdad visual; ante discrepancias, preguntar.
- No inventar requisitos, contenido, datos reales ni decisiones de diseño. Lo marcado como PENDIENTE no se implementa.
- Los nombres y datos de Figma son ejemplos: los datos de prueba van identificados en `data/mock/`.
- No instalar dependencias, borrar archivos ni cambiar la estructura de datos sin aprobación.
- No afirmar que algo funciona sin verificarlo.
- Commits: `Etapa N — Nombre`.

## Convenciones

- Usa nombres de variables y funciones descriptivos.
- Mantén el código simple y comentado donde haga falta.
- Componentes en `PascalCase`, funciones en `camelCase`, imágenes en `kebab-case`.
