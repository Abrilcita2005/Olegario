import type { Espacio } from '@/models/espacio';
import type { Reserva } from '@/models/reserva';

import {
  DIAS_ANTICIPACION,
  MINUTOS_LIMITE_CANCELACION,
  duracionHoras,
  horaTexto,
  inicioDelDia,
  sumarDias,
} from './fechas';

// Reglas de reserva (decisión de la responsable, 2026-11-04): horario libre las 24 hs en pasos de 30 min,
// hasta 3 días de anticipación, cancelación hasta 30 min antes y toda reserva descuenta horas del plan.

function seSuperponen(a: { inicio: Date; fin: Date }, b: { inicio: Date; fin: Date }): boolean {
  return a.inicio < b.fin && b.inicio < a.fin;
}

function ocupacionesDe(espacio: Espacio, reservas: Reserva[]) {
  return [
    ...espacio.ocupaciones,
    ...reservas.filter((r) => r.espacioId === espacio.id && !r.cancelada),
  ];
}

export function lugaresLibres(
  espacio: Espacio,
  inicio: Date,
  fin: Date,
  reservas: Reserva[] = [],
): number {
  const ocupados = ocupacionesDe(espacio, reservas).filter((o) =>
    seSuperponen(o, { inicio, fin }),
  ).length;
  return Math.max(0, espacio.capacidad - ocupados);
}

export type EstadoEspacio =
  | { tipo: 'libre' }
  | { tipo: 'cupos'; libres: number }
  | { tipo: 'ocupado'; hasta: string; libreDesde: Date };

export function estadoEspacio(
  espacio: Espacio,
  inicio: Date,
  fin: Date,
  reservas: Reserva[] = [],
): EstadoEspacio {
  const libres = lugaresLibres(espacio, inicio, fin, reservas);
  if (libres === 0) {
    const ultimas = ocupacionesDe(espacio, reservas)
      .filter((o) => seSuperponen(o, { inicio, fin }))
      .map((o) => o.fin.getTime());
    const libreDesde = new Date(Math.max(...ultimas));
    return { tipo: 'ocupado', hasta: horaTexto(libreDesde), libreDesde };
  }
  if (espacio.capacidad === 1) return { tipo: 'libre' };
  return { tipo: 'cupos', libres };
}

export type ErrorReserva =
  'duracion' | 'pasado' | 'anticipacion' | 'horasInsuficientes' | 'sinLugar' | 'servidor';

export const MENSAJES_ERROR_RESERVA: Record<ErrorReserva, string> = {
  duracion: 'El horario de fin tiene que ser posterior al de inicio.',
  pasado: 'Elegí un horario que todavía no haya empezado.',
  anticipacion: `Podés reservar con hasta ${DIAS_ANTICIPACION} días de anticipación.`,
  horasInsuficientes: 'No te alcanzan las horas disponibles de tu plan.',
  sinLugar: 'Ese espacio ya no tiene lugar en el horario elegido.',
  servidor: 'No pudimos guardar la reserva. Revisá tu conexión y probá de nuevo.',
};

export function validarReserva(params: {
  espacio: Espacio;
  inicio: Date;
  fin: Date;
  ahora: Date;
  horasDisponibles: number;
  reservas?: Reserva[];
}): ErrorReserva | null {
  const { espacio, inicio, fin, ahora, horasDisponibles, reservas = [] } = params;
  if (fin <= inicio) return 'duracion';
  if (inicio < ahora) return 'pasado';
  if (inicio >= sumarDias(inicioDelDia(ahora), DIAS_ANTICIPACION + 1)) return 'anticipacion';
  if (duracionHoras(inicio, fin) > horasDisponibles) return 'horasInsuficientes';
  if (lugaresLibres(espacio, inicio, fin, reservas) === 0) return 'sinLugar';
  return null;
}

export function diaReservable(dia: Date, ahora: Date): boolean {
  const hoy = inicioDelDia(ahora);
  return dia >= hoy && dia < sumarDias(hoy, DIAS_ANTICIPACION + 1);
}

export function puedeCancelar(reserva: Reserva, ahora: Date): boolean {
  return (
    !reserva.cancelada &&
    reserva.inicio.getTime() - ahora.getTime() >= MINUTOS_LIMITE_CANCELACION * 60_000
  );
}

export function horasUsadas(reservas: Reserva[]): number {
  return reservas
    .filter((r) => !r.cancelada)
    .reduce((total, r) => total + duracionHoras(r.inicio, r.fin), 0);
}
