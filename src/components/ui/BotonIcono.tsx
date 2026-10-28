import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AREA_TACTIL_MINIMA, colores, radios } from '@/theme';

type Props = {
  icono: ReactNode;
  etiquetaAccesible: string;
  onPress: () => void;
};

// Botón cuadrado de 44×44 (p. ej. "Cómo llegar a tu puesto" en el Home). La etiqueta es obligatoria.
export function BotonIcono({ icono, etiquetaAccesible, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={etiquetaAccesible}
      style={({ pressed }) => [styles.base, pressed && styles.presionado]}
    >
      {icono}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: AREA_TACTIL_MINIMA,
    height: AREA_TACTIL_MINIMA,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
    backgroundColor: colores.superficie,
  },
  presionado: { opacity: 0.85 },
});
