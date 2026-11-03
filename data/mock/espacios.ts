import type { Submarca } from '../../src/components/marca/IconoSubmarca';

// DATOS DE PRUEBA (no reales): disponibilidad de los servicios del Home, tomada de Figma.
export type ServicioDePrueba = {
  submarca: Submarca;
  nombre: string;
  disponibilidad: string;
  esDatoDePrueba: true;
};

export const serviciosHomeDePrueba: ServicioDePrueba[] = [
  {
    submarca: 'cowork',
    nombre: 'OLE/COWORK',
    disponibilidad: '4 Puestos Libres',
    esDatoDePrueba: true,
  },
  {
    submarca: 'stream',
    nombre: 'OLE/STREAM',
    disponibilidad: '2 Salas Disponibles',
    esDatoDePrueba: true,
  },
  {
    submarca: 'network',
    nombre: 'OLE/NETWORK',
    disponibilidad: 'Mesa Abierta',
    esDatoDePrueba: true,
  },
];
