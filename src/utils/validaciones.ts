import { LARGO_MINIMO_CONTRASENA } from './fortalezaContrasena';

// Validaciones de los formularios de acceso. Devuelven el mensaje de error o null si el dato es válido.
// Son funciones puras (con pruebas). El servidor repetirá estas validaciones cuando exista (Etapa 13).

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarNombre(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return 'Ingresá tu nombre completo.';
  if (limpio.length < 2) return 'El nombre es demasiado corto.';
  if (limpio.length > 80) return 'Usá como máximo 80 caracteres.';
  return null;
}

export function validarCorreo(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return 'Ingresá tu correo.';
  if (!PATRON_CORREO.test(limpio))
    return 'Ingresá un correo válido, por ejemplo nombre@estudio.com.';
  return null;
}

export function validarProfesion(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return 'Contanos tu profesión o área de trabajo.';
  if (limpio.length > 80) return 'Usá como máximo 80 caracteres.';
  return null;
}

export function validarContrasenaNueva(valor: string): string | null {
  if (!valor) return 'Creá una contraseña.';
  if (valor.length < LARGO_MINIMO_CONTRASENA)
    return `La contraseña necesita al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`;
  return null;
}

export function validarUsuarioOCorreo(valor: string): string | null {
  return valor.trim() ? null : 'Ingresá tu email o usuario.';
}

export function validarContrasenaIngreso(valor: string): string | null {
  return valor ? null : 'Ingresá tu contraseña.';
}

export type DatosRegistro = {
  nombre: string;
  correo: string;
  profesion: string;
  contrasena: string;
  aceptaTerminos: boolean;
};

export type ErroresRegistro = Partial<Record<keyof DatosRegistro, string>>;

export function validarRegistro(datos: DatosRegistro): ErroresRegistro {
  const errores: ErroresRegistro = {};
  const nombre = validarNombre(datos.nombre);
  const correo = validarCorreo(datos.correo);
  const profesion = validarProfesion(datos.profesion);
  const contrasena = validarContrasenaNueva(datos.contrasena);
  if (nombre) errores.nombre = nombre;
  if (correo) errores.correo = correo;
  if (profesion) errores.profesion = profesion;
  if (contrasena) errores.contrasena = contrasena;
  if (!datos.aceptaTerminos)
    errores.aceptaTerminos = 'Para continuar, aceptá los términos de convivencia.';
  return errores;
}
