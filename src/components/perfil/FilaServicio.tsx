import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';

type Props = {
  icono: ComponentType<{ color: string; tamano?: number }>;
  color: string;
  fondo: string;
  titulo: string;
  detalle: string;
  onPress: () => void;
};

// Fila de "GESTIÓN Y SERVICIOS" (Figma: PERFIL): ícono en círculo de color, título y detalle.
export function FilaServicio({ icono: Icono, color, fondo, titulo, detalle, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${detalle}`}
      style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
    >
      <View style={[styles.icono, { backgroundColor: fondo }]}>
        <Icono color={color} />
      </View>
      <View style={styles.textos}>
        <Texto variante="cuerpoMedio" color="textoSobreOscuro">
          {titulo}
        </Texto>
        <Texto variante="cuerpoChico" color="textoSecundario" numberOfLines={1}>
          {detalle}
        </Texto>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xl,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  presionada: { opacity: 0.85 },
  icono: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.pastilla,
  },
  textos: { flex: 1, gap: espacio.xxs },
});
