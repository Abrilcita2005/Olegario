import AsyncStorage from '@react-native-async-storage/async-storage';

// Almacenamiento local NO cifrado: solo para preferencias y estado de navegación.
// Nunca guardar acá contraseñas, tokens ni datos sensibles (para eso, almacenamiento seguro en la Etapa 13).
const CLAVES = {
  bienvenidaVista: 'olegario.bienvenidaVista',
  tipoAcceso: 'olegario.tipoAcceso',
  fotoPerfil: 'olegario.fotoPerfil',
  perfilBasico: 'olegario.perfilBasico',
  reservas: 'olegario.reservas',
} as const;

export type TipoAcceso = 'miembro' | 'invitado';

// Datos que la persona cargó al registrarse (nunca la contraseña).
export type PerfilBasico = {
  nombre: string;
  correo: string;
  profesion: string;
};

export type EstadoGuardado = {
  bienvenidaVista: boolean;
  tipoAcceso: TipoAcceso | null;
  fotoPerfil: string | null;
  perfilBasico: PerfilBasico | null;
};

function esTipoAcceso(valor: string | null): valor is TipoAcceso {
  return valor === 'miembro' || valor === 'invitado';
}

export async function leerEstadoGuardado(): Promise<EstadoGuardado> {
  const [bienvenida, tipo, foto, perfil] = await Promise.all([
    AsyncStorage.getItem(CLAVES.bienvenidaVista),
    AsyncStorage.getItem(CLAVES.tipoAcceso),
    AsyncStorage.getItem(CLAVES.fotoPerfil),
    AsyncStorage.getItem(CLAVES.perfilBasico),
  ]);
  return {
    bienvenidaVista: bienvenida === 'si',
    tipoAcceso: esTipoAcceso(tipo) ? tipo : null,
    fotoPerfil: foto,
    perfilBasico: leerPerfil(perfil),
  };
}

export async function guardarBienvenidaVista(): Promise<void> {
  await AsyncStorage.setItem(CLAVES.bienvenidaVista, 'si');
}

export async function guardarTipoAcceso(tipo: TipoAcceso | null): Promise<void> {
  if (tipo) await AsyncStorage.setItem(CLAVES.tipoAcceso, tipo);
  else await AsyncStorage.removeItem(CLAVES.tipoAcceso);
}

// Foto de perfil como imagen comprimida (data URI). Provisional: en la Etapa 13 se sube al servidor.
export async function guardarFotoPerfil(foto: string | null): Promise<void> {
  if (foto) await AsyncStorage.setItem(CLAVES.fotoPerfil, foto);
  else await AsyncStorage.removeItem(CLAVES.fotoPerfil);
}

function leerPerfil(texto: string | null): PerfilBasico | null {
  if (!texto) return null;
  try {
    const datos = JSON.parse(texto) as Partial<PerfilBasico>;
    return typeof datos.nombre === 'string' &&
      typeof datos.correo === 'string' &&
      typeof datos.profesion === 'string'
      ? { nombre: datos.nombre, correo: datos.correo, profesion: datos.profesion }
      : null;
  } catch {
    return null;
  }
}

export async function guardarPerfilBasico(perfil: PerfilBasico | null): Promise<void> {
  if (perfil) await AsyncStorage.setItem(CLAVES.perfilBasico, JSON.stringify(perfil));
  else await AsyncStorage.removeItem(CLAVES.perfilBasico);
}

// Reservas simuladas (Etapa 8): las que hizo la persona y las de prueba que canceló.
// PROVISIONAL: en la Etapa 13 las reservas viven en el servidor.
export type ReservaGuardada = {
  id: string;
  espacioId: string;
  inicio: string;
  fin: string;
  cancelada?: boolean;
};

export type ReservasGuardadas = {
  propias: ReservaGuardada[];
  pruebasCanceladas: string[];
};

const SIN_RESERVAS: ReservasGuardadas = { propias: [], pruebasCanceladas: [] };

export async function leerReservas(): Promise<ReservasGuardadas> {
  const texto = await AsyncStorage.getItem(CLAVES.reservas);
  if (!texto) return SIN_RESERVAS;
  try {
    const datos = JSON.parse(texto) as Partial<ReservasGuardadas>;
    return {
      propias: Array.isArray(datos.propias)
        ? datos.propias.filter(
            (r) =>
              typeof r?.id === 'string' &&
              typeof r.espacioId === 'string' &&
              typeof r.inicio === 'string' &&
              typeof r.fin === 'string',
          )
        : [],
      pruebasCanceladas: Array.isArray(datos.pruebasCanceladas)
        ? datos.pruebasCanceladas.filter((id) => typeof id === 'string')
        : [],
    };
  } catch {
    return SIN_RESERVAS;
  }
}

export async function guardarReservas(reservas: ReservasGuardadas): Promise<void> {
  await AsyncStorage.setItem(CLAVES.reservas, JSON.stringify(reservas));
}
