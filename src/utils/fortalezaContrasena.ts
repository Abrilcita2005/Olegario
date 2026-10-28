export type NivelFortaleza = 0 | 1 | 2 | 3 | 4;

export const LARGO_MINIMO_CONTRASENA = 8;

// Calcula la fortaleza de una contraseña en 4 niveles (las 4 barras del registro en Figma).
// Criterio provisional, a confirmar: largo mínimo, mayúsculas y minúsculas, números y símbolos.
export function calcularFortaleza(contrasena: string): NivelFortaleza {
  if (contrasena.length === 0) return 0;
  if (contrasena.length < LARGO_MINIMO_CONTRASENA) return 1;

  let nivel = 1;
  if (/[a-z]/.test(contrasena) && /[A-Z]/.test(contrasena)) nivel += 1;
  if (/\d/.test(contrasena)) nivel += 1;
  if (/[^A-Za-z0-9]/.test(contrasena)) nivel += 1;
  return Math.min(nivel, 4) as NivelFortaleza;
}
