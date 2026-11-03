import type { TipoAcceso } from '@/services/almacenamiento';

// Qué puede hacer cada tipo de acceso (decisión de la responsable, 2026-11-03).
// Invitado: mira todo e inscribe a eventos; no reserva espacios, no usa Comunidad ni tiene perfil de cuenta.
export type Accion =
  'verContenido' | 'inscribirseEvento' | 'reservarEspacio' | 'usarComunidad' | 'verPerfilCuenta';

const PERMISOS: Record<TipoAcceso, readonly Accion[]> = {
  miembro: [
    'verContenido',
    'inscribirseEvento',
    'reservarEspacio',
    'usarComunidad',
    'verPerfilCuenta',
  ],
  invitado: ['verContenido', 'inscribirseEvento'],
};

export function puede(tipoAcceso: TipoAcceso | null, accion: Accion): boolean {
  return tipoAcceso ? PERMISOS[tipoAcceso].includes(accion) : false;
}
