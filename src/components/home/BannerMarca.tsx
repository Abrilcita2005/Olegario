import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';

// Banner con la frase de marca (Figma: "Editorial Brand Banner / Quote").
export function BannerMarca() {
  return (
    <LinearGradient
      colors={[colores.superficie, colores.superficie, colores.superficieBanner]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.banner}
    >
      <Texto variante="cita" color="textoSobreOscuro" style={styles.texto}>
        “Impulsamos personas, conectamos oportunidades y expandimos experiencias de trabajo.”
      </Texto>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: espacio.base,
    borderRadius: radios.xxl,
    minHeight: 131,
    justifyContent: 'center',
  },
  texto: { maxWidth: 260 },
});
