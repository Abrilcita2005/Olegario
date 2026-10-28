// DATOS DE PRUEBA (no reales). Contenido de ejemplo tomado de Figma hasta que exista el backend (Etapa 13).
export type NovedadDePrueba = {
  id: string;
  titulo: string;
  leida: boolean;
  esDatoDePrueba: true;
};

export const novedadesDePrueba: NovedadDePrueba[] = [
  { id: 'promo-cafeteria', titulo: 'Promo cafetería', leida: false, esDatoDePrueba: true },
  { id: 'coworkeo-itinerante', titulo: 'Coworkeo itinerante', leida: false, esDatoDePrueba: true },
];
