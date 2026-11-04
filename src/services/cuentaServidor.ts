import type { PerfilBasico, TipoAcceso } from './almacenamiento';
import { supabase } from './supabase';

// Cuentas reales con Supabase Auth (Etapa 13). La contraseña la recibe y la guarda cifrada Supabase:
// la app nunca la guarda. Solo se usa cuando Supabase está configurado (ver services/supabase.ts).

export type ResultadoCuenta =
  { ok: true; requiereConfirmacion?: boolean } | { ok: false; error: string };

export type CuentaActual = { tipoAcceso: TipoAcceso; perfil: PerfilBasico | null };

// Mensajes de Supabase → español rioplatense (sin detalles técnicos).
export function mensajeDeError(error: { message?: string; status?: number } | null): string {
  const texto = (error?.message ?? '').toLowerCase();
  if (texto.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (texto.includes('already registered') || texto.includes('already been registered'))
    return 'Ya existe una cuenta con ese correo. Probá iniciar sesión.';
  if (texto.includes('email not confirmed'))
    return 'Confirmá tu correo con el enlace que te mandamos y volvé a intentar.';
  if (texto.includes('password') && (texto.includes('weak') || texto.includes('least')))
    return 'Elegí una contraseña más segura (al menos 8 caracteres, con letras y números).';
  if (texto.includes('rate limit') || error?.status === 429)
    return 'Hiciste muchos intentos seguidos. Esperá unos minutos y probá de nuevo.';
  if (texto.includes('anonymous') && texto.includes('disabled'))
    return 'El modo invitado no está disponible por ahora.';
  if (texto.includes('fetch') || texto.includes('network'))
    return 'No pudimos conectarnos. Revisá tu conexión a internet.';
  return 'No pudimos completar la operación. Probá de nuevo en unos minutos.';
}

const SIN_SERVIDOR: ResultadoCuenta = { ok: false, error: 'El servidor no está configurado.' };

export async function registrarCuenta(
  perfil: PerfilBasico,
  contrasena: string,
): Promise<ResultadoCuenta> {
  if (!supabase) return SIN_SERVIDOR;
  try {
    const { data, error } = await supabase.auth.signUp({
      email: perfil.correo,
      password: contrasena,
      options: { data: { nombre: perfil.nombre, profesion: perfil.profesion } },
    });
    if (error) return { ok: false, error: mensajeDeError(error) };
    // Si Supabase pide confirmar el correo, todavía no hay sesión.
    return { ok: true, requiereConfirmacion: !data.session };
  } catch (e) {
    return { ok: false, error: mensajeDeError(e as Error) };
  }
}

export async function ingresarConCorreo(
  correo: string,
  contrasena: string,
): Promise<ResultadoCuenta> {
  if (!supabase) return SIN_SERVIDOR;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });
    return error ? { ok: false, error: mensajeDeError(error) } : { ok: true };
  } catch (e) {
    return { ok: false, error: mensajeDeError(e as Error) };
  }
}

// Modo invitado: ingreso anónimo de Supabase (el servidor le asigna el rol "invitado").
export async function ingresarComoInvitado(): Promise<ResultadoCuenta> {
  if (!supabase) return SIN_SERVIDOR;
  try {
    const { error } = await supabase.auth.signInAnonymously();
    return error ? { ok: false, error: mensajeDeError(error) } : { ok: true };
  } catch (e) {
    return { ok: false, error: mensajeDeError(e as Error) };
  }
}

export async function cerrarSesionServidor(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut().catch(() => {});
}

// Borra la cuenta y todos sus datos en el servidor (función eliminar_mi_cuenta del esquema).
export async function eliminarCuentaServidor(): Promise<ResultadoCuenta> {
  if (!supabase) return SIN_SERVIDOR;
  const { error } = await supabase.rpc('eliminar_mi_cuenta');
  if (error) return { ok: false, error: mensajeDeError(error) };
  await supabase.auth.signOut().catch(() => {});
  return { ok: true };
}

export async function actualizarPerfilServidor(perfil: PerfilBasico): Promise<ResultadoCuenta> {
  if (!supabase) return SIN_SERVIDOR;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, error: 'Tu sesión venció. Volvé a ingresar.' };
  const { error } = await supabase
    .from('perfiles')
    .update({ nombre: perfil.nombre, profesion: perfil.profesion })
    .eq('id', data.user.id);
  return error ? { ok: false, error: mensajeDeError(error) } : { ok: true };
}

// Sesión guardada al abrir la app: quién es y con qué rol.
export async function leerCuentaActual(): Promise<CuentaActual | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const usuario = data.session?.user;
  if (!usuario) return null;
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, profesion, rol')
    .eq('id', usuario.id)
    .maybeSingle();
  const tipoAcceso: TipoAcceso =
    perfil?.rol === 'invitado' || usuario.is_anonymous ? 'invitado' : 'miembro';
  return {
    tipoAcceso,
    perfil:
      tipoAcceso === 'miembro' && perfil
        ? { nombre: perfil.nombre, profesion: perfil.profesion, correo: usuario.email ?? '' }
        : null,
  };
}
