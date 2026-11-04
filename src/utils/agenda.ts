import type { Efemeride, Evento } from '@/models/agenda';
import type { Reserva } from '@/models/reserva';
import type { NombreColor } from '@/theme';

import { horaTexto, mismoDia } from './fechas';

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// PIN de acceso de PRUEBA (P-07): 4 cifras que salen siempre igual del id de la reserva. No abre nada.
export function pinDeReserva(id: string): string {
  let hash = 7;
  for (const letra of id) hash = (hash * 31 + letra.charCodeAt(0)) % 9000;
  return String(1000 + hash);
}

// "En 45 min", "En 2 h", "Mañana", "En curso" (Figma: "En 45 min").
export function textoFaltante(reserva: Reserva, ahora: Date): string {
  if (ahora >= reserva.fin) return 'Finalizada';
  if (ahora >= reserva.inicio) return 'En curso';
  const minutos = Math.round((reserva.inicio.getTime() - ahora.getTime()) / 60_000);
  if (minutos < 60) return `En ${minutos} min`;
  if (mismoDia(reserva.inicio, ahora)) return `En ${Math.floor(minutos / 60)} h`;
  const manana = new Date(ahora);
  manana.setDate(ahora.getDate() + 1);
  if (mismoDia(reserva.inicio, manana)) return 'Mañana';
  return `${DIAS[reserva.inicio.getDay()]} ${reserva.inicio.getDate()}`;
}

// "Jue 22 · 17:00 hs" (Figma).
export function fechaEvento(evento: Evento): string {
  return `${DIAS[evento.inicio.getDay()]} ${evento.inicio.getDate()} · ${horaTexto(evento.inicio)} hs`;
}

// "21 DE MAYO" (Figma; el estilo lo pasa a mayúsculas).
export function fechaEfemeride(efemeride: Efemeride): string {
  return `${efemeride.fecha.getDate()} de ${MESES[efemeride.fecha.getMonth()]}`;
}

// Puntos bajo los días (respuesta de la responsable, 2026-11-04: "indican que tenés una reserva, de algún
// tipo, o un evento"). Colores como en Figma: reserva naranja, evento lima, after office rosa.
export type MarcaDia = { dia: Date; color: NombreColor; descripcion: string };

export function marcasDeActividad(reservas: Reserva[], eventos: Evento[]): MarcaDia[] {
  return [
    ...reservas.map((r) => ({
      dia: r.inicio,
      color: 'acentoNaranja' as const,
      descripcion: 'tenés una reserva',
    })),
    ...eventos.map((e) => ({
      dia: e.inicio,
      color: e.submarca === 'evento' ? ('acentoLima' as const) : ('acento' as const),
      descripcion: 'hay un evento',
    })),
  ];
}

export function delDia<T>(items: T[], dia: Date, fecha: (item: T) => Date): T[] {
  return items.filter((item) => mismoDia(fecha(item), dia));
}
