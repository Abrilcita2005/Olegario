import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  titulo: string;
};

// Marcador temporal para las pestañas mientras se construyen sus etapas.
export function PantallaEnConstruccion({ titulo }: Props) {
  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.contenido}>
        <Text accessibilityRole="header" style={styles.titulo}>
          {titulo}
        </Text>
        <Text style={styles.texto}>Pantalla en construcción</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
  },
  texto: {
    fontSize: 14,
  },
});
