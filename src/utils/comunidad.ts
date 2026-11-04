import type { TipoPublicacion } from '@/models/comunidad';

export type DatosPublicacion = {
  tipo: TipoPublicacion;
  busca: string;
  titulo: string;
  descripcion: string;
  etiquetas: string;
};

export type ErroresPublicacion = Partial<Record<'busca' | 'titulo' | 'descripcion', string>>;

export const LARGO_MAXIMO_TITULO = 80;
export const LARGO_MAXIMO_DESCRIPCION = 400;
export const MAXIMO_ETIQUETAS = 5;

export function validarPublicacion(datos: DatosPublicacion): ErroresPublicacion {
  const errores: ErroresPublicacion = {};
  if (datos.tipo === 'colaborador' && !datos.busca.trim())
    errores.busca = 'Contá qué perfil buscás (por ejemplo, Diseñador/a UI/UX).';
  if (datos.titulo.trim().length < 5)
    errores.titulo = 'Escribí un título de al menos 5 caracteres.';
  if (datos.descripcion.trim().length < 20)
    errores.descripcion = 'Describí tu proyecto en al menos 20 caracteres.';
  return errores;
}

// "Figma, Mobile UX ,  , Figma" → ["Figma", "Mobile UX"] (sin vacías ni repetidas, hasta 5).
export function separarEtiquetas(texto: string): string[] {
  const vistas = new Set<string>();
  const resultado: string[] = [];
  for (const parte of texto.split(',')) {
    const etiqueta = parte.trim();
    const clave = etiqueta.toLowerCase();
    if (etiqueta && !vistas.has(clave)) {
      vistas.add(clave);
      resultado.push(etiqueta);
    }
  }
  return resultado.slice(0, MAXIMO_ETIQUETAS);
}
