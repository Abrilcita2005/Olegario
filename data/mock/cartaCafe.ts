// DATOS DE PRUEBA (no reales). Carta de ejemplo para la pantalla provisional de la carta del café.
// Productos y precios a confirmar por Olegario (pendiente P-38). Flat White y Cookie de avena salen de Figma.
import type { Ilustracion } from '../../src/components/ilustraciones/IlustracionProducto';

export type CategoriaCarta = 'cafes' | 'frios' | 'pasteleria';

export type EtiquetaProducto = 'vegano' | 'sinTacc' | 'sinLactosa';

export type ProductoDePrueba = {
  id: string;
  categoria: CategoriaCarta;
  nombre: string;
  descripcion: string;
  precioDeEjemplo: number;
  etiquetas: EtiquetaProducto[];
  // Sin fotos reales todavía: se muestra una ilustración del producto (pendiente P-40).
  ilustracion: Ilustracion;
  esDatoDePrueba: true;
};

export const productosDePrueba: ProductoDePrueba[] = [
  {
    id: 'espresso',
    categoria: 'cafes',
    nombre: 'Espresso',
    descripcion: 'Café de especialidad, extracción corta.',
    precioDeEjemplo: 2500,
    etiquetas: ['vegano', 'sinTacc'],
    ilustracion: 'espresso',
    esDatoDePrueba: true,
  },
  {
    id: 'flat-white',
    categoria: 'cafes',
    nombre: 'Flat White de especialidad',
    descripcion: 'Doble espresso con leche texturizada.',
    precioDeEjemplo: 3800,
    etiquetas: ['sinTacc'],
    ilustracion: 'flatWhite',
    esDatoDePrueba: true,
  },
  {
    id: 'cortado',
    categoria: 'cafes',
    nombre: 'Cortado',
    descripcion: 'Espresso con un toque de leche.',
    precioDeEjemplo: 2900,
    etiquetas: ['sinTacc'],
    ilustracion: 'cortado',
    esDatoDePrueba: true,
  },
  {
    id: 'cold-brew',
    categoria: 'frios',
    nombre: 'Cold brew',
    descripcion: 'Café de extracción en frío, servido con hielo.',
    precioDeEjemplo: 4200,
    etiquetas: ['vegano', 'sinTacc'],
    ilustracion: 'coldBrew',
    esDatoDePrueba: true,
  },
  {
    id: 'limonada',
    categoria: 'frios',
    nombre: 'Limonada',
    descripcion: 'Limón, menta y jengibre.',
    precioDeEjemplo: 3500,
    etiquetas: ['vegano', 'sinTacc'],
    ilustracion: 'limonada',
    esDatoDePrueba: true,
  },
  {
    id: 'cookie-avena',
    categoria: 'pasteleria',
    nombre: 'Cookie casera de avena',
    descripcion: 'Horneada en el día.',
    precioDeEjemplo: 2200,
    etiquetas: [],
    ilustracion: 'cookie',
    esDatoDePrueba: true,
  },
  {
    id: 'medialuna',
    categoria: 'pasteleria',
    nombre: 'Medialuna de manteca',
    descripcion: 'Clásica, para acompañar el café.',
    precioDeEjemplo: 1500,
    etiquetas: [],
    ilustracion: 'medialuna',
    esDatoDePrueba: true,
  },
];
