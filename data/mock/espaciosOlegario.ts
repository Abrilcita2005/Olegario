import type { Espacio } from '../../src/models/espacio';

// DATOS DE PRUEBA (no reales): espacios y ocupación tomados de Figma (pantalla ESPACIOS), hasta el
// servidor (Etapa 13). Las ocupaciones son relativas al día en que se abre la app.
// Fotos provistas por la responsable (Drive, 2026-11-04).
export function espaciosDePrueba(hoy: Date = new Date()): Espacio[] {
  const a = (hora: number, minuto = 0, dias = 0) => {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + dias);
    fecha.setHours(hora, minuto, 0, 0);
    return fecha;
  };
  return [
    {
      id: 'rincon-botanico-zen',
      foto: require('../../assets/imagenes/espacios/rincon-botanico-zen.jpg'),
      servicio: 'cowork',
      nombre: 'Rincón Botánico Zen',
      tipo: 'Puesto individual',
      ubicacion: 'Ala Oeste · Nivel 1 · Frente a jardín interior',
      ambiente: ['Luz natural directa', 'Silencio alto'],
      equipamiento: ['Tomas USB-C 65W', 'Herman Miller Sayl', 'Aire purificado'],
      capacidad: 1,
      ocupaciones: [{ inicio: a(15), fin: a(18) }],
    },
    {
      id: 'mesa-luz-natural',
      foto: require('../../assets/imagenes/espacios/mesa-luz-natural.jpg'),
      servicio: 'cowork',
      nombre: 'Mesa con Luz Natural',
      tipo: 'Puesto individual',
      ubicacion: 'Sector Jardín · Puesto #14',
      ambiente: ['Luz natural directa'],
      equipamiento: ['Tomas USB-C 65W', 'WiFi 6E Mesh 500Mbps'],
      capacidad: 1,
      ocupaciones: [],
    },
    {
      id: 'mesa-comunitaria-cafe',
      foto: require('../../assets/imagenes/espacios/mesa-comunitaria-cafe.jpg'),
      servicio: 'cafe',
      nombre: 'Mesa Comunitaria Barra Cafetería',
      tipo: 'Mesa compartida',
      ubicacion: 'Planta Alta',
      ambiente: ['Murmullo alegre', 'Barra de especialidad'],
      equipamiento: ['WiFi 6E Mesh 500Mbps', 'Espresso bar libre', 'Pérgola bioclimática'],
      etiqueta: 'Comunidad',
      capacidad: 3,
      ocupaciones: [],
    },
    {
      id: 'sala-acustica-focus',
      foto: require('../../assets/imagenes/espacios/sala-acustica-focus.jpg'),
      servicio: 'stream',
      nombre: 'Sala Acústica Focus',
      tipo: 'Sala de stream y llamadas',
      ubicacion: 'Sala Central · Pods de Stream & Calls',
      ambiente: ['-32dB aislación', 'Ilum. Broadcast'],
      equipamiento: ['Cámara 4K + Brazo Elgato', 'Mic Rode PodMic'],
      capacidad: 1,
      ocupaciones: [{ inicio: a(9), fin: a(11, 30) }],
    },
  ];
}

// Horas del plan (Figma, Perfil: "42 / 80 hs"). DATO DE PRUEBA.
export const planDePrueba = { horasTotales: 80, horasUsadasPrevias: 42 };
