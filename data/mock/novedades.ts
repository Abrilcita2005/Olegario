import type { ImageSourcePropType } from 'react-native';

// DATOS DE PRUEBA (no reales): novedades de Figma (pantalla NOVEDADES) hasta el servidor (Etapa 13).
// Fotos provistas por la responsable (Drive, 2026-11-04). Textos con las correcciones aprobadas:
// "Cookie casera de chocolate" (P-41), tildes y voseo ("Viajá", "conocé", "Últimos").
export type NovedadDePrueba = {
  id: string;
  foto: ImageSourcePropType;
  descuento?: string;
  titulo: string;
  texto: string;
  // "carta": abre la carta del café · "inscripcion": inscribirse (simulado, como los eventos).
  accion: { texto: string; tipo: 'carta' | 'inscripcion' };
  // Personas ya inscriptas (iniciales de Figma) y cuántas más hay.
  participantes?: { iniciales: string[]; mas: number };
  esDatoDePrueba: true;
};

export const novedadesDePrueba: NovedadDePrueba[] = [
  {
    id: 'promo-cafeteria',
    foto: require('../../assets/imagenes/novedades/promo-cafeteria.jpg'),
    descuento: '20% OFF',
    titulo: 'Promo cafetería',
    texto: 'Flat White de especialidad + Cookie casera de chocolate',
    accion: { texto: 'Pedir al barista', tipo: 'carta' },
    esDatoDePrueba: true,
  },
  {
    id: 'coworkeo-itinerante',
    foto: require('../../assets/imagenes/novedades/coworkeo-itinerante.jpg'),
    descuento: '20% OFF',
    titulo: 'Coworkeo itinerante',
    texto: '¡Viajá con Olegario y conocé personas y lugares nuevos!',
    accion: { texto: 'Últimos cupos', tipo: 'inscripcion' },
    participantes: { iniciales: ['MG', 'LR'], mas: 5 },
    esDatoDePrueba: true,
  },
];
