// Escala de espacios, radios y sombras medidos en Figma (docs/DISENO.md §C.4 y §C.5).

export const espacio = {
  xxs: 2,
  xs: 4,
  s: 6,
  m: 8,
  l: 10,
  xl: 12,
  xxl: 14,
  base: 16,
  grande: 24,
  margenPantalla: 30,
  margenPantallaAmplio: 32,
} as const;

export const radios = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 14,
  xxl: 16,
  pastilla: 9999,
} as const;

// Área táctil mínima recomendada (iOS 44 pt).
export const AREA_TACTIL_MINIMA = 44;

export const sombras = {
  accion: {
    shadowColor: '#FE016D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  tarjeta: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  sutil: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
} as const;
