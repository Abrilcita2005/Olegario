import { StyleSheet, View, type ViewProps } from 'react-native';

import { colores, espacio, radios, sombras } from '@/theme';

type Props = ViewProps & {
  elevada?: boolean;
};

// Superficie oscura de las tarjetas de Figma (radio 16, padding 16).
export function Tarjeta({ elevada = false, style, ...props }: Props) {
  return <View {...props} style={[styles.base, elevada && sombras.tarjeta, style]} />;
}

const styles = StyleSheet.create({
  base: {
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
});
