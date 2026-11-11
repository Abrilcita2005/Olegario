import * as Sharing from 'expo-sharing';
import type { ComponentRef, RefObject } from 'react';
import { Platform, Share, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

// Compartir una tarjeta como imagen (pedido de la responsable, Etapa 14: "como cuando compartís un tweet").
// Se saca una imagen de la tarjeta (react-native-view-shot) y se abre el menú para compartir del teléfono
// (expo-sharing), donde aparecen Instagram, WhatsApp, etc. En la web, o si falla, se comparte el texto.
export async function compartirTarjeta(
  tarjeta: RefObject<ComponentRef<typeof View> | null>,
  texto: string,
): Promise<boolean> {
  try {
    if (Platform.OS !== 'web' && tarjeta.current && (await Sharing.isAvailableAsync())) {
      const imagen = await captureRef(tarjeta as Parameters<typeof captureRef>[0], {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(imagen, {
        mimeType: 'image/png',
        UTI: 'public.png',
        dialogTitle: 'Compartir',
      });
      return true;
    }
    await Share.share({ message: texto });
    return true;
  } catch {
    return false;
  }
}
