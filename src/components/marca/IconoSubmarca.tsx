import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, Defs, LinearGradient, Stop, Svg } from 'react-native-svg';

import { degradados } from '@/theme';

import { SubmarcaCafe } from './SubmarcaCafe';
import { SubmarcaCowork } from './SubmarcaCowork';
import { SubmarcaNetwork } from './SubmarcaNetwork';
import { SubmarcaStream } from './SubmarcaStream';

export type Submarca = 'cowork' | 'stream' | 'network' | 'cafe';

const COMPONENTES = {
  cowork: SubmarcaCowork,
  stream: SubmarcaStream,
  network: SubmarcaNetwork,
  cafe: SubmarcaCafe,
} as const;

const NOMBRES: Record<Submarca, string> = {
  cowork: 'OLE/COWORK',
  stream: 'OLE/STREAM',
  network: 'OLE/NETWORK',
  cafe: 'OLE/CAFÉ',
};

// Grosor del aro respecto del tamaño total (≈3 px en el ícono de 73 px de Figma).
const PROPORCION_ARO = 0.045;

type Props = {
  submarca: Submarca;
  tamano?: number;
  conAro?: boolean;
};

// Ícono circular de cada servicio OLE/, con el aro de degradado de marca como en Figma (aprobado 2026-10-28).
// El nombre del servicio se muestra aparte como texto.
export function IconoSubmarca({ submarca, tamano = 73, conAro = true }: Props) {
  const Componente = COMPONENTES[submarca];
  const idDegradado = useId();
  const grosor = conAro ? Math.max(2, Math.round(tamano * PROPORCION_ARO)) : 0;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={NOMBRES[submarca]}
      style={{ width: tamano, height: tamano }}
    >
      {conAro ? (
        <Svg width={tamano} height={tamano} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id={idDegradado} x1="0" y1="0" x2="1" y2="1">
              {degradados.marca.colores.map((color, i) => (
                <Stop key={color} offset={degradados.marca.posiciones[i]} stopColor={color} />
              ))}
            </LinearGradient>
          </Defs>
          <Circle cx={tamano / 2} cy={tamano / 2} r={tamano / 2} fill={`url(#${idDegradado})`} />
        </Svg>
      ) : null}
      <View style={[StyleSheet.absoluteFill, styles.centro]}>
        <Componente ancho={tamano - grosor * 2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center' },
});
