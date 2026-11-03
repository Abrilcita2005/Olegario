import type { EstadoReserva, Reserva } from '@/models/reserva';

export function estadoReserva(reserva: Reserva, ahora: Date): EstadoReserva {
  if (ahora < reserva.inicio) return 'proxima';
  if (ahora < reserva.fin) return 'enCurso';
  return 'finalizada';
}

// La reserva que muestra el Home: la que está en curso o, si no hay, la próxima más cercana.
export function reservaParaMostrar(reservas: Reserva[], ahora: Date): Reserva | null {
  const vigentes = reservas
    .filter((r) => estadoReserva(r, ahora) !== 'finalizada')
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
  return vigentes[0] ?? null;
}

function hora(fecha: Date): string {
  return `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`;
}

function mismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// "Hoy: 10:00 - 14:00 hs" (Figma), "Mañana: …" o "Jueves 22: …".
export function textoHorario(reserva: Reserva, ahora: Date): string {
  const manana = new Date(ahora);
  manana.setDate(ahora.getDate() + 1);
  const dia = mismoDia(reserva.inicio, ahora)
    ? 'Hoy'
    : mismoDia(reserva.inicio, manana)
      ? 'Mañana'
      : `${DIAS[reserva.inicio.getDay()].replace(/^./, (l) => l.toUpperCase())} ${reserva.inicio.getDate()}`;
  return `${dia}: ${hora(reserva.inicio)} - ${hora(reserva.fin)} hs`;
}
