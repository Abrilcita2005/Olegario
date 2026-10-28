import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconoFlechaVolver } from '@/components/iconos/Iconos';
import { Isotipo } from '@/components/marca/Isotipo';
import { colores, espacio } from '@/theme';

// Encabezado de las pantallas secundarias (Figma, Inicio 2 y 3): flecha volver e isotipo.
export function EncabezadoVolver({ conIsotipo = true }: { conIsotipo?: boolean }) {
  return (
    <View style={styles.contenedor}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        hitSlop={8}
      >
        <IconoFlechaVolver tamano={35} color={colores.textoSobreClaro} />
      </Pressable>
      {conIsotipo ? <Isotipo /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: espacio.margenPantalla,
    paddingBottom: espacio.grande,
  },
});
