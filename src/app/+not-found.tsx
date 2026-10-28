import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { EstadoError } from '@/components/ui';
import { colores } from '@/theme';

// Pantalla para rutas que no existen.
export default function NoEncontradaScreen() {
  return (
    <SafeAreaView style={styles.pantalla}>
      <EstadoError
        titulo="No encontramos esta pantalla"
        texto="Puede que el enlace esté mal o que la sección todavía no exista."
        accion={{ texto: 'Ir al inicio', onPress: () => router.replace('/') }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, justifyContent: 'center', backgroundColor: colores.fondo },
});
