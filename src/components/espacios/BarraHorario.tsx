import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconoCronometro } from '@/components/iconos/Iconos';
import { Texto } from '@/components/ui';
import { colores, degradados, espacio, radios, sombras } from '@/theme';

type Props = {
  horario: string;
  onCambiar: () => void;
};

// Tarjeta "HORARIO SELECCIONADO" (Figma: ESPACIOS). Toda la tarjeta abre el selector de horario.
export function BarraHorario({ horario, onCambiar }: Props) {
  return (
    <Pressable
      onPress={onCambiar}
      accessibilityRole="button"
      accessibilityLabel={`Horario seleccionado: ${horario}. Cambiar horario`}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <LinearGradient
        colors={degradados.accion.colores}
        locations={degradados.accion.posiciones}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.icono}
      >
        <IconoCronometro color={colores.textoSobreOscuro} />
      </LinearGradient>
      <View style={styles.textos}>
        <Texto variante="categoria" color="textoTerciario">
          Horario seleccionado
        </Texto>
        <Texto variante="cuerpoChicoDestacado" color="textoSobreOscuro">
          {horario}
        </Texto>
      </View>
      <View style={[styles.boton, sombras.accion]}>
        <LinearGradient
          colors={degradados.accion.colores}
          locations={degradados.accion.posiciones}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[StyleSheet.absoluteFill, styles.fondoBoton]}
        />
        <Texto variante="boton" color="textoBoton">
          Cambiar
        </Texto>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.l,
    padding: espacio.l,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  presionada: { opacity: 0.9 },
  icono: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.lg,
  },
  textos: { flex: 1, gap: espacio.xxs },
  boton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: espacio.base,
    borderRadius: radios.lg,
  },
  fondoBoton: { borderRadius: radios.lg },
});
