import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Conexión con Supabase (Etapa 13, aprobado por la responsable 2026-11-04).
// Se activa solo si están las dos variables de entorno públicas (ver .env.example). Sin ellas, la app
// sigue con los datos de prueba. Nunca se usa la clave "service_role" en la app.
const URL_SUPABASE = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const CLAVE_ANONIMA = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseConfigurado = URL_SUPABASE.startsWith('https://') && CLAVE_ANONIMA.length > 0;

// La sesión se guarda cifrada con expo-secure-store (guía maestra §G.7). SecureStore acepta valores
// chicos, así que se parte en trozos. En la web no existe SecureStore: se usa el almacenamiento local.
const TAMANO_TROZO = 1800;

const almacenamientoSeguro = {
  async getItem(clave: string): Promise<string | null> {
    const cantidad = Number(await SecureStore.getItemAsync(`${clave}.trozos`));
    if (!cantidad) return null;
    const trozos = await Promise.all(
      Array.from({ length: cantidad }, (_, i) => SecureStore.getItemAsync(`${clave}.${i}`)),
    );
    return trozos.every((t) => t !== null) ? trozos.join('') : null;
  },
  async setItem(clave: string, valor: string): Promise<void> {
    const trozos = valor.match(new RegExp(`.{1,${TAMANO_TROZO}}`, 'gs')) ?? [];
    await Promise.all(trozos.map((t, i) => SecureStore.setItemAsync(`${clave}.${i}`, t)));
    await SecureStore.setItemAsync(`${clave}.trozos`, String(trozos.length));
  },
  async removeItem(clave: string): Promise<void> {
    const cantidad = Number(await SecureStore.getItemAsync(`${clave}.trozos`));
    await Promise.all(
      Array.from({ length: cantidad || 0 }, (_, i) => SecureStore.deleteItemAsync(`${clave}.${i}`)),
    );
    await SecureStore.deleteItemAsync(`${clave}.trozos`);
  },
};

// Claves de SecureStore: solo letras, números, ".", "-" y "_".
function claveSegura(clave: string): string {
  return clave.replace(/[^A-Za-z0-9._-]/g, '_');
}

const almacenamiento =
  Platform.OS === 'web'
    ? AsyncStorage
    : {
        getItem: (k: string) => almacenamientoSeguro.getItem(claveSegura(k)),
        setItem: (k: string, v: string) => almacenamientoSeguro.setItem(claveSegura(k), v),
        removeItem: (k: string) => almacenamientoSeguro.removeItem(claveSegura(k)),
      };

export const supabase: SupabaseClient | null = supabaseConfigurado
  ? createClient(URL_SUPABASE, CLAVE_ANONIMA, {
      auth: {
        storage: almacenamiento,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
