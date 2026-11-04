import type { Efemeride, Evento } from '../../src/models/agenda';

// DATOS DE PRUEBA (no reales): eventos y efeméride de Figma (pantalla AGENDA), relativos al día en que se
// abre la app, hasta el servidor (Etapa 13). Fotos de eventos y personas provistas por la responsable
// (Drive, 2026-11-04); las personas son ficticias.
const personas = [
  require('../../assets/imagenes/personas/persona-1.jpg'),
  require('../../assets/imagenes/personas/persona-2.jpg'),
  require('../../assets/imagenes/personas/persona-3.jpg'),
  require('../../assets/imagenes/personas/persona-4.jpg'),
  require('../../assets/imagenes/personas/persona-5.jpg'),
  require('../../assets/imagenes/personas/persona-6.jpg'),
];

function a(hoy: Date, dias: number, hora: number, minuto = 0): Date {
  const fecha = new Date(hoy);
  fecha.setDate(fecha.getDate() + dias);
  fecha.setHours(hora, minuto, 0, 0);
  return fecha;
}

export function eventosDePrueba(hoy: Date = new Date()): Evento[] {
  return [
    {
      id: 'evento-storytelling',
      submarca: 'evento',
      titulo: 'Storytelling para Emprendedores',
      detalle: 'Disertante: Sofía Valenzuela · Sala Principal',
      inicio: a(hoy, 1, 17),
      foto: require('../../assets/imagenes/eventos/storytelling-emprendedores.jpg'),
      inscriptos: 14,
      personas: personas.slice(0, 3),
      esDatoDePrueba: true,
    },
    {
      id: 'evento-sunset-beats',
      submarca: 'afterOffice',
      titulo: 'Sunset Beats & Vinyl Session',
      detalle: 'Terraza Abierta Olegario · DJ Set en vivo',
      inicio: a(hoy, 2, 18, 30),
      foto: require('../../assets/imagenes/eventos/sunset-beats-vinyl.jpg'),
      inscriptos: 14,
      personas: personas.slice(3, 6),
      esDatoDePrueba: true,
    },
  ];
}

export function efemeridesDePrueba(hoy: Date = new Date()): Efemeride[] {
  return [
    {
      id: 'efemeride-diseno-grafico',
      fecha: a(hoy, 0, 0),
      titulo: 'Día mundial del diseño gráfico',
      cita: '“Celebrar el impacto visual que transforma ideas en proyectos reales. Los trazos que inspiran y las marcas que dejan huella indeleble.”',
      beneficio: {
        antes: 'Mostrá este pase y pedí tu ',
        destacado: 'Flat White',
        despues: ' de especialidad de regalo.',
      },
      esDatoDePrueba: true,
    },
  ];
}
