import type { ImageSourcePropType } from 'react-native';

import type { Submarca } from '@/components/marca/IconoSubmarca';

export type Evento = {
  id: string;
  submarca: Extract<Submarca, 'evento' | 'afterOffice'>;
  titulo: string;
  detalle: string;
  inicio: Date;
  foto?: ImageSourcePropType;
  // Inscriptos sin contar a la persona (que se suma si se inscribe).
  inscriptos: number;
  personas: ImageSourcePropType[];
  esDatoDePrueba?: boolean;
};

export type Efemeride = {
  id: string;
  fecha: Date;
  titulo: string;
  cita: string;
  beneficio: { antes: string; destacado: string; despues: string };
  esDatoDePrueba?: boolean;
};

export type FiltroAgenda = 'todo' | 'reservas' | 'efemerides';
