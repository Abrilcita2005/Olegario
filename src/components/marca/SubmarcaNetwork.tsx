// Generado a partir de `assets/marca/ole-network.svg` (original de la marca; se quita el nombre "OLE / …", que en la app va como texto aparte).
import { useId } from 'react';
import { Svg, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

type Props = {
  ancho: number;
};

export const PROPORCION_SUBMARCANETWORK = 1.0;

export function SubmarcaNetwork({ ancho }: Props) {
  const idDegradado = useId();
  return (
    <Svg width={ancho} height={ancho * PROPORCION_SUBMARCANETWORK} viewBox="2.47 0 565.16 565.16">
      <Defs>
        <LinearGradient
          id={idDegradado}
          x1="-7324.91"
          y1="-3000.72"
          x2="-6947.66"
          y2="-3000.72"
          gradientTransform="translate(3285.2098 -6854.5559) rotate(-90)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FE016D" />
          <Stop offset=".52" stopColor="#F83B11" />
          <Stop offset="1" stopColor="#CAF22C" />
        </LinearGradient>
      </Defs>
      <Circle cx="285.05" cy="282.58" r="282.58" fill="#262020" />
      <Path
        fill={`url(#${idDegradado})`}
        d="M284.49,264.06c51.89,0,93.96,8.07,93.96,18.02s-42.07,18.02-93.96,18.02-93.96-8.07-93.96-18.02,42.07-18.02,93.96-18.02ZM190.26,137.47c0,20.19,28.65,37.22,67.86,42.59-39.2,3.32-67.86,13.83-67.86,26.3,0,15.13,42.19,27.39,94.23,27.39s94.23-12.26,94.23-27.39c0-12.46-28.65-22.98-67.86-26.3,39.2-5.37,67.86-22.41,67.86-42.59,0-24.5-42.19-44.36-94.23-44.36s-94.23,19.86-94.23,44.36ZM284.49,470.35c52.04,0,94.23-19.86,94.23-44.36,0-20.19-28.65-37.22-67.86-42.59,39.2-3.32,67.86-13.83,67.86-26.3,0-15.13-42.19-27.39-94.23-27.39-52.04,0-94.23,12.26-94.23,27.39,0,12.46,28.65,22.98,67.86,26.3-39.2,5.37-67.86,22.41-67.86,42.59,0,24.5,42.19,44.36,94.23,44.36Z"
      />
    </Svg>
  );
}
