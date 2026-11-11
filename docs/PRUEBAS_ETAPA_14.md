# Etapa 14 — Informe de pruebas

Fecha: 2026-11-11. Entorno: versión web (Chromium, 390 px y 320 px de ancho) contra el servidor local
(PHP 8.3 + MySQL 8.0), más el empaquetado de iOS y Android con `expo export`.

## 1. Recorrido funcional automático

Se abrieron las 23 pantallas con una sesión real (y las 5 de acceso sin sesión), juntando errores de
la consola, revisando accesibilidad básica y pantalla angosta.

| Hallazgo                                                                                    | Tipo        | Estado                                         |
| ------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------- |
| "Iniciar sesión" no mandaba correo ni contraseña al servidor: quedaba cargando sin avisar   | Error grave | Corregido + prueba automática                  |
| Sin conexión, las pestañas mostraban pantallas vacías que parecían ciertas                  | Comprensión | Corregido: aviso "Sin conexión" + "Reintentar" |
| Sin sesión, la app pedía datos protegidos al servidor (respuestas "no autorizado")          | Error       | Corregido                                      |
| Home: "4 Puestos Libres" y similares eran números fijos de Figma aunque hubiera servidor    | Comprensión | Corregido: se calculan con datos reales        |
| Novedades: contenido y personas inscriptas de prueba aunque hubiera servidor                | Comprensión | Corregido: sale del servidor                   |
| Espacios: filtro OLE/CAFÉ sin espacios reales                                               | Flujo       | Corregido: solo submarcas con espacios         |
| "+0 inscriptos" en eventos y novedades                                                      | Estética    | Corregido: "Sin inscriptos todavía"            |
| Botones sin nombre para lectores de pantalla                                                | Accesib.    | Ninguno                                        |
| Pantallas sin título para lectores de pantalla                                              | Accesib.    | Ninguna                                        |
| Áreas táctiles menores a 44 px (chips, "Ver perfil", ojo de contraseña, "Eliminar cuenta"…) | Accesib.    | Corregido con área táctil extendida            |
| Textos de 9–10 px que vienen de Figma (barra inferior, tarjetas del Home, chip "LIBRE")     | Accesib.    | **Pendiente de decisión (P-49)**               |
| Pantalla de 320 px de ancho: nada se sale de la pantalla (solo las filas que se deslizan)   | Visual      | Sin problemas                                  |
| Empaquetado iOS y Android                                                                   | Técnico     | Sin errores                                    |
| "Recuperar contraseña" no funciona (el servidor no envía correos)                           | Función     | **Pendiente de decisión (P-48)**               |

## 2. Comparación con Figma

Capturas lado a lado en `docs/capturas-app/etapa-14/figma-vs-app-*.png` (11 pantallas). La estructura,
los colores, las tipografías y los componentes coinciden. Diferencias, todas ya decididas o por datos:
sin Face ID, Google ni Apple (decisión del 2026-11-03); "Cambiar" en lugar de "Confirmar" en el horario de Espacios;
espacios reales del plano en lugar de los de Figma (D-73); perfil sin foto muestra el círculo vacío.

## 3. Lo que no se puede probar en la nube (necesita a la responsable)

- Recorrido en un **teléfono real** iOS y Android (L-04).
- **VoiceOver** (iPhone) y **TalkBack** (Android).
- **Texto grande** del sistema.
- **Pruebas de uso con 3 personas**: guion, tareas y planilla en `docs/PRUEBAS_DE_USO.md`.
