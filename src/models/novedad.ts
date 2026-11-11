import type { ImageSourcePropType } from 'react-native';

// Novedad del panel "Pulso de Olegario" (Figma: NOVEDADES).
export type Novedad = {
  id: string;
  foto?: ImageSourcePropType;
  descuento?: string;
  titulo: string;
  texto: string;
  // "carta": abre la carta del café · "inscripcion": inscribe al evento `eventoId` (o a `id`).
  accion: { texto: string; tipo: 'carta' | 'inscripcion' };
  eventoId?: string;
  // Personas ya inscriptas sin contar a la persona: iniciales (solo en los datos de prueba) y cuántas más.
  participantes?: { iniciales: string[]; mas: number };
};
