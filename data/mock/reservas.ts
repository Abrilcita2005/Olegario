import type { Reserva } from '../../src/models/reserva';

// DATOS DE PRUEBA (no reales), tomados de Figma, hasta que exista el servidor (Etapa 13).
// La reserva es "hoy de 10 a 14 hs" respecto de la fecha en que se abre la app.
export function reservasDePrueba(hoy: Date = new Date()): Reserva[] {
  const a = (hora: number) => {
    const fecha = new Date(hoy);
    fecha.setHours(hora, 0, 0, 0);
    return fecha;
  };
  return [
    {
      id: 'reserva-prueba-1',
      servicio: 'cowork',
      tipo: 'Puesto individual',
      espacio: 'Mesa con Luz Natural',
      ubicacion: 'Sector Jardín · Puesto #14',
      inicio: a(10),
      fin: a(14),
    },
  ];
}
