import { StyleSheet, View } from 'react-native';

import { colores, espacio, radios } from '@/theme';
import type { NivelFortaleza } from '@/utils/fortalezaContrasena';

const NOMBRES = ['vacía', 'débil', 'aceptable', 'buena', 'fuerte'] as const;
const COLORES_NIVEL = [
  colores.superficieElevada,
  colores.error,
  colores.advertencia,
  colores.acentoLima,
  colores.acentoLima,
];

// Las 4 barras de fortaleza del registro. Los colores por nivel son provisionales (sin diseño).
export function IndicadorFortaleza({ nivel }: { nivel: NivelFortaleza }) {
  return (
    <View
      style={styles.fila}
      accessible
      accessibilityLabel={`Fortaleza de la contraseña: ${NOMBRES[nivel]}`}
    >
      {[1, 2, 3, 4].map((barra) => (
        <View
          key={barra}
          style={[
            styles.barra,
            { backgroundColor: barra <= nivel ? COLORES_NIVEL[nivel] : colores.superficieElevada },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', gap: espacio.s, paddingTop: espacio.xs },
  barra: { flex: 1, height: 4, borderRadius: radios.pastilla },
});
