import type { ImageSourcePropType } from 'react-native';

import type { Evento } from '@/models/agenda';
import type { Espacio } from '@/models/espacio';
import type { Reserva } from '@/models/reserva';
import type { ErrorReserva } from '@/utils/disponibilidad';

import { fotosDeEspacios, fotosDeEventos } from '../../data/fotosLocales';
import { pedirApi } from './api';

// Reservas y agenda con la API de Olegario (Etapa 13, D-68; direcciones en docs/BACKEND.md). Las reglas
// (lugar libre, horas, anticipación, cancelación) las vuelve a controlar el servidor. Las lecturas
// devuelven null si no se pudo (sin conexión o sin sesión), para que la pantalla no se rompa.

// ───────────── Datos tal como los manda la API ─────────────
export type EspacioApi = {
  id: string;
  servicio: Espacio['servicio'];
  nombre: string;
  tipo: string;
  ubicacion: string;
  ambiente: string[];
  equipamiento: string[];
  etiqueta: string | null;
  fotoUrl: string | null;
  capacidad: number;
  // Reservas de OTRAS personas (la API no incluye las propias ni dice quién reservó).
  ocupaciones: { inicio: string; fin: string }[];
};

export type ReservaApi = {
  id: string;
  espacioId: string;
  inicio: string;
  fin: string;
  cancelada: boolean;
};

export type HorasApi = { totales: number; usadas: number; disponibles: number };

export type EventoApi = {
  id: string;
  submarca: string;
  titulo: string;
  detalle: string;
  inicio: string;
  fotoUrl: string | null;
  inscriptos: number; // Total, contando a la persona si está inscripta.
  inscripto: boolean;
};

// ───────────── Conversión (funciones puras, probadas en tests/servidor.test.tsx) ─────────────
function foto(url: string | null, local?: ImageSourcePropType): ImageSourcePropType | undefined {
  return url ? { uri: url } : local;
}

export function espacioDesdeApi(e: EspacioApi): Espacio {
  return {
    id: e.id,
    servicio: e.servicio,
    nombre: e.nombre,
    tipo: e.tipo,
    ubicacion: e.ubicacion,
    ambiente: e.ambiente ?? [],
    equipamiento: e.equipamiento ?? [],
    etiqueta: e.etiqueta ?? undefined,
    foto: foto(e.fotoUrl, fotosDeEspacios[e.id]),
    capacidad: e.capacidad,
    ocupaciones: (e.ocupaciones ?? []).map((o) => ({
      inicio: new Date(o.inicio),
      fin: new Date(o.fin),
    })),
  };
}

export function reservaDesdeApi(r: ReservaApi, espacios: Espacio[]): Reserva | null {
  const espacio = espacios.find((e) => e.id === r.espacioId);
  if (!espacio) return null;
  return {
    id: r.id,
    espacioId: espacio.id,
    servicio: espacio.servicio,
    tipo: espacio.tipo,
    espacio: espacio.nombre,
    ubicacion: espacio.ubicacion,
    inicio: new Date(r.inicio),
    fin: new Date(r.fin),
    cancelada: r.cancelada,
  };
}

const ERRORES_RESERVA: ErrorReserva[] = [
  'duracion',
  'pasado',
  'anticipacion',
  'horasInsuficientes',
  'sinLugar',
];

// Los códigos salen de servidor/api/src/Reservas.php; cualquier otro problema es "servidor".
export function errorReservaDesdeCodigo(codigo: string): ErrorReserva {
  return (ERRORES_RESERVA as string[]).includes(codigo) ? (codigo as ErrorReserva) : 'servidor';
}

// Solo eventos de la Agenda (el coworkeo itinerante se muestra en Novedades).
export function eventoDesdeApi(e: EventoApi): Evento | null {
  if (e.submarca !== 'evento' && e.submarca !== 'afterOffice') return null;
  return {
    id: e.id,
    submarca: e.submarca,
    titulo: e.titulo,
    detalle: e.detalle,
    inicio: new Date(e.inicio),
    foto: foto(e.fotoUrl, fotosDeEventos[e.id]),
    // El modelo cuenta los inscriptos sin la persona (la tarjeta la suma si está inscripta).
    inscriptos: Math.max(0, e.inscriptos - (e.inscripto ? 1 : 0)),
    // La API no dice quiénes se inscribieron (privacidad): sin fotos de personas.
    personas: [],
  };
}

// ───────────── Lectura y escritura ─────────────
export type DatosReservas = { espacios: Espacio[]; reservas: Reserva[]; horas: HorasApi | null };

// Espacios con la ocupación ajena entre `desde` y `hasta`, mis reservas del mes y mis horas.
export async function leerReservasServidor(
  desde: Date,
  hasta: Date,
): Promise<DatosReservas | null> {
  const rango = `desde=${encodeURIComponent(desde.toISOString())}&hasta=${encodeURIComponent(hasta.toISOString())}`;
  const [espacios, reservas, horas] = await Promise.all([
    pedirApi<EspacioApi[]>('GET', `/espacios?${rango}`),
    pedirApi<ReservaApi[]>('GET', '/reservas'),
    pedirApi<HorasApi | null>('GET', '/horas'),
  ]);
  if (!espacios.ok || !reservas.ok) return null;
  const lista = espacios.datos.map(espacioDesdeApi);
  return {
    espacios: lista,
    reservas: reservas.datos
      .map((r) => reservaDesdeApi(r, lista))
      .filter((r): r is Reserva => r !== null),
    // Sin membresía (el invitado) la API devuelve null.
    horas: horas.ok ? horas.datos : null,
  };
}

export async function crearReservaServidor(
  espacioId: string,
  inicio: Date,
  fin: Date,
): Promise<{ ok: true; reserva: ReservaApi } | { ok: false; error: ErrorReserva }> {
  const respuesta = await pedirApi<ReservaApi>('POST', '/reservas', {
    espacioId,
    inicio: inicio.toISOString(),
    fin: fin.toISOString(),
  });
  return respuesta.ok
    ? { ok: true, reserva: respuesta.datos }
    : { ok: false, error: errorReservaDesdeCodigo(respuesta.codigo) };
}

export async function cancelarReservaServidor(id: string): Promise<boolean> {
  const respuesta = await pedirApi('POST', `/reservas/${encodeURIComponent(id)}/cancelar`);
  return respuesta.ok;
}

// Compra SIMULADA de horas extras (no se cobra nada). Devuelve las horas nuevas, o null si falló.
export async function sumarHorasExtraServidor(horas: number): Promise<HorasApi | null> {
  const respuesta = await pedirApi<HorasApi>('POST', '/horas/extra', { horas });
  return respuesta.ok ? respuesta.datos : null;
}

export type DatosAgenda = { eventos: Evento[]; inscripciones: string[] };

// Eventos desde hoy y los ids de mis inscripciones (incluye las de Novedades).
export async function leerAgendaServidor(): Promise<DatosAgenda | null> {
  const respuesta = await pedirApi<EventoApi[]>('GET', '/eventos');
  if (!respuesta.ok) return null;
  return {
    eventos: respuesta.datos.map(eventoDesdeApi).filter((e): e is Evento => e !== null),
    inscripciones: respuesta.datos.filter((e) => e.inscripto).map((e) => e.id),
  };
}

// Inscribe o da de baja. Devuelve false si el servidor no lo guardó.
export async function cambiarInscripcionServidor(
  eventoId: string,
  inscribir: boolean,
): Promise<boolean> {
  const ruta = `/eventos/${encodeURIComponent(eventoId)}/inscripcion`;
  const respuesta = await pedirApi(inscribir ? 'POST' : 'DELETE', ruta);
  return respuesta.ok;
}
