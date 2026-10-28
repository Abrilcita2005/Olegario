// DATOS DE PRUEBA (no reales). Carta de ejemplo para la pantalla provisional de la carta del café.
// Productos y precios a confirmar por Olegario (pendiente P-38). Fotos: provistas por la responsable.

export const fotoPromoCafeteria: ImageSourcePropType = require('../../assets/imagenes/carta/promo-flat-white-cookie.jpg');
import type { ImageSourcePropType } from 'react-native';

export type CategoriaCarta = 'cafes' | 'frios' | 'pasteleria';

export type EtiquetaProducto = 'vegano' | 'sinTacc' | 'sinLactosa';

export type ProductoDePrueba = {
  id: string;
  categoria: CategoriaCarta;
  nombre: string;
  descripcion: string;
  precioDeEjemplo: number;
  etiquetas: EtiquetaProducto[];
  // Fotos de producto provistas por la responsable (assets/imagenes/carta, 360×360).
  foto: ImageSourcePropType;
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
    foto: require('../../assets/imagenes/carta/espresso.jpg'),
    esDatoDePrueba: true,
  },
  {
    id: 'flat-white',
    categoria: 'cafes',
    nombre: 'Flat White de especialidad',
    descripcion: 'Doble espresso con leche texturizada.',
    precioDeEjemplo: 3800,
    etiquetas: ['sinTacc'],
    foto: require('../../assets/imagenes/carta/flat-white.jpg'),
    esDatoDePrueba: true,
  },
  {
    id: 'cortado',
    categoria: 'cafes',
    nombre: 'Cortado',
    descripcion: 'Espresso con un toque de leche.',
    precioDeEjemplo: 2900,
    etiquetas: ['sinTacc'],
    foto: require('../../assets/imagenes/carta/cortado.jpg'),
    esDatoDePrueba: true,
  },
  {
    id: 'cold-brew',
    categoria: 'frios',
    nombre: 'Cold brew',
    descripcion: 'Café de extracción en frío, servido con hielo.',
    precioDeEjemplo: 4200,
    etiquetas: ['vegano', 'sinTacc'],
    foto: require('../../assets/imagenes/carta/cold-brew.jpg'),
    esDatoDePrueba: true,
  },
  {
    id: 'limonada',
    categoria: 'frios',
    nombre: 'Limonada',
    descripcion: 'Limón, menta y jengibre.',
    precioDeEjemplo: 3500,
    etiquetas: ['vegano', 'sinTacc'],
    foto: require('../../assets/imagenes/carta/limonada.jpg'),
    esDatoDePrueba: true,
  },
  {
    id: 'cookie-chocolate',
    categoria: 'pasteleria',
    nombre: 'Cookie de chocolate',
    descripcion: 'Horneada en el día.',
    precioDeEjemplo: 2200,
    etiquetas: [],
    foto: require('../../assets/imagenes/carta/cookie-chocolate.jpg'),
    esDatoDePrueba: true,
  },
  {
    id: 'medialuna',
    categoria: 'pasteleria',
    nombre: 'Medialuna de manteca',
    descripcion: 'Clásica, para acompañar el café.',
    precioDeEjemplo: 1500,
    etiquetas: [],
    foto: require('../../assets/imagenes/carta/medialuna.jpg'),
    esDatoDePrueba: true,
  },
];
