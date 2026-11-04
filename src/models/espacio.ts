import type { Submarca } from '@/components/marca/IconoSubmarca';

export type Ocupacion = { inicio: Date; fin: Date };

export type Espacio = {
  id: string;
  servicio: Submarca;
  nombre: string;
  tipo: string;
  ubicacion: string;
  ambiente: string[];
  equipamiento: string[];
  etiqueta?: string;
  // Cantidad de lugares (puestos) que se pueden reservar a la vez.
  capacidad: number;
  ocupaciones: Ocupacion[];
};
