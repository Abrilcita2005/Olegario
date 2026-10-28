import { Image, StyleSheet, View } from 'react-native';

import { colores, radios } from '@/theme';

type Props = {
  foto: string | null;
  tamano?: number;
};

// Foto de perfil circular. Sin foto, se muestra el círculo oscuro de Figma.
export function Avatar({ foto, tamano = 49 }: Props) {
  const estilo = { width: tamano, height: tamano, borderRadius: radios.pastilla };
  return foto ? (
    <Image source={{ uri: foto }} style={[styles.base, estilo]} accessibilityIgnoresInvertColors />
  ) : (
    <View style={[styles.base, estilo]} />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colores.superficie },
});
