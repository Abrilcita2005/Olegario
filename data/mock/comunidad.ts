import type { Persona, Publicacion, Taller } from '../../src/models/comunidad';

// DATOS DE PRUEBA (no reales): textos de Figma (pantallas COMUNIDAD y PERFIL PÚBLICO) hasta el servidor
// (Etapa 13). Las fotos son de personas ficticias provistas por la responsable (Drive, 2026-11-04);
// la de Martina Rossi es la de la referencia de Figma que pasó la responsable.
// Solo se cargan los datos que están en Figma: no se inventa información de las personas.

export const personasDePrueba: Persona[] = [
  {
    id: 'lucas-benitez',
    nombre: 'Lucas Benítez',
    profesion: 'Tech Lead',
    foto: require('../../assets/imagenes/personas/persona-4.jpg'),
    portada: require('../../assets/imagenes/personas/portada-lucas-benitez.jpg'),
    ubicacion: 'Cowork Mesa 04',
  },
  {
    id: 'martina-rossi',
    nombre: 'Martina Rossi',
    profesion: 'Diseñadora UI/UX & Brand Strategy Freelance',
    foto: require('../../assets/imagenes/personas/martina-rossi.jpg'),
    portada: require('../../assets/imagenes/personas/portada-martina-rossi.jpg'),
    ubicacion: 'En Ole/Café ahora · Mesa 12',
    sobreMi:
      'Apasionada por crear interfaces elegantes y estrategias de marca que dejen huella. Combino diseño visual sofisticado con investigación de usuario. Buscando siempre nuevos desafíos y colaboradores interesantes en Olegario.',
  },
  {
    id: 'gonzalo-vera',
    nombre: 'Gonzalo Vera',
    profesion: '',
    foto: require('../../assets/imagenes/personas/persona-6.jpg'),
    portada: require('../../assets/imagenes/personas/portada-gonzalo-vera.jpg'),
  },
  {
    id: 'clara-mendez',
    nombre: 'Clara Méndez',
    profesion: 'Desarrolladora Fullstack',
    foto: require('../../assets/imagenes/personas/persona-3.jpg'),
    portada: require('../../assets/imagenes/personas/portada-clara-mendez.jpg'),
    disponible: true,
    ofrezco: 'Asesoría técnica en arquitectura web, integración de pagos y APIs escalables.',
    busco: 'Aprender branding, validación comercial y diseño de producto para ideas SaaS.',
  },
];

export const publicacionesDePrueba: Publicacion[] = [
  {
    id: 'ecotrack',
    tipo: 'colaborador',
    busca: 'Diseñador/a UI/UX',
    titulo: 'EcoTrack: App de impacto y huella de carbono',
    descripcion:
      'Buscamos partner para diseñar flujos de onboarding y dashboard ambiental antes del pitch a inversores.',
    etiquetas: ['Figma', 'Design Systems', 'Mobile UX'],
    autores: [{ personaId: 'lucas-benitez', nombre: 'Lucas Benítez' }],
    rolAutor: 'Tech Lead',
    lugar: 'Cowork Mesa 04',
    actividad: 'Activo hoy',
    accion: 'Quiero aportar / postularme',
    conDetalle: true,
    esDatoDePrueba: true,
  },
  {
    id: 'estudio-circular',
    tipo: 'colaborador',
    busca: 'Productor de Contenido y Audio',
    titulo: 'Estudio Circular: Podcast de Negocios Creativos',
    descripcion:
      'Grabamos en Ole/Stream los martes. Buscamos alguien con experiencia en guión o postproducción.',
    etiquetas: ['Audio Editing', 'Storytelling', 'Ole/Stream'],
    autores: [
      { personaId: 'martina-rossi', nombre: 'Martina Rossi' },
      { personaId: 'gonzalo-vera', nombre: 'Gonzalo Vera' },
    ],
    lugar: 'Ole/Stream',
    actividad: '',
    accion: 'Me interesa colaborar',
    esDatoDePrueba: true,
  },
  {
    id: 'cafe-sostenible',
    tipo: 'iniciativa',
    titulo: 'Lanzamiento de Marca de Café Sostenible',
    descripcion:
      'Mesa redonda de testing sensorial y packaging feedback abierta a todos los coworkers este viernes.',
    etiquetas: [],
    autores: [{ nombre: 'Comunidad Olegario' }],
    lugar: 'Terraza / Cafetería',
    actividad: 'Este viernes',
    accion: 'Sumarme al equipo de testing',
    esDatoDePrueba: true,
  },
];

export const talleresDePrueba: Taller[] = [
  {
    id: 'club-lectura',
    tipo: 'Grupo de interés',
    cuando: 'Miércoles · 18:30 hs',
    titulo: 'Club de Lectura Tech & Diseño',
    descripcion:
      'Espacio quincenal para debatir ensayos de diseño, sistemas complejos e IA aplicada al trabajo independiente.',
    accion: 'Sumarse',
    esDatoDePrueba: true,
  },
  {
    id: 'debate-no-code',
    tipo: 'Workshop co-aprendizaje',
    cuando: 'Jueves · 17:00 hs',
    titulo: 'Mesa de Debate No-Code & Automatización',
    descripcion:
      'Mostramos flujos de trabajo reales con Make, Airtable y Supabase creados por coworkers de la comunidad.',
    accion: 'Últimos cupos disponibles',
    esDatoDePrueba: true,
  },
];
