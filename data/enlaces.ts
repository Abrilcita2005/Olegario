// Páginas de Olegario publicadas en Vercel por la responsable (2026-11-11). Se abren en un panel sobre la
// app (expo-web-browser), con poco protagonismo: "Conocé Olegario" al final del Home y el plano al final
// de Espacios.
// PENDIENTE: el enlace del video es de una versión de prueba de Vercel (con "_vercel_share"); conviene
// reemplazarlo por el enlace definitivo cuando exista, porque los enlaces de prueba pueden vencer.
export const ENLACE_CONOCE_OLEGARIO =
  'https://conoce-olegario-9mno5ib05-abrilcita.vercel.app/?_vercel_share=PVJVZVLt02DaKV9VRdwWCBLGr3XoNytZ';

// Plano visto desde arriba para reservar (proyecto olegario-reservas). Unido al servidor de la app (D-73):
// sus reservas son las mismas que las de la app. PENDIENTE: la versión publicada en Vercel pasa a usar el
// servidor cuando esté en Hostinger (hasta entonces sigue con sus reservas aparte, en Firebase).
export const ENLACE_PLANO_RESERVAS = 'https://olegario-reservas.vercel.app/';

// true cuando la versión publicada del plano ya guarda en el servidor de Olegario (después de Hostinger):
// la app lo abre con la sesión (código de un solo uso) y deja de mostrar el aviso de "reservas aparte".
export const PLANO_CONECTADO_AL_SERVIDOR = false;
