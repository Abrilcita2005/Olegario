import { Pressable, StyleSheet } from 'react-native';

import { IconoSubmarca, type Submarca } from '@/components/marca/IconoSubmarca';
import { Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';

type Props = {
  submarca: Submarca;
  nombre: string;
  disponibilidad: string;
  onPress: () => void;
};

// Tarjeta de servicio del Home (Figma: 107×142, ícono de 73 px, nombre y disponibilidad en lima).
export function TarjetaServicio({ submarca, nombre, disponibilidad, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${nombre}, ${disponibilidad}`}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <IconoSubmarca submarca={submarca} tamano={73} />
      <Texto variante="categoria" color="textoSobreOscuro" style={styles.centrado}>
        {nombre}
      </Texto>
      <Texto variante="micro" color="acentoLima" style={styles.disponibilidad}>
        {disponibilidad}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minHeight: 142,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.xxs,
    paddingHorizontal: espacio.xs,
    borderRadius: radios.xl,
    backgroundColor: colores.superficie,
  },
  presionada: { opacity: 0.85 },
  centrado: { textAlign: 'center', letterSpacing: 0, marginTop: espacio.s },
  disponibilidad: { textAlign: 'center', lineHeight: 12 },
});
