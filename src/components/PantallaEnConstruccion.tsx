import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Texto } from '@/components/ui';
import { colores, espacio } from '@/theme';

type Props = {
  titulo: string;
};

// Marcador temporal para las pestañas mientras se construyen sus etapas.
export function PantallaEnConstruccion({ titulo }: Props) {
  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.contenido}>
        <Texto accessibilityRole="header" variante="tituloPantalla">
          {titulo}
        </Texto>
        <Texto>Pantalla en construcción</Texto>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.m,
  },
});
