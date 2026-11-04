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

// Efeméride del calendario anual (se repite cada año el mismo día).
export type EfemerideAnual = {
  id: string;
  mes: number; // 1 a 12
  dia: number;
  titulo: string;
  texto: string;
  // Beneficio opcional (lo define Olegario; no se inventa).
  beneficio?: { antes: string; destacado: string; despues: string };
};

// Efeméride ubicada en una fecha concreta para mostrar en la Agenda.
export type Efemeride = EfemerideAnual & { fecha: Date };

export type FiltroAgenda = 'todo' | 'reservas' | 'efemerides';
