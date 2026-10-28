import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { Logo } from '@/components/marca/Logo';
import { Boton } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { colores, espacio } from '@/theme';

// PROVISIONAL (Etapa 5): estructura de navegación de Acceso. El diseño de Figma llega en la Etapa 6.
export default function AccesoScreen() {
  const { ingresar } = useSesion();
  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenido}>
        <Logo fondo="sobreClaro" />
        <PantallaEnConstruccion titulo="Acceso" etapa="Etapa 6">
          <View style={styles.botones}>
            <Boton
              texto="Iniciar sesión"
              tamano="grande"
              onPress={() => router.push('/iniciar-sesion')}
            />
            <Boton
              texto="Crear una cuenta"
              tamano="grande"
              variante="secundario"
              onPress={() => router.push('/registro')}
            />
            <Boton
              texto="Modo invitado"
              variante="secundario"
              onPress={() => ingresar('invitado')}
            />
          </View>
        </PantallaEnConstruccion>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { flex: 1, padding: espacio.margenPantalla },
  botones: { alignSelf: 'stretch', gap: espacio.xl },
});
