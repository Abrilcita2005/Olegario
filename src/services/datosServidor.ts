import type { ImageSourcePropType } from 'react-native';

import type { Evento } from '@/models/agenda';
import type { Novedad } from '@/models/novedad';
import type { ModoComunidad, Persona, Publicacion, Taller } from '@/models/comunidad';
import type { Espacio } from '@/models/espacio';
import type { Reserva } from '@/models/reserva';
import type { ErrorReserva } from '@/utils/disponibilidad';

import { fotosDeEspacios, fotosDeEventos, fotosDeNovedades } from '../../data/fotosLocales';
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

// ───────────── Comunidad ─────────────
export type PersonaApi = {
  id: string;
  nombre: string;
  profesion: string;
  fotoUrl: string | null;
  sobreMi: string | null;
  ofrezco: string | null;
  busco: string | null;
  disponible: boolean;
};

export type PublicacionApi = {
  id: string;
  tipo: Publicacion['tipo'];
  busca: string | null;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  // id null: la persona autora está en Modo Foco (no se enlaza a su perfil).
  autor: { id: string | null; nombre: string; profesion: string };
  esPropia: boolean;
};

export type ComunidadApi = {
  modo: ModoComunidad;
  personas: PersonaApi[];
  publicaciones: PublicacionApi[];
  talleres: Omit<Taller, 'esDatoDePrueba'>[];
  solicitudesEnviadas: string[];
};

export type DatosComunidad = {
  modo: ModoComunidad;
  personas: Persona[];
  publicaciones: Publicacion[];
  talleres: Taller[];
  solicitudesEnviadas: string[];
};

export function personaDesdeApi(p: PersonaApi): Persona {
  return {
    id: p.id,
    nombre: p.nombre,
    profesion: p.profesion,
    foto: p.fotoUrl ? { uri: p.fotoUrl } : undefined,
    sobreMi: p.sobreMi ?? undefined,
    ofrezco: p.ofrezco ?? undefined,
    busco: p.busco ?? undefined,
    // La API solo manda personas en "Conexión abierta", que en la app es "Disponible para colaborar"
    // (D-64): por eso todas aparecen en "Talentos disponibles".
    disponible: true,
  };
}

// Textos de los botones tomados de Figma (COMUNIDAD).
const ACCION_PUBLICACION: Record<Publicacion['tipo'], string> = {
  colaborador: 'Quiero aportar / postularme',
  iniciativa: 'Me interesa colaborar',
};

export function publicacionDesdeApi(p: PublicacionApi): Publicacion {
  return {
    id: p.id,
    tipo: p.tipo,
    busca: p.busca ?? undefined,
    titulo: p.titulo,
    descripcion: p.descripcion,
    etiquetas: p.etiquetas,
    autores: [
      { personaId: p.autor.id && !p.esPropia ? p.autor.id : undefined, nombre: p.autor.nombre },
    ],
    rolAutor: p.autor.profesion || undefined,
    actividad: '',
    accion: p.esPropia ? '' : ACCION_PUBLICACION[p.tipo],
    esPropia: p.esPropia,
  };
}

export async function leerComunidadServidor(): Promise<DatosComunidad | null> {
  const respuesta = await pedirApi<ComunidadApi>('GET', '/comunidad');
  if (!respuesta.ok) return null;
  const d = respuesta.datos;
  return {
    modo: d.modo,
    personas: d.personas.map(personaDesdeApi),
    publicaciones: d.publicaciones.map(publicacionDesdeApi),
    talleres: d.talleres,
    solicitudesEnviadas: d.solicitudesEnviadas,
  };
}

export async function cambiarModoServidor(modo: ModoComunidad): Promise<boolean> {
  return (await pedirApi('PATCH', '/comunidad/modo', { modo })).ok;
}

export type NuevaPublicacionApi = {
  tipo: Publicacion['tipo'];
  busca?: string;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
};

export async function publicarServidor(datos: NuevaPublicacionApi): Promise<boolean> {
  return (await pedirApi('POST', '/publicaciones', datos)).ok;
}

export async function eliminarPublicacionServidor(id: string): Promise<boolean> {
  return (await pedirApi('DELETE', `/publicaciones/${encodeURIComponent(id)}`)).ok;
}

// `destino`: id de la persona, la publicación o el taller.
export async function enviarSolicitudServidor(destino: string, mensaje: string): Promise<boolean> {
  return (await pedirApi('POST', '/solicitudes', { destino, mensaje })).ok;
}

// ───────────── Servicios del Perfil ─────────────
export type MembresiaApi = {
  plan: string;
  acceso: string;
  vence: string | null; // AAAA-MM-DD
  renovacionAutomatica: boolean;
};

export type PaqueteApi = { id: string; descripcion: string; estado: string };

export type BeneficioApi = { id: string; titulo: string; detalle: string; lugar: string };

export type CantidadOpiniones = { valoraciones: number; mensajes: number };

export async function leerMembresiaServidor(): Promise<MembresiaApi | null> {
  const respuesta = await pedirApi<MembresiaApi | null>('GET', '/membresia');
  return respuesta.ok ? respuesta.datos : null;
}

export async function leerPaquetesServidor(): Promise<PaqueteApi[] | null> {
  const respuesta = await pedirApi<PaqueteApi[]>('GET', '/paquetes');
  return respuesta.ok ? respuesta.datos : null;
}

export async function leerBeneficiosServidor(): Promise<BeneficioApi[] | null> {
  const respuesta = await pedirApi<{ beneficios: BeneficioApi[] }>('GET', '/contenido');
  return respuesta.ok ? respuesta.datos.beneficios : null;
}

export async function leerOpinionesServidor(): Promise<CantidadOpiniones | null> {
  const respuesta = await pedirApi<CantidadOpiniones>('GET', '/opiniones');
  return respuesta.ok ? respuesta.datos : null;
}

export async function valorarEspacioServidor(
  espacioId: string,
  estrellas: number,
  comentario: string,
): Promise<boolean> {
  return (await pedirApi('POST', '/valoraciones', { espacioId, estrellas, comentario })).ok;
}

export async function enviarMensajeServidor(
  tipo: 'queja' | 'sugerencia',
  texto: string,
): Promise<boolean> {
  return (await pedirApi('POST', '/mensajes', { tipo, texto })).ok;
}

// ───────────── Novedades ─────────────
type NovedadApi = {
  id: string;
  titulo: string;
  texto: string;
  descuento: string | null;
  fotoUrl: string | null;
  accion: 'carta' | 'inscripcion';
  eventoId: string | null;
};

// Novedades que carga el equipo, con la cantidad real de inscriptos al evento (sin decir quiénes).
export async function leerNovedadesServidor(): Promise<Novedad[] | null> {
  const [contenido, eventos] = await Promise.all([
    pedirApi<{ novedades: NovedadApi[] }>('GET', '/contenido'),
    pedirApi<EventoApi[]>('GET', '/eventos'),
  ]);
  if (!contenido.ok) return null;
  const evento = (id: string | null) =>
    eventos.ok && id ? eventos.datos.find((e) => e.id === id) : undefined;
  return contenido.datos.novedades.map((n) => {
    const e = evento(n.eventoId);
    return {
      id: n.id,
      foto: foto(n.fotoUrl, fotosDeNovedades[n.id]),
      descuento: n.descuento ?? undefined,
      titulo: n.titulo,
      texto: n.texto,
      // Con datos reales no se promete escasez ("Últimos cupos"): se invita a inscribirse.
      accion: { texto: n.accion === 'carta' ? 'Pedir al barista' : 'Inscribirme', tipo: n.accion },
      eventoId: n.eventoId ?? undefined,
      participantes: e
        ? { iniciales: [], mas: Math.max(0, e.inscriptos - (e.inscripto ? 1 : 0)) }
        : undefined,
    };
  });
}
