import type { Submarca } from '@/components/marca/IconoSubmarca';

export type Reserva = {
  id: string;
  servicio: Submarca;
  tipo: string;
  espacio: string;
  ubicacion: string;
  inicio: Date;
  fin: Date;
};

export type EstadoReserva = 'proxima' | 'enCurso' | 'finalizada';
