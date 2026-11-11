import type { Evento, EventoDetalle } from '../../src/models/agenda';

// DATOS DE PRUEBA (no reales): eventos de Figma (pantalla AGENDA), relativos al día en que se
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
      // Texto de EJEMPLO para la pantalla de detalle (igual que servidor/db/04_descripcion_eventos.sql).
      descripcion:
        'Un taller práctico para contar tu proyecto en pocos minutos: cómo armar una historia que enganche, qué mostrar en una presentación y cómo adaptar el mensaje a cada público. Traé tu idea: trabajamos en grupos chicos y con devoluciones en el momento.',
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
      descripcion:
        'Cerramos la semana en la terraza con un DJ set de vinilos al atardecer. Música, buena charla y algo rico de OLE/CAFÉ para conocer a otras personas de la comunidad.',
      inicio: a(hoy, 2, 18, 30),
      foto: require('../../assets/imagenes/eventos/sunset-beats-vinyl.jpg'),
      inscriptos: 14,
      personas: personas.slice(3, 6),
      esDatoDePrueba: true,
    },
  ];
}

// Detalle del coworkeo itinerante (novedad con inscripción). DATO DE EJEMPLO, como el de la novedad.
export function coworkeoItineranteDePrueba(hoy: Date = new Date()): EventoDetalle {
  return {
    id: 'coworkeo-itinerante',
    etiqueta: 'OLE / Itinerante',
    titulo: 'Coworkeo itinerante',
    detalle: '¡Viajá con Olegario y conocé personas y lugares nuevos!',
    descripcion:
      'Una jornada de trabajo fuera de Olegario: viajamos en grupo a un lugar distinto de Mendoza, armamos la oficina por un día y cerramos con un almuerzo compartido. Ideal para cambiar de aire y conocer gente nueva.',
    inicio: a(hoy, 7, 9),
    foto: require('../../assets/imagenes/novedades/coworkeo-itinerante.jpg'),
    inscriptos: 7,
  };
}
