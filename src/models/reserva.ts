import type { Submarca } from '@/components/marca/IconoSubmarca';

export type Reserva = {
  id: string;
  espacioId: string;
  servicio: Submarca;
  tipo: string;
  espacio: string;
  ubicacion: string;
  inicio: Date;
  fin: Date;
  cancelada?: boolean;
  // true en las reservas de ejemplo de Figma (no creadas por la persona).
  esDatoDePrueba?: boolean;
};

export type EstadoReserva = 'proxima' | 'enCurso' | 'finalizada';
