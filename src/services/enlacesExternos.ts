import * as WebBrowser from 'expo-web-browser';

import { colores } from '@/theme';

import { ENLACE_PLANO_RESERVAS, PLANO_CONECTADO_AL_SERVIDOR } from '../../data/enlaces';
import { apiConfigurada, leerToken, pedirApi } from './api';

// Abre una página externa en un panel sobre la app (en el teléfono) o en otra pestaña (en la web).
// Devuelve false si no se pudo abrir.
export async function abrirEnlace(url: string): Promise<boolean> {
  try {
    await WebBrowser.openBrowserAsync(url, {
      toolbarColor: colores.superficie,
      controlsColor: colores.acentoLima,
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });
    return true;
  } catch {
    return false;
  }
}

// Plano de reservas (D-73): con servidor y sesión, entra directo con un código de un solo uso que vence en
// un minuto (el plano lo canjea por su propia sesión); si no se puede pedir, abre el plano sin sesión y
// ahí se ingresa con correo y contraseña. Devuelve cuando la persona cierra el plano.
export async function abrirPlanoDeReservas(): Promise<boolean> {
  let url = ENLACE_PLANO_RESERVAS;
  if (PLANO_CONECTADO_AL_SERVIDOR && apiConfigurada && (await leerToken().catch(() => null))) {
    const respuesta = await pedirApi<{ codigo: string }>('POST', '/cuentas/codigo');
    if (respuesta.ok) url = `${url}?codigo=${encodeURIComponent(respuesta.datos.codigo)}`;
  }
  return abrirEnlace(url);
}
