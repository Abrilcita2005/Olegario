import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import { colores, degradados } from '@/theme';

// Píldoras del logo oficial (`assets/marca/logo-horizontal-negro.svg`).
const PILDORAS =
  'M499.45,33.19c0,18.33-4.39,33.19-9.81,33.19s-9.81-14.86-9.81-33.19S484.21,0,489.63,0s9.81,14.86,9.81,33.19ZM533.76,0c-8.23,0-14.9,14.86-14.9,33.19s6.67,33.19,14.9,33.19,14.9-14.86,14.9-33.19-6.67-33.19-14.9-33.19ZM576.87,0c-8.23,0-14.9,14.86-14.9,33.19s6.67,33.19,14.9,33.19,14.9-14.86,14.9-33.19-6.67-33.19-14.9-33.19ZM697.5,0c-6.9,0-13.07,4.6-17.2,11.82-4.13-7.22-10.3-11.82-17.2-11.82-8.06,0-15.11,6.27-19.08,15.66-3.97-9.39-11.02-15.66-19.08-15.66-12.43,0-22.5,14.86-22.5,33.19s10.07,33.19,22.5,33.19c8.06,0,15.11-6.27,19.08-15.66,3.97,9.39,11.02,15.66,19.08,15.66,6.9,0,13.07-4.6,17.2-11.81,4.13,7.22,10.3,11.81,17.2,11.81,12.43,0,22.5-14.86,22.5-33.19S709.93,0,697.5,0Z';

// Isotipo circular del encabezado (49 px en Figma): las píldoras del logo
// sobre un círculo oscuro con aro de degradado.
export function Isotipo({ tamano = 49 }: { tamano?: number }) {
  const idAro = useId();
  const idPildoras = useId();
  const grosor = Math.max(2, Math.round(tamano * 0.045));
  const anchoPildoras = tamano * 0.56;

  return (
    <View style={{ width: tamano, height: tamano }}>
      <Svg width={tamano} height={tamano} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={idAro} x1="0" y1="0" x2="1" y2="1">
            {degradados.marca.colores.map((color, i) => (
              <Stop key={color} offset={degradados.marca.posiciones[i]} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>
        <Circle cx={tamano / 2} cy={tamano / 2} r={tamano / 2} fill={`url(#${idAro})`} />
        <Circle cx={tamano / 2} cy={tamano / 2} r={tamano / 2 - grosor} fill={colores.superficie} />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.centro]}>
        <Svg
          width={anchoPildoras}
          height={anchoPildoras * (66.38 / 240.18)}
          viewBox="479.82 0 240.18 66.38"
        >
          <Defs>
            <LinearGradient
              id={idPildoras}
              x1="479.82"
              y1="33.19"
              x2="720"
              y2="33.19"
              gradientUnits="userSpaceOnUse"
            >
              {degradados.marca.colores.map((color, i) => (
                <Stop key={color} offset={degradados.marca.posiciones[i]} stopColor={color} />
              ))}
            </LinearGradient>
          </Defs>
          <Path fill={`url(#${idPildoras})`} d={PILDORAS} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center' },
});
