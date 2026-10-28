import AsyncStorage from '@react-native-async-storage/async-storage';

// Almacenamiento local NO cifrado: solo para preferencias y estado de navegación.
// Nunca guardar acá contraseñas, tokens ni datos sensibles (para eso, almacenamiento seguro en la Etapa 13).
const CLAVES = {
  bienvenidaVista: 'olegario.bienvenidaVista',
  tipoAcceso: 'olegario.tipoAcceso',
} as const;

export type TipoAcceso = 'miembro' | 'invitado';

export type EstadoGuardado = {
  bienvenidaVista: boolean;
  tipoAcceso: TipoAcceso | null;
};

function esTipoAcceso(valor: string | null): valor is TipoAcceso {
  return valor === 'miembro' || valor === 'invitado';
}

export async function leerEstadoGuardado(): Promise<EstadoGuardado> {
  const [bienvenida, tipo] = await Promise.all([
    AsyncStorage.getItem(CLAVES.bienvenidaVista),
    AsyncStorage.getItem(CLAVES.tipoAcceso),
  ]);
  return { bienvenidaVista: bienvenida === 'si', tipoAcceso: esTipoAcceso(tipo) ? tipo : null };
}

export async function guardarBienvenidaVista(): Promise<void> {
  await AsyncStorage.setItem(CLAVES.bienvenidaVista, 'si');
}

export async function guardarTipoAcceso(tipo: TipoAcceso | null): Promise<void> {
  if (tipo) await AsyncStorage.setItem(CLAVES.tipoAcceso, tipo);
  else await AsyncStorage.removeItem(CLAVES.tipoAcceso);
}
