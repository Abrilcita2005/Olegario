import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Isotipo } from '@/components/marca/Isotipo';
import { Avatar } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { espacio } from '@/theme';

const TAMANO = 49;

// Encabezado de las pantallas principales (Figma, 101 px de alto). Navegación aprobada 2026-10-28:
// isotipo → Home · ícono OLE/CAFÉ → carta del café · avatar → perfil de cuenta.
export function Encabezado() {
  const { fotoPerfil } = useSesion();
  return (
    <View style={styles.contenedor}>
      <Pressable
        onPress={() => router.navigate('/')}
        accessibilityRole="button"
        accessibilityLabel="Ir al inicio"
        hitSlop={4}
      >
        <Isotipo tamano={TAMANO} />
      </Pressable>
      <View style={styles.derecha}>
        <Pressable
          onPress={() => router.push('/carta-cafe')}
          accessibilityRole="button"
          accessibilityLabel="Carta del café"
          hitSlop={4}
        >
          <IconoSubmarca submarca="cafe" tamano={TAMANO} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/perfil')}
          accessibilityRole="button"
          accessibilityLabel="Mi perfil y membresía"
          hitSlop={4}
        >
          <Avatar foto={fotoPerfil} tamano={TAMANO} />
        </Pressable>
      </View>
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
  derecha: { flexDirection: 'row', gap: espacio.l },
});
