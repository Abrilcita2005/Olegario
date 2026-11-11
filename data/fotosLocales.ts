import type { ImageSourcePropType } from 'react-native';

// Fotos que vienen con la app (provistas por la responsable, Drive, 2026-11-04), por id del espacio o
// del evento. Se usan cuando el servidor todavía no tiene foto cargada (foto_url vacío).
export const fotosDeEspacios: Record<string, ImageSourcePropType> = {
  'rincon-botanico-zen': require('../assets/imagenes/espacios/rincon-botanico-zen.jpg'),
  'mesa-luz-natural': require('../assets/imagenes/espacios/mesa-luz-natural.jpg'),
  'mesa-comunitaria-cafe': require('../assets/imagenes/espacios/mesa-comunitaria-cafe.jpg'),
  'sala-acustica-focus': require('../assets/imagenes/espacios/sala-acustica-focus.jpg'),
  // Espacios reales del plano (D-73): maquetas 3D del proyecto olegario-reservas. Los 13 puestos
  // comparten la imagen del cowork.
  ...Object.fromEntries(
    Array.from({ length: 13 }, (_, i) => [
      `puesto-${i + 1}`,
      require('../assets/imagenes/espacios-plano/cowork.webp'),
    ]),
  ),
  'cubiculo-1': require('../assets/imagenes/espacios-plano/cubiculo-1.webp'),
  'cubiculo-2': require('../assets/imagenes/espacios-plano/cubiculo-2.webp'),
  'streaming-1': require('../assets/imagenes/espacios-plano/streaming-1.webp'),
  'streaming-2': require('../assets/imagenes/espacios-plano/streaming-2.webp'),
  'streaming-3': require('../assets/imagenes/espacios-plano/streaming-3.webp'),
  fotografia: require('../assets/imagenes/espacios-plano/fotografia.webp'),
  reunion: require('../assets/imagenes/espacios-plano/reunion.webp'),
  eventos: require('../assets/imagenes/espacios-plano/eventos.webp'),
};

export const fotosDeEventos: Record<string, ImageSourcePropType> = {
  'evento-storytelling': require('../assets/imagenes/eventos/storytelling-emprendedores.jpg'),
  'evento-sunset-beats': require('../assets/imagenes/eventos/sunset-beats-vinyl.jpg'),
};
