// DATOS DE PRUEBA (no reales). Carta de ejemplo para la pantalla provisional de la carta del café.
// Productos y precios a confirmar por Olegario (pendiente P-38). Flat White y Cookie de avena salen de Figma.
export type CategoriaCarta = 'cafes' | 'frios' | 'pasteleria';

export type ProductoDePrueba = {
  id: string;
  categoria: CategoriaCarta;
  nombre: string;
  descripcion: string;
  precioDeEjemplo: number;
  esDatoDePrueba: true;
};

export const productosDePrueba: ProductoDePrueba[] = [
  {
    id: 'espresso',
    categoria: 'cafes',
    nombre: 'Espresso',
    descripcion: 'Café de especialidad, extracción corta.',
    precioDeEjemplo: 2500,
    esDatoDePrueba: true,
  },
  {
    id: 'flat-white',
    categoria: 'cafes',
    nombre: 'Flat White de especialidad',
    descripcion: 'Doble espresso con leche texturizada.',
    precioDeEjemplo: 3800,
    esDatoDePrueba: true,
  },
  {
    id: 'cortado',
    categoria: 'cafes',
    nombre: 'Cortado',
    descripcion: 'Espresso con un toque de leche.',
    precioDeEjemplo: 2900,
    esDatoDePrueba: true,
  },
  {
    id: 'cold-brew',
    categoria: 'frios',
    nombre: 'Cold brew',
    descripcion: 'Café de extracción en frío, servido con hielo.',
    precioDeEjemplo: 4200,
    esDatoDePrueba: true,
  },
  {
    id: 'limonada',
    categoria: 'frios',
    nombre: 'Limonada',
    descripcion: 'Limón, menta y jengibre.',
    precioDeEjemplo: 3500,
    esDatoDePrueba: true,
  },
  {
    id: 'cookie-avena',
    categoria: 'pasteleria',
    nombre: 'Cookie casera de avena',
    descripcion: 'Horneada en el día.',
    precioDeEjemplo: 2200,
    esDatoDePrueba: true,
  },
  {
    id: 'medialuna',
    categoria: 'pasteleria',
    nombre: 'Medialuna de manteca',
    descripcion: 'Clásica, para acompañar el café.',
    precioDeEjemplo: 1500,
    esDatoDePrueba: true,
  },
];
