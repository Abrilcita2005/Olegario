// Colores de Olegario en Movimiento. Única fuente de colores de la app: no usar valores sueltos en los componentes.
// Marca: valores de los SVG originales (decisión 2026-10-28). Neutros: tomados de las pantallas de Figma.

export const marca = {
  rosa: '#FE016D',
  naranja: '#F83B11',
  lima: '#CAF22C',
  negro: '#262020',
  grisLogo: '#E6E6E6',
} as const;

export const colores = {
  // Fondos
  fondo: '#DCDCDC',
  fondoOscuro: marca.negro,

  // Superficies (tarjetas, campos, barra inferior)
  superficie: marca.negro,
  superficieElevada: '#353439',
  superficieMiniatura: '#272732',

  // Texto
  textoSobreClaro: marca.negro,
  textoSobreOscuro: '#FFFFFF',
  textoSobreOscuroSuave: '#E4E1E7',
  textoSecundario: '#D4D4D8',
  textoTerciario: '#A1A1AA',
  textoBoton: '#FFFAF9',

  // Acentos
  acento: marca.rosa,
  acentoNaranja: marca.naranja,
  acentoLima: marca.lima,

  // Botón "Siguiente" claro (bienvenidas)
  botonClaro: '#D9D9D9',

  // Bordes y divisores
  divisorSobreOscuro: 'rgba(255, 255, 255, 0.1)',
  bordeAcento: 'rgba(254, 1, 109, 0.4)',
  fondoChipAcento: 'rgba(254, 1, 109, 0.2)',

  // Estados (provisionales hasta que haya diseño: ver docs/DISENO.md §C.10)
  error: marca.rosa,
  exito: marca.lima,
  advertencia: marca.naranja,

  // Fondo semitransparente detrás de menús y paneles
  velo: 'rgba(38, 32, 32, 0.5)',

  transparente: 'transparent',
} as const;

// Degradados: listas de colores + posiciones (0 a 1) para expo-linear-gradient y react-native-svg.
export const degradados = {
  marca: { colores: [marca.rosa, marca.naranja, marca.lima], posiciones: [0, 0.52, 1] },
  accion: { colores: [marca.naranja, marca.rosa], posiciones: [0, 1] },
  acento: { colores: [marca.rosa, marca.naranja], posiciones: [0, 1] },
} as const;

export type NombreColor = keyof typeof colores;
