import type { PerfilBasico, TipoAcceso } from './almacenamiento';
import { guardarToken, leerToken, pedirApi } from './api';

// Cuentas reales con la API de Olegario (Etapa 13, D-68). La contraseña viaja solo al servidor, que la
// guarda cifrada: la app nunca la guarda. Solo se usa cuando la API está configurada (ver services/api.ts).
// Los mensajes de error ya vienen en español desde la API (servidor/api/src/).

export type ResultadoCuenta = { ok: true } | { ok: false; error: string };

// Perfil tal como lo manda la API (los textos vacíos llegan como null).
type PerfilApi = {
  nombre: string;
  profesion: string;
  correo: string;
  fotoUrl?: string | null;
  sobreMi?: string | null;
  ofrezco?: string | null;
  busco?: string | null;
};

export type CuentaActual = {
  id: string;
  tipoAcceso: TipoAcceso;
  perfil: PerfilBasico | null;
  // Foto de perfil guardada en el servidor (dirección completa), o null.
  fotoUrl: string | null;
};

type CuentaApi = { id: string; tipoAcceso: TipoAcceso; perfil: PerfilApi | null };

function cuentaDesdeApi(c: CuentaApi): CuentaActual {
  const p = c.perfil;
  return {
    id: c.id,
    tipoAcceso: c.tipoAcceso,
    perfil: p
      ? {
          nombre: p.nombre,
          profesion: p.profesion,
          correo: p.correo,
          ...(p.sobreMi ? { sobreMi: p.sobreMi } : {}),
          ...(p.ofrezco ? { ofrezco: p.ofrezco } : {}),
          ...(p.busco ? { busco: p.busco } : {}),
        }
      : null,
    fotoUrl: p?.fotoUrl ?? null,
  };
}

type RespuestaSesion = { token: string; cuenta: CuentaApi };

async function abrirSesion(
  ruta: string,
  datos?: unknown,
): Promise<ResultadoCuenta & { cuenta?: CuentaActual }> {
  const respuesta = await pedirApi<RespuestaSesion>('POST', ruta, datos);
  if (!respuesta.ok) return { ok: false, error: respuesta.error };
  await guardarToken(respuesta.datos.token);
  return { ok: true, cuenta: cuentaDesdeApi(respuesta.datos.cuenta) };
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
    sobreMi: perfil.sobreMi ?? '',
    ofrezco: perfil.ofrezco ?? '',
    busco: perfil.busco ?? '',
  });
  return respuesta.ok ? { ok: true } : { ok: false, error: respuesta.error };
}

// Sube la foto de perfil (imagen comprimida "data:image/...") o la quita (null). Devuelve la dirección
// de la foto en el servidor, o un error.
export async function cambiarFotoServidor(
  foto: string | null,
): Promise<{ ok: true; fotoUrl: string | null } | { ok: false; error: string }> {
  if (foto !== null && !foto.startsWith('data:image/')) {
    return { ok: false, error: 'No pudimos leer la foto. Probá elegirla de nuevo.' };
  }
  const respuesta = await pedirApi<{ fotoUrl: string | null }>('PUT', '/cuentas/foto', { foto });
  return respuesta.ok
    ? { ok: true, fotoUrl: respuesta.datos.fotoUrl }
    : { ok: false, error: respuesta.error };
}

// Sesión guardada al abrir la app. null si no hay sesión válida (venció o se eliminó la cuenta).
// Si no hay conexión, devuelve 'sin_conexion' para no cerrar la sesión por un corte de internet.
export async function leerCuentaActual(): Promise<CuentaActual | null | 'sin_conexion'> {
  // Sin sesión guardada no hace falta preguntarle al servidor.
  if (!(await leerToken().catch(() => null))) return null;
  const respuesta = await pedirApi<CuentaApi>('GET', '/cuentas/yo');
  if (respuesta.ok) return cuentaDesdeApi(respuesta.datos);
  if (respuesta.estado === 401) await guardarToken(null);
  return respuesta.estado === 401 ? null : 'sin_conexion';
}
