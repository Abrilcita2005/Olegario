export const MINUTOS_PASO = 30;
export const DIAS_ANTICIPACION = 3;
export const MINUTOS_LIMITE_CANCELACION = 30;
// Horario de reservas: de 8 a 20 hs (pedido de la responsable en la Etapa 14, igual que el plano de
// reservas; reemplaza el horario libre de 24 hs del 2026-11-04).
export const HORA_APERTURA = 8;
export const HORA_CIERRE = 20;

const DIAS_CORTOS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

export function inicioDelDia(fecha: Date): Date {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function sumarDias(fecha: Date, dias: number): Date {
  const d = new Date(fecha);
  d.setDate(d.getDate() + dias);
  return d;
}

export function sumarMinutos(fecha: Date, minutos: number): Date {
  return new Date(fecha.getTime() + minutos * 60_000);
}

export function mismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function diaCorto(fecha: Date): string {
  return DIAS_CORTOS[fecha.getDay()];
}

export function horaTexto(fecha: Date): string {
  return `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`;
}

export function duracionHoras(inicio: Date, fin: Date): number {
  return Math.round(((fin.getTime() - inicio.getTime()) / 3_600_000) * 2) / 2;
}

export function textoHoras(horas: number): string {
  const numero = Number.isInteger(horas) ? String(horas) : horas.toFixed(1).replace('.', ',');
  return `${numero} ${horas === 1 ? 'h' : 'hs'}`;
}

// Próximo múltiplo de 30 minutos a partir de "ahora" (horario por defecto al abrir Espacios).
export function proximoPaso(ahora: Date): Date {
  const d = new Date(ahora);
  d.setSeconds(0, 0);
  const resto = d.getMinutes() % MINUTOS_PASO;
  if (resto !== 0) d.setMinutes(d.getMinutes() + (MINUTOS_PASO - resto));
  return d;
}

// "Hoy, 10:00 - 14:00 (4 hrs)" como en Figma.
export function textoHorarioElegido(inicio: Date, fin: Date, ahora: Date): string {
  const dia = mismoDia(inicio, ahora)
    ? 'Hoy'
    : mismoDia(inicio, sumarDias(ahora, 1))
      ? 'Mañana'
      : `${diaCorto(inicio).charAt(0)}${diaCorto(inicio).slice(1).toLowerCase()} ${inicio.getDate()}`;
  const horas = duracionHoras(inicio, fin);
  const finTexto =
    mismoDia(inicio, fin) || fin.getHours() + fin.getMinutes() > 0 ? horaTexto(fin) : '24:00';
  return `${dia}, ${horaTexto(inicio)} - ${finTexto} (${String(horas).replace('.', ',')} ${horas === 1 ? 'hr' : 'hrs'})`;
}

function aLaHora(dia: Date, hora: number): Date {
  const d = inicioDelDia(dia);
  d.setHours(hora);
  return d;
}

// Límites del horario elegible en un día: de 8 a 20 hs; si es hoy, desde el próximo paso de 30 min.
export function limitesHorario(dia: Date, ahora: Date): { minInicio: Date; finDelDia: Date } {
  const apertura = aLaHora(dia, HORA_APERTURA);
  const finDelDia = aLaHora(dia, HORA_CIERRE);
  const desdeAhora = proximoPaso(ahora);
  const minInicio = mismoDia(dia, ahora) && desdeAhora > apertura ? desdeAhora : apertura;
  return { minInicio, finDelDia };
}

// ¿Queda algún turno de 30 min para reservar ese día?
export function quedaHorarioEnElDia(dia: Date, ahora: Date): boolean {
  const { minInicio, finDelDia } = limitesHorario(dia, ahora);
  return sumarMinutos(minInicio, MINUTOS_PASO) <= finDelDia;
}

// Primer horario disponible: hoy si todavía hay turnos, si no mañana a las 8.
export function primerDiaConHorario(ahora: Date): Date {
  return quedaHorarioEnElDia(ahora, ahora)
    ? inicioDelDia(ahora)
    : sumarDias(inicioDelDia(ahora), 1);
}

// ¿El horario está dentro de la apertura (8 a 20 hs del mismo día)?
export function dentroDelHorario(inicio: Date, fin: Date): boolean {
  return (
    mismoDia(inicio, sumarMinutos(fin, -1)) &&
    inicio >= aLaHora(inicio, HORA_APERTURA) &&
    fin <= aLaHora(inicio, HORA_CIERRE)
  );
}

// Ajusta un horario para que quede dentro del día y respete los límites (al menos 30 min de duración).
export function ajustarHorario(
  dia: Date,
  inicio: Date,
  fin: Date,
  ahora: Date,
): { inicio: Date; fin: Date } {
  const { minInicio, finDelDia } = limitesHorario(dia, ahora);
  const maxInicio = sumarMinutos(finDelDia, -MINUTOS_PASO);
  const base = inicioDelDia(dia);
  // Conserva la hora del día y la duración elegidas.
  const minutosInicio = Math.round((inicio.getTime() - inicioDelDia(inicio).getTime()) / 60_000);
  const duracion = Math.max(MINUTOS_PASO, Math.round((fin.getTime() - inicio.getTime()) / 60_000));
  let nuevoInicio = sumarMinutos(base, minutosInicio);
  if (nuevoInicio < minInicio) nuevoInicio = minInicio;
  if (nuevoInicio > maxInicio) nuevoInicio = maxInicio;
  let nuevoFin = sumarMinutos(nuevoInicio, duracion);
  if (nuevoFin > finDelDia) nuevoFin = finDelDia;
  return { inicio: nuevoInicio, fin: nuevoFin };
}

// Los 7 días que muestra el selector: la semana de lunes a domingo, corrida si hace falta para que
// siempre se vean los días que se pueden reservar (hoy y los 3 siguientes).
export function diasVisibles(ahora: Date): Date[] {
  const hoy = inicioDelDia(ahora);
  const lunes = sumarDias(hoy, -((hoy.getDay() + 6) % 7));
  const minimo = sumarDias(hoy, DIAS_ANTICIPACION - 6);
  const desde = lunes > minimo ? lunes : minimo;
  return Array.from({ length: 7 }, (_, i) => sumarDias(desde, i));
}
