import { Pressable, StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { AREA_TACTIL_MINIMA, colores, espacio, radios } from '@/theme';

import { Texto } from './Texto';

type Props = {
  marcada: boolean;
  onCambiar: (marcada: boolean) => void;
  texto: string;
  aclaracion?: string;
};

// Casilla de aceptación (registro: términos de convivencia). Área táctil ampliada a toda la fila.
export function Casilla({ marcada, onCambiar, texto, aclaracion }: Props) {
  return (
    <Pressable
      onPress={() => onCambiar(!marcada)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcada }}
      accessibilityLabel={texto}
      style={styles.fila}
    >
      <View style={[styles.caja, marcada && styles.cajaMarcada]}>
        {marcada ? (
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path d="M2 6.5 5 9l5-6" stroke={colores.superficie} strokeWidth={2} fill="none" />
          </Svg>
        ) : null}
      </View>
      <View style={styles.textos}>
        <Texto variante="cuerpoChico" color="textoSobreOscuroSuave">
          {texto}
        </Texto>
        {aclaracion ? (
          <Texto variante="meta" color="acentoLima">
            {aclaracion}
          </Texto>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: espacio.xl,
    minHeight: AREA_TACTIL_MINIMA,
    padding: espacio.xl,
    borderRadius: radios.lg,
    backgroundColor: colores.superficie,
  },
  caja: {
    width: 18,
    height: 18,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colores.textoTerciario,
    backgroundColor: colores.textoSobreOscuro,
  },
  cajaMarcada: { backgroundColor: colores.acentoLima, borderColor: colores.acentoLima },
  textos: { flex: 1, gap: espacio.s },
});
