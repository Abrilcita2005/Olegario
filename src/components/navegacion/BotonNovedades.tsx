import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconoMegafono } from '@/components/iconos/Iconos';
import { Texto } from '@/components/ui';
import { colores, degradados, espacio, radios } from '@/theme';

import { novedadesDePrueba } from '../../../data/mock/novedades';

import { BARRA, BOTON_NOVEDADES } from './medidas';

// Botón flotante persistente de Novedades (Figma: 178×45, sobre la barra inferior).
// Abre el panel de Novedades. El contador sale de datos de prueba hasta la Etapa 12.
export function BotonNovedades() {
  const { bottom } = useSafeAreaInsets();
  const nuevas = novedadesDePrueba.filter((n) => !n.leida).length;
  const textoContador = nuevas === 1 ? '1 nueva' : `${nuevas} nuevas`;

  return (
    <Pressable
      onPress={() => router.push('/novedades')}
      accessibilityRole="button"
      accessibilityLabel={nuevas > 0 ? `Novedades, ${textoContador}` : 'Novedades'}
      style={({ pressed }) => [
        styles.boton,
        {
          bottom:
            Math.max(bottom, BARRA.separacionInferior) +
            BARRA.alto +
            BOTON_NOVEDADES.separacionSobreBarra,
        },
        pressed && styles.presionado,
      ]}
    >
      <View>
        <LinearGradient
          colors={degradados.acento.colores}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.circulo}
        >
          <IconoMegafono color={colores.textoSobreOscuro} />
        </LinearGradient>
        {nuevas > 0 ? <View style={styles.punto} /> : null}
      </View>
      <Texto variante="botonFlotante" color="textoSobreOscuro">
        Novedades
      </Texto>
      {nuevas > 0 ? (
        <Texto variante="pestana" color="acentoLima">
          {textoContador}
        </Texto>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    position: 'absolute',
    right: BOTON_NOVEDADES.margenDerecho,
    height: BOTON_NOVEDADES.alto,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.l,
    paddingLeft: espacio.l,
    paddingRight: espacio.base,
    borderRadius: radios.pastilla,
    backgroundColor: colores.superficie,
  },
  circulo: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.pastilla,
  },
  punto: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.superficie,
    backgroundColor: colores.acentoNaranja,
  },
  presionado: { opacity: 0.85 },
});
