import { StyleSheet, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

import { Texto } from '@/components/ui';
import { colores } from '@/theme';

type Props = { porcentaje: number; tamano?: number };

const GROSOR = 7;

// Anillo de horas libres (Figma: PERFIL, "Inline Radial Metric Ring", "53% LIBRE").
export function AnilloHoras({ porcentaje, tamano = 80 }: Props) {
  const radio = (tamano - GROSOR) / 2;
  const circunferencia = 2 * Math.PI * radio;
  return (
    <View
      style={{ width: tamano, height: tamano }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${porcentaje}% de horas libres`}
      accessibilityValue={{ min: 0, max: 100, now: porcentaje }}
    >
      <Svg width={tamano} height={tamano} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          stroke={colores.superficieElevada}
          strokeWidth={GROSOR}
          fill="none"
        />
        <Circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          stroke={colores.acentoLima}
          strokeWidth={GROSOR}
          strokeLinecap="round"
          strokeDasharray={`${(circunferencia * porcentaje) / 100} ${circunferencia}`}
          fill="none"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.centro]}>
        <Texto variante="cuerpoChicoDestacado" color="textoSobreOscuro">
          {porcentaje}%
        </Texto>
        <Texto variante="micro" color="textoTerciario" style={styles.libre}>
          LIBRE
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center' },
  libre: { lineHeight: 10 },
});
