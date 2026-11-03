import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { colores, espacio, type NombreColor } from '@/theme';

// Línea – texto – línea (Figma: "O CONTINUÁ CON").
export function DivisorTexto({ texto, color = 'acento' }: { texto: string; color?: NombreColor }) {
  return (
    <View style={styles.fila} accessibilityRole="text">
      <View style={styles.linea} />
      <Texto variante="divisor" color={color}>
        {texto}
      </Texto>
      <View style={styles.linea} />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xl,
    paddingHorizontal: espacio.m,
  },
  linea: { flex: 1, height: 1, backgroundColor: colores.superficie },
});
