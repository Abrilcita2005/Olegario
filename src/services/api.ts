import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Conexión con la API en PHP del servidor de Olegario (Etapa 13, D-68; ver docs/BACKEND.md).
// Se activa solo si está la variable EXPO_PUBLIC_API_URL (ver .env.example). Sin ella, la app sigue con los
// datos de prueba. La app nunca se conecta directo a MySQL.
const URL_API = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export const apiConfigurada = /^https?:\/\//.test(URL_API);

// El token de sesión se guarda cifrado con expo-secure-store (guía maestra §G.7). En la web no existe
// SecureStore: se usa el almacenamiento local del navegador (solo para la verificación visual).
const CLAVE_TOKEN = 'olegario.tokenSesion';

export async function leerToken(): Promise<string | null> {
  return Platform.OS === 'web'
    ? AsyncStorage.getItem(CLAVE_TOKEN)
    : SecureStore.getItemAsync(CLAVE_TOKEN);
}

export async function guardarToken(token: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    if (token) await AsyncStorage.setItem(CLAVE_TOKEN, token);
    else await AsyncStorage.removeItem(CLAVE_TOKEN);
    return;
  }
  if (token) await SecureStore.setItemAsync(CLAVE_TOKEN, token);
  else await SecureStore.deleteItemAsync(CLAVE_TOKEN);
}

// Respuesta de la API: los datos, o el mensaje en español y el código del error.
export type RespuestaApi<T> =
  { ok: true; datos: T } | { ok: false; estado: number; error: string; codigo: string };

const SIN_CONEXION = 'No pudimos conectarnos. Revisá tu conexión a internet.';

export async function pedirApi<T>(
  metodo: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  ruta: string,
  datos?: unknown,
): Promise<RespuestaApi<T>> {
  if (!apiConfigurada) {
    return {
      ok: false,
      estado: 0,
      error: 'El servidor no está configurado.',
      codigo: 'sin_servidor',
    };
  }
  try {
    const token = await leerToken();
    const respuesta = await fetch(`${URL_API}${ruta}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: datos === undefined ? undefined : JSON.stringify(datos),
    });
    const cuerpo = (await respuesta.json().catch(() => null)) as
      (T & { error?: string; codigo?: string }) | null;
    if (respuesta.ok) return { ok: true, datos: cuerpo as T };
    return {
      ok: false,
      estado: respuesta.status,
      error: cuerpo?.error ?? 'No pudimos completar la operación. Probá de nuevo en unos minutos.',
      codigo: cuerpo?.codigo ?? 'servidor',
    };
  } catch {
    return { ok: false, estado: 0, error: SIN_CONEXION, codigo: 'sin_conexion' };
  }
}
