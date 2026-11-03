import AsyncStorage from '@react-native-async-storage/async-storage';

// Almacenamiento local NO cifrado: solo para preferencias y estado de navegación.
// Nunca guardar acá contraseñas, tokens ni datos sensibles (para eso, almacenamiento seguro en la Etapa 13).
const CLAVES = {
  bienvenidaVista: 'olegario.bienvenidaVista',
  tipoAcceso: 'olegario.tipoAcceso',
  fotoPerfil: 'olegario.fotoPerfil',
  perfilBasico: 'olegario.perfilBasico',
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
