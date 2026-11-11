import * as WebBrowser from 'expo-web-browser';

import { colores } from '@/theme';

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
