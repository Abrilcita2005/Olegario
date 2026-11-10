import type { ImageSourcePropType } from 'react-native';

// Fotos que vienen con la app (provistas por la responsable, Drive, 2026-11-04), por id del espacio o
// del evento. Se usan cuando el servidor todavía no tiene foto cargada (foto_url vacío).
export const fotosDeEspacios: Record<string, ImageSourcePropType> = {
  'rincon-botanico-zen': require('../assets/imagenes/espacios/rincon-botanico-zen.jpg'),
  'mesa-luz-natural': require('../assets/imagenes/espacios/mesa-luz-natural.jpg'),
  'mesa-comunitaria-cafe': require('../assets/imagenes/espacios/mesa-comunitaria-cafe.jpg'),
  'sala-acustica-focus': require('../assets/imagenes/espacios/sala-acustica-focus.jpg'),
};

export const fotosDeEventos: Record<string, ImageSourcePropType> = {
  'evento-storytelling': require('../assets/imagenes/eventos/storytelling-emprendedores.jpg'),
  'evento-sunset-beats': require('../assets/imagenes/eventos/sunset-beats-vinyl.jpg'),
};
