import type { Submarca } from '@/components/marca/IconoSubmarca';
import type { Espacio } from '@/models/espacio';

export const SERVICIOS: Submarca[] = ['cowork', 'stream', 'cafe', 'network'];

export const NOMBRE_SERVICIO: Record<Submarca, string> = {
  cowork: 'OLE/COWORK',
  stream: 'OLE/STREAM',
  network: 'OLE/NETWORK',
  cafe: 'OLE/CAFÉ',
};

export function esServicio(valor: unknown): valor is Submarca {
  return typeof valor === 'string' && (SERVICIOS as string[]).includes(valor);
}

// Minúsculas y sin tildes, para que "cafeteria" encuentre "Cafetería".
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function filtrarEspacios(
  espacios: Espacio[],
  servicio: Submarca | null,
  busqueda: string,
): Espacio[] {
  const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
  return espacios.filter((espacio) => {
    if (servicio && espacio.servicio !== servicio) return false;
    const texto = normalizar(
      [
        espacio.nombre,
        espacio.tipo,
        espacio.ubicacion,
        NOMBRE_SERVICIO[espacio.servicio],
        espacio.etiqueta ?? '',
        ...espacio.ambiente,
        ...espacio.equipamiento,
      ].join(' '),
    );
    return palabras.every((palabra) => texto.includes(palabra));
  });
}
