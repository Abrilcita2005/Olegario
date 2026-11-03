import { StyleSheet, View } from 'react-native';

import { IconoUbicacion } from '@/components/iconos/Iconos';
import { Texto } from '@/components/ui';
import { colores, espacio } from '@/theme';

// Pie de las pantallas de acceso (Figma: "Hospitality Footer Anchor").
export function PieHospitalidad() {
  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <IconoUbicacion color={colores.textoSobreClaro} />
        <Texto variante="botonSecundario">Mendoza · Hub Creativo & Coworking</Texto>
      </View>
      <Texto variante="divisor" style={styles.subtitulo}>
        Café de especialidad & conexión 24/7
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: espacio.xs,
    paddingTop: espacio.base,
    paddingBottom: espacio.grande,
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  subtitulo: { opacity: 0.75, textAlign: 'center' },
});
