import type { Reserva } from '@/models/reserva';

import { horaTexto, mismoDia, sumarDias } from './fechas';
import { estadoReserva } from './reservas';

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
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// "30 de noviembre de 2026".
export function fechaLarga(fecha: Date): string {
  return `${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

// Porcentaje libre del plan, redondeado (Figma: "53% LIBRE" con 42 / 80 hs).
export function porcentajeLibre(disponibles: number, totales: number): number {
  if (totales <= 0) return 0;
  return Math.round(Math.min(1, Math.max(0, disponibles / totales)) * 100);
}

// Subtítulo de "Historial y Próximas Reservas" (Figma: "Sala de Directorio mañana a las 10:00 hs").
export function textoProximaReserva(reservas: Reserva[], ahora: Date): string {
  const proxima = reservas
    .filter((r) => estadoReserva(r, ahora) !== 'finalizada')
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime())[0];
  if (!proxima) return 'No tenés reservas próximas';
  if (estadoReserva(proxima, ahora) === 'enCurso')
    return `${proxima.espacio} ahora, hasta las ${horaTexto(proxima.fin)} hs`;
  const dia = mismoDia(proxima.inicio, ahora)
    ? 'hoy'
    : mismoDia(proxima.inicio, sumarDias(ahora, 1))
      ? 'mañana'
      : `el ${DIAS[proxima.inicio.getDay()]} ${proxima.inicio.getDate()}`;
  return `${proxima.espacio} ${dia} a las ${horaTexto(proxima.inicio)} hs`;
}
