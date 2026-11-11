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
      {/* Exactamente 4 líneas (pedido de la responsable); si no entran, la letra se achica un poco. */}
      <Texto
        variante="cita"
        color="textoSobreOscuro"
        numberOfLines={4}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {'“Impulsamos personas,\nconectamos oportunidades\ny expandimos experiencias\nde trabajo.”'}
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
});
