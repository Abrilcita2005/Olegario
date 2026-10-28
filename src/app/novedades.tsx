import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';

// Panel de Novedades que sube desde abajo (aprobado 2026-10-28). Se cierra deslizando hacia abajo,
// con el botón atrás del sistema o con "Cerrar". Contenido en la Etapa 12.
export default function NovedadesScreen() {
  return (
    <View style={styles.panel}>
      <View style={styles.barraSuperior}>
        <Texto variante="tituloSeccion" color="acento">
          Pulso de Olegario
        </Texto>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Cerrar novedades"
          hitSlop={8}
          style={styles.cerrar}
        >
          <Texto variante="chip">Cerrar</Texto>
        </Pressable>
      </View>
      <PantallaEnConstruccion titulo="Novedades" etapa="Etapa 12" />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, padding: espacio.margenPantalla, backgroundColor: colores.fondo },
  barraSuperior: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cerrar: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: espacio.base,
    borderRadius: radios.pastilla,
  },
});
