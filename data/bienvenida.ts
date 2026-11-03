import type { FotoMazo } from '../src/components/bienvenida/MazoFotos';

// Fotos de la Bienvenida 2 (provistas por la responsable) con la posición y rotación de Figma
// (frame de 402 px; coordenadas relativas al área del collage, que empieza 120 px más abajo).
export const fotosCollage: FotoMazo[] = [
  {
    fuente: require('../assets/imagenes/bienvenida/collage-2.jpg'),
    descripcion: 'Vista desde arriba de un espacio de trabajo compartido',
    centroX: 123.5,
    centroY: 151.5,
    rotacion: -11.67,
  },
  {
    fuente: require('../assets/imagenes/bienvenida/collage-4.jpg'),
    descripcion: 'Estudio luminoso preparado para un evento',
    centroX: 264.5,
    centroY: 125.9,
    rotacion: 27.32,
  },
  {
    fuente: require('../assets/imagenes/bienvenida/collage-5.jpg'),
    descripcion: 'Sala con luz cálida y público sentado',
    centroX: 194.3,
    centroY: 182.4,
    rotacion: 2.29,
  },
  {
    fuente: require('../assets/imagenes/bienvenida/collage-3.jpg'),
    descripcion: 'Personas charlando en un living',
    centroX: 126.8,
    centroY: 247.8,
    rotacion: -14.16,
  },
  {
    fuente: require('../assets/imagenes/bienvenida/collage-1.jpg'),
    descripcion: 'Terraza con gente conversando',
    centroX: 267.2,
    centroY: 262.4,
    rotacion: 21.99,
  },
];

export const fotoEvento = require('../assets/imagenes/bienvenida/evento.jpg');
