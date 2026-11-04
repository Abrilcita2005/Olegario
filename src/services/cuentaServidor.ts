import type { PerfilBasico, TipoAcceso } from './almacenamiento';
import { guardarToken, pedirApi } from './api';

// Cuentas reales con la API de Olegario (Etapa 13, D-68). La contraseña viaja solo al servidor, que la
// guarda cifrada: la app nunca la guarda. Solo se usa cuando la API está configurada (ver services/api.ts).
// Los mensajes de error ya vienen en español desde la API (servidor/api/src/).

export type ResultadoCuenta = { ok: true } | { ok: false; error: string };

export type CuentaActual = { id: string; tipoAcceso: TipoAcceso; perfil: PerfilBasico | null };

type RespuestaSesion = { token: string; cuenta: CuentaActual };

async function abrirSesion(
  ruta: string,
  datos?: unknown,
): Promise<ResultadoCuenta & { cuenta?: CuentaActual }> {
  const respuesta = await pedirApi<RespuestaSesion>('POST', ruta, datos);
  if (!respuesta.ok) return { ok: false, error: respuesta.error };
  await guardarToken(respuesta.datos.token);
  return { ok: true, cuenta: respuesta.datos.cuenta };
}

export function registrarCuenta(perfil: PerfilBasico, contrasena: string) {
  return abrirSesion('/cuentas/registro', {
    nombre: perfil.nombre,
    profesion: perfil.profesion,
    correo: perfil.correo,
    contrasena,
  });
}

export function ingresarConCorreo(correo: string, contrasena: string) {
  return abrirSesion('/cuentas/ingreso', { correo, contrasena });
}

// Modo invitado (D-34): el servidor crea una cuenta sin correo con rol invitado.
export function ingresarComoInvitado() {
  return abrirSesion('/cuentas/invitado');
}

export async function cerrarSesionServidor(): Promise<void> {
  await pedirApi('POST', '/cuentas/salir');
  await guardarToken(null);
}

// Borra la cuenta y, en cascada, todos sus datos en el servidor.
export async function eliminarCuentaServidor(): Promise<ResultadoCuenta> {
  const respuesta = await pedirApi('DELETE', '/cuentas/yo');
  if (!respuesta.ok) return { ok: false, error: respuesta.error };
  await guardarToken(null);
  return { ok: true };
}

export async function actualizarPerfilServidor(perfil: PerfilBasico): Promise<ResultadoCuenta> {
  const respuesta = await pedirApi('PATCH', '/cuentas/yo', {
    nombre: perfil.nombre,
    profesion: perfil.profesion,
  });
  return respuesta.ok ? { ok: true } : { ok: false, error: respuesta.error };
}

// Sesión guardada al abrir la app. null si no hay sesión válida (venció o se eliminó la cuenta).
// Si no hay conexión, devuelve 'sin_conexion' para no cerrar la sesión por un corte de internet.
export async function leerCuentaActual(): Promise<CuentaActual | null | 'sin_conexion'> {
  const respuesta = await pedirApi<CuentaActual>('GET', '/cuentas/yo');
  if (respuesta.ok) return respuesta.datos;
  if (respuesta.estado === 401) await guardarToken(null);
  return respuesta.estado === 401 ? null : 'sin_conexion';
}
